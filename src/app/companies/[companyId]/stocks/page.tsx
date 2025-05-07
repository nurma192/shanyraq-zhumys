"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { Info } from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "./CompanyStockes.module.scss";
import { useToast } from "@/components/ui/use-toast";

const CompanyStocksPage = () => {
  const { companyId } = useParams() as { companyId: string };
  const { overview, stocks, loading, error, fetchStocks } = useCompanyDetails();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (companyId && !stocks) {
      fetchStocks(companyId);
    }
  }, [companyId, stocks, fetchStocks]);

  useEffect(() => {
    if (overview && overview.type === "ТОО") {
      toast({
        title: "Компания не публичная",
        description: "У непубличных компаний нет акций для просмотра",
        variant: "destructive",
      });
      router.push(`/companies/${companyId}`);
    }
  }, [overview, companyId, router, toast]);

  const prepareYearlyStockData = () => {
    if (!stocks || !stocks.historicalData) return [];

    // Define the type for the accumulator object
    interface YearlyData {
      [key: string]: {
        sum: number;
        count: number;
      };
    }

    // Group data by year with properly typed accumulator
    const yearlyData = stocks.historicalData.reduce<YearlyData>((acc, item) => {
      // Extract year from date (assuming format like "2023-01-01")
      const year = item.date.split("-")[0];

      if (!acc[year]) {
        acc[year] = {
          sum: 0,
          count: 0,
        };
      }

      acc[year].sum += item.close;
      acc[year].count += 1;

      return acc;
    }, {});

    // Calculate average for each year and format for bar chart
    return Object.keys(yearlyData)
      .sort() // Sort years in ascending order
      .map((year) => ({
        year,
        "Цена акций": +(yearlyData[year].sum / yearlyData[year].count).toFixed(
          2
        ),
      }));
  };

  if (error.stocks) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Ошибка при загрузке данных об акциях
        </h2>
        <p>{error.stocks}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 w-full">
      <h1 className="text-3xl font-bold mb-8">
        {loading.stocks ? (
          <Skeleton className="h-10 w-96" />
        ) : (
          `Данные акций компании ${stocks?.companyName || ""}`
        )}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Динамика цены акций по годам
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Отображает среднегодовую стоимость акций компании</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {loading.stocks ? (
              <div className="h-80 w-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : stocks ? (
              <div className="h-80">
                <ResponsiveBar
                  data={prepareYearlyStockData()}
                  keys={["Цена акций"]}
                  indexBy="year"
                  margin={{ top: 30, right: 20, bottom: 50, left: 70 }}
                  padding={0.3}
                  colors={{ scheme: "red_blue" }}
                  colorBy="indexValue"
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Год",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: `Цена (${stocks.currency})`,
                    legendPosition: "middle",
                    legendOffset: -50,
                    format: (value) => Math.round(value),
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor="white"
                  theme={{
                    tooltip: {
                      container: {
                        background: "#fff",
                        fontSize: "12px",
                        borderRadius: "4px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        padding: "8px 12px",
                      },
                    },
                  }}
                  tooltip={({ id, value, color }) => (
                    <div
                      style={{
                        padding: 8,
                        color: "#333",
                        background: "#fff",
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        border: `1px solid ${color}`,
                      }}
                    >
                      <strong>
                        {id}: {value} {stocks.currency}
                      </strong>
                    </div>
                  )}
                  animate={true}
                />
              </div>
            ) : null}

            <p className="mt-6 text-gray-600 text-sm">
              График отображает динамику средней цены акций компании по годам.
              Исторические данные помогают определить долгосрочные тренды и
              оценить потенциальные инвестиционные возможности.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md bg-slate-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Ключевые показатели
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Основные финансовые метрики, характеризующие текущее
                      состояние акций компании
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {loading.stocks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : stocks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Текущая цена</p>
                  <p className="text-xl font-bold">{stocks.formattedPrice}</p>
                  <p
                    className={`text-sm font-medium ${
                      stocks.priceChange < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {stocks.priceChange > 0 ? "+" : ""}
                    {stocks.priceChange.toFixed(2)} (
                    {stocks.priceChangePercent.toFixed(2)}%)
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">
                    Рыночная капитализация
                  </p>
                  <p className="text-xl font-bold">
                    {stocks.formattedMarketCap}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">P/E коэффициент</p>
                  <p className="text-xl font-bold">
                    {stocks.peRatio.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">
                    52-недельный максимум
                  </p>
                  <p className="text-xl font-bold">
                    {stocks.fiftyTwoWeekHigh.toLocaleString()} {stocks.currency}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">
                    52-недельный минимум
                  </p>
                  <p className="text-xl font-bold">
                    {stocks.fiftyTwoWeekLow.toLocaleString()} {stocks.currency}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">
                    Дивидендная доходность
                  </p>
                  <p className="text-xl font-bold">
                    {stocks.dividendYield ? `${stocks.dividendYield}%` : "Н/Д"}
                  </p>
                </div>
              </div>
            ) : null}

            <p className="mt-6 text-gray-600 text-sm">
              Ключевые показатели дают общее представление о финансовом здоровье
              компании и оценке ее акций рынком. P/E коэффициент указывает на
              то, сколько инвесторы готовы платить за единицу прибыли компании.
            </p>
          </CardContent>
        </Card>
      </div>

      {!loading.stocks && stocks && (
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Детали торгов за сегодня
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Подробная информация о торгах за текущий день</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Цена открытия</p>
                <p className="text-lg font-semibold">
                  {stocks.open.toLocaleString()} {stocks.currency}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Максимум дня</p>
                <p className="text-lg font-semibold">
                  {stocks.dayHigh.toLocaleString()} {stocks.currency}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Минимум дня</p>
                <p className="text-lg font-semibold">
                  {stocks.dayLow.toLocaleString()} {stocks.currency}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">
                  Объем торгов сегодня
                </p>
                <p className="text-lg font-semibold">
                  {stocks.volume.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-right text-gray-500 text-sm">
              Данные обновлены: {new Date(stocks.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyStocksPage;

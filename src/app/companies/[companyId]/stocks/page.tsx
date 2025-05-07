"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveBar } from "@nivo/bar";
import { Info, TrendingUp, TrendingDown, DollarSign, BarChart2, ArrowUp, ArrowDown } from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

    interface YearlyData {
      [key: string]: {
        sum: number;
        count: number;
      };
    }

    const yearlyData = stocks.historicalData.reduce<YearlyData>((acc, item) => {
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

    return Object.keys(yearlyData)
      .sort()
      .map(year => ({
        year,
        "Цена акций": +(yearlyData[year].sum / yearlyData[year].count).toFixed(2),
      }));
  };

  if (error.stocks) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Ошибка при загрузке данных об акциях</h2>
          <p className="text-red-500">{error.stocks}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        {loading.stocks ? (
          <Skeleton className="h-10 w-64 mb-2" />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#1D1D1D] mb-1">Данные акций компании {stocks?.companyName || ""}</h1>
            <p className="text-[#1D1D1D]/70 text-sm">Информация о стоимости и динамике акций на фондовом рынке</p>
          </>
        )}
      </div>

      {/* Current Price Card */}
      {loading.stocks ? (
        <Skeleton className="h-32 w-full rounded-lg mb-6" />
      ) : stocks ? (
        <Card className="border-[#E6E6B0]/30 bg-gradient-to-br from-[#628307]/5 to-[#E6E6B0]/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#628307]/10 text-[#628307] mr-4">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#1D1D1D]/70 mb-1">Текущая цена акций</div>
                  <div className="text-2xl font-bold text-[#628307]">{stocks.formattedPrice}</div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <div className={`flex items-center text-lg font-semibold ${stocks.priceChange < 0 ? "text-red-600" : "text-[#628307]"}`}>
                  {stocks.priceChange > 0 ? <TrendingUp className="mr-1 h-5 w-5" /> : <TrendingDown className="mr-1 h-5 w-5" />}
                  {stocks.priceChange > 0 ? "+" : ""}
                  {stocks.priceChange.toFixed(2)} {stocks.currency}
                </div>
                <div className={`text-sm ${stocks.priceChangePercent < 0 ? "text-red-600" : "text-[#628307]"}`}>
                  {stocks.priceChangePercent > 0 ? "+" : ""}
                  {stocks.priceChangePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-[#E6E6B0]/20 border border-[#E6E6B0]/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            Детали
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <Card className="border-[#E6E6B0]/30">
            <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
              <CardTitle className="text-[#628307] text-lg">Ключевые показатели</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading.stocks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : stocks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Текущая цена</p>
                    <p className="text-xl font-bold text-[#1D1D1D]">{stocks.formattedPrice}</p>
                    <p className={`text-sm font-medium ${stocks.priceChange < 0 ? "text-red-600" : "text-[#628307]"}`}>
                      {stocks.priceChange > 0 ? "+" : ""}
                      {stocks.priceChange.toFixed(2)} ({stocks.priceChangePercent.toFixed(2)}%)
                    </p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Рыночная капитализация</p>
                    <p className="text-xl font-bold text-[#1D1D1D]">{stocks.formattedMarketCap}</p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">P/E коэффициент</p>
                    <p className="text-xl font-bold text-[#1D1D1D]">{stocks.peRatio.toFixed(2)}</p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">52-недельный максимум</p>
                    <p className="text-xl font-bold text-[#1D1D1D] flex items-center">
                      {stocks.fiftyTwoWeekHigh.toLocaleString()} {stocks.currency}
                      <ArrowUp className="h-4 w-4 text-[#628307] ml-1" />
                    </p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">52-недельный минимум</p>
                    <p className="text-xl font-bold text-[#1D1D1D] flex items-center">
                      {stocks.fiftyTwoWeekLow.toLocaleString()} {stocks.currency}
                      <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
                    </p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Дивидендная доходность</p>
                    <p className="text-xl font-bold text-[#1D1D1D]">{stocks.dividendYield ? `${stocks.dividendYield}%` : "Н/Д"}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3 text-xs text-[#1D1D1D]/70">
              Ключевые показатели дают общее представление о финансовом здоровье компании и оценке ее акций рынком. P/E коэффициент указывает на то, сколько
              инвесторы готовы платить за единицу прибыли компании.
            </CardFooter>
          </Card>

          {/* Stock Chart */}
          <Card className="border-[#E6E6B0]/30">
            <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#628307] text-lg flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Динамика цены акций по годам
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-[#628307] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Отображает среднегодовую стоимость акций компании</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
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
                    colors={["#628307"]}
                    borderRadius={4}
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
                      format: value => Math.round(value),
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
            </CardContent>
            <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3 text-xs text-[#1D1D1D]/70">
              График отображает динамику средней цены акций компании по годам. Исторические данные помогают определить долгосрочные тренды и оценить
              потенциальные инвестиционные возможности.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {loading.stocks ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : stocks ? (
            <Card className="border-[#E6E6B0]/30">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#628307] text-lg">Детали торгов за сегодня</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className="text-[#628307] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Подробная информация о торгах за текущий день</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Цена открытия</p>
                    <p className="text-lg font-semibold text-[#1D1D1D]">
                      {stocks.open.toLocaleString()} {stocks.currency}
                    </p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Максимум дня</p>
                    <p className="text-lg font-semibold text-[#1D1D1D] flex items-center">
                      {stocks.dayHigh.toLocaleString()} {stocks.currency}
                      <ArrowUp className="h-4 w-4 text-[#628307] ml-1" />
                    </p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Минимум дня</p>
                    <p className="text-lg font-semibold text-[#1D1D1D] flex items-center">
                      {stocks.dayLow.toLocaleString()} {stocks.currency}
                      <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
                    </p>
                  </div>

                  <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <p className="text-[#1D1D1D]/70 text-sm mb-1">Объем торгов сегодня</p>
                    <p className="text-lg font-semibold text-[#1D1D1D]">{stocks.volume.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3 text-xs text-[#1D1D1D]/70 flex justify-end">
                Данные обновлены: {new Date(stocks.timestamp).toLocaleString()}
              </CardFooter>
            </Card>
          ) : null}

          {loading.stocks ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : stocks ? (
            <Card className="border-[#E6E6B0]/30">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <CardTitle className="text-[#628307] text-lg">Дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1D] mb-3">Ценовые показатели</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">Текущая цена</span>
                        <span className="font-medium">{stocks.formattedPrice}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">Изменение</span>
                        <span className={`font-medium ${stocks.priceChange < 0 ? "text-red-600" : "text-[#628307]"}`}>
                          {stocks.priceChange > 0 ? "+" : ""}
                          {stocks.priceChange.toFixed(2)} ({stocks.priceChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">52-недельный максимум</span>
                        <span className="font-medium">
                          {stocks.fiftyTwoWeekHigh.toLocaleString()} {stocks.currency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">52-недельный минимум</span>
                        <span className="font-medium">
                          {stocks.fiftyTwoWeekLow.toLocaleString()} {stocks.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1D] mb-3">Финансовые показатели</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">Рыночная капитализация</span>
                        <span className="font-medium">{stocks.formattedMarketCap}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">P/E коэффициент</span>
                        <span className="font-medium">{stocks.peRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">Дивидендная доходность</span>
                        <span className="font-medium">{stocks.dividendYield ? `${stocks.dividendYield}%` : "Н/Д"}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#E6E6B0]/30">
                        <span className="text-[#1D1D1D]/70">Объем торгов</span>
                        <span className="font-medium">{stocks.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>

      {!loading.stocks && stocks && (
        <div className="mt-6 text-xs text-[#1D1D1D]/60 flex items-center justify-between">
          <div>Источник данных: {stocks.exchange}</div>
          <div>Последнее обновление: {new Date(stocks.timestamp).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export default CompanyStocksPage;

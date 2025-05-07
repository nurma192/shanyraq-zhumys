"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { Info } from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "./CompanyTaxesPage.module.scss";

const CompanyTaxesPage = () => {
  const { companyId } = useParams() as { companyId: string };
  const { taxes, loading, error, fetchTaxes } = useCompanyDetails();

  useEffect(() => {
    if (companyId && !taxes) {
      fetchTaxes(companyId);
    }
  }, [companyId, taxes, fetchTaxes]);

  // Prepare data for charts if taxes data exists
  const getTaxBarData = () => {
    if (!taxes || !taxes.yearlyTaxes) return [];

    return taxes.yearlyTaxes.map((tax) => ({
      year: tax.year.toString(),
      Налоги: +(tax.amount / 1e9).toFixed(2), // Convert to billions and round for display
    }));
  };

  const getLatestYearTaxData = () => {
    if (!taxes || !taxes.yearlyTaxes || taxes.yearlyTaxes.length === 0)
      return null;

    // Sort by year descending and get the latest year data
    const sortedTaxes = [...taxes.yearlyTaxes].sort((a, b) => b.year - a.year);
    return sortedTaxes[0];
  };

  const calculateTaxGrowth = () => {
    if (!taxes || !taxes.yearlyTaxes || taxes.yearlyTaxes.length < 2)
      return null;

    // Sort by year
    const sortedTaxes = [...taxes.yearlyTaxes].sort((a, b) => a.year - b.year);
    const lastYearTax = sortedTaxes[sortedTaxes.length - 1].amount;
    const prevYearTax = sortedTaxes[sortedTaxes.length - 2].amount;

    const growthRate = ((lastYearTax - prevYearTax) / prevYearTax) * 100;
    return growthRate.toFixed(1);
  };

  const latestYearTax = getLatestYearTaxData();
  const taxGrowth = calculateTaxGrowth();
  const taxBarData = getTaxBarData();

  if (error.taxes) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Ошибка при загрузке данных о налогах
        </h2>
        <p>{error.taxes}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 w-full">
      <h1 className="text-3xl font-bold mb-6">
        {loading.taxes ? (
          <Skeleton className="h-10 w-96" />
        ) : (
          `Налоговая статистика компании ${taxes?.companyName || ""}`
        )}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Ежегодные налоговые отчисления (млрд ₸)
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Показывает динамику ежегодных налоговых отчислений
                      компании в миллиардах тенге
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {loading.taxes ? (
              <div className="h-80 w-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : taxes ? (
              <div className="h-80">
                <ResponsiveBar
                  data={taxBarData}
                  keys={["Налоги"]}
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
                    legend: "Сумма (млрд ₸)",
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
                        {id}: {value} млрд ₸
                      </strong>
                    </div>
                  )}
                  animate={true}
                />
              </div>
            ) : null}

            <p className="mt-6 text-gray-600 text-sm">
              График демонстрирует динамику налоговых отчислений компании по
              годам. Показатели приведены в миллиардах тенге на основе
              официальной финансовой отчетности.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Налоговые показатели
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ключевые налоговые показатели компании</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {loading.taxes ? (
              <div className="space-y-6">
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : taxes ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">
                    Последние отчисления ({latestYearTax?.year})
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {latestYearTax?.formattedAmount}
                  </p>
                  {taxGrowth && (
                    <p
                      className={`text-sm font-medium ${
                        parseFloat(taxGrowth) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {parseFloat(taxGrowth) >= 0 ? "+" : ""}
                      {taxGrowth}% к предыдущему году
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">
                      Статус плательщика НДС
                    </p>
                    <p className="font-medium">
                      {taxes.vatPayer
                        ? "Плательщик НДС"
                        : "Не является плательщиком НДС"}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">
                      Юридический статус
                    </p>
                    <p className="font-medium">
                      {taxes.companyType} "{taxes.companyStatus}"
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">
                    Основной вид деятельности
                  </p>
                  <p className="font-medium">
                    {taxes.businessActivity} (код {taxes.businessActivityCode})
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">
                      Размер компании
                    </p>
                    <p className="font-medium">{taxes.companySize}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">
                      Количество лицензий
                    </p>
                    <p className="font-medium">{taxes.licenseCount}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <p className="mt-6 text-gray-600 text-sm">
              Данные представлены на основе официальной отчетности,
              предоставляемой государственными органами. Последнее обновление:{" "}
              {taxes?.lastUpdateDate || "н/д"}
            </p>
          </CardContent>
        </Card>
      </div>

      {!loading.taxes && taxes && (
        <Card className="overflow-hidden transition-all hover:shadow-md mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Дополнительная информация
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Информация о регистрации и участии компании</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Дата регистрации</p>
                <p className="font-medium">{taxes.registrationDate}</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">
                  Участие в других компаниях
                </p>
                <p className="font-medium">
                  {taxes.participationsInOtherCompanies > 0
                    ? `${taxes.participationsInOtherCompanies} компаний`
                    : "Не участвует"}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">
                  Участие в гос. закупках
                </p>
                <p className="font-medium">
                  {taxes.governmentProcurementParticipant
                    ? "Участвует"
                    : "Не участвует"}
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-sm italic">
              Источник данных: {taxes.dataSource}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyTaxesPage;

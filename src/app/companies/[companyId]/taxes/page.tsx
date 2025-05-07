"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import {
  Info,
  TrendingUp,
  FileText,
  Calendar,
  Building,
  Briefcase,
  Award,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart2,
  PieChart,
  FileBarChart,
  ChevronRight,
  LineChart,
} from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

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

    return taxes.yearlyTaxes.map(tax => ({
      year: tax.year.toString(),
      Налоги: +(tax.amount / 1e9).toFixed(2), // Convert to billions and round for display
    }));
  };

  const getLatestYearTaxData = () => {
    if (!taxes || !taxes.yearlyTaxes || taxes.yearlyTaxes.length === 0) return null;

    // Sort by year descending and get the latest year data
    const sortedTaxes = [...taxes.yearlyTaxes].sort((a, b) => b.year - a.year);
    return sortedTaxes[0];
  };

  const calculateTaxGrowth = () => {
    if (!taxes || !taxes.yearlyTaxes || taxes.yearlyTaxes.length < 2) return null;

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
      <div className="p-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-xl font-semibold text-red-700">Ошибка при загрузке данных о налогах</h4>
          <p className="text-red-600 mt-2">{error.taxes}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8">
      {/* Header Section */}
      <div className="mb-6">
        {loading.taxes ? (
          <Skeleton className="h-10 w-64 mb-2" />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#1D1D1D] mb-1">Налоговая статистика компании {taxes?.companyName || ""}</h1>
            <div className="text-[#1D1D1D]/70 text-sm">Данные о налоговых отчислениях и финансовой деятельности</div>
          </>
        )}
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-[#E6E6B0]/20 border border-[#E6E6B0]/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            Детали
          </TabsTrigger>
          <TabsTrigger value="charts" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            Графики
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading.taxes ? (
              <>
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </>
            ) : taxes ? (
              <>
                <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow bg-gradient-to-br from-[#628307]/5 to-[#E6E6B0]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#628307]/10 text-[#628307] mr-4">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Последние отчисления ({latestYearTax?.year})</div>
                        <div className="text-2xl font-bold text-[#628307]">{latestYearTax?.formattedAmount}</div>
                        {taxGrowth && (
                          <div className={`text-xs font-medium ${parseFloat(taxGrowth) >= 0 ? "text-[#628307]" : "text-red-600"}`}>
                            {parseFloat(taxGrowth) >= 0 ? "+" : ""}
                            {taxGrowth}% к предыдущему году
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow bg-gradient-to-br from-[#628307]/5 to-[#E6E6B0]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#628307]/10 text-[#628307] mr-4">
                        <Building size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Юридический статус</div>
                        <div className="text-lg font-bold text-[#1D1D1D]">{taxes.companyType}</div>
                        <div className="text-xs text-[#1D1D1D]/70">"{taxes.companyStatus}"</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow bg-gradient-to-br from-[#628307]/5 to-[#E6E6B0]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#628307]/10 text-[#628307] mr-4">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Размер компании</div>
                        <div className="text-lg font-bold text-[#1D1D1D]">{taxes.companySize}</div>
                        <div className="text-xs text-[#1D1D1D]/70">{taxes.licenseCount} лицензий</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          {/* Tax Chart */}
          <Card className="border-[#E6E6B0]">
            <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#628307] text-lg flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Ежегодные налоговые отчисления (млрд ₸)
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-[#628307] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Показывает динамику ежегодных налоговых отчислений компании в миллиардах тенге</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                {loading.taxes ? (
                  <Skeleton className="h-full w-full" />
                ) : taxes ? (
                  <ResponsiveBar
                    data={taxBarData}
                    keys={["Налоги"]}
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
                      legend: "Сумма (млрд ₸)",
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
                          {id}: {value} млрд ₸
                        </strong>
                      </div>
                    )}
                    animate={true}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-[#1D1D1D]/60 text-center">Нет данных о налоговых отчислениях</div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3 text-xs text-[#1D1D1D]/70">
              График демонстрирует динамику налоговых отчислений компании по годам. Показатели приведены в миллиардах тенге на основе официальной финансовой
              отчетности.
            </CardFooter>
          </Card>

          {/* Business Activity */}
          {!loading.taxes && taxes && (
            <Card className="border-[#E6E6B0]">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <CardTitle className="text-[#628307] text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Основная деятельность
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Основной вид деятельности</div>
                    <div className="text-lg font-semibold text-[#1D1D1D]">{taxes.businessActivity}</div>
                    <div className="text-xs text-[#1D1D1D]/70 mt-1">Код: {taxes.businessActivityCode}</div>
                  </div>

                  <div className="flex-1 bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                    <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Статус плательщика НДС</div>
                    <div className="flex items-center">
                      {taxes.vatPayer ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-[#628307] mr-2" />
                          <span className="text-lg font-semibold text-[#1D1D1D]">Плательщик НДС</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="text-lg font-semibold text-[#1D1D1D]">Не является плательщиком НДС</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {loading.taxes ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ) : taxes ? (
            <>
              <Card className="border-[#E6E6B0]">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <CardTitle className="text-[#628307] text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Регистрационная информация
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Дата регистрации</div>
                      <div className="text-lg font-semibold text-[#1D1D1D]">{taxes.registrationDate}</div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Юридический статус</div>
                      <div className="text-lg font-semibold text-[#1D1D1D]">
                        {taxes.companyType} "{taxes.companyStatus}"
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E6E6B0]">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <CardTitle className="text-[#628307] text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Участие в бизнесе
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Участие в других компаниях</div>
                      <div className="text-lg font-semibold text-[#1D1D1D]">
                        {taxes.participationsInOtherCompanies > 0 ? `${taxes.participationsInOtherCompanies} компаний` : "Не участвует"}
                      </div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Участие в гос. закупках</div>
                      <div className="flex items-center">
                        {taxes.governmentProcurementParticipant ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-[#628307] mr-2" />
                            <span className="text-lg font-semibold text-[#1D1D1D]">Участвует</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                            <span className="text-lg font-semibold text-[#1D1D1D]">Не участвует</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E6E6B0]">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <CardTitle className="text-[#628307] text-lg flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Дополнительная информация
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Размер компании</div>
                      <div className="text-lg font-semibold text-[#1D1D1D]">{taxes.companySize}</div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Количество лицензий</div>
                      <div className="text-lg font-semibold text-[#1D1D1D]">{taxes.licenseCount}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3 text-xs text-[#1D1D1D]/70">
                  Источник данных: {taxes.dataSource} • Последнее обновление: {taxes?.lastUpdateDate || "н/д"}
                </CardFooter>
              </Card>
            </>
          ) : null}
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          {loading.taxes ? (
            <div className="space-y-4">
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          ) : taxes ? (
            <>
              <Card className="border-[#E6E6B0]">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[#628307] text-lg flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2" />
                      Ежегодные налоговые отчисления (млрд ₸)
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-[#628307] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Показывает динамику ежегодных налоговых отчислений компании в миллиардах тенге</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80">
                    <ResponsiveBar
                      data={taxBarData}
                      keys={["Налоги"]}
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
                        legend: "Сумма (млрд ₸)",
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
                            {id}: {value} млрд ₸
                          </strong>
                        </div>
                      )}
                      animate={true}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Chart Visualization */}
              <Card className="border-[#E6E6B0]">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[#628307] text-lg flex items-center">
                      <LineChart className="h-5 w-5 mr-2" />
                      Динамика налоговых отчислений
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-[#628307] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Показывает тренд налоговых отчислений компании в виде линейного графика</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80">
                    <ResponsiveLine
                      data={[
                        {
                          id: "Налоговые отчисления",
                          color: "#628307",
                          data: taxBarData.map(item => ({
                            x: item.year,
                            y: item.Налоги,
                          })),
                        },
                      ]}
                      margin={{ top: 30, right: 20, bottom: 50, left: 70 }}
                      xScale={{ type: "point" }}
                      yScale={{
                        type: "linear",
                        min: "auto",
                        max: "auto",
                        stacked: false,
                        reverse: false,
                      }}
                      curve="monotoneX"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Год",
                        legendOffset: 36,
                        legendPosition: "middle",
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Сумма (млрд ₸)",
                        legendOffset: -50,
                        legendPosition: "middle",
                      }}
                      colors={["#628307"]}
                      pointSize={10}
                      pointColor="#ffffff"
                      pointBorderWidth={2}
                      pointBorderColor="#628307"
                      pointLabelYOffset={-12}
                      enableArea={true}
                      areaOpacity={0.15}
                      useMesh={true}
                      enableSlices="x"
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
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3 text-xs text-[#1D1D1D]/70">
                  График демонстрирует тренд налоговых отчислений компании по годам. Показатели приведены в миллиардах тенге.
                </CardFooter>
              </Card>

              {/* Tax Metrics Summary */}
              <Card className="border-[#E6E6B0]">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <CardTitle className="text-[#628307] text-lg flex items-center">
                    <FileBarChart className="h-5 w-5 mr-2" />
                    Сводка налоговых показателей
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Последние отчисления</div>
                      <div className="text-2xl font-bold text-[#628307]">{latestYearTax?.formattedAmount}</div>
                      <div className="text-xs text-[#1D1D1D]/70 mt-1">За {latestYearTax?.year} год</div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Динамика</div>
                      <div className={`text-2xl font-bold ${taxGrowth && parseFloat(taxGrowth) >= 0 ? "text-[#628307]" : "text-red-600"}`}>
                        {taxGrowth && (parseFloat(taxGrowth) >= 0 ? "+" : "")}
                        {taxGrowth}%
                      </div>
                      <div className="text-xs text-[#1D1D1D]/70 mt-1">К предыдущему году</div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="text-sm font-medium text-[#1D1D1D]/70 mb-2">Статус НДС</div>
                      <div className="flex items-center">
                        {taxes.vatPayer ? (
                          <Badge className="bg-[#628307]/20 text-[#628307] hover:bg-[#628307]/30 border-[#628307]/20">Плательщик НДС</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Не плательщик НДС</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>
      </Tabs>

      {/* Source Information */}
      {!loading.taxes && taxes && (
        <div className="mt-6 text-xs text-[#1D1D1D]/60 flex items-center justify-between">
          <div>Источник данных: {taxes.dataSource}</div>
          <div>Последнее обновление: {taxes?.lastUpdateDate || "н/д"}</div>
        </div>
      )}
    </div>
  );
};

export default CompanyTaxesPage;

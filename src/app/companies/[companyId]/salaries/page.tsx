"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import {
  Search,
  DollarSign,
  TrendingUp,
  Briefcase,
  MapPin,
  Building,
  Filter,
  BarChart2,
  LineChart,
  Award,
  ChevronRight,
  Plus,
  ArrowUpDown,
  Info,
} from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { ExperienceFilter } from "@/features/companyDetails/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompanySalariesPage = () => {
  const { companyId } = useParams() as { companyId: string };
  const router = useRouter();

  // State for UI filters and pagination
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>("all");
  const [positionSearch, setPositionSearch] = useState("");
  const [sortOption, setSortOption] = useState<"highest" | "lowest">("highest");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [activeTab, setActiveTab] = useState("list");

  // Get company details from our hook
  const { fetchSalaries, loading, error } = useCompanyDetails();

  // Use our hook to get cached data
  const { getSalaries } = useCompanyDetails();

  // Fetch salaries on mount and when filters change
  useEffect(() => {
    if (companyId) {
      fetchSalaries({
        companyId,
        experienceFilter,
        search: positionSearch,
        sort: sortOption,
        page,
        pageSize,
      });
    }
  }, [companyId, experienceFilter, positionSearch, sortOption, page, pageSize, fetchSalaries]);

  // Get the cached data for current filters
  const salaryData = getSalaries({
    companyId,
    experienceFilter,
    search: positionSearch,
    sort: sortOption,
    page,
    pageSize,
  });

  // Handle filter changes
  const handleExperienceFilterChange = (value: ExperienceFilter) => {
    setExperienceFilter(value);
    setPage(0); // Reset to first page when filter changes
  };

  const handlePositionSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPositionSearch(e.target.value);
    setPage(0); // Reset to first page when search changes
  };

  const handleSortChange = (value: "highest" | "lowest") => {
    setSortOption(value);
    setPage(0); // Reset to first page when sort changes
  };

  const handleChangePage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Prepare salary position data for bar chart
  const prepareSalaryPositionData = () => {
    if (!salaryData || !salaryData.salaries || salaryData.salaries.length === 0) return [];

    return salaryData.salaries.slice(0, 5).map(salary => ({
      position: salary.position,
      salary: salary.median,
    }));
  };

  // Prepare salary distribution data
  const prepareSalaryDistributionData = () => {
    if (!salaryData || !salaryData.statistics.salaryDistribution) return [];

    return salaryData.statistics.salaryDistribution.map(item => ({
      x: `₸${Math.round(item.salaryRange).toLocaleString()}`,
      y: item.count,
    }));
  };

  // Calculate statistics
  const salaryPositionData = prepareSalaryPositionData();
  const salaryDistributionData = prepareSalaryDistributionData();

  // Filter salaries from current page for rendering
  const filteredSalaries = salaryData ? salaryData.salaries : [];

  // Calculate total pages
  const totalPages = salaryData ? salaryData.totalPages : 0;

  if (error.salaries) {
    return (
      <div className="p-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-xl font-semibold text-red-700">Ошибка при загрузке данных о зарплатах</h4>
          <p className="text-red-600 mt-2">{error.salaries}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8">
      {/* Header with Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          {loading.salaries ? (
            <>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-40" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#1D1D1D] mb-1">Зарплаты в компании {salaryData?.companyName || ""}</h1>
              <div className="text-[#1D1D1D]/70 text-sm">Данные о {salaryData?.totalSalaries || 0} зарплатах в различных должностях</div>
            </>
          )}
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <Button className="bg-[#628307] hover:bg-[#4D6706] flex-1 md:flex-none" onClick={() => router.push("/profile/add/salary")}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить зарплату
          </Button>

          <Tabs defaultValue="list" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-[#E6E6B0]/20 border border-[#E6E6B0]/30">
              <TabsTrigger value="list" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
                Список
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
                Аналитика
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Search and Filters Section */}
      <Card className="border-[#E6E6B0] mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={18} />
              <Input
                placeholder="Поиск по должности..."
                value={positionSearch}
                onChange={handlePositionSearchChange}
                className="pl-10 w-full border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={experienceFilter} onValueChange={(value: ExperienceFilter) => handleExperienceFilterChange(value)}>
                <SelectTrigger className="w-full sm:w-[180px] border-[#E6E6B0] focus:ring-[#628307]">
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2 text-[#628307]" />
                    <SelectValue placeholder="Все уровни" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все уровни</SelectItem>
                  <SelectItem value="0-1">Менее 1 года</SelectItem>
                  <SelectItem value="1-3">1-3 года</SelectItem>
                  <SelectItem value="3-5">3-5 лет</SelectItem>
                  <SelectItem value="5-10">5-10 лет</SelectItem>
                  <SelectItem value="10+">Более 10 лет</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={(value: "highest" | "lowest") => handleSortChange(value)}>
                <SelectTrigger className="w-full sm:w-[200px] border-[#E6E6B0] focus:ring-[#628307]">
                  <div className="flex items-center">
                    <ArrowUpDown size={16} className="mr-2 text-[#628307]" />
                    <SelectValue placeholder="Сортировка" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest">Наибольшая зарплата</SelectItem>
                  <SelectItem value="lowest">Наименьшая зарплата</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-[#1D1D1D]/70 mt-4">
            {loading.salaries ? <Skeleton className="h-4 w-40" /> : `Найдено ${salaryData?.totalSalaries || 0} результатов`}
          </div>
        </CardContent>
      </Card>

      {activeTab === "list" ? (
        <>
          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {loading.salaries ? (
              <>
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </>
            ) : salaryData ? (
              <>
                <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow bg-gradient-to-br from-[#628307]/5 to-[#E6E6B0]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#628307]/10 text-[#628307] mr-4">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Средняя зарплата</div>
                        <div className="text-2xl font-bold text-[#628307]">₸{Math.round(salaryData.statistics.averageSalary).toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow bg-gradient-to-br from-[#628307]/5 to-[#E6E6B0]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#628307]/10 text-[#628307] mr-4">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Высшая зарплата</div>
                        <div className="text-2xl font-bold text-[#628307]">₸{Math.round(salaryData.statistics.highestSalary).toLocaleString()}</div>
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
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Количество должностей</div>
                        <div className="text-2xl font-bold text-[#628307]">{salaryData.statistics.totalPositions}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          {/* Salary Cards Section */}
          <div className="space-y-5">
            {loading.salaries ? (
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="border-[#E6E6B0]">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <Skeleton className="h-6 w-64 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))
            ) : filteredSalaries.length > 0 ? (
              filteredSalaries.map((salary, index) => (
                <Card key={index} className="border-[#E6E6B0] hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-5 border-b border-[#E6E6B0]">
                      <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                        <div>
                          <h4 className="text-xl font-semibold text-[#628307] mb-1">{salary.position}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-[#1D1D1D]/70">
                            {salary.department && (
                              <div className="flex items-center">
                                <Building size={16} className="mr-1 text-[#628307]" />
                                {salary.department}
                              </div>
                            )}
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-1 text-[#628307]" />
                              {salary.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Badge className="px-2 py-1 bg-[#628307]/10 text-[#628307] hover:bg-[#628307]/20 border-[#628307]/20">{salary.experienceLevel}</Badge>
                          <Badge className="px-2 py-1 bg-[#E6E6B0]/20 text-[#1D1D1D]/80 hover:bg-[#E6E6B0]/30 border-[#E6E6B0]/30">
                            {salary.employmentType}
                          </Badge>
                          {salary.hasVerification && (
                            <Badge className="px-2 py-1 bg-[#628307]/10 text-[#628307] hover:bg-[#628307]/20 border-[#628307]/20 flex items-center gap-1">
                              <Award size={12} />
                              Верифицировано
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-[#E6E6B0]/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-[#1D1D1D]/70 mb-1">Средняя зарплата</div>
                          <div className="text-2xl font-bold text-[#628307]">₸{salary.median.toLocaleString()}</div>
                          <div className="text-xs text-[#1D1D1D]/60 mt-1">
                            {salary.currency} · {salary.payPeriod}
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-[#1D1D1D]/70 mb-1">Диапазон зарплат</div>
                          <div className="text-lg font-semibold text-[#1D1D1D]">
                            ₸{salary.min.toLocaleString()} — ₸{salary.max.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#1D1D1D]/60 mt-1">Мин. — Макс.</div>
                        </div>

                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-[#1D1D1D]/70 mb-1">Дополнительные выплаты</div>
                          <div className="text-lg font-semibold text-[#1D1D1D]">₸{salary.additionalPay.toLocaleString()}</div>
                          <div className="text-xs text-[#1D1D1D]/60 mt-1">Бонусы, премии</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#E6E6B0]">
                        <div className="relative h-2 bg-[#E6E6B0]/30 rounded-full mb-2">
                          <div
                            className="absolute h-full bg-[#628307] rounded-full"
                            style={{
                              width: `${((salary.median - salary.min) / (salary.max - salary.min)) * 100}%`,
                              left: "0",
                            }}
                          ></div>
                          <div
                            className="absolute w-3 h-3 bg-[#628307] rounded-full top-1/2 transform -translate-y-1/2 border-2 border-white"
                            style={{
                              left: `${((salary.median - salary.min) / (salary.max - salary.min)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-[#1D1D1D]/60">
                          <span>₸{salary.min.toLocaleString()}</span>
                          <span>₸{salary.max.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-[#E6E6B0] bg-[#E6E6B0]/10">
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 mx-auto text-[#628307]/50 mb-3" />
                  <h3 className="text-xl font-semibold text-[#1D1D1D] mb-2">По заданным критериям зарплат не найдено</h3>
                  <p className="text-[#1D1D1D]/70 mb-4">Попробуйте изменить параметры фильтрации или добавьте первые данные о зарплатах</p>
                  <Button className="bg-[#628307] hover:bg-[#4D6706]" onClick={() => router.push("/profile/add/salary")}>
                    Добавить информацию о зарплате
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChangePage(i)}
                  className={`min-w-[2.5rem] h-9 ${
                    page === i ? "bg-[#628307] hover:bg-[#4D6706]" : "border-[#E6E6B0] text-[#1D1D1D]/70 hover:bg-[#E6E6B0]/20 hover:text-[#628307]"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Analytics View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Main Stats Card */}
            <Card className="border-[#E6E6B0] lg:col-span-1">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <CardTitle className="text-[#628307] text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Статистика зарплат
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loading.salaries ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : salaryData ? (
                  <div className="space-y-6">
                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Средняя зарплата</div>
                        <DollarSign className="h-5 w-5 text-[#628307]" />
                      </div>
                      <div className="text-2xl font-bold text-[#628307]">₸{Math.round(salaryData.statistics.averageSalary).toLocaleString()}</div>
                      <div className="text-xs text-[#1D1D1D]/60 mt-1">По всем должностям</div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Высшая зарплата</div>
                        <TrendingUp className="h-5 w-5 text-[#628307]" />
                      </div>
                      <div className="text-2xl font-bold text-[#628307]">₸{Math.round(salaryData.statistics.highestSalary).toLocaleString()}</div>
                      <div className="text-xs text-[#1D1D1D]/60 mt-1">Максимальная зарплата</div>
                    </div>

                    <div className="bg-[#E6E6B0]/10 rounded-lg p-4 border border-[#E6E6B0]/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#1D1D1D]/70">Количество должностей</div>
                        <Briefcase className="h-5 w-5 text-[#628307]" />
                      </div>
                      <div className="text-2xl font-bold text-[#628307]">{salaryData.statistics.totalPositions}</div>
                      <div className="text-xs text-[#1D1D1D]/60 mt-1">Уникальных позиций</div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="bg-[#E6E6B0]/10 border-t border-[#E6E6B0]/30 py-3">
                <Button variant="outline" className="w-full border-[#628307]/20 text-[#628307] hover:bg-[#628307]/5" onClick={() => setActiveTab("list")}>
                  Просмотреть все зарплаты
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            {/* Charts Section - Now takes 2/3 of the width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Salary by Position Chart */}
              <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <CardTitle className="text-[#628307] text-lg flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Зарплаты по должностям
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80">
                    {loading.salaries ? (
                      <Skeleton className="h-full w-full" />
                    ) : salaryPositionData.length > 0 ? (
                      <ResponsiveBar
                        data={salaryPositionData}
                        keys={["salary"]}
                        indexBy="position"
                        margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
                        padding={0.3}
                        layout="horizontal"
                        valueScale={{ type: "linear" }}
                        indexScale={{ type: "band", round: true }}
                        colors={({ id, data }) => "#628307"}
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
                          legend: "Зарплата (₸)",
                          legendPosition: "middle",
                          legendOffset: 40,
                          format: value => (value ? `₸${Math.round(value / 1000)}К` : "0"),
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 12,
                          tickRotation: 0,
                        }}
                        label={d => `₸${Math.round(d.value || 0).toLocaleString()}`}
                        labelSkipWidth={20}
                        labelSkipHeight={12}
                        labelTextColor="#ffffff"
                        animate={true}
                        tooltip={({ data, value }) => (
                          <div className="bg-white p-2 shadow-md rounded border border-[#E6E6B0]">
                            <div className="font-semibold text-[#1D1D1D]">{data.position}</div>
                            <div className="text-[#628307]">₸{value ? Math.round(value).toLocaleString() : "0"}</div>
                          </div>
                        )}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-[#1D1D1D]/60 text-center">Отображение данных о зарплатах по должностям</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Salary Distribution Chart */}
              <Card className="border-[#E6E6B0] hover:shadow-md transition-shadow">
                <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                  <CardTitle className="text-[#628307] text-lg flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Распределение зарплат
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80">
                    {loading.salaries ? (
                      <Skeleton className="h-full w-full" />
                    ) : salaryDistributionData.length > 0 ? (
                      <ResponsiveLine
                        data={[
                          {
                            id: "зарплаты",
                            data: salaryDistributionData,
                          },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                        xScale={{ type: "point" }}
                        yScale={{
                          type: "linear",
                          min: 0,
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
                          tickRotation: 45,
                          legend: "Уровень зарплаты",
                          legendOffset: 50,
                          legendPosition: "middle",
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: "Количество",
                          legendOffset: -45,
                          legendPosition: "middle",
                        }}
                        colors={["#628307"]}
                        lineWidth={3}
                        pointSize={10}
                        pointColor="#628307"
                        pointBorderWidth={2}
                        pointBorderColor={{ from: "serieColor" }}
                        pointLabelYOffset={-12}
                        areaBaselineValue={0}
                        enableArea={true}
                        areaOpacity={0.15}
                        useMesh={true}
                        enableSlices="x"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-[#1D1D1D]/60 text-center">Отображение распределения зарплат</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Salaries Preview */}
          <Card className="border-[#E6E6B0] mb-6">
            <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#628307] text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Топ зарплаты
                </CardTitle>
                <Button variant="outline" size="sm" className="border-[#628307]/20 text-[#628307] hover:bg-[#628307]/5" onClick={() => setActiveTab("list")}>
                  Все зарплаты
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loading.salaries ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : filteredSalaries.length > 0 ? (
                <div className="space-y-4">
                  {filteredSalaries.slice(0, 3).map((salary, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-lg border border-[#E6E6B0]/30 bg-[#E6E6B0]/10"
                    >
                      <div>
                        <h4 className="font-semibold text-[#628307]">{salary.position}</h4>
                        <div className="flex items-center text-sm text-[#1D1D1D]/70">
                          <MapPin size={14} className="mr-1 text-[#628307]" />
                          {salary.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#628307]/10 text-[#628307] border-[#628307]/20">{salary.experienceLevel}</Badge>
                        <div className="text-xl font-bold text-[#628307]">₸{salary.median.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-[#1D1D1D]/60">Нет данных о зарплатах</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CompanySalariesPage;

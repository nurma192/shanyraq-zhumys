// src/app/companies/[companyId]/salaries/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import {
  Search,
  DollarSign,
  TrendingUp,
  Briefcase,
  MapPin,
  Building,
} from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { ExperienceFilter } from "@/features/companyDetails/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "./CompanySalariesPage.module.scss";

const CompanySalariesPage = () => {
  const { companyId } = useParams() as { companyId: string };

  // State for UI filters and pagination
  const [experienceFilter, setExperienceFilter] =
    useState<ExperienceFilter>("all");
  const [positionSearch, setPositionSearch] = useState("");
  const [sortOption, setSortOption] = useState<"highest" | "lowest">("highest");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

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
  }, [
    companyId,
    experienceFilter,
    positionSearch,
    sortOption,
    page,
    pageSize,
    fetchSalaries,
  ]);

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

  const handlePositionSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    if (!salaryData || !salaryData.salaries || salaryData.salaries.length === 0)
      return [];

    return salaryData.salaries.slice(0, 5).map((salary) => ({
      position: salary.position,
      salary: salary.median,
    }));
  };

  // Prepare salary distribution data
  const prepareSalaryDistributionData = () => {
    if (!salaryData || !salaryData.statistics.salaryDistribution) return [];

    return salaryData.statistics.salaryDistribution.map((item) => ({
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
      <div className="py-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Ошибка при загрузке данных о зарплатах
        </h2>
        <div className="text-gray-600">{error.salaries}</div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        {loading.salaries ? (
          <>
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-5 w-64" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800">
              Зарплаты в компании {salaryData?.companyName || ""}
            </h1>
            <div className="text-gray-600">
              Данные о {salaryData?.totalSalaries || 0} зарплатах в различных
              должностях
            </div>
          </>
        )}
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading.salaries ? (
          <>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </>
        ) : salaryData ? (
          <>
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Средняя зарплата
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">
                      ₸
                      {Math.round(
                        salaryData.statistics.averageSalary
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 mr-4">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Высшая зарплата
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ₸
                      {Math.round(
                        salaryData.statistics.highestSalary
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-50 text-amber-600 mr-4">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Количество должностей
                    </div>
                    <div className="text-2xl font-bold text-amber-600">
                      {salaryData.statistics.totalPositions}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary by Position Chart */}
        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">
              Зарплаты по должностям
            </h3>
          </CardHeader>
          <CardContent>
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
                  colors={({ id, data }) => "#800000"}
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
                    format: (value) =>
                      value ? `₸${Math.round(value / 1000)}К` : "0",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 12,
                    tickRotation: 0,
                  }}
                  label={(d) => `₸${Math.round(d.value || 0).toLocaleString()}`}
                  labelSkipWidth={20}
                  labelSkipHeight={12}
                  labelTextColor="#ffffff"
                  animate={true}
                  tooltip={({ data, value }) => (
                    <div className="bg-white p-2 shadow-md rounded border border-gray-200">
                      <div className="font-semibold">{data.position}</div>
                      <div>
                        ₸{value ? Math.round(value).toLocaleString() : "0"}
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-gray-500 text-center">
                    Отображение данных о зарплатах по должностям
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Salary Distribution Chart */}
        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">
              Распределение зарплат
            </h3>
          </CardHeader>
          <CardContent>
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
                  colors={["#800000"]}
                  lineWidth={3}
                  pointSize={10}
                  pointColor="#800000"
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
                  <div className="text-gray-500 text-center">
                    Отображение распределения зарплат
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">
            Поиск по зарплатам
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Поиск по должности..."
                value={positionSearch}
                onChange={handlePositionSearchChange}
                className="pl-10 w-full h-12 border border-gray-300 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>

            <div className="flex-1">
              <Select
                value={experienceFilter}
                onValueChange={(value: ExperienceFilter) =>
                  handleExperienceFilterChange(value)
                }
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 focus:ring-gray-400">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Опыт работы:</span>
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
            </div>

            <div className="flex-1">
              <Select
                value={sortOption}
                onValueChange={(value: "highest" | "lowest") =>
                  handleSortChange(value)
                }
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 focus:ring-gray-400">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Сортировка:</span>
                    <SelectValue placeholder="Наибольшая зарплата" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest">Наибольшая зарплата</SelectItem>
                  <SelectItem value="lowest">Наименьшая зарплата</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            {loading.salaries ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              `Найдено ${salaryData?.totalSalaries || 0} результатов`
            )}
          </div>
        </CardContent>
      </Card>

      {/* Salary Cards Section */}
      <div className="space-y-5">
        {loading.salaries ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="bg-white border border-gray-200">
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
            <Card
              key={index}
              className="bg-white border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              <CardContent className="pt-6">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-1">
                      {salary.position}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      {salary.department && (
                        <div className="flex items-center">
                          <Building size={16} className="mr-1" />
                          {salary.department}
                        </div>
                      )}
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {salary.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                      {salary.experienceLevel}
                    </Badge>
                    <Badge className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                      {salary.employmentType}
                    </Badge>
                    {salary.hasVerification && (
                      <Badge className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
                        Верифицировано
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Средняя зарплата
                    </div>
                    <div className="text-2xl font-bold text-[#800000]">
                      ₸{salary.median.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {salary.currency} · {salary.payPeriod}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Диапазон зарплат
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      ₸{salary.min.toLocaleString()} — ₸
                      {salary.max.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Мин. — Макс.
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Дополнительные выплаты
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      ₸{salary.additionalPay.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Бонусы, премии
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white border border-gray-200">
            <CardContent className="py-12 text-center">
              <div className="text-gray-500">
                По заданным критериям зарплат не найдено.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i ? "default" : "outline"}
              size="sm"
              onClick={() => handleChangePage(i)}
              className={
                page === i ? "bg-[#800000] hover:bg-[#660000]" : "text-gray-600"
              }
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanySalariesPage;

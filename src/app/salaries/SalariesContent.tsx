// src/app/salaries/SalariesContent.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchSalaryStatistics,
  selectSalaryStatistics,
  selectSalaryStatisticsLoading,
  selectSalaryStatisticsError,
} from "@/features/salaryStatistics/salaryStatisticsSlice";
import SalaryBreakdown from "./components/SalaryBreakdown";
import CareerTrajectory from "./components/CareerTrajectory";
import SalaryList from "./components/SalaryList";
import { Search, Loader2, Info, ArrowRightIcon, Filter } from "lucide-react";
import searchAPI from "@/services/searchAPI";
import styles from "./Salaries.module.scss";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Define types for search results
interface JobResult {
  id: string;
  title: string;
}

interface LocationResult {
  id: string;
  locationValue: string;
}

// Define type for salary entry from API
interface SalaryEntryFromAPI {
  id: string | null;
  companyId: number;
  companyName: string;
  companyLogoUrl?: string;
  position: string;
  department: string;
  experienceLevel: string;
  salary: number;
  currency: string;
  payPeriod: string;
  additionalPay: number | null;
  location: string;
  employmentType: string;
  hasVerification: boolean;
}

// Define type for aggregated company salary data
interface CompanySalaryData {
  companyId: number;
  companyName: string;
  companyLogoUrl: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  currency: string;
  verified: boolean;
  count: number;
}

// Define type for salary statistics data
interface SalaryStatisticsData {
  jobTitle: string;
  location: string;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  minAdditionalPay: number;
  maxAdditionalPay: number;
  percentile10: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
  sampleSize: number;
  currency: string;
  payPeriod: string;
  employmentTypeDistribution: Record<string, number>;
  experienceLevelDistribution: Record<string, number>;
  salaryByExperienceLevel: Record<string, number>;
  salaries: SalaryEntryFromAPI[];
}

// Define type for our local use
interface LocalSalaryStatistics {
  data?: SalaryStatisticsData;
}

interface SalaryRangeData {
  basePay: {
    min: number;
    max: number;
  };
  additionalPay: {
    min: number;
    max: number;
  };
  totalEstimate: number;
}

interface ExperienceFilterOption {
  value: string;
  label: string;
}

interface EmploymentFilterOption {
  value: string;
  label: string;
}

export default function SalariesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const jobId = searchParams.get("jobId");
  const locationId = searchParams.get("locationId");

  // Experience level filter
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [experienceOptions, setExperienceOptions] = useState<
    ExperienceFilterOption[]
  >([]);

  // Employment type filter
  const [selectedEmployment, setSelectedEmployment] = useState<string>("all");
  const [employmentOptions, setEmploymentOptions] = useState<
    EmploymentFilterOption[]
  >([]);

  const salaryStats = useSelector(
    jobId && locationId ? selectSalaryStatistics(jobId, locationId) : () => null
  ) as LocalSalaryStatistics | null;

  const isLoading = useSelector(selectSalaryStatisticsLoading);
  const error = useSelector(selectSalaryStatisticsError);

  // Search functionality
  const [jobSearch, setJobSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);

  const [jobLoading, setJobLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [showJobResults, setShowJobResults] = useState(false);
  const [showLocationResults, setShowLocationResults] = useState(false);

  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);

  // If no jobId or locationId, redirect to home
  useEffect(() => {
    if (!jobId || !locationId) {
      toast({
        title: "Выберите должность и локацию",
        description:
          "Для просмотра информации о зарплатах необходимо выбрать должность и локацию",
        variant: "destructive",
      });
      router.push("/?tab=2");
    } else {
      dispatch(fetchSalaryStatistics({ jobId, locationId }));
    }
  }, [jobId, locationId, router, dispatch, toast]);

  // Create experience filter options when data loads
  useEffect(() => {
    if (salaryStats?.data) {
      const distribution = salaryStats.data.experienceLevelDistribution;
      const options: ExperienceFilterOption[] = [
        { value: "all", label: "Весь опыт" },
      ];

      Object.entries(distribution).forEach(([level, count]) => {
        let label = "";
        switch (level) {
          case "0-1":
            label = "0-1 год";
            break;
          case "1-3":
            label = "1-3 года";
            break;
          case "3-5":
            label = "3-5 лет";
            break;
          case "5-7":
            label = "5-7 лет";
            break;
          default:
            label = `${level} лет`;
        }
        options.push({ value: level, label: `${label} (${count})` });
      });

      setExperienceOptions(options);

      // Employment type options
      const empDistribution = salaryStats.data.employmentTypeDistribution;
      const empOptions: EmploymentFilterOption[] = [
        { value: "all", label: "Все типы занятости" },
      ];

      Object.entries(empDistribution).forEach(([type, count]) => {
        let label = "";
        switch (type) {
          case "full-time":
            label = "Полная занятость";
            break;
          case "part-time":
            label = "Частичная занятость";
            break;
          case "contract":
            label = "Контракт";
            break;
          default:
            label = type;
        }
        empOptions.push({ value: type, label: `${label} (${count})` });
      });

      setEmploymentOptions(empOptions);
    }
  }, [salaryStats]);

  // Job search
  useEffect(() => {
    const searchJobs = async () => {
      if (jobSearch.trim().length < 2) {
        setJobResults([]);
        setShowJobResults(false);
        return;
      }

      setJobLoading(true);
      try {
        const response = await searchAPI.searchJobs(jobSearch);
        setJobResults(response.data || []);
        setShowJobResults(true);
      } catch (error) {
        console.error("Error searching jobs:", error);
        setJobResults([]);
      } finally {
        setJobLoading(false);
      }
    };

    const timeoutId = setTimeout(searchJobs, 300);
    return () => clearTimeout(timeoutId);
  }, [jobSearch]);

  // Location search
  useEffect(() => {
    const searchLocations = async () => {
      if (locationSearch.trim().length < 2) {
        setLocationResults([]);
        setShowLocationResults(false);
        return;
      }

      setLocationLoading(true);
      try {
        const response = await searchAPI.searchLocations(locationSearch);
        setLocationResults(response.data || []);
        setShowLocationResults(true);
      } catch (error) {
        console.error("Error searching locations:", error);
        setLocationResults([]);
      } finally {
        setLocationLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [locationSearch]);

  const handleJobSelect = (job: JobResult) => {
    setSelectedJob(job);
    setJobSearch(job.title);
    setShowJobResults(false);
  };

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);
    setLocationSearch(location.locationValue);
    setShowLocationResults(false);
  };

  const handleSearch = () => {
    if (selectedJob && selectedLocation) {
      router.push(
        `/salaries?jobId=${selectedJob.id}&locationId=${selectedLocation.id}`
      );
    }
  };

  // Filter salaries based on experience and employment type
  const getFilteredSalaries = () => {
    if (!salaryStats?.data?.salaries) return [];

    return salaryStats.data.salaries.filter((entry) => {
      const experienceMatch =
        selectedExperience === "all" ||
        entry.experienceLevel === selectedExperience;
      const employmentMatch =
        selectedEmployment === "all" ||
        entry.employmentType === selectedEmployment;
      return experienceMatch && employmentMatch;
    });
  };

  // Aggregate salaries by company
  const getAggregatedCompanySalaries = (): CompanySalaryData[] => {
    const filteredSalaries = getFilteredSalaries();
    const companySalaries: Record<number, CompanySalaryData> = {};

    filteredSalaries.forEach((entry) => {
      if (!companySalaries[entry.companyId]) {
        companySalaries[entry.companyId] = {
          companyId: entry.companyId,
          companyName: entry.companyName,
          companyLogoUrl:
            entry.companyLogoUrl ||
            "https://cdn-icons-png.flaticon.com/512/5954/5954315.png",
          minSalary: entry.salary,
          maxSalary: entry.salary,
          avgSalary: entry.salary,
          currency: entry.currency,
          verified: entry.hasVerification,
          count: 1,
        };
      } else {
        const company = companySalaries[entry.companyId];
        company.minSalary = Math.min(company.minSalary, entry.salary);
        company.maxSalary = Math.max(company.maxSalary, entry.salary);
        company.avgSalary =
          (company.avgSalary * company.count + entry.salary) /
          (company.count + 1);
        company.count += 1;
        company.verified = company.verified || entry.hasVerification;
      }
    });

    return Object.values(companySalaries);
  };

  // If loading or no data yet, show loading state
  if (isLoading || (!salaryStats && !error)) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#800000] mb-4" />
          <p className="text-xl font-medium">Загрузка данных о зарплатах...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Произошла ошибка при загрузке данных
        </h2>
        <p className="mb-8">
          Пожалуйста, попробуйте еще раз или выполните новый поиск
        </p>

        <div className="max-w-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="w-full relative">
              <Input
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Должность"
                className="pl-10"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />

              {jobLoading && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}

              {showJobResults && jobResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                  {jobResults.map((job) => (
                    <div
                      key={job.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleJobSelect(job)}
                    >
                      {job.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full relative">
              <Input
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Местоположение"
                className="pl-10"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />

              {locationLoading && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}

              {showLocationResults && locationResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                  {locationResults.map((location) => (
                    <div
                      key={location.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location.locationValue}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              className="h-10 w-full md:w-auto bg-[#800000] hover:bg-[#660000]"
              disabled={!selectedJob || !selectedLocation}
            >
              <Search className="h-4 w-4 mr-2" />
              Поиск
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get data from salaryStats response data
  const actualData = salaryStats?.data;

  // Format currency
  const formatCurrency = (
    amount: number,
    notation: "standard" | "compact" = "standard"
  ) => {
    const formatter = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: actualData?.currency || "KZT",
      maximumFractionDigits: 0,
      notation: notation,
    });
    return formatter.format(amount);
  };

  // Create data structures for components based on API response
  const salaryData: SalaryRangeData = {
    basePay: {
      min: actualData?.minSalary || 0,
      max: actualData?.maxSalary || 0,
    },
    additionalPay: {
      min: actualData?.minAdditionalPay || 0,
      max: actualData?.maxAdditionalPay || 0,
    },
    totalEstimate: actualData?.averageSalary || 0,
  };

  // Extract experience levels and create trajectory data
  const experienceLevels = Object.keys(
    actualData?.salaryByExperienceLevel || {}
  );

  // Map experience level to user-friendly names
  const getExperienceLevelName = (level: string) => {
    switch (level) {
      case "0-1":
        return "Начинающий (0-1 год)";
      case "1-3":
        return "Младший (1-3 года)";
      case "3-5":
        return "Средний (3-5 лет)";
      case "5-7":
        return "Старший (5-7 лет)";
      case "7+":
        return "Ведущий (7+ лет)";
      default:
        return level;
    }
  };

  // Create trajectoryData array for career progression
  const trajectoryData = experienceLevels.map((level) => {
    const salary = (actualData?.salaryByExperienceLevel || {})[level] || 0;
    return {
      role: getExperienceLevelName(level),
      salaryRange: `${formatCurrency(salary)}/${
        actualData?.payPeriod === "monthly" ? "мес" : "год"
      }`,
      current: true,
    };
  });

  // Get aggregated company salaries
  const companySalaries = getAggregatedCompanySalaries();

  // Format salaries data for listing with range and count information
  const salaryEntries = companySalaries.map((company) => ({
    id: `${company.companyId}`,
    companyId: `${company.companyId}`,
    companyName: company.companyName,
    companyLogoUrl: company.companyLogoUrl,
    salaryRange: {
      min: formatCurrency(company.minSalary, "compact"),
      max: formatCurrency(company.maxSalary, "compact"),
      avg: formatCurrency(company.avgSalary, "compact"),
      count: company.count,
    },
    verified: company.verified,
  }));

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          Зарплаты {actualData?.jobTitle || ""} в {actualData?.location || ""}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="w-full md:w-64 relative">
            <Input
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="Должность"
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />

            {jobLoading && (
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}

            {showJobResults && jobResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                {jobResults.map((job) => (
                  <div
                    key={job.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleJobSelect(job)}
                  >
                    {job.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-64 relative">
            <Input
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Местоположение"
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />

            {locationLoading && (
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}

            {showLocationResults && locationResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                {locationResults.map((location) => (
                  <div
                    key={location.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location.locationValue}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSearch}
            className="h-10 w-full md:w-auto bg-[#800000] hover:bg-[#660000]"
            disabled={!selectedJob || !selectedLocation}
          >
            <Search className="h-4 w-4 mr-2 md:mr-0" />
            <span className="md:hidden">Поиск</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#800000] flex items-center justify-between">
              <span>Обзор зарплат</span>
              <Badge variant="outline" className="ml-2">
                {actualData?.sampleSize || 0}{" "}
                {actualData?.sampleSize === 1
                  ? "запись"
                  : actualData?.sampleSize && actualData.sampleSize < 5
                  ? "записи"
                  : "записей"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Диапазон зарплат:</span>
                <span className="font-semibold">
                  {formatCurrency(actualData?.minSalary || 0)} -{" "}
                  {formatCurrency(actualData?.maxSalary || 0)}
                </span>
              </div>

              <div className="h-2 w-full bg-gray-200 rounded-full relative mb-6">
                <div
                  className="absolute h-4 w-4 bg-[#800000] rounded-full -top-1"
                  style={{ left: "0%" }}
                ></div>
                <div
                  className="absolute h-4 w-4 bg-[#800000] rounded-full -top-1"
                  style={{ left: "100%" }}
                ></div>
                <div
                  className="absolute h-6 w-6 bg-white border-2 border-[#800000] rounded-full -top-2 transform -translate-x-1/2 flex items-center justify-center"
                  style={{ left: "50%" }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <span className="text-xs font-bold text-[#800000]">
                            М
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Медианная зарплата:{" "}
                          {formatCurrency(actualData?.medianSalary || 0)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div
                  className="h-full bg-[#800000] rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Средняя зарплата:
                  </p>
                  <p className="text-lg font-bold text-[#800000]">
                    {formatCurrency(actualData?.averageSalary || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Медианная зарплата:
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(actualData?.medianSalary || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Процентили зарплат</h3>
              <div className="grid grid-cols-4 gap-2 mb-1">
                <div className="text-xs text-gray-500 text-center">10%</div>
                <div className="text-xs text-gray-500 text-center">25%</div>
                <div className="text-xs text-gray-500 text-center">75%</div>
                <div className="text-xs text-gray-500 text-center">90%</div>
              </div>
              <div className="flex h-6 w-full mb-1">
                <div className="w-1/4 bg-[#f1e4e4] rounded-l-lg"></div>
                <div className="w-1/4 bg-[#e6c8c8]"></div>
                <div className="w-1/4 bg-[#d9abab]"></div>
                <div className="w-1/4 bg-[#c68e8e] rounded-r-lg"></div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-xs font-medium text-center">
                  {formatCurrency(actualData?.percentile10 || 0, "compact")}
                </div>
                <div className="text-xs font-medium text-center">
                  {formatCurrency(actualData?.percentile25 || 0, "compact")}
                </div>
                <div className="text-xs font-medium text-center">
                  {formatCurrency(actualData?.percentile75 || 0, "compact")}
                </div>
                <div className="text-xs font-medium text-center">
                  {formatCurrency(actualData?.percentile90 || 0, "compact")}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Процентили зарплат показывают распределение зарплат на рынке.
                  Например, 10-й процентиль означает, что 10% людей получают
                  зарплату ниже этого уровня, а 90% - выше. 90-й процентиль
                  показывает уровень, ниже которого находятся зарплаты 90%
                  работников. Эти данные помогают понять, к какой части рынка
                  труда относится ваша зарплата и насколько она
                  конкурентоспособна в данной профессии и регионе.
                </p>
              </div>
            </div>

            {trajectoryData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-[#800000]">
                  Зарплата по опыту работы
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {trajectoryData.map((item, idx) => (
                    <Card
                      key={idx}
                      className="border border-gray-200 hover:border-[#800000] hover:shadow-md transition-all"
                    >
                      <CardContent className="p-4">
                        <p className="font-medium mb-1">{item.role}</p>
                        <p className="text-[#800000] font-semibold">
                          {item.salaryRange}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#800000]">Структура оплаты</CardTitle>
            <CardDescription>
              {actualData?.payPeriod === "monthly" ? "Месячная" : "Годовая"}{" "}
              оплата
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Базовая оплата</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(salaryData.basePay.min)} -{" "}
                  {formatCurrency(salaryData.basePay.max)}
                </p>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            {salaryData.additionalPay.max > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Дополнительная оплата</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(salaryData.additionalPay.min)} -{" "}
                    {formatCurrency(salaryData.additionalPay.max)}
                  </p>
                </div>
                <Progress
                  value={
                    (salaryData.additionalPay.max / salaryData.basePay.max) *
                    100
                  }
                  className="h-2"
                />
              </div>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-medium">Общая средняя оплата</p>
              <p className="text-lg font-bold text-[#800000]">
                {formatCurrency(salaryData.totalEstimate)}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              <div className="flex gap-2">
                <Info
                  size={16}
                  className="text-[#800000] flex-shrink-0 mt-0.5"
                />
                <p>
                  Дополнительная оплата может включать бонусы, премии, комиссии
                  и другие формы материального поощрения.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {salaryEntries.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#800000]">
              Зарплаты по компаниям
            </h2>

            <div className="flex gap-2">
              {experienceOptions.length > 1 && (
                <Select
                  value={selectedExperience}
                  onValueChange={setSelectedExperience}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Опыт работы" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {employmentOptions.length > 1 && (
                <Select
                  value={selectedEmployment}
                  onValueChange={setSelectedEmployment}
                >
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Тип занятости" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <SalaryList data={salaryEntries} />
        </div>
      )}
    </>
  );
}

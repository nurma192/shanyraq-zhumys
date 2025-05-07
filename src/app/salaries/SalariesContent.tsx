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
import { Search, Loader2, Info, ChevronRight, Filter, Users, CheckCircle, ArrowRight, Briefcase, MapPin, DollarSign, BarChart3 } from "lucide-react";
import searchAPI from "@/services/searchAPI";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface SalaryListItem {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  salaryRange: {
    min: string;
    max: string;
    avg: string;
    count: number;
  };
  verified?: boolean;
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
  const [experienceOptions, setExperienceOptions] = useState<ExperienceFilterOption[]>([]);

  // Employment type filter
  const [selectedEmployment, setSelectedEmployment] = useState<string>("all");
  const [employmentOptions, setEmploymentOptions] = useState<EmploymentFilterOption[]>([]);

  const salaryStats = useSelector(jobId && locationId ? selectSalaryStatistics(jobId, locationId) : () => null) as LocalSalaryStatistics | null;

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
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);

  // If no jobId or locationId, redirect to home
  useEffect(() => {
    if (!jobId || !locationId) {
      toast({
        title: "Выберите должность и локацию",
        description: "Для просмотра информации о зарплатах необходимо выбрать должность и локацию",
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
      const options: ExperienceFilterOption[] = [{ value: "all", label: "Весь опыт" }];

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
      const empOptions: EmploymentFilterOption[] = [{ value: "all", label: "Все типы занятости" }];

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
      router.push(`/salaries?jobId=${selectedJob.id}&locationId=${selectedLocation.id}`);
    }
  };

  // Filter salaries based on experience and employment type
  const getFilteredSalaries = () => {
    if (!salaryStats?.data?.salaries) return [];

    return salaryStats.data.salaries.filter(entry => {
      const experienceMatch = selectedExperience === "all" || entry.experienceLevel === selectedExperience;
      const employmentMatch = selectedEmployment === "all" || entry.employmentType === selectedEmployment;
      return experienceMatch && employmentMatch;
    });
  };

  // Aggregate salaries by company
  const getAggregatedCompanySalaries = (): CompanySalaryData[] => {
    const filteredSalaries = getFilteredSalaries();
    const companySalaries: Record<number, CompanySalaryData> = {};

    filteredSalaries.forEach(entry => {
      if (!companySalaries[entry.companyId]) {
        companySalaries[entry.companyId] = {
          companyId: entry.companyId,
          companyName: entry.companyName,
          companyLogoUrl: entry.companyLogoUrl || "https://cdn-icons-png.flaticon.com/512/5954/5954315.png",
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
        company.avgSalary = (company.avgSalary * company.count + entry.salary) / (company.count + 1);
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
          <Loader2 className="h-12 w-12 animate-spin text-[#628307] mb-4" />
          <p className="text-xl font-medium text-[#1D1D1D]">Загрузка данных о зарплатах...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Произошла ошибка при загрузке данных</h2>
        <p className="mb-8 text-[#1D1D1D]">Пожалуйста, попробуйте еще раз или выполните новый поиск</p>

        <div className="max-w-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="w-full relative">
              <Input
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
                placeholder="Должность"
                className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

              {jobLoading && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#628307]" />
                </div>
              )}

              {showJobResults && jobResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0] rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                  {jobResults.map(job => (
                    <div key={job.id} className="px-4 py-2 hover:bg-[#E6E6B0]/20 cursor-pointer" onClick={() => handleJobSelect(job)}>
                      {job.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full relative">
              <Input
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                placeholder="Местоположение"
                className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

              {locationLoading && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#628307]" />
                </div>
              )}

              {showLocationResults && locationResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0] rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                  {locationResults.map(location => (
                    <div key={location.id} className="px-4 py-2 hover:bg-[#E6E6B0]/20 cursor-pointer" onClick={() => handleLocationSelect(location)}>
                      {location.locationValue}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              className="h-10 w-full md:w-auto bg-[#628307] hover:bg-[#4D6706] text-white"
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
  const formatCurrency = (amount: number, notation: "standard" | "compact" = "standard") => {
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
  const experienceLevels = Object.keys(actualData?.salaryByExperienceLevel || {});

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
  const trajectoryData = experienceLevels.map(level => {
    const salary = (actualData?.salaryByExperienceLevel || {})[level] || 0;
    return {
      role: getExperienceLevelName(level),
      salaryRange: `${formatCurrency(salary)}/${actualData?.payPeriod === "monthly" ? "мес" : "год"}`,
      current: true,
    };
  });

  // Get aggregated company salaries
  const companySalaries = getAggregatedCompanySalaries();

  // Format salaries data for listing with range and count information
  const salaryEntries: SalaryListItem[] = companySalaries.map(company => ({
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

  // Helper to format the salary display based on range
  const formatSalaryDisplay = (item: SalaryListItem) => {
    const { min, max, count } = item.salaryRange;

    if (min === max) {
      return item.salaryRange.avg;
    }

    return (
      <div className="flex flex-col">
        <span>
          {min} - {max}
        </span>
        <span className="text-xs text-gray-500">В среднем: {item.salaryRange.avg}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Search Panel - Now at the top as a prominent feature */}
      <Card className="mb-8 border-[#E6E6B0] shadow-md bg-[#E6E6B0]/10">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-[#628307]" />
              <h2 className="text-xl font-semibold text-[#1D1D1D]">Поиск зарплат</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <Input
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  placeholder="Должность"
                  className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                />
                {jobLoading && (
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#628307]" />
                  </div>
                )}
                {showJobResults && jobResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0] rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                    {jobResults.map(job => (
                      <div key={job.id} className="px-4 py-2 hover:bg-[#E6E6B0]/20 cursor-pointer" onClick={() => handleJobSelect(job)}>
                        {job.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]">
                  <MapPin className="h-4 w-4" />
                </div>
                <Input
                  value={locationSearch}
                  onChange={e => setLocationSearch(e.target.value)}
                  placeholder="Местоположение"
                  className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                />
                {locationLoading && (
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#628307]" />
                  </div>
                )}
                {showLocationResults && locationResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0] rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                    {locationResults.map(location => (
                      <div key={location.id} className="px-4 py-2 hover:bg-[#E6E6B0]/20 cursor-pointer" onClick={() => handleLocationSelect(location)}>
                        {location.locationValue}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleSearch} className="h-10 bg-[#628307] hover:bg-[#4D6706] text-white" disabled={!selectedJob || !selectedLocation}>
                <Search className="h-4 w-4 mr-2" />
                Поиск зарплат
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Title and Summary Card */}
      <Card className="mb-8 border-[#E6E6B0] shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#628307] to-[#4D6706] text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {actualData?.jobTitle || ""} в {actualData?.location || ""}
              </h1>
              <p className="mt-2 text-white/80">
                Данные о зарплатах основаны на {actualData?.sampleSize || 0}{" "}
                {actualData?.sampleSize === 1 ? "записи" : actualData?.sampleSize && actualData.sampleSize < 5 ? "записях" : "записях"}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end bg-white/10 p-3 rounded-lg">
              <p className="text-sm">Средняя зарплата</p>
              <p className="text-2xl font-bold">{formatCurrency(actualData?.averageSalary || 0)}</p>
              <p className="text-sm">{actualData?.payPeriod === "monthly" ? "в месяц" : "в год"}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4 bg-[#E6E6B0]/10 rounded-lg border border-[#E6E6B0]/30">
              <DollarSign className="h-8 w-8 text-[#628307] mb-2" />
              <p className="text-sm text-[#1D1D1D]/70 mb-1">Минимальная</p>
              <p className="text-xl font-bold text-[#1D1D1D]">{formatCurrency(actualData?.minSalary || 0)}</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-[#E6E6B0]/10 rounded-lg border border-[#E6E6B0]/30">
              <BarChart3 className="h-8 w-8 text-[#628307] mb-2" />
              <p className="text-sm text-[#1D1D1D]/70 mb-1">Медианная</p>
              <p className="text-xl font-bold text-[#1D1D1D]">{formatCurrency(actualData?.medianSalary || 0)}</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-[#E6E6B0]/10 rounded-lg border border-[#E6E6B0]/30">
              <DollarSign className="h-8 w-8 text-[#628307] mb-2" />
              <p className="text-sm text-[#1D1D1D]/70 mb-1">Максимальная</p>
              <p className="text-xl font-bold text-[#1D1D1D]">{formatCurrency(actualData?.maxSalary || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6 bg-[#E6E6B0]/20 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="companies" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            По компаниям
          </TabsTrigger>
          <TabsTrigger value="experience" className="data-[state=active]:bg-[#628307] data-[state=active]:text-white">
            По опыту
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 border-[#E6E6B0] shadow-md">
              <CardHeader className="pb-2 border-b border-[#E6E6B0]/30">
                <CardTitle className="text-[#628307]">Распределение зарплат</CardTitle>
                <CardDescription className="text-[#1D1D1D]/70">Процентили показывают распределение зарплат на рынке</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-2 mb-1">
                    <div className="text-xs text-[#1D1D1D]/70 text-center">10%</div>
                    <div className="text-xs text-[#1D1D1D]/70 text-center">25%</div>
                    <div className="text-xs text-[#1D1D1D]/70 text-center">75%</div>
                    <div className="text-xs text-[#1D1D1D]/70 text-center">90%</div>
                  </div>
                  <div className="flex h-6 w-full mb-1">
                    <div className="w-1/4 bg-[#E6E6B0]/30 rounded-l-lg"></div>
                    <div className="w-1/4 bg-[#E6E6B0]/50"></div>
                    <div className="w-1/4 bg-[#628307]/20"></div>
                    <div className="w-1/4 bg-[#628307]/40 rounded-r-lg"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-xs font-medium text-center text-[#1D1D1D]">{formatCurrency(actualData?.percentile10 || 0, "compact")}</div>
                    <div className="text-xs font-medium text-center text-[#1D1D1D]">{formatCurrency(actualData?.percentile25 || 0, "compact")}</div>
                    <div className="text-xs font-medium text-center text-[#1D1D1D]">{formatCurrency(actualData?.percentile75 || 0, "compact")}</div>
                    <div className="text-xs font-medium text-center text-[#1D1D1D]">{formatCurrency(actualData?.percentile90 || 0, "compact")}</div>
                  </div>
                  <div className="mt-4 text-sm text-[#1D1D1D]/70 p-3 bg-[#E6E6B0]/10 rounded-lg border border-[#E6E6B0]/30">
                    <p>
                      Процентили зарплат показывают распределение зарплат на рынке. Например, 10-й процентиль означает, что 10% людей получают зарплату ниже
                      этого уровня, а 90% - выше. 90-й процентиль показывает уровень, ниже которого находятся зарплаты 90% работников.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E6E6B0] shadow-md">
              <CardHeader className="pb-2 border-b border-[#E6E6B0]/30">
                <CardTitle className="text-[#628307]">Структура оплаты</CardTitle>
                <CardDescription className="text-[#1D1D1D]/70">{actualData?.payPeriod === "monthly" ? "Месячная" : "Годовая"} оплата</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-[#1D1D1D]">Базовая оплата</p>
                    <p className="text-sm font-semibold text-[#1D1D1D]">
                      {formatCurrency(salaryData.basePay.min, "compact")} - {formatCurrency(salaryData.basePay.max, "compact")}
                    </p>
                  </div>
                  <Progress value={100} className="h-2 bg-[#E6E6B0]/30" />
                </div>

                {salaryData.additionalPay.max > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-[#1D1D1D]">Дополнительная оплата</p>
                      <p className="text-sm font-semibold text-[#1D1D1D]">
                        {formatCurrency(salaryData.additionalPay.min, "compact")} - {formatCurrency(salaryData.additionalPay.max, "compact")}
                      </p>
                    </div>
                    <Progress value={(salaryData.additionalPay.max / salaryData.basePay.max) * 100} className="h-2 bg-[#E6E6B0]/30" />
                  </div>
                )}

                <Separator className="my-4 bg-[#E6E6B0]/30" />

                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm font-medium text-[#1D1D1D]">Общая средняя оплата</p>
                  <p className="text-lg font-bold text-[#628307]">{formatCurrency(salaryData.totalEstimate)}</p>
                </div>

                <div className="bg-[#E6E6B0]/10 p-4 rounded-lg text-sm text-[#1D1D1D]/70 border border-[#E6E6B0]/30">
                  <div className="flex gap-2">
                    <Info size={16} className="text-[#628307] flex-shrink-0 mt-0.5" />
                    <p>Дополнительная оплата может включать бонусы, премии, комиссии и другие формы материального поощрения.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="mt-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-[#628307]">Зарплаты по компаниям</h2>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {experienceOptions.length > 1 && (
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="w-full sm:w-[180px] border-[#E6E6B0] focus:ring-[#628307]">
                    <Filter className="h-4 w-4 mr-2 text-[#628307]" />
                    <SelectValue placeholder="Опыт работы" />
                  </SelectTrigger>
                  <SelectContent className="border-[#E6E6B0]">
                    {experienceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {employmentOptions.length > 1 && (
                <Select value={selectedEmployment} onValueChange={setSelectedEmployment}>
                  <SelectTrigger className="w-full sm:w-[200px] border-[#E6E6B0] focus:ring-[#628307]">
                    <Filter className="h-4 w-4 mr-2 text-[#628307]" />
                    <SelectValue placeholder="Тип занятости" />
                  </SelectTrigger>
                  <SelectContent className="border-[#E6E6B0]">
                    {employmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Card className="border-[#E6E6B0] shadow-md overflow-hidden">
            <Table>
              <TableHeader className="bg-[#E6E6B0]/20">
                <TableRow>
                  <TableHead className="text-[#1D1D1D] font-semibold text-sm">Компания</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold text-sm text-right">Зарплата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryEntries.map(item => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30"
                    onClick={() => router.push(`/companies/${item.companyId}/salaries`)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#E6E6B0]/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={item.companyLogoUrl || "/placeholder.png"} alt={item.companyName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#1D1D1D]">{item.companyName}</p>
                            {item.salaryRange.count > 1 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-5 bg-[#E6E6B0]/20 border-[#E6E6B0]/30">
                                      <Users className="h-3 w-3 text-[#628307]" />
                                      <span className="text-xs text-[#1D1D1D]">{item.salaryRange.count}</span>
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-white border border-[#E6E6B0]">
                                    <p>Количество записей: {item.salaryRange.count}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          {item.verified && (
                            <Badge variant="outline" className="bg-[#628307]/10 text-[#628307] border-[#628307]/20 text-xs flex items-center gap-1 mt-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Проверено</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[#1D1D1D]">{formatSalaryDisplay(item)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="mt-0">
          {trajectoryData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#628307]">Зарплата по опыту работы</h3>

              <div className="relative mb-8 pl-4 border-l-2 border-[#628307]/30">
                {trajectoryData.map((item, idx) => (
                  <div key={idx} className="mb-6 relative">
                    <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#628307] text-white flex items-center justify-center">{idx + 1}</div>
                    <Card className="ml-6 border border-[#E6E6B0] hover:border-[#628307]/40 hover:bg-[#E6E6B0]/10 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <p className="font-medium mb-1 text-[#1D1D1D] text-lg">{item.role}</p>
                            <p className="text-[#1D1D1D]/70 text-sm">Уровень опыта</p>
                          </div>
                          <div className="mt-2 md:mt-0 bg-[#628307]/10 p-2 rounded-lg">
                            <p className="text-[#628307] font-semibold text-xl">{item.salaryRange}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {idx < trajectoryData.length - 1 && (
                      <div className="absolute -left-[9px] top-10 h-[calc(100%-10px)] border-l-2 border-dashed border-[#628307]/30"></div>
                    )}
                  </div>
                ))}
              </div>

              <Card className="border-[#E6E6B0] shadow-md">
                <CardHeader className="pb-2 border-b border-[#E6E6B0]/30">
                  <CardTitle className="text-[#628307]">Рост зарплаты с опытом</CardTitle>
                  <CardDescription className="text-[#1D1D1D]/70">Как меняется зарплата с увеличением опыта работы</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-[#E6E6B0]/10 p-4 rounded-lg text-sm text-[#1D1D1D]/70 border border-[#E6E6B0]/30 mb-4">
                    <div className="flex gap-2">
                      <Info size={16} className="text-[#628307] flex-shrink-0 mt-0.5" />
                      <p>
                        С увеличением опыта работы зарплата специалиста обычно растет. Данные показывают, как меняется средняя зарплата в зависимости от стажа
                        работы в данной профессии.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {trajectoryData.map((item, idx) => (
                      <Card key={idx} className="border border-[#E6E6B0] hover:border-[#628307]/40 hover:bg-[#E6E6B0]/10 transition-all duration-200">
                        <CardContent className="p-4">
                          <p className="font-medium mb-1 text-[#1D1D1D]">{item.role}</p>
                          <p className="text-[#628307] font-semibold">{item.salaryRange}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

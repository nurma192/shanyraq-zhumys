"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Building2,
  DollarSign,
  FileText,
  TrendingUp,
  Loader2,
  Star,
  ChevronRight,
  Users,
  BarChart2,
  Briefcase,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import searchAPI from "@/services/searchAPI";

interface Job {
  id: string;
  title: string;
}

interface Location {
  id: string;
  locationValue: string;
}

interface Company {
  id: string;
  name: string;
  logoUrl?: string;
}

function SearchParamsHandler({ onTabChange }: { onTabChange: (tabValue: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      onTabChange(tabParam === "1" ? "companies" : "salaries");
    }
  }, [searchParams, onTabChange]);

  return null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("companies");
  const router = useRouter();

  // Search state
  const [jobSearch, setJobSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const [jobResults, setJobResults] = useState<Job[]>([]);
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [companyResults, setCompanyResults] = useState<Company[]>([]);

  const [jobLoading, setJobLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);

  const [showJobResults, setShowJobResults] = useState(false);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [showCompanyResults, setShowCompanyResults] = useState(false);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset search fields when changing tabs
    setJobSearch("");
    setLocationSearch("");
    setCompanySearch("");
    setSelectedJob(null);
    setSelectedLocation(null);
    setSelectedCompany(null);
  };

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

  // Company search
  useEffect(() => {
    const searchCompanies = async () => {
      if (companySearch.trim().length < 2) {
        setCompanyResults([]);
        setShowCompanyResults(false);
        return;
      }

      setCompanyLoading(true);
      try {
        const response = await searchAPI.searchCompanies(companySearch);
        setCompanyResults(response.data?.content || []);
        setShowCompanyResults(true);
      } catch (error) {
        console.error("Error searching companies:", error);
        setCompanyResults([]);
      } finally {
        setCompanyLoading(false);
      }
    };

    const timeoutId = setTimeout(searchCompanies, 300);
    return () => clearTimeout(timeoutId);
  }, [companySearch]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setJobSearch(job.title);
    setShowJobResults(false);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocationSearch(location.locationValue);
    setShowLocationResults(false);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setShowCompanyResults(false);
    router.push(`/companies/${company.id}/reviews`);
  };

  const handleSearch = () => {
    if (activeTab === "companies" && selectedCompany) {
      router.push(`/companies/${selectedCompany.id}/reviews`);
    } else if (activeTab === "salaries" && selectedJob && selectedLocation) {
      router.push(`/salaries?jobId=${selectedJob.id}&locationId=${selectedLocation.id}`);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Suspense fallback={null}>
        <SearchParamsHandler onTabChange={handleTabChange} />
      </Suspense>

      {/* Hero Section - Redesigned */}
      <section className="relative bg-[#1D1D1D] py-16 md:py-20 overflow-hidden">
        {/* Background Pattern - Diagonal Lines */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#E6E6B0" strokeWidth="4" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#diagonalLines)" />
          </svg>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#628307]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-[#E6E6B0]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-[#628307]/10 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
            {/* Left Column - Content */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1 mt-8 lg:mt-0">
              <div className="lg:pr-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#E6E6B0] leading-tight">
                  Ваша карьера <span className="text-[#628307]">заслуживает</span> справедливой оплаты
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                  Узнайте свою стоимость на рынке труда и рассчитайте справедливую зарплату с помощью современных инструментов оценки
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                    <Users size={20} className="text-[#628307] mr-2" />
                    <span className="text-white/90">1M+ отзывов</span>
                  </div>
                  <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                    <Building2 size={20} className="text-[#628307] mr-2" />
                    <span className="text-white/90">10K+ компаний</span>
                  </div>
                  <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                    <DollarSign size={20} className="text-[#628307] mr-2" />
                    <span className="text-white/90">500K+ зарплат</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Search Box */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="bg-[#1D1D1D]/90 backdrop-blur-sm border border-[#E6E6B0]/20 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                {/* Corner Decorations */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#628307]/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#E6E6B0]/10 rounded-tr-full"></div>

                <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#E6E6B0]">Начните поиск</h2>
                    <TabsList className="bg-[#1D1D1D]/60 p-1 rounded-full">
                      <TabsTrigger
                        value="companies"
                        className="rounded-full px-4 py-2 text-sm text-[#E6E6B0] data-[state=active]:bg-[#628307] data-[state=active]:text-white"
                      >
                        Компании
                      </TabsTrigger>
                      <TabsTrigger
                        value="salaries"
                        className="rounded-full px-4 py-2 text-sm text-[#E6E6B0] data-[state=active]:bg-[#628307] data-[state=active]:text-white"
                      >
                        Зарплаты
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="companies" className="mt-0 space-y-6">
                    <div className="bg-white/5 p-4 rounded-lg border border-[#E6E6B0]/10">
                      <label className="block text-[#E6E6B0] text-sm font-medium mb-2 flex items-center">
                        <Building2 size={16} className="mr-2 text-[#628307]" /> Название компании
                      </label>
                      <div className="relative">
                        <Input
                          value={companySearch}
                          onChange={e => setCompanySearch(e.target.value)}
                          placeholder="Введите название компании..."
                          className="pl-10 bg-white border-[#E6E6B0]/30 h-12 rounded-lg text-[#1D1D1D]"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={20} />

                        {companyLoading && (
                          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                            <Loader2 className="h-5 w-5 animate-spin text-[#628307]" />
                          </div>
                        )}

                        {showCompanyResults && companyResults.length > 0 && (
                          <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                            {companyResults.map(company => (
                              <div
                                key={company.id}
                                className="px-4 py-3 hover:bg-[#E6E6B0]/10 cursor-pointer flex items-center transition-colors duration-150"
                                onClick={() => handleCompanySelect(company)}
                              >
                                {company.logoUrl && (
                                  <img src={company.logoUrl || "/placeholder.svg"} alt={company.name} className="w-8 h-8 mr-3 object-contain" />
                                )}
                                <span className="text-[#1D1D1D] font-medium">{company.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {showCompanyResults && companyResults.length === 0 && !companyLoading && companySearch.length >= 2 && (
                          <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-lg shadow-lg z-50 mt-1">
                            <div className="px-4 py-3 text-gray-500">Компания с названием "{companySearch}" не найдена</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleSearch}
                      className="w-full h-14 bg-[#628307] hover:bg-[#4D6706] transition-all duration-200 rounded-lg font-medium text-white"
                      disabled={!selectedCompany}
                    >
                      <span className="mr-2">Найти отзывы и зарплаты</span>
                      <ArrowRight size={18} />
                    </Button>

                    <p className="text-[#E6E6B0]/60 text-sm text-center">Более 1 миллиона проверенных отзывов от сотрудников</p>
                  </TabsContent>

                  <TabsContent value="salaries" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-lg border border-[#E6E6B0]/10">
                        <label className="block text-[#E6E6B0] text-sm font-medium mb-2 flex items-center">
                          <Briefcase size={16} className="mr-2 text-[#628307]" /> Должность
                        </label>
                        <div className="relative">
                          <Input
                            value={jobSearch}
                            onChange={e => setJobSearch(e.target.value)}
                            placeholder="Введите название должности..."
                            className="pl-10 bg-white border-[#E6E6B0]/30 h-12 rounded-lg text-[#1D1D1D]"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={20} />

                          {jobLoading && (
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                              <Loader2 className="h-5 w-5 animate-spin text-[#628307]" />
                            </div>
                          )}

                          {showJobResults && jobResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                              {jobResults.map(job => (
                                <div
                                  key={job.id}
                                  className="px-4 py-3 hover:bg-[#E6E6B0]/10 cursor-pointer transition-colors duration-150"
                                  onClick={() => handleJobSelect(job)}
                                >
                                  <span className="text-[#1D1D1D] font-medium">{job.title}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {showJobResults && jobResults.length === 0 && !jobLoading && jobSearch.length >= 2 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-lg shadow-lg z-50 mt-1">
                              <div className="px-4 py-3 text-gray-500">Должность "{jobSearch}" не найдена</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white/5 p-4 rounded-lg border border-[#E6E6B0]/10">
                        <label className="block text-[#E6E6B0] text-sm font-medium mb-2 flex items-center">
                          <MapPin size={16} className="mr-2 text-[#628307]" /> Местоположение
                        </label>
                        <div className="relative">
                          <Input
                            value={locationSearch}
                            onChange={e => setLocationSearch(e.target.value)}
                            placeholder="Введите местоположение..."
                            className="pl-10 bg-white border-[#E6E6B0]/30 h-12 rounded-lg text-[#1D1D1D]"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={20} />

                          {locationLoading && (
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                              <Loader2 className="h-5 w-5 animate-spin text-[#628307]" />
                            </div>
                          )}

                          {showLocationResults && locationResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                              {locationResults.map(location => (
                                <div
                                  key={location.id}
                                  className="px-4 py-3 hover:bg-[#E6E6B0]/10 cursor-pointer transition-colors duration-150"
                                  onClick={() => handleLocationSelect(location)}
                                >
                                  <span className="text-[#1D1D1D] font-medium">{location.locationValue}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {showLocationResults && locationResults.length === 0 && !locationLoading && locationSearch.length >= 2 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-lg shadow-lg z-50 mt-1">
                              <div className="px-4 py-3 text-gray-500">Локация "{locationSearch}" не найдена</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSearch}
                      className="w-full h-14 bg-[#628307] hover:bg-[#4D6706] transition-all duration-200 rounded-lg font-medium text-white"
                      disabled={!selectedJob || !selectedLocation}
                    >
                      <span className="mr-2">Узнать зарплату</span>
                      <ArrowRight size={18} />
                    </Button>

                    <p className="text-[#E6E6B0]/60 text-sm text-center">Данные о зарплате по 500K+ должностей</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Section - Moved up */}
      <section className="bg-[#1D1D1D] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#E6E6B0] mb-2">Лучшие компании 2025 года</h2>
              <p className="text-white/80 max-w-2xl">Ознакомьтесь с рейтингом лучших компаний для работы, основанным на отзывах миллионов сотрудников</p>
            </div>
            <Link href="/companies" className="mt-4 md:mt-0">
              <Button className="bg-[#628307] hover:bg-[#4D6706] text-white rounded-lg font-medium transition-all duration-200">
                Все компании
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompanyCard
              name="Google"
              rating={4.5}
              reviews={15240}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
            />
            <CompanyCard
              name="Microsoft"
              rating={4.3}
              reviews={12458}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
            />
            <CompanyCard
              name="Apple"
              rating={4.2}
              reviews={14782}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png"
            />
            <CompanyCard
              name="Amazon"
              rating={3.9}
              reviews={18234}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1D] text-center mb-12">Почему стоит использовать iWork</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Building2 size={32} className="text-[#628307]" />}
              title="Достоверные отзывы компаний"
              description="Узнайте реальную информацию о работодателях от сотрудников, которые там работают или работали"
            />
            <FeatureCard
              icon={<DollarSign size={32} className="text-[#628307]" />}
              title="Данные о зарплатах"
              description="Получите доступ к актуальным данным о зарплатах, основанных на информации от реальных сотрудников"
            />
            <FeatureCard
              icon={<FileText size={32} className="text-[#628307]" />}
              title="Аналитика по компаниям"
              description="Детальная информация о компаниях, включая рейтинги, преимущества и финансовые показатели"
            />
            <FeatureCard
              icon={<TrendingUp size={32} className="text-[#628307]" />}
              title="Карьерный рост"
              description="Инструменты и советы для развития карьеры и получения повышения в зарплате"
            />
          </div>
        </div>
      </section>

      {/* Stats Section - New section */}
      <section className="py-16 bg-[#E6E6B0]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-[#E6E6B0]/30 shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#628307]/10 p-4 rounded-full mb-4">
                <Building2 size={28} className="text-[#628307]" />
              </div>
              <div className="text-4xl font-bold text-[#628307] mb-2">10,000+</div>
              <div className="text-lg font-medium text-[#1D1D1D]">Компаний</div>
              <p className="text-[#1D1D1D]/70 mt-2 text-sm">Подробная информация о тысячах компаний</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E6E6B0]/30 shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#628307]/10 p-4 rounded-full mb-4">
                <Users size={28} className="text-[#628307]" />
              </div>
              <div className="text-4xl font-bold text-[#628307] mb-2">1M+</div>
              <div className="text-lg font-medium text-[#1D1D1D]">Отзывов</div>
              <p className="text-[#1D1D1D]/70 mt-2 text-sm">Реальные отзывы от сотрудников компаний</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E6E6B0]/30 shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#628307]/10 p-4 rounded-full mb-4">
                <BarChart2 size={28} className="text-[#628307]" />
              </div>
              <div className="text-4xl font-bold text-[#628307] mb-2">500K+</div>
              <div className="text-lg font-medium text-[#1D1D1D]">Зарплат</div>
              <p className="text-[#1D1D1D]/70 mt-2 text-sm">Актуальные данные о зарплатах по должностям</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-[#628307]/10 to-[#E6E6B0]/30 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1D] mb-4">Присоединяйтесь к сообществу iWork</h2>
            <p className="text-[#1D1D1D]/80 max-w-2xl mx-auto mb-8">
              Поделитесь своим опытом работы и получите доступ к миллионам отзывов, зарплат и вопросов с собеседований
            </p>
            <Link href="/auth/register">
              <Button className="bg-[#628307] hover:bg-[#4D6706] text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200">
                Зарегистрироваться бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function CompanyCard({ name, rating, reviews, logo }: { name: string; rating: number; reviews: number; logo: string }) {
  return (
    <Card className="bg-white overflow-hidden hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 border-[#E6E6B0]/30">
      <div className="bg-[#E6E6B0]/20 p-4 flex justify-center items-center h-24">
        <img src={logo || "/placeholder.svg"} alt={name} className="h-16 max-w-full object-contain" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-[#1D1D1D] text-center mb-2">{name}</h3>
        <div className="flex items-center justify-center space-x-1 mb-2">
          <span className="font-bold text-[#1D1D1D]">{rating}</span>
          <div className="flex text-[#628307]">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(rating) ? "#628307" : "none"} color="#628307" />
              ))}
          </div>
        </div>
        <p className="text-[#1D1D1D]/70 text-sm text-center">{reviews.toLocaleString()} отзывов</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#E6E6B0]/20 rounded-xl p-6 border border-[#628307]/20 hover:border-[#628307]/40 hover:shadow-md transition-all duration-200 h-full flex flex-col">
      <div className="bg-[#628307]/10 p-3 rounded-full w-fit mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-[#1D1D1D] mb-3">{title}</h3>
      <p className="text-[#1D1D1D]/70 text-sm flex-grow">{description}</p>
    </div>
  );
}

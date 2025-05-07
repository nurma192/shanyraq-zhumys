"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Grid, Tabs, Tab, Typography, Card } from "@mui/material";
import { Search, Building2, DollarSign, FileText, TrendingUp, Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Search Params Handler Component
function SearchParamsHandler({ onTabChange }: { onTabChange: (tabValue: number) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      onTabChange(parseInt(tabParam) - 1);
    }
  }, [searchParams, onTabChange]);

  return null;
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
    if (tabValue === 0 && selectedCompany) {
      router.push(`/companies/${selectedCompany.id}/reviews`);
    } else if (tabValue === 1 && selectedJob && selectedLocation) {
      router.push(`/salaries?jobId=${selectedJob.id}&locationId=${selectedLocation.id}`);
    }
  };

  return (
    <Box component="main" className="bg-[#FFFFFF]">
      {/* Wrap the searchParams with Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler onTabChange={setTabValue} />
      </Suspense>

      {/* Hero Section */}
      <Box
        className="relative overflow-hidden"
        sx={{
          background: "linear-gradient(135deg, #628307 0%, #4D6706 100%)",
          py: { xs: 6, md: 8 },
          mb: 6,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjMgMCAxMiA1LjM3IDEyIDEyaDZ6TTUxIDQyYzAtMTMuODA3LTExLjE5My0yNS0yNS0yNXY2YzEwLjQ5MyAwIDE5IDguNTA3IDE5IDE5aDZ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              mb: 6,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              className="text-e6e6b0"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                mb: 3,
              }}
            >
              Получаете ли вы справедливую оплату?
            </Typography>
            <Typography
              variant="h6"
              className="text-e6e6b0"
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                maxWidth: "800px",
                mx: "auto",
                opacity: 0.9,
              }}
            >
              Узнайте свою стоимость на рынке труда и рассчитайте справедливую зарплату с помощью инструментов оценки
            </Typography>
          </Box>

          <Box
            className="bg-[#1D1D1D] border border-[#E6E6B0]/20 shadow-xl rounded-lg"
            sx={{
              p: { xs: 3, md: 4 },
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              textColor="inherit"
              sx={{
                mb: 4,
                "& .MuiTab-root": {
                  color: "#E6E6B0",
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  px: 4,
                  py: 2,
                  transition: "all 0.2s",
                },
                "& .Mui-selected": {
                  color: "#FFFFFF",
                  backgroundColor: "rgba(230, 230, 176, 0.1)",
                  borderRadius: "8px",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
              centered
              variant="fullWidth"
            >
              <Tab label="Компании" className="rounded-l-lg transition-all duration-200" />
              <Tab label="Зарплаты" className="rounded-r-lg transition-all duration-200" />
            </Tabs>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              {tabValue === 0 ? (
                <div className="w-full relative">
                  <Input
                    value={companySearch}
                    onChange={e => setCompanySearch(e.target.value)}
                    placeholder="Название компании"
                    className="pl-10 bg-[#FFFFFF] border-[#E6E6B0]/30 h-12 rounded-lg text-[#1D1D1D]"
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
                          {company.logoUrl && <img src={company.logoUrl} alt={company.name} className="w-8 h-8 mr-3 object-contain" />}
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
              ) : (
                <>
                  <div className="w-full relative">
                    <Input
                      value={jobSearch}
                      onChange={e => setJobSearch(e.target.value)}
                      placeholder="Должность"
                      className="pl-10 bg-[#FFFFFF] border-[#E6E6B0]/30 h-12 rounded-lg text-[#1D1D1D]"
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

                  <div className="w-full relative">
                    <Input
                      value={locationSearch}
                      onChange={e => setLocationSearch(e.target.value)}
                      placeholder="Местоположение"
                      className="pl-10 bg-[#FFFFFF] border-[#E6E6B0]/30 h-12 rounded-lg text-[#1D1D1D]"
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
                </>
              )}

              <Button
                onClick={handleSearch}
                className="h-12 w-full md:w-auto bg-[#628307] hover:bg-[#4D6706] transition-all duration-200 rounded-lg font-medium text-white px-6"
                disabled={(tabValue === 0 && !selectedCompany) || (tabValue === 1 && (!selectedJob || !selectedLocation))}
              >
                <Search className="h-5 w-5 mr-2" />
                <span>Поиск</span>
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          className="text-[#1D1D1D]"
          sx={{
            fontWeight: 700,
            mb: 6,
            textAlign: "center",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Почему стоит использовать iWork
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <div className="flex flex-col items-center bg-[#E6E6B0]/20 p-6 rounded-xl h-full border border-[#628307]/20 hover:border-[#628307]/40 hover:shadow-md transition-all duration-200">
              <div className="bg-[#628307]/10 p-3 rounded-full mb-4">
                <Building2 size={36} className="text-[#628307]" />
              </div>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1D1D1D", textAlign: "center" }}>
                Достоверные отзывы компаний
              </Typography>
              <Typography variant="body2" sx={{ color: "#1D1D1D", opacity: 0.8, textAlign: "center" }}>
                Узнайте реальную информацию о работодателях от сотрудников, которые там работают или работали
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <div className="flex flex-col items-center bg-[#E6E6B0]/20 p-6 rounded-xl h-full border border-[#628307]/20 hover:border-[#628307]/40 hover:shadow-md transition-all duration-200">
              <div className="bg-[#628307]/10 p-3 rounded-full mb-4">
                <DollarSign size={36} className="text-[#628307]" />
              </div>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1D1D1D", textAlign: "center" }}>
                Данные о зарплатах
              </Typography>
              <Typography variant="body2" sx={{ color: "#1D1D1D", opacity: 0.8, textAlign: "center" }}>
                Получите доступ к актуальным данным о зарплатах, основанных на информации от реальных сотрудников
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <div className="flex flex-col items-center bg-[#E6E6B0]/20 p-6 rounded-xl h-full border border-[#628307]/20 hover:border-[#628307]/40 hover:shadow-md transition-all duration-200">
              <div className="bg-[#628307]/10 p-3 rounded-full mb-4">
                <FileText size={36} className="text-[#628307]" />
              </div>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1D1D1D", textAlign: "center" }}>
                Аналитика по компаниям
              </Typography>
              <Typography variant="body2" sx={{ color: "#1D1D1D", opacity: 0.8, textAlign: "center" }}>
                Детальная информация о компаниях, включая рейтинги, преимущества и финансовые показатели
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <div className="flex flex-col items-center bg-[#E6E6B0]/20 p-6 rounded-xl h-full border border-[#628307]/20 hover:border-[#628307]/40 hover:shadow-md transition-all duration-200">
              <div className="bg-[#628307]/10 p-3 rounded-full mb-4">
                <TrendingUp size={36} className="text-[#628307]" />
              </div>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1D1D1D", textAlign: "center" }}>
                Карьерный рост
              </Typography>
              <Typography variant="body2" sx={{ color: "#1D1D1D", opacity: 0.8, textAlign: "center" }}>
                Инструменты и советы для развития карьеры и получения повышения в зарплате
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Top Companies Section */}
      <Box className="bg-[#1D1D1D] py-12 my-10">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            className="text-[#E6E6B0]"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Лучшие компании 2025 года
          </Typography>
          <Typography variant="body1" className="text-white opacity-80 mb-8" sx={{ maxWidth: "800px" }}>
            Ознакомьтесь с рейтингом лучших компаний для работы, основанным на отзывах миллионов сотрудников
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompanyCardNew
              name="Google"
              rating={4.5}
              reviews={15240}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
            />
            <CompanyCardNew
              name="Microsoft"
              rating={4.3}
              reviews={12458}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
            />
            <CompanyCardNew
              name="Apple"
              rating={4.2}
              reviews={14782}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png"
            />
            <CompanyCardNew
              name="Amazon"
              rating={3.9}
              reviews={18234}
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
            />
          </div>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Link href="/companies" style={{ textDecoration: "none" }}>
              <Button className="bg-[#628307] hover:bg-[#4D6706] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                Посмотреть все компании
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className="bg-[#E6E6B0]/30 py-12 my-6 rounded-xl" sx={{ textAlign: "center", mx: { xs: 2, md: 6 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            className="text-[#1D1D1D]"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Присоединяйтесь к сообществу iWork
          </Typography>
          <Typography variant="body1" className="text-[#1D1D1D] opacity-80" sx={{ mb: 6, maxWidth: "700px", mx: "auto" }}>
            Поделитесь своим опытом работы и получите доступ к миллионам отзывов, зарплат и вопросов с собеседований
          </Typography>
          <Link href="/auth/register" style={{ textDecoration: "none" }}>
            <Button className="bg-[#628307] hover:bg-[#4D6706] text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200">
              Зарегистрироваться бесплатно
            </Button>
          </Link>
        </Container>
      </Box>
    </Box>
  );
}

// New component for the company card with updated design
function CompanyCardNew({ name, rating, reviews, logo }: CompanyCardProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col">
      <div className="bg-[#E6E6B0]/20 p-4 flex justify-center items-center h-24">
        <img src={logo} alt={name} className="h-16 max-w-full object-contain" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
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
        <p className="text-[#1D1D1D]/70 text-sm text-center mt-auto">{reviews.toLocaleString()} отзывов</p>
      </div>
    </div>
  );
}

// Original interfaces for reference
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CompanyCardProps {
  name: string;
  rating: number;
  reviews: number;
  logo: string;
}

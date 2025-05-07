"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Typography,
  Card,
} from "@mui/material";
import {
  Search,
  Building2,
  DollarSign,
  FileText,
  TrendingUp,
  Loader2,
  Star,
} from "lucide-react";
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
function SearchParamsHandler({
  onTabChange,
}: {
  onTabChange: (tabValue: number) => void;
}) {
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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
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
      router.push(
        `/salaries?jobId=${selectedJob.id}&locationId=${selectedLocation.id}`
      );
    }
  };

  return (
    <Box component="main">
      {/* Wrap the searchParams with Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler onTabChange={setTabValue} />
      </Suspense>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #800000 0%, #a20000 100%)",
          py: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              mb: 4,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                mb: 2,
              }}
            >
              Получаете ли вы справедливую оплату?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              Узнайте свою стоимость на рынке труда и рассчитайте справедливую
              зарплату с помощью инструментов оценки
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              p: { xs: 2, md: 3 },
              maxWidth: "850px",
              mx: "auto",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              textColor="inherit"
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                },
                "& .Mui-selected": {
                  color: "white",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                },
              }}
              centered
              variant="fullWidth"
            >
              <Tab label="Компании" />
              <Tab label="Зарплаты" />
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
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Название компании"
                    className="pl-10 bg-white"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  {companyLoading && (
                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  )}

                  {showCompanyResults && companyResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                      {companyResults.map((company) => (
                        <div
                          key={company.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleCompanySelect(company)}
                        >
                          {company.logoUrl && (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="w-6 h-6 mr-2 object-contain"
                            />
                          )}
                          <span>{company.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {showCompanyResults &&
                    companyResults.length === 0 &&
                    !companyLoading &&
                    companySearch.length >= 2 && (
                      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
                        <div className="px-4 py-3 text-gray-500">
                          Компания с названием "{companySearch}" не найдена
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <>
                  <div className="w-full relative">
                    <Input
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder="Должность"
                      className="pl-10 bg-white"
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

                    {showJobResults &&
                      jobResults.length === 0 &&
                      !jobLoading &&
                      jobSearch.length >= 2 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
                          <div className="px-4 py-3 text-gray-500">
                            Должность "{jobSearch}" не найдена
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="w-full relative">
                    <Input
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Местоположение"
                      className="pl-10 bg-white"
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

                    {showLocationResults &&
                      locationResults.length === 0 &&
                      !locationLoading &&
                      locationSearch.length >= 2 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
                          <div className="px-4 py-3 text-gray-500">
                            Локация "{locationSearch}" не найдена
                          </div>
                        </div>
                      )}
                  </div>
                </>
              )}

              <Button
                onClick={handleSearch}
                className="h-10 w-full md:w-auto bg-[#800000] hover:bg-[#660000]"
                disabled={
                  (tabValue === 0 && !selectedCompany) ||
                  (tabValue === 1 && (!selectedJob || !selectedLocation))
                }
              >
                <Search className="h-4 w-4" />
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 4,
            textAlign: "center",
            color: "#333",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Почему стоит использовать iWork
        </Typography>

        <Grid container spacing={4}>
          <FeatureItem
            icon={<Building2 size={36} color="#a20000" />}
            title="Достоверные отзывы компаний"
            description="Узнайте реальную информацию о работодателях от сотрудников, которые там работают или работали"
          />
          <FeatureItem
            icon={<DollarSign size={36} color="#a20000" />}
            title="Данные о зарплатах"
            description="Получите доступ к актуальным данным о зарплатах, основанных на информации от реальных сотрудников"
          />
          <FeatureItem
            icon={<FileText size={36} color="#a20000" />}
            title="Аналитика по компаниям"
            description="Детальная информация о компаниях, включая рейтинги, преимущества и финансовые показатели"
          />
          <FeatureItem
            icon={<TrendingUp size={36} color="#a20000" />}
            title="Карьерный рост"
            description="Инструменты и советы для развития карьеры и получения повышения в зарплате"
          />
        </Grid>
      </Container>

      {/* Top Companies Section */}
      <Box sx={{ bgcolor: "#f9f9f9", py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#333",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Лучшие компании 2025 года
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: "800px" }}>
            Ознакомьтесь с рейтингом лучших компаний для работы, основанным на
            отзывах миллионов сотрудников
          </Typography>

          <Grid container spacing={3}>
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
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Link href="/companies" style={{ textDecoration: "none" }}>
              <Button className="bg-[#800000] hover:bg-[#a20000] px-4 py-1.5">
                Посмотреть все компании
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{ bgcolor: "#800000", color: "white", py: 6, textAlign: "center" }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Присоединяйтесь к сообществу iWork
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: "700px", mx: "auto", opacity: 0.9 }}
          >
            Поделитесь своим опытом работы и получите доступ к миллионам
            отзывов, зарплат и вопросов с собеседований
          </Typography>
          <Link href="/auth/register" style={{ textDecoration: "none" }}>
            <Button className="bg-white text-[#800000] hover:bg-[#f0f0f0] px-4 py-1.5 font-semibold text-base">
              Зарегистрироваться бесплатно
            </Button>
          </Link>
        </Container>
      </Box>
    </Box>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 2 }}>{icon}</Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Grid>
  );
}

interface CompanyCardProps {
  name: string;
  rating: number;
  reviews: number;
  logo: string;
}

function CompanyCard({ name, rating, reviews, logo }: CompanyCardProps) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            height: 80,
            "& img": {
              maxHeight: "100%",
              objectFit: "contain",
            },
          }}
        >
          <img src={logo} alt={name} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, textAlign: "center", mb: 1 }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            {rating}
          </Typography>
          <Box sx={{ display: "flex", color: "#ffc107" }}>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(rating) ? "#ffc107" : "none"}
                  color="#ffc107"
                />
              ))}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: "#666", textAlign: "center" }}>
          {reviews.toLocaleString()} отзывов
        </Typography>
      </Card>
    </Grid>
  );
}

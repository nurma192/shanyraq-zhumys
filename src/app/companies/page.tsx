"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Grid, List, Search, Star, X, Filter, ChevronDown, ChevronUp, Loader2, MapPin, Building, Info, Briefcase, TrendingUp, Users } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import searchAPI from "@/services/searchAPI";

interface LocationResult {
  id: number;
  locationValue: string;
}

const CompaniesPage = () => {
  const { companies, filters, pagination, loading, getCompanies, updateFilters, resetAllFilters } = useCompany();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>(["Алматы, Казахстан", "Астана, Казахстан", "Костанай, Казахстан"]);
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState<LocationResult[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    if (companies?.length === 0 && !loading) {
      getCompanies();
    }
  }, [companies?.length, getCompanies, loading]);

  useEffect(() => {
    const newSelectedFilters = [];

    if (filters.location) {
      newSelectedFilters.push(`Локация: ${filters.location}`);
    }

    if (filters.industry) {
      newSelectedFilters.push(`Отрасль: ${filters.industry}`);
    }

    if (filters.minRating) {
      newSelectedFilters.push(`${filters.minRating}★`);
    }

    if (filters.size) {
      newSelectedFilters.push(`Размер: ${filters.size}`);
    }

    setSelectedFilters(newSelectedFilters);
  }, [filters]);

  const handleSearch = () => {
    updateFilters({ search: searchInput });
  };

  const handleLocationSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationSearchValue(value);

    if (value.trim().length > 0) {
      setIsLocationLoading(true);
      try {
        const response = await searchAPI.searchLocations(value);
        setLocationSearchResults(response.data || []);
        setShowLocationResults(true);
      } catch (error) {
        console.error("Error searching locations:", error);
        setLocationSearchResults([]);
        setShowLocationResults(false);
      } finally {
        setIsLocationLoading(false);
      }
    } else {
      setLocationSearchResults([]);
      setShowLocationResults(false);
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocationId(location.id);
    updateFilters({
      location: location.locationValue,
      locationId: location.id,
    });
    setLocationSearchValue(location.locationValue);
    setShowLocationResults(false);
  };

  const handleLocationChange = (value: string) => {
    updateFilters({ location: value === "all" ? "" : value });
  };

  const handleIndustryChange = (value: string) => {
    updateFilters({ industry: value === "all" ? "" : value });
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    updateFilters({ minRating: checked ? rating : undefined });
  };

  const handleSizeChange = (value: string) => {
    updateFilters({ size: value === "all" ? "" : value });
  };

  const handleChangePage = (pageNumber: number) => {
    getCompanies({ ...filters, page: pageNumber - 1 });
  };

  const handleSwitchToGrid = () => setViewMode("grid");
  const handleSwitchToList = () => setViewMode("list");

  const toggleFilters = () => setShowFilters(!showFilters);

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Локация:")) {
      updateFilters({ location: "", locationId: null });
      setSelectedLocationId(null);
    } else if (filter.startsWith("Отрасль:")) {
      updateFilters({ industry: "" });
    } else if (filter.includes("★")) {
      updateFilters({ minRating: undefined });
    } else if (filter.startsWith("Размер:")) {
      updateFilters({ size: "" });
    }
  };

  const clearAllFilters = () => {
    resetAllFilters();
    setSearchInput("");
    setLocationSearchValue("");
    setSelectedLocationId(null);
  };

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <Star key={i} className="text-[#F5B400] fill-[#F5B400]" size={16} /> : <Star key={i} className="text-gray-300" size={16} />);
    }
    return stars;
  };

  return (
    <div className="bg-white">
      {/* Completely redesigned hero section */}
      <div className="relative bg-[#1D1D1D] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E6E6B0" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)" />
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#E6E6B0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-[#628307]/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E6E6B0]/10 blur-3xl"></div>

        <Container className="relative z-10">
          <div className="flex flex-col items-center py-12 md:py-16 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-[#E6E6B0]"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#E6E6B0]"></div>
              <div className="px-2 py-1 bg-[#628307] rounded-full text-xs font-bold text-white">ВСЕ КОМПАНИИ</div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#E6E6B0]"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#E6E6B0]"></div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E6E6B0] max-w-4xl mb-6 leading-tight">
              Исследуйте <span className="text-[#628307]">лучшие компании</span> для вашей карьеры
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mb-10">
              Ознакомьтесь с рейтингами компаний, отзывами и информацией о зарплатах, предоставленными сотрудниками
            </p>

            <div className="flex justify-center gap-6 flex-wrap mb-10">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Building size={20} className="text-[#628307]" />
                <span className="text-white/90 font-medium">10,000+ компаний</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Star size={20} className="text-[#628307]" />
                <span className="text-white/90 font-medium">Реальные отзывы</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <TrendingUp size={20} className="text-[#628307]" />
                <span className="text-white/90 font-medium">Актуальные данные</span>
              </div>
            </div>

            <div className="w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-2xl">
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-[#628307]" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Поиск по названию, отрасли или местоположению..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="pl-10 bg-white border-0 h-14 rounded-lg text-[#1D1D1D] text-lg shadow-sm"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-14 px-8 bg-[#628307] hover:bg-[#4D6706] text-white text-lg font-medium rounded-lg shadow-md transition-all"
                >
                  Найти
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="ghost" onClick={toggleFilters} className="text-[#E6E6B0] hover:text-white hover:bg-white/10 flex items-center gap-2">
                    <Filter size={18} className="text-[#628307]" />
                    <span>Дополнительные фильтры</span>
                    {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>

                  {selectedFilters.length > 0 && <div className="text-[#E6E6B0]/80 text-sm">{selectedFilters.length} активных фильтров</div>}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#E6E6B0]/80">Вид:</span>
                  <div className="flex gap-1 bg-white/10 p-1 rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={handleSwitchToGrid}
                      className={viewMode === "grid" ? "bg-[#628307] text-white hover:bg-[#4D6706] h-8 w-8" : "text-[#E6E6B0] hover:bg-white/10 h-8 w-8"}
                    >
                      <Grid size={16} />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={handleSwitchToList}
                      className={viewMode === "list" ? "bg-[#628307] text-white hover:bg-[#4D6706] h-8 w-8" : "text-[#E6E6B0] hover:bg-white/10 h-8 w-8"}
                    >
                      <List size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="w-full max-w-4xl mx-auto mt-4 bg-white rounded-xl p-6 shadow-xl border border-[#E6E6B0]/30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location Filter */}
                <div>
                  <h3 className="text-[#1D1D1D] font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[#628307]" />
                    Локация
                  </h3>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Поиск локаций..."
                      value={locationSearchValue}
                      onChange={handleLocationSearchChange}
                      className="border-[#E6E6B0]/30 focus:border-[#628307] focus:ring-[#628307]/20"
                    />
                    {isLocationLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#628307]" />
                      </div>
                    )}

                    {showLocationResults && locationSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-[#E6E6B0]/30 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {locationSearchResults.map(location => (
                          <div key={location.id} className="px-4 py-2 hover:bg-[#E6E6B0]/20 cursor-pointer" onClick={() => handleLocationSelect(location)}>
                            {location.locationValue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Industry Filter */}
                <div>
                  <h3 className="text-[#1D1D1D] font-semibold mb-3 flex items-center gap-2">
                    <Building size={16} className="text-[#628307]" />
                    Отрасли
                  </h3>
                  <Select value={filters.industry || "all"} onValueChange={handleIndustryChange}>
                    <SelectTrigger className="border-[#E6E6B0]/30 focus:border-[#628307] focus:ring-[#628307]/20">
                      <SelectValue placeholder="Выберите отрасль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все отрасли</SelectItem>
                      <SelectItem value="Почтовые услуги">Почтовые услуги</SelectItem>
                      <SelectItem value="Логистика">Логистика</SelectItem>
                      <SelectItem value="Финансовые услуги">Финансовые услуги</SelectItem>
                      <SelectItem value="Банковское дело">Банковское дело</SelectItem>
                      <SelectItem value="Финансовые технологии">Финансовые технологии</SelectItem>
                      <SelectItem value="Нефть и газ">Нефть и газ</SelectItem>
                      <SelectItem value="Энергетика">Энергетика</SelectItem>
                      <SelectItem value="Телекоммуникации">Телекоммуникации</SelectItem>
                      <SelectItem value="Интернет-услуги">Интернет-услуги</SelectItem>
                      <SelectItem value="Авиаперевозки">Авиаперевозки</SelectItem>
                      <SelectItem value="Розничная торговля">Розничная торговля</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Rating Filter */}
                <div>
                  <h3 className="text-[#1D1D1D] font-semibold mb-3 flex items-center gap-2">
                    <Star size={16} className="text-[#628307]" />
                    Рейтинг компании
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center">
                        <Checkbox
                          id={`rating-${rating}`}
                          className="border-[#E6E6B0]/30 data-[state=checked]:bg-[#628307] data-[state=checked]:border-[#628307]"
                          checked={filters.minRating === rating}
                          onCheckedChange={checked => handleRatingChange(rating, checked === true)}
                        />
                        <Label htmlFor={`rating-${rating}`} className="flex items-center gap-2 ml-2 cursor-pointer">
                          <span className="flex items-center">{renderRating(rating)}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Size Filter */}
                <div>
                  <h3 className="text-[#1D1D1D] font-semibold mb-3 flex items-center gap-2">
                    <Users size={16} className="text-[#628307]" />
                    Размер компании
                  </h3>
                  <Select value={filters.size || "all"} onValueChange={handleSizeChange}>
                    <SelectTrigger className="border-[#E6E6B0]/30 focus:border-[#628307] focus:ring-[#628307]/20">
                      <SelectValue placeholder="Выберите размер" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой размер</SelectItem>
                      <SelectItem value="Более 1000 сотрудников">Более 1000 сотрудников</SelectItem>
                      <SelectItem value="Более 2000 сотрудников">Более 2000 сотрудников</SelectItem>
                      <SelectItem value="Более 3000 сотрудников">Более 3000 сотрудников</SelectItem>
                      <SelectItem value="Более 5000 сотрудников">Более 5000 сотрудников</SelectItem>
                      <SelectItem value="Более 10000 сотрудников">Более 10000 сотрудников</SelectItem>
                      <SelectItem value="Более 20000 сотрудников">Более 20000 сотрудников</SelectItem>
                      <SelectItem value="Более 50000 сотрудников">Более 50000 сотрудников</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters Button */}
                <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-4">
                  <Button variant="outline" className="border-[#628307] text-[#628307] hover:bg-[#628307]/10" onClick={clearAllFilters}>
                    Сбросить фильтры
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="bg-[#628307]/5 border border-[#628307]/10 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[#1D1D1D] font-medium mr-2 flex items-center">
                <Filter size={16} className="text-[#628307] mr-1" />
                Активные фильтры:
              </div>
              {selectedFilters.map(filter => (
                <div key={filter} className="flex items-center gap-1 bg-[#628307] text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {filter}
                  <button
                    className="ml-2 flex items-center justify-center text-white hover:bg-white/20 rounded-full p-0.5"
                    onClick={() => removeFilter(filter)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="ml-auto text-[#628307] hover:bg-[#628307]/10 font-medium">
                Очистить все
              </Button>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[#1D1D1D] font-medium">
              <p>Найдено {pagination.totalElements || 0} компаний</p>
            </div>
          </div>

          {/* Company Cards */}
          {loading ? (
            <div className="py-12 text-center bg-white rounded-lg border border-[#E6E6B0]/30 shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-[#628307] mb-4" />
              <p className="text-[#1D1D1D] font-medium">Загрузка компаний...</p>
            </div>
          ) : (
            <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
              {companies && companies?.length > 0 ? (
                companies.map(company => (
                  <Link href={`/companies/${company.id}`} key={company.id} className="block transition-transform hover:-translate-y-1 duration-200">
                    <Card
                      className={`h-full border-[#E6E6B0]/30 hover:border-[#628307]/20 shadow-sm hover:shadow ${viewMode === "list" ? "overflow-hidden" : ""}`}
                    >
                      <CardContent className={`p-0 h-full ${viewMode === "list" ? "flex flex-row items-center" : ""}`}>
                        <div
                          className={`${
                            viewMode === "list" ? "w-24 h-24 flex-shrink-0 border-r border-[#E6E6B0]/30" : "w-full h-36 border-b border-[#E6E6B0]/30"
                          } flex justify-center items-center bg-[#E6E6B0]/10`}
                        >
                          <img src={company.logoUrl || "/placeholder.svg"} alt={company.name} className="max-w-full max-h-full object-contain p-4" />
                        </div>
                        <div className={`flex-1 p-4 ${viewMode === "list" ? "ml-2" : ""}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-[#628307] truncate">{company.name}</h3>
                            <div className="flex items-center gap-1 ml-2">
                              <span className="font-semibold text-[#1D1D1D]">{company.rating}</span>
                              <Star className="h-4 w-4 text-[#F5B400] fill-[#F5B400]" />
                            </div>
                          </div>
                          <p className="text-[#1D1D1D]/70 text-sm flex items-center gap-1 mb-2">
                            <MapPin size={14} className="text-[#628307] flex-shrink-0" />
                            <span className="truncate">{company.location}</span>
                          </p>
                          <p className={`text-[#1D1D1D]/80 text-sm ${viewMode === "list" ? "line-clamp-1" : "line-clamp-3"}`}>{company.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center bg-white rounded-lg border border-[#E6E6B0]/30 shadow-sm col-span-full">
                  <p className="text-[#1D1D1D]/70">Компании не найдены</p>
                  <Button variant="outline" onClick={clearAllFilters} className="mt-4 border-[#628307] text-[#628307] hover:bg-[#628307]/10">
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="bg-white rounded-full shadow-sm border border-[#E6E6B0]/30 inline-flex p-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleChangePage(i + 1)}
                  className={
                    pagination.pageNumber + 1 === i + 1
                      ? "bg-[#628307] text-white hover:bg-[#4D6706] rounded-full min-w-8 h-8 mx-0.5"
                      : "text-[#1D1D1D] hover:bg-[#E6E6B0]/20 rounded-full min-w-8 h-8 mx-0.5"
                  }
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CompaniesPage;

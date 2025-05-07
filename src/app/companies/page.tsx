"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Grid,
  List,
  Search,
  Star,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import searchAPI from "@/services/searchAPI";
import styles from "./CompaniesPage.module.scss";

interface LocationResult {
  id: number;
  locationValue: string;
}

const CompaniesPage = () => {
  const {
    companies,
    filters,
    pagination,
    loading,
    getCompanies,
    updateFilters,
    resetAllFilters,
  } = useCompany();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([
    "Алматы, Казахстан",
    "Астана, Казахстан",
    "Костанай, Казахстан",
  ]);
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState<LocationResult[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
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

  const handleLocationSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      stars.push(
        i <= rating ? (
          <Star
            key={i}
            className={styles.starFilled}
            size={16}
            fill="#f5b400"
            strokeWidth={0}
          />
        ) : (
          <Star
            key={i}
            className={styles.starEmpty}
            size={16}
            strokeWidth={1.5}
          />
        )
      );
    }
    return stars;
  };

  return (
    <div className={styles.companiesPage}>
      <Container>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Компании</h1>
          <p className={styles.pageDescription}>
            Ознакомьтесь с рейтингами компаний, отзывами и информацией о
            зарплатах, предоставленными сотрудниками
          </p>
        </div>

        {selectedFilters.length > 0 && (
          <div className={styles.activeFilters}>
            <div className={styles.filtersLabel}>Активные фильтры:</div>
            <div className={styles.filterTags}>
              {selectedFilters.map((filter) => (
                <div key={filter} className={styles.filterTag}>
                  {filter}
                  <button
                    className={styles.removeFilterBtn}
                    onClick={() => removeFilter(filter)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className={styles.clearFiltersBtn}
            >
              Очистить все
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={toggleFilters}
          className={styles.mobileFilterToggle}
        >
          <Filter size={16} className={styles.filterIcon} />
          Фильтры
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>

        <div className={styles.pageContent}>
          <div
            className={`${styles.filtersPanel} ${
              showFilters ? styles.filtersPanelVisible : ""
            }`}
          >
            <div className={styles.filterHeader}>
              <h2 className={styles.filterTitle}>Фильтры</h2>
              <Search className={styles.filterIcon} size={18} />
            </div>

            <Separator className={styles.filterDivider} />

            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Локация</h3>
              <div className="relative mb-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Поиск локаций..."
                    value={locationSearchValue}
                    onChange={handleLocationSearchChange}
                    className="pl-10 pr-4 py-2 w-full border rounded"
                  />
                  {isLocationLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>

                {showLocationResults && locationSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {locationSearchResults.map((location) => (
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
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Отрасли</h3>
              <Select
                value={filters.industry || "all"}
                onValueChange={handleIndustryChange}
              >
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue placeholder="Выберите отрасль" />
                </SelectTrigger>
                <SelectContent className={styles.filterSelectContent}>
                  <SelectItem className={styles.filterSelectItem} value="all">
                    Все отрасли
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Почтовые услуги"
                  >
                    Почтовые услуги
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Логистика"
                  >
                    Логистика
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Финансовые услуги"
                  >
                    Финансовые услуги
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Банковское дело"
                  >
                    Банковское дело
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Финансовые технологии"
                  >
                    Финансовые технологии
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Нефть и газ"
                  >
                    Нефть и газ
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Энергетика"
                  >
                    Энергетика
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Телекоммуникации"
                  >
                    Телекоммуникации
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Интернет-услуги"
                  >
                    Интернет-услуги
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Авиаперевозки"
                  >
                    Авиаперевозки
                  </SelectItem>
                  <SelectItem
                    className={styles.filterSelectItem}
                    value="Розничная торговля"
                  >
                    Розничная торговля
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Рейтинг компании</h3>
              <div className={styles.ratingFilter}>
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className={styles.ratingOption}>
                    <Checkbox
                      id={`rating-${rating}`}
                      className={styles.ratingCheckbox}
                      checked={filters.minRating === rating}
                      onCheckedChange={(checked) =>
                        handleRatingChange(rating, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className={styles.ratingLabel}
                    >
                      <span className={styles.ratingStars}>
                        {renderRating(rating)}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Размер компании</h3>
              <RadioGroup
                defaultValue="all"
                value={filters.size || "all"}
                onValueChange={handleSizeChange}
                className={styles.sizeFilter}
              >
                {[
                  { value: "all", label: "Любой размер" },
                  {
                    value: "Более 1000 сотрудников",
                    label: "Более 1000 сотрудников",
                  },
                  {
                    value: "Более 2000 сотрудников",
                    label: "Более 2000 сотрудников",
                  },
                  {
                    value: "Более 3000 сотрудников",
                    label: "Более 3000 сотрудников",
                  },
                  {
                    value: "Более 5000 сотрудников",
                    label: "Более 5000 сотрудников",
                  },
                  {
                    value: "Более 10000 сотрудников",
                    label: "Более 10000 сотрудников",
                  },
                  {
                    value: "Более 20000 сотрудников",
                    label: "Более 20000 сотрудников",
                  },
                  {
                    value: "Более 50000 сотрудников",
                    label: "Более 50000 сотрудников",
                  },
                ].map((size) => (
                  <div key={size.value} className={styles.sizeOption}>
                    <RadioGroupItem
                      value={size.value}
                      id={`size-${size.value}`}
                      className={styles.sizeRadio}
                    />
                    <Label htmlFor={`size-${size.value}`}>{size.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button
              variant="outline"
              className={styles.resetFiltersBtn}
              onClick={clearAllFilters}
            >
              Сбросить фильтры
            </Button>
          </div>

          <div className={styles.resultsPanel}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsCount}>
                <p>Найдено {pagination.totalElements || 0} компаний</p>
              </div>
              <div className={styles.viewToggle}>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={handleSwitchToGrid}
                  className={
                    viewMode === "grid"
                      ? styles.viewActive
                      : styles.viewNoActive
                  }
                >
                  <Grid size={18} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={handleSwitchToList}
                  className={
                    viewMode === "list"
                      ? styles.viewActive
                      : styles.viewNoActive
                  }
                >
                  <List size={18} />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center">
                <p>Загрузка компаний...</p>
              </div>
            ) : (
              <div
                className={`${styles.companyGrid} ${
                  viewMode === "list" ? styles.listView : ""
                }`}
              >
                {companies && companies?.length > 0 ? (
                  companies.map((company) => (
                    <Link
                      href={`/companies/${company.id}`}
                      key={company.id}
                      className={styles.companyCard}
                    >
                      <Card className={styles.companyCardd}>
                        <CardContent className={styles.companyCardContent}>
                          <div className={styles.companyLogo}>
                            <img
                              src={company.logoUrl || "/placeholder.svg"}
                              alt={company.name}
                            />
                          </div>
                          <div className={styles.companyInfo}>
                            <h3 className={styles.companyName}>
                              {company.name}
                            </h3>
                            <div className={styles.companyRating}>
                              <span className={styles.ratingValue}>
                                {company.rating}
                              </span>
                              <div className={styles.ratingStars}>
                                {renderRating(company.rating)}
                              </div>
                            </div>
                            <p className={styles.companyLocation}>
                              {company.location}
                            </p>
                            <p className={styles.companyDescription}>
                              {company.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center w-full">
                    <p>Компании не найдены</p>
                  </div>
                )}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={
                      pagination.pageNumber + 1 === i + 1
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleChangePage(i + 1)}
                    className={styles.paginationBtn}
                    data-state={
                      pagination.pageNumber + 1 === i + 1 ? "on" : "off"
                    }
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CompaniesPage;
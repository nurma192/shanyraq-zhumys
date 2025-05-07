"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsUp, MessageSquare, Calendar, Briefcase, User, CheckCircle, Filter, SortAsc, Award } from "lucide-react";
import router from "next/router";

const CompanyReviewsPage = () => {
  const { companyId } = useParams() as { companyId: string };

  // State for filters and pagination
  const [sortOption, setSortOption] = useState<"newest" | "highest" | "lowest">("newest");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Get company reviews from our hook
  const { fetchReviews, loading, error } = useCompanyDetails();

  // Use our hook to get cached data
  const { getReviews } = useCompanyDetails();

  // Fetch reviews on mount and when filters change
  useEffect(() => {
    if (companyId) {
      fetchReviews({
        companyId,
        ratingFilter,
        sort: sortOption,
        page,
        pageSize,
      });
    }
  }, [companyId, ratingFilter, sortOption, page, pageSize, fetchReviews]);

  // Get the cached data for current filters
  const reviewData = getReviews({
    companyId,
    ratingFilter,
    sort: sortOption,
    page,
    pageSize,
  });

  // Handle filter changes
  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleSortChange = (value: "newest" | "highest" | "lowest") => {
    setSortOption(value);
    setPage(0); // Reset to first page when sort changes
  };

  const handleChangePage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Filter reviews to current page
  const currentReviews = reviewData ? reviewData.reviews : [];

  // Calculate total pages
  const totalPages = reviewData ? reviewData.totalPages : 0;

  // Employment status translation
  const translateEmploymentStatus = (status: string) => {
    switch (status) {
      case "current":
        return "Текущий сотрудник";
      case "former":
        return "Бывший сотрудник";
      default:
        return status;
    }
  };

  // Employment type translation
  const translateEmploymentType = (type: string) => {
    switch (type) {
      case "full-time":
        return "Полная занятость";
      case "part-time":
        return "Частичная занятость";
      case "contract":
        return "Контракт";
      case "internship":
        return "Стажировка";
      default:
        return type;
    }
  };

  // Function to render star rating
  const renderStarRating = (rating: number, size = "sm") => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${
              i < Math.floor(rating) ? "fill-[#628307] text-[#628307]" : "fill-[#E6E6B0]/50 text-[#E6E6B0]"
            }`}
          />
        ))}
      </div>
    );
  };

  if (error.reviews) {
    return (
      <div className="p-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-xl font-semibold text-red-700">Ошибка при загрузке отзывов</h4>
          <p className="text-red-600 mt-2">{error.reviews}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8">
      {loading.reviews ? (
        <div className="mb-8">
          <Skeleton className="h-10 w-80 mb-4" />
          <div className="bg-[#E6E6B0]/10 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-12 w-12 mb-2" />
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="flex-1 space-y-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="w-10 text-sm font-medium">{rating} ★</div>
                    <div className="flex-1 h-2 bg-[#E6E6B0]/30 rounded-full overflow-hidden">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="w-8 text-right text-sm">0</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : reviewData ? (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1D1D1D] mb-4">Отзывы о компании {reviewData.companyName}</h1>
          <Card className="border-[#E6E6B0]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center bg-[#E6E6B0]/10 p-4 rounded-lg border border-[#E6E6B0]/30 md:min-w-[180px]">
                  <span className="text-3xl font-bold text-[#628307] mb-2">{reviewData.averageRating.toFixed(1)}</span>
                  <div className="mb-2">{renderStarRating(reviewData.averageRating, "md")}</div>
                  <span className="text-sm text-[#1D1D1D]/70 text-center">На основе {reviewData.totalReviews} отзывов</span>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = reviewData.ratingDistribution[rating.toString()] || 0;
                    const percentage = reviewData.totalReviews > 0 ? (count / reviewData.totalReviews) * 100 : 0;

                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="w-10 text-sm font-medium text-[#1D1D1D]/70">{rating} ★</div>
                        <div className="flex-1 h-2 bg-[#E6E6B0]/30 rounded-full overflow-hidden">
                          <div className="h-full bg-[#628307]" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="w-8 text-right text-sm text-[#1D1D1D]/70">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 md:max-w-xs">
          <div className="bg-[#E6E6B0]/10 p-4 rounded-lg border border-[#E6E6B0]/30">
            <div className="flex items-center gap-2 mb-3">
              <SortAsc className="h-5 w-5 text-[#628307]" />
              <span className="text-[#1D1D1D]/70 font-medium">Сортировать по:</span>
            </div>
            <Select value={sortOption} onValueChange={(value: "newest" | "highest" | "lowest") => handleSortChange(value)}>
              <SelectTrigger className="border-[#E6E6B0] focus:ring-[#628307] focus:border-[#628307] bg-white">
                <SelectValue placeholder="Сортировать" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Самые новые</SelectItem>
                <SelectItem value="highest">Самый высокий рейтинг</SelectItem>
                <SelectItem value="lowest">Самый низкий рейтинг</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 md:max-w-xs">
          <div className="bg-[#E6E6B0]/10 p-4 rounded-lg border border-[#E6E6B0]/30">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-[#628307]" />
              <span className="text-[#1D1D1D]/70 font-medium">Фильтр по рейтингу:</span>
            </div>
            <Select value={ratingFilter} onValueChange={value => handleRatingFilterChange(value)}>
              <SelectTrigger className="border-[#E6E6B0] focus:ring-[#628307] focus:border-[#628307] bg-white">
                <SelectValue placeholder="Все рейтинги" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все рейтинги</SelectItem>
                <SelectItem value="5">5 звезд</SelectItem>
                <SelectItem value="4">4 звезды</SelectItem>
                <SelectItem value="3">3 звезды</SelectItem>
                <SelectItem value="2">2 звезды</SelectItem>
                <SelectItem value="1">1 звезда</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading.reviews ? (
          // Skeleton loading state
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="border-[#E6E6B0] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-28" />
                  </div>
                  <Skeleton className="h-6 w-64 my-2" />
                  <Skeleton className="h-4 w-full my-1" />
                  <Skeleton className="h-4 w-full my-1" />
                  <Skeleton className="h-4 w-3/4 my-1" />
                </CardContent>
              </Card>
            ))
        ) : currentReviews.length > 0 ? (
          currentReviews.map((review, index) => (
            <Card key={index} className="border-[#E6E6B0] hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-[#628307] text-white">
                      <AvatarFallback>{review.author ? review.author.charAt(0).toUpperCase() : "A"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[#1D1D1D]">{review.author || "Аноним"}</h3>
                      <div className="flex items-center text-[#1D1D1D]/60 text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {review.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#E6E6B0]/20 px-3 py-1 rounded-full">
                    {renderStarRating(review.rating)}
                    <span className="font-medium text-[#1D1D1D]">{review.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 my-3">
                  <Badge variant="outline" className="bg-[#628307]/5 border-[#628307]/20 text-[#1D1D1D]/80 flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {review.position}
                  </Badge>
                  <Badge variant="outline" className="bg-[#E6E6B0]/20 border-[#E6E6B0]/30 text-[#1D1D1D]/80 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {translateEmploymentStatus(review.employmentStatus)}
                  </Badge>
                  <Badge variant="outline" className="bg-[#E6E6B0]/20 border-[#E6E6B0]/30 text-[#1D1D1D]/80 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {translateEmploymentType(review.employmentType)}
                  </Badge>
                  {review.recommendToFriend && (
                    <Badge variant="outline" className="bg-[#628307]/10 text-[#628307] border-[#628307]/20 flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Рекомендует
                    </Badge>
                  )}
                  {review.hasVerification && (
                    <Badge variant="outline" className="bg-[#628307]/10 text-[#628307] border-[#628307]/20 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Верифицирован
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-[#628307] mb-3">{review.title}</h2>

                <p className="text-[#1D1D1D]/80 leading-relaxed mb-4">{review.body}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {review.pros && (
                    <div className="bg-[#628307]/5 p-4 rounded-lg border border-[#628307]/20">
                      <h4 className="text-[#628307] font-semibold mb-2 flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        Плюсы:
                      </h4>
                      <p className="text-[#1D1D1D]/80 text-sm">{review.pros}</p>
                    </div>
                  )}

                  {review.cons && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h4 className="text-red-600 font-semibold mb-2 flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 rotate-180" />
                        Минусы:
                      </h4>
                      <p className="text-[#1D1D1D]/80 text-sm">{review.cons}</p>
                    </div>
                  )}
                </div>

                {review.advice && (
                  <div className="bg-[#E6E6B0]/20 p-4 rounded-lg border border-[#E6E6B0]/30 mb-4">
                    <h4 className="text-[#1D1D1D]/80 font-semibold mb-2 flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Совет руководству:
                    </h4>
                    <p className="text-[#1D1D1D]/80 text-sm">{review.advice}</p>
                  </div>
                )}

                <Separator className="my-4 bg-[#E6E6B0]" />

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#1D1D1D]/60 mb-1">Карьера</span>
                    {renderStarRating(review.careerOpportunities)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#1D1D1D]/60 mb-1">Баланс</span>
                    {renderStarRating(review.workLifeBalance)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#1D1D1D]/60 mb-1">Оплата</span>
                    {renderStarRating(review.compensation)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#1D1D1D]/60 mb-1">Стабильность</span>
                    {renderStarRating(review.jobSecurity)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#1D1D1D]/60 mb-1">Руководство</span>
                    {renderStarRating(review.management)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-[#E6E6B0]/10 p-8 rounded-lg border border-[#E6E6B0]/30 text-center">
            <Award className="h-12 w-12 mx-auto text-[#628307]/50 mb-3" />
            <h3 className="text-xl font-semibold text-[#1D1D1D] mb-2">По заданным критериям отзывов не найдено</h3>
            <p className="text-[#1D1D1D]/70 mb-4">Попробуйте изменить параметры фильтрации или добавьте первый отзыв</p>
            <Button className="bg-[#628307] hover:bg-[#4D6706]" onClick={() => router.push("/profile/add")}>
              Добавить отзыв
            </Button>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default CompanyReviewsPage;

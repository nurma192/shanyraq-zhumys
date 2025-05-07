// src/app/companies/[companyId]/reviews/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Typography, Box, Avatar, Rating } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "./CompanyReviewsPage.module.scss";

const CompanyReviewsPage = () => {
  const { companyId } = useParams() as { companyId: string };

  // State for filters and pagination
  const [sortOption, setSortOption] = useState<"newest" | "highest" | "lowest">(
    "newest"
  );
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

  if (error.reviews) {
    return (
      <Box className={styles.notFound}>
        <Typography variant="h5">Ошибка при загрузке отзывов</Typography>
        <Typography>{error.reviews}</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.companyReviews}>
      {loading.reviews ? (
        <Box className={styles.header}>
          <Skeleton className="h-10 w-80 mb-4" />
          <Box className={styles.stats}>
            <Box className={styles.ratingOverview}>
              <Skeleton className="h-12 w-12 mb-2" />
              <Skeleton className="h-6 w-36 mb-2" />
              <Skeleton className="h-4 w-24" />
            </Box>

            <Box className={styles.ratingDistribution} sx={{ flexGrow: 1 }}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Box key={rating} className={styles.ratingBar}>
                  <Typography variant="body2" className={styles.ratingLabel}>
                    {rating} ★
                  </Typography>
                  <Box className={styles.progressBar}>
                    <Skeleton className="h-full w-full" />
                  </Box>
                  <Typography variant="body2" className={styles.ratingCount}>
                    0
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : reviewData ? (
        <Box className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Отзывы о компании {reviewData.companyName}
          </Typography>
          <Box className={styles.stats}>
            <Box className={styles.ratingOverview}>
              <Typography variant="h3" className={styles.ratingValue}>
                {reviewData.averageRating.toFixed(1)}
              </Typography>
              <Rating
                value={reviewData.averageRating}
                precision={0.1}
                readOnly
                className={styles.ratingStars}
              />
              <Typography variant="body2" className={styles.ratingCount}>
                На основе {reviewData.totalReviews} отзывов
              </Typography>
            </Box>

            <Box className={styles.ratingDistribution}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  reviewData.ratingDistribution[rating.toString()] || 0;
                const percentage =
                  reviewData.totalReviews > 0
                    ? (count / reviewData.totalReviews) * 100
                    : 0;

                return (
                  <Box key={rating} className={styles.ratingBar}>
                    <Typography variant="body2" className={styles.ratingLabel}>
                      {rating} ★
                    </Typography>
                    <Box className={styles.progressBar}>
                      <Box
                        className={styles.progressFill}
                        style={{ width: `${percentage}%` }}
                      />
                    </Box>
                    <Typography variant="body2" className={styles.ratingCount}>
                      {count}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      ) : null}

      <Box className={styles.filters}>
        <Box className={styles.filterItem}>
          <Typography variant="body2" className={styles.filterLabel}>
            Сортировать по:
          </Typography>
          <Select
            value={sortOption}
            onValueChange={(value: "newest" | "highest" | "lowest") =>
              handleSortChange(value)
            }
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="Сортировать" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Самые новые</SelectItem>
              <SelectItem value="highest">Самый высокий рейтинг</SelectItem>
              <SelectItem value="lowest">Самый низкий рейтинг</SelectItem>
            </SelectContent>
          </Select>
        </Box>

        <Box className={styles.filterItem}>
          <Typography variant="body2" className={styles.filterLabel}>
            Фильтр по рейтингу:
          </Typography>
          <Select
            value={ratingFilter}
            onValueChange={(value) => handleRatingFilterChange(value)}
          >
            <SelectTrigger className={styles.selectTrigger}>
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
        </Box>
      </Box>

      <Box className={styles.reviewsList}>
        {loading.reviews ? (
          // Skeleton loading state
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className={styles.reviewCard}>
                <CardContent>
                  <Box className={styles.reviewHeader}>
                    <Box className={styles.reviewAuthor}>
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Box>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </Box>
                    </Box>
                    <Skeleton className="h-5 w-28" />
                  </Box>
                  <Skeleton className="h-6 w-64 my-2" />
                  <Skeleton className="h-4 w-full my-1" />
                  <Skeleton className="h-4 w-full my-1" />
                  <Skeleton className="h-4 w-3/4 my-1" />
                </CardContent>
              </Card>
            ))
        ) : currentReviews.length > 0 ? (
          currentReviews.map((review, index) => (
            <Card key={index} className={styles.reviewCard}>
              <CardContent className={styles.reviewContent}>
                <Box className={styles.reviewHeader}>
                  <Box className={styles.reviewAuthor}>
                    <Avatar className={styles.avatar}>
                      {review.author ? review.author.charAt(0) : "A"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className={styles.authorName}
                      >
                        {review.author || "Аноним"}
                      </Typography>
                      <Typography variant="body2" className={styles.reviewDate}>
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className={styles.reviewRating}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" className={styles.ratingText}>
                      {review.rating.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>

                <Box className="flex flex-wrap gap-2 my-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {review.position}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    {translateEmploymentStatus(review.employmentStatus)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700"
                  >
                    {translateEmploymentType(review.employmentType)}
                  </Badge>
                  {review.recommendToFriend && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Рекомендует
                    </Badge>
                  )}
                  {review.hasVerification && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      Верифицирован
                    </Badge>
                  )}
                </Box>

                <Typography variant="h6" className={styles.reviewTitle}>
                  {review.title}
                </Typography>

                <Typography variant="body1" className={styles.reviewBody}>
                  {review.body}
                </Typography>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {review.pros && (
                    <Box className="bg-green-50 p-3 rounded-md">
                      <Typography
                        variant="subtitle2"
                        className="text-green-700 font-semibold mb-1"
                      >
                        Плюсы:
                      </Typography>
                      <Typography variant="body2" className="text-gray-700">
                        {review.pros}
                      </Typography>
                    </Box>
                  )}

                  {review.cons && (
                    <Box className="bg-red-50 p-3 rounded-md">
                      <Typography
                        variant="subtitle2"
                        className="text-red-700 font-semibold mb-1"
                      >
                        Минусы:
                      </Typography>
                      <Typography variant="body2" className="text-gray-700">
                        {review.cons}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {review.advice && (
                  <Box className="bg-amber-50 p-3 rounded-md mb-4">
                    <Typography
                      variant="subtitle2"
                      className="text-amber-700 font-semibold mb-1"
                    >
                      Совет руководству:
                    </Typography>
                    <Typography variant="body2" className="text-gray-700">
                      {review.advice}
                    </Typography>
                  </Box>
                )}

                <Box className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Box className="flex flex-col items-center">
                    <Typography
                      variant="caption"
                      className="text-gray-500 mb-1"
                    >
                      Карьера
                    </Typography>
                    <Rating
                      value={review.careerOpportunities}
                      readOnly
                      size="small"
                    />
                  </Box>
                  <Box className="flex flex-col items-center">
                    <Typography
                      variant="caption"
                      className="text-gray-500 mb-1"
                    >
                      Баланс
                    </Typography>
                    <Rating
                      value={review.workLifeBalance}
                      readOnly
                      size="small"
                    />
                  </Box>
                  <Box className="flex flex-col items-center">
                    <Typography
                      variant="caption"
                      className="text-gray-500 mb-1"
                    >
                      Оплата
                    </Typography>
                    <Rating value={review.compensation} readOnly size="small" />
                  </Box>
                  <Box className="flex flex-col items-center">
                    <Typography
                      variant="caption"
                      className="text-gray-500 mb-1"
                    >
                      Стабильность
                    </Typography>
                    <Rating value={review.jobSecurity} readOnly size="small" />
                  </Box>
                  <Box className="flex flex-col items-center">
                    <Typography
                      variant="caption"
                      className="text-gray-500 mb-1"
                    >
                      Руководство
                    </Typography>
                    <Rating value={review.management} readOnly size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" className={styles.noReviews}>
            По заданным критериям отзывов не найдено.
          </Typography>
        )}
      </Box>

      {totalPages > 1 && (
        <Box className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i ? "default" : "outline"}
              size="sm"
              onClick={() => handleChangePage(i)}
              className={styles.paginationBtn}
              data-state={page === i ? "on" : "off"}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CompanyReviewsPage;

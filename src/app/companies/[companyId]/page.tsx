"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const companyId =
    typeof params.companyId === "string" ? params.companyId : "";

  const { overview, loading, error, fetchSalaries } = useCompanyDetails();

  // Fetch salary data for preview
  useEffect(() => {
    if (companyId) {
      fetchSalaries({
        companyId,
        page: 0,
        pageSize: 1,
      });
    }
  }, [companyId, fetchSalaries]);

  // Get salary data from the store
  const { getSalaries } = useCompanyDetails();
  const salariesData = getSalaries({ companyId, page: 0, pageSize: 1 });

  // Get a single salary for preview
  const singleSalary = salariesData?.salaries?.[0];

  const handleSeeAllReviews = () =>
    router.push(`/companies/${companyId}/reviews`);
  const handleSeeAllSalaries = () =>
    router.push(`/companies/${companyId}/salaries`);

  if (error.overview) {
    return (
      <div className="mt-4 mb-8">
        <h4 className="text-2xl font-semibold">Ошибка при загрузке данных</h4>
        <p className="text-gray-600">{error.overview}</p>
      </div>
    );
  }

  if (!overview && !loading.overview) {
    return (
      <div className="mt-4 mb-8">
        <h4 className="text-2xl font-semibold">Компания не найдена</h4>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-8">
      {loading.overview ? (
        <LoadingSkeletonOverview />
      ) : (
        overview && (
          <>
            <Card className="mb-6 shadow-sm">
              <CardContent className="pt-6">
                <h6 className="text-[#800000] font-semibold mb-4 pb-2 border-b border-[rgba(128,0,0,0.1)] flex items-center justify-between">
                  <span>Основная информация</span>
                  {overview.type && (
                    <span className="text-sm bg-[rgba(128,0,0,0.05)] px-3 py-1 rounded-full">
                      {overview.type}
                    </span>
                  )}
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-sm mb-1">Основана</p>
                    <p className="text-gray-800 font-medium">
                      {overview.founded}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-sm mb-1">Выручка</p>
                    <p className="text-gray-800 font-medium">
                      {overview.revenue}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-sm mb-1">Индустрия</p>
                    <p className="text-gray-800 font-medium">
                      {overview.industries.join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-sm mb-1">Размер</p>
                    <p className="text-gray-800 font-medium">{overview.size}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-1">Миссия компании</p>
                  <p className="text-gray-700 italic leading-relaxed">
                    {overview.mission}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-1">Описание</p>
                  <p className="text-gray-700 leading-relaxed">
                    {overview.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
              <div className="md:col-span-7">
                <Card className="h-full shadow-sm">
                  <CardContent className="pt-6">
                    <h6 className="text-[#800000] font-semibold mb-4 pb-2 border-b border-[rgba(128,0,0,0.1)]">
                      Отзывы сотрудников
                    </h6>
                    {overview.topReview ? (
                      <div className="py-2">
                        <div className="flex justify-between items-center mb-2 flex-col sm:flex-row sm:items-center gap-2">
                          <h6 className="font-semibold text-gray-800">
                            {overview.topReview.title}
                          </h6>
                          <div>
                            <span className="font-semibold mr-1">
                              {overview.topReview.rating}
                            </span>
                            <span className="text-[#f5b400] tracking-tighter">
                              {"★".repeat(
                                Math.floor(overview.topReview.rating)
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-500 mb-2 text-sm">
                          Дата: {overview.topReview.date}
                        </p>
                        <p className="text-gray-800 mb-4 leading-relaxed">
                          {overview.topReview.body}
                        </p>
                        <Button
                          variant="ghost"
                          className="text-[#800000] p-0 font-medium hover:bg-transparent hover:underline"
                          onClick={handleSeeAllReviews}
                        >
                          Смотреть все отзывы ({overview.totalReviews})
                        </Button>
                      </div>
                    ) : (
                      <p>У этой компании пока нет отзывов</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-5">
                <Card className="h-full shadow-sm">
                  <CardContent className="pt-6">
                    <h6 className="text-[#800000] font-semibold mb-4 pb-2 border-b border-[rgba(128,0,0,0.1)]">
                      Зарплаты
                    </h6>
                    {loading.salaries ? (
                      <SalarySkeleton />
                    ) : singleSalary ? (
                      <div className="py-2">
                        <h6 className="font-semibold text-gray-800">
                          {singleSalary.position}
                        </h6>
                        <p className="text-[#800000] font-semibold text-xl my-2">
                          ₸{singleSalary.median.toLocaleString()}
                        </p>
                        <p className="text-gray-500 mb-2 text-sm">
                          Диапазон: ₸{singleSalary.min.toLocaleString()}-₸
                          {singleSalary.max.toLocaleString()}
                        </p>
                        <p className="text-gray-500 mb-2 text-sm">
                          Уровень: {singleSalary.experienceLevel}
                        </p>
                        <Button
                          variant="ghost"
                          className="text-[#800000] p-0 font-medium hover:bg-transparent hover:underline mt-2"
                          onClick={handleSeeAllSalaries}
                        >
                          Смотреть все зарплаты (
                          {salariesData?.totalSalaries ||
                            overview.totalSalaries}
                          )
                        </Button>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="text-gray-600 mb-4">
                          У этой компании пока нет данных о зарплатах
                        </p>
                        <Button
                          variant="ghost"
                          className="text-[#800000] p-0 font-medium hover:bg-transparent hover:underline"
                          onClick={handleSeeAllSalaries}
                        >
                          Добавить информацию о зарплате
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="mb-6 shadow-sm">
              <CardContent className="pt-6">
                <h6 className="text-[#800000] font-semibold mb-4 pb-2 border-b border-[rgba(128,0,0,0.1)]">
                  О компании {overview.name}
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Рейтинг</span>
                    <div className="flex items-center mt-1">
                      <span className="font-semibold mr-1">
                        {overview.rating}
                      </span>
                      <span className="text-[#f5b400] tracking-tighter">
                        {"★".repeat(Math.floor(overview.rating))}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Расположение</span>
                    <span className="font-medium mt-1">
                      {overview.location}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Отзывы</span>
                    <span className="font-medium mt-1">
                      {overview.totalReviews} отзывов
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h6 className="text-[#800000] font-semibold mb-4 pb-2 border-b border-[rgba(128,0,0,0.1)]">
                  Индустрии
                </h6>
                <div className="flex flex-wrap gap-2">
                  {overview.industries.map((industry, index) => (
                    <span
                      key={index}
                      className="bg-[rgba(128,0,0,0.05)] px-3 py-1 rounded-full text-sm text-[#800000]"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )
      )}
    </div>
  );
}

function LoadingSkeletonOverview() {
  return (
    <>
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-16 w-full" />

          <Skeleton className="h-4 w-32 mt-4 mb-1" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-7">
          <Card className="h-full shadow-sm">
            <CardContent className="pt-6">
              <Skeleton className="h-7 w-48 mb-4" />
              <ReviewSkeleton />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-5">
          <Card className="h-full shadow-sm">
            <CardContent className="pt-6">
              <Skeleton className="h-7 w-32 mb-4" />
              <SalarySkeleton />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ReviewSkeleton() {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-5 w-40" />
    </div>
  );
}

function SalarySkeleton() {
  return (
    <div className="py-2">
      <Skeleton className="h-5 w-48 mb-2" />
      <Skeleton className="h-7 w-32 my-2" />
      <Skeleton className="h-4 w-40 mb-2" />
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-5 w-40 mt-2" />
    </div>
  );
}

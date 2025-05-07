"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building, Calendar, DollarSign, Briefcase, Users, Star, MapPin, MessageSquare, ChevronRight, Award, Target } from "lucide-react";

export default function CompanyOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = typeof params.companyId === "string" ? params.companyId : "";

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

  const handleSeeAllReviews = () => router.push(`/companies/${companyId}/reviews`);
  const handleSeeAllSalaries = () => router.push(`/companies/${companyId}/salaries`);

  if (error.overview) {
    return (
      <div className="p-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-xl font-semibold text-red-700">Ошибка при загрузке данных</h4>
          <p className="text-red-600 mt-2">{error.overview}</p>
        </div>
      </div>
    );
  }

  if (!overview && !loading.overview) {
    return (
      <div className="p-6 mb-8">
        <div className="bg-[#E6E6B0]/20 border border-[#E6E6B0] rounded-lg p-6 text-center">
          <Building className="h-16 w-16 mx-auto text-[#628307]/50 mb-4" />
          <h4 className="text-2xl font-semibold text-[#1D1D1D]">Компания не найдена</h4>
          <p className="mt-2 text-[#1D1D1D]/70">Информация о данной компании отсутствует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8">
      {loading.overview ? (
        <LoadingSkeletonOverview />
      ) : (
        overview && (
          <>
            <Card className="mb-6 border-[#E6E6B0] overflow-hidden">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#628307] text-xl">Основная информация</CardTitle>
                  {overview.type && <Badge className="bg-[#628307]/10 text-[#628307] border-[#628307]/20 font-normal">{overview.type}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-[#628307] mt-0.5" />
                    <div>
                      <p className="text-[#1D1D1D]/60 text-sm mb-1">Основана</p>
                      <p className="text-[#1D1D1D] font-medium">{overview.founded || "Нет данных"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-[#628307] mt-0.5" />
                    <div>
                      <p className="text-[#1D1D1D]/60 text-sm mb-1">Выручка</p>
                      <p className="text-[#1D1D1D] font-medium">{overview.revenue || "Нет данных"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-[#628307] mt-0.5" />
                    <div>
                      <p className="text-[#1D1D1D]/60 text-sm mb-1">Индустрия</p>
                      <p className="text-[#1D1D1D] font-medium">{overview.industries?.join(", ") || "Нет данных"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-[#628307] mt-0.5" />
                    <div>
                      <p className="text-[#1D1D1D]/60 text-sm mb-1">Размер</p>
                      <p className="text-[#1D1D1D] font-medium">{overview.size || "Нет данных"}</p>
                    </div>
                  </div>
                </div>

                {overview.mission && (
                  <div className="mb-5 bg-[#E6E6B0]/10 p-4 rounded-lg border-l-4 border-[#628307]">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-[#628307] mr-2" />
                      <p className="text-[#1D1D1D]/70 font-medium">Миссия компании</p>
                    </div>
                    <p className="text-[#1D1D1D]/80 italic leading-relaxed">{overview.mission}</p>
                  </div>
                )}

                {overview.description && (
                  <div className="mt-4">
                    <p className="text-[#1D1D1D]/70 font-medium mb-2">Описание</p>
                    <p className="text-[#1D1D1D]/80 leading-relaxed">{overview.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
              <div className="md:col-span-7">
                <Card className="h-full border-[#E6E6B0]">
                  <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                    <CardTitle className="text-[#628307] text-xl flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Отзывы сотрудников
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {overview.topReview ? (
                      <div className="py-2">
                        <div className="flex justify-between items-start mb-3 flex-col sm:flex-row sm:items-center gap-2">
                          <h6 className="font-semibold text-[#1D1D1D]">{overview.topReview.title}</h6>
                          <div className="flex items-center bg-[#E6E6B0]/20 px-3 py-1 rounded-full">
                            <span className="font-semibold mr-1 text-[#1D1D1D]">{overview.topReview.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    overview.topReview && i < Math.floor(overview.topReview.rating)
                                      ? "fill-[#628307] text-[#628307]"
                                      : "fill-[#E6E6B0]/50 text-[#E6E6B0]"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-[#1D1D1D]/60 mb-3 text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {overview.topReview.date}
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-[#E6E6B0]/30 mb-4">
                          <p className="text-[#1D1D1D]/80 leading-relaxed">{overview.topReview.body}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-[#628307] border-[#628307]/20 hover:bg-[#628307]/5 hover:text-[#4D6706] flex items-center"
                          onClick={handleSeeAllReviews}
                        >
                          Смотреть все отзывы ({overview.totalReviews})
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4 text-center bg-[#E6E6B0]/10 rounded-lg">
                        <p className="text-[#1D1D1D]/70 mb-4">У этой компании пока нет отзывов</p>
                        <Button className="bg-[#628307] hover:bg-[#4D6706]" onClick={() => router.push("/profile/add")}>
                          Добавить первый отзыв
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-5">
                <Card className="h-full border-[#E6E6B0]">
                  <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                    <CardTitle className="text-[#628307] text-xl flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Зарплаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loading.salaries ? (
                      <SalarySkeleton />
                    ) : singleSalary ? (
                      <div className="py-2">
                        <h6 className="font-semibold text-[#1D1D1D] mb-3 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-[#628307]" />
                          {singleSalary.position}
                        </h6>
                        <div className="bg-[#628307]/5 p-4 rounded-lg border border-[#628307]/10 mb-3">
                          <p className="text-[#628307] font-semibold text-xl">₸{singleSalary.median.toLocaleString()}</p>
                          <p className="text-[#1D1D1D]/60 mt-1 text-sm">Медианная зарплата</p>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex justify-between items-center">
                            <p className="text-[#1D1D1D]/70 text-sm">Минимум:</p>
                            <p className="font-medium text-[#1D1D1D]">₸{singleSalary.min.toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[#1D1D1D]/70 text-sm">Максимум:</p>
                            <p className="font-medium text-[#1D1D1D]">₸{singleSalary.max.toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[#1D1D1D]/70 text-sm">Уровень:</p>
                            <Badge variant="outline" className="bg-[#E6E6B0]/20 text-[#1D1D1D]/80">
                              {singleSalary.experienceLevel}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="text-[#628307] border-[#628307]/20 hover:bg-[#628307]/5 hover:text-[#4D6706] flex items-center w-full justify-center"
                          onClick={handleSeeAllSalaries}
                        >
                          Смотреть все зарплаты ({salariesData?.totalSalaries || overview.totalSalaries})
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4 text-center bg-[#E6E6B0]/10 rounded-lg">
                        <p className="text-[#1D1D1D]/70 mb-4">У этой компании пока нет данных о зарплатах</p>
                        <Button className="bg-[#628307] hover:bg-[#4D6706]" onClick={() => router.push("/profile/add/salary")}>
                          Добавить информацию о зарплате
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="mb-6 border-[#E6E6B0]">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <CardTitle className="text-[#628307] text-xl flex items-center">
                  <Building className="h-5 w-5 mr-2" />О компании {overview.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-[#E6E6B0]/10 p-4 rounded-lg border border-[#E6E6B0]/30 flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-[#628307] mr-2" />
                      <span className="text-[#1D1D1D]/70">Рейтинг</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="font-semibold mr-2 text-xl text-[#1D1D1D]">{overview.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(overview.rating) ? "fill-[#628307] text-[#628307]" : "fill-[#E6E6B0]/50 text-[#E6E6B0]"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#E6E6B0]/10 p-4 rounded-lg border border-[#E6E6B0]/30 flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-[#628307] mr-2" />
                      <span className="text-[#1D1D1D]/70">Расположение</span>
                    </div>
                    <span className="font-medium mt-1 text-center text-[#1D1D1D]">{overview.location || "Нет данных"}</span>
                  </div>

                  <div className="bg-[#E6E6B0]/10 p-4 rounded-lg border border-[#E6E6B0]/30 flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-5 w-5 text-[#628307] mr-2" />
                      <span className="text-[#1D1D1D]/70">Отзывы</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="font-medium text-[#1D1D1D]">
                        {overview.totalReviews} {getReviewsText(overview.totalReviews)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E6E6B0]">
              <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
                <CardTitle className="text-[#628307] text-xl flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Индустрии
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {overview.industries?.map((industry, index) => (
                    <Badge key={index} variant="outline" className="bg-[#628307]/5 border-[#628307]/20 text-[#1D1D1D]/80 py-1.5 px-3">
                      {industry}
                    </Badge>
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

function getReviewsText(count: number) {
  if (count === 1) return "отзыв";
  if (count >= 2 && count <= 4) return "отзыва";
  return "отзывов";
}

function LoadingSkeletonOverview() {
  return (
    <>
      <Card className="mb-6 border-[#E6E6B0]">
        <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
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
          <Card className="h-full border-[#E6E6B0]">
            <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent className="pt-6">
              <ReviewSkeleton />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-5">
          <Card className="h-full border-[#E6E6B0]">
            <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent className="pt-6">
              <SalarySkeleton />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6 border-[#E6E6B0]">
        <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E6E6B0]">
        <CardHeader className="bg-[#E6E6B0]/10 border-b border-[#E6E6B0]/30 pb-3">
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(i => (
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
      <Skeleton className="h-24 w-full rounded-lg mb-4" />
      <Skeleton className="h-9 w-40" />
    </div>
  );
}

function SalarySkeleton() {
  return (
    <div className="py-2">
      <Skeleton className="h-5 w-48 mb-3" />
      <Skeleton className="h-20 w-full rounded-lg mb-3" />
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

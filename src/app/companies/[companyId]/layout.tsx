"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Building, Star, MapPin, BadgeInfo, PenSquare, Users, Calendar, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const segments = useSelectedLayoutSegments();
  const companyId = typeof params.companyId === "string" ? params.companyId : "";
  const { toast } = useToast();

  const { overview, loading, error, fetchOverview } = useCompanyDetails();

  useEffect(() => {
    if (companyId) {
      fetchOverview(companyId);
    }
  }, [companyId, fetchOverview]);

  useEffect(() => {
    if (overview && overview.type === "ТОО" && segments[0] === "stocks") {
      toast({
        title: "Компания не публичная",
        description: "У непубличных компаний нет акций для просмотра",
        variant: "destructive",
      });
      router.push(`/companies/${companyId}`);
    }
  }, [overview, segments, companyId, router, toast]);

  const handleAddReview = () => {
    router.push("/profile/add");
  };

  const tabs = [
    { label: "Обзор", path: "" },
    { label: "Отзывы", path: "reviews" },
    { label: "Зарплаты", path: "salaries" },
  ];

  if (!overview || overview.type !== "ТОО") {
    // tabs.push({ label: "Акции", path: "stocks" });
  }

  const isActiveTab = (tabPath: string) => {
    return (!tabPath && !segments[0]) || segments[0] === tabPath;
  };

  if (error.overview) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-12 text-center">
        <div className="bg-red-50 p-8 rounded-xl border border-red-100">
          <div className="text-red-500 bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building size={32} />
          </div>
          <h4 className="text-2xl font-semibold text-[#1D1D1D] mb-2">Произошла ошибка при загрузке данных</h4>
          <p className="text-[#1D1D1D]/70">{error.overview}</p>
          <Button className="mt-6 bg-[#628307] hover:bg-[#4D6706] text-white" onClick={() => router.push("/companies")}>
            Вернуться к списку компаний
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {loading.overview ? (
        <div className="w-full">
          <Skeleton className="w-full h-64 rounded-xl mb-5" />
          <div className="flex items-center mb-6 gap-4">
            <Skeleton className="w-32 h-32 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="w-40 h-10" />
          </div>
          <div className="flex gap-6 mb-6 overflow-x-auto">
            {tabs.map((tab, index) => (
              <Skeleton key={index} className="w-24 h-8" />
            ))}
          </div>
        </div>
      ) : overview ? (
        <>
          {/* Redesigned Hero Section */}
          <div className="relative mt-6 mb-8">
            {/* Background banner with overlay */}
            <div className="relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden">
              {overview.bannerImg ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1D1D1D]/20 to-[#1D1D1D]/60 z-10"></div>
                  <img src={overview.bannerImg} alt={`${overview.name} баннер`} className="w-full h-full object-cover" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#628307]/80 to-[#4D6706] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                        <rect width="100%" height="100%" fill="none" />
                        <path d="M 0,20 H 40 M 20,0 V 40" stroke="white" strokeWidth="1" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#pattern)" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Company Info Card */}
            <div className="relative z-20 mx-4 -mt-32 bg-white rounded-xl shadow-lg border border-[#E6E6B0]/30 overflow-hidden">
              {/* Top Profile Section */}
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Logo Section */}
                <div className="md:w-auto w-full flex flex-col items-center">
                  <div className="bg-white rounded-xl shadow-sm border border-[#E6E6B0]/30 p-3 w-28 h-28 flex items-center justify-center">
                    {overview.logoUrl ? (
                      <img src={overview.logoUrl} alt={overview.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="flex items-center justify-center bg-[#E6E6B0]/20 rounded-lg w-full h-full">
                        <Building size={40} className="text-[#628307]" />
                      </div>
                    )}
                  </div>

                  <Button
                    className="mt-4 bg-[#628307] hover:bg-[#4D6706] text-white font-medium shadow-sm flex items-center gap-2 w-full md:w-auto"
                    onClick={handleAddReview}
                  >
                    <PenSquare className="h-4 w-4" />
                    Добавить отзыв
                  </Button>
                </div>

                {/* Company Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#628307]">{overview.name}</h1>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#628307]/10 px-3 py-1.5 rounded-full">
                        <Star className="h-5 w-5 text-[#628307] fill-[#628307]" />
                        <span className="text-lg font-semibold text-[#1D1D1D]">{overview.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {overview.location && (
                      <div className="flex items-center gap-1 bg-[#E6E6B0]/20 px-3 py-1 rounded-full">
                        <MapPin className="h-4 w-4 text-[#628307]" />
                        <span className="text-[#1D1D1D]/80 text-sm">{overview.location}</span>
                      </div>
                    )}

                    {overview.type && (
                      <Badge variant="outline" className="bg-[#628307]/5 border-[#628307]/20 text-[#1D1D1D]/80 font-normal">
                        <BadgeInfo className="h-3.5 w-3.5 mr-1 text-[#628307]" />
                        {overview.type}
                      </Badge>
                    )}

                    <Badge variant="outline" className="bg-[#E6E6B0]/20 border-[#E6E6B0]/30 text-[#1D1D1D]/80 font-normal">
                      <Users className="h-3.5 w-3.5 mr-1 text-[#628307]" />
                      Более 1000 сотрудников
                    </Badge>

                    <Badge variant="outline" className="bg-[#E6E6B0]/20 border-[#E6E6B0]/30 text-[#1D1D1D]/80 font-normal">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-[#628307]" />
                      Основана в 2005
                    </Badge>
                  </div>

                  <p className="text-[#1D1D1D]/70 text-sm leading-relaxed max-w-3xl">
                    {overview.description || "Информация о компании отсутствует. Вы можете добавить отзыв и помочь другим узнать больше о данной компании."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {/* Company Stats Preview */}
                    <div className="bg-[#E6E6B0]/10 px-4 py-2 rounded-lg flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#1D1D1D]/60">Отзывы</span>
                        <span className="font-semibold text-[#1D1D1D]">224</span>
                      </div>
                      <Separator orientation="vertical" className="h-8 bg-[#E6E6B0]/40" />
                      <div className="flex flex-col">
                        <span className="text-xs text-[#1D1D1D]/60">Зарплаты</span>
                        <span className="font-semibold text-[#1D1D1D]">143</span>
                      </div>
                      <Separator orientation="vertical" className="h-8 bg-[#E6E6B0]/40" />
                      <div className="flex flex-col">
                        <span className="text-xs text-[#1D1D1D]/60">Рекомендуют</span>
                        <span className="font-semibold text-[#1D1D1D]">87%</span>
                      </div>
                    </div>

                    <div className="flex items-center text-[#628307] hover:underline text-sm">
                      <ExternalLink size={14} className="mr-1" />
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Официальный сайт
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 border-t border-[#E6E6B0]/30 mt-4">
                <div className="flex gap-6 overflow-x-auto md:gap-8 gap-4 -mb-px">
                  {tabs.map(tab => (
                    <Link
                      key={tab.label}
                      href={`/companies/${companyId}/${tab.path}`}
                      className={cn(
                        "inline-block no-underline text-[#1D1D1D]/70 font-medium py-4 px-1 border-b-2 border-transparent transition-colors whitespace-nowrap hover:text-[#628307]",
                        isActiveTab(tab.path) && "text-[#628307] border-b-[#628307] font-semibold"
                      )}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action Card */}
            <div className="mt-6 bg-gradient-to-r from-[#628307]/10 to-[#E6E6B0]/20 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#628307]/20 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-[#628307]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1D]">Нашли работу в {overview.name}?</h3>
                  <p className="text-sm text-[#1D1D1D]/70">Поделитесь своим опытом с другими</p>
                </div>
              </div>
              <Button className="bg-[#628307] hover:bg-[#4D6706] text-white w-full md:w-auto flex items-center gap-1" onClick={handleAddReview}>
                Написать отзыв
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#E6E6B0]/30">{children}</div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto p-8 mt-12 text-center bg-[#E6E6B0]/10 rounded-xl border border-[#E6E6B0]/30">
          <Building className="h-16 w-16 mx-auto text-[#628307]/50 mb-4" />
          <h4 className="text-2xl font-semibold text-[#1D1D1D]">Компания не найдена</h4>
          <p className="mt-2 text-[#1D1D1D]/70">Возможно, компания была удалена или указан неверный идентификатор</p>
          <Button className="mt-6 bg-[#628307] hover:bg-[#4D6706]" onClick={() => router.push("/companies")}>
            Вернуться к списку компаний
          </Button>
        </div>
      )}
    </div>
  );
}

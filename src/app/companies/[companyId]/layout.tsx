"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Building, Star, MapPin, BadgeInfo, PenSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

    return () => {
      // Any cleanup if needed
    };
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
    // { label: "Налоги", path: "taxes" },
  ];

  if (!overview || overview.type !== "ТОО") {
    // tabs.push({ label: "Акции", path: "stocks" });
  }

  const isActiveTab = (tabPath: string) => {
    return (!tabPath && !segments[0]) || segments[0] === tabPath;
  };

  if (error.overview) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-12 text-center">
        <h4 className="text-2xl font-semibold text-[#1D1D1D]">Произошла ошибка при загрузке данных</h4>
        <p className="mt-2 text-[#1D1D1D]/70">{error.overview}</p>
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
          {overview.bannerImg && (
            <div className="w-full overflow-hidden mb-6 rounded-xl shadow-md mt-4">
              <img src={overview.bannerImg || "/placeholder.svg"} alt={`${overview.name} баннер`} className="w-full h-auto object-cover max-h-64 block" />
            </div>
          )}

          <div className="mt-5 flex items-center mb-6 border-b border-[#E6E6B0] pb-6 md:flex-row flex-col md:items-center items-start gap-4">
            <div className="mr-4 md:mr-6 md:mb-0 bg-white p-2 rounded-xl shadow-sm border border-[#E6E6B0]">
              {overview.logoUrl ? (
                <img src={overview.logoUrl || "/placeholder.svg"} alt={overview.name} className="w-28 h-28 object-contain rounded-lg md:w-28 w-24" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center bg-[#E6E6B0]/20 rounded-lg">
                  <Building size={40} className="text-[#628307]" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <h1 className="text-[#628307] font-bold m-0 text-2xl md:text-3xl">{overview.name}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-[#E6E6B0]/20 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-[#628307] fill-[#628307]" />
                  <span className="text-[#1D1D1D]/80 font-medium">{overview.rating}</span>
                </div>

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
              </div>

              <p className="text-[#1D1D1D]/70 text-sm mt-1 max-w-2xl">
                {overview.description || "Информация о компании отсутствует. Вы можете добавить отзыв и помочь другим узнать больше о данной компании."}
              </p>
            </div>

            <div className="md:w-auto w-full flex mt-2 md:mt-0">
              <Button
                className="bg-[#628307] text-white px-5 py-2.5 font-medium hover:bg-[#4D6706] w-full shadow-sm flex items-center gap-2"
                onClick={handleAddReview}
              >
                <PenSquare className="h-4 w-4" />
                Добавить отзыв
              </Button>
            </div>
          </div>

          <div className="flex gap-6 mb-8 border-b border-[#E6E6B0] overflow-x-auto md:gap-8 gap-4 pb-0.5">
            {tabs.map(tab => (
              <Link
                key={tab.label}
                href={`/companies/${companyId}/${tab.path}`}
                className={cn(
                  "inline-block no-underline text-[#1D1D1D]/70 font-medium pb-3 px-1 border-b-2 border-transparent transition-colors whitespace-nowrap hover:text-[#628307]",
                  isActiveTab(tab.path) && "text-[#628307] border-b-[#628307] font-semibold"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
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

      <div className="bg-white rounded-xl shadow-sm border border-[#E6E6B0]/30">{children}</div>
    </div>
  );
}

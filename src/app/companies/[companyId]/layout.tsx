// src/app/companies/[companyId]/layout.tsx
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  useParams,
  useSelectedLayoutSegments,
  useRouter,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const segments = useSelectedLayoutSegments();
  const companyId =
    typeof params.companyId === "string" ? params.companyId : "";
  const { toast } = useToast();

  const { overview, loading, error, fetchOverview } = useCompanyDetails();

  useEffect(() => {
    if (companyId) {
      // Fetch company overview when the layout loads
      fetchOverview(companyId);
    }

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [companyId, fetchOverview]);

  // Redirect if accessing stocks page for a non-public company
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

  // Filter out the "Акции" tab if the company is a "ТОО"
  const tabs = [
    { label: "Обзор", path: "" },
    { label: "Отзывы", path: "reviews" },
    { label: "Зарплаты", path: "salaries" },
    { label: "Налоги", path: "taxes" },
  ];

  // Only add the Stocks tab if company is not a ТОО
  if (!overview || overview.type !== "ТОО") {
    tabs.push({ label: "Акции", path: "stocks" });
  }

  const isActiveTab = (tabPath: string) => {
    return (!tabPath && !segments[0]) || segments[0] === tabPath;
  };

  if (error.overview) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-12 text-center">
        <h4 className="text-2xl font-semibold">
          Произошла ошибка при загрузке данных
        </h4>
        <p className="mt-2 text-gray-600">{error.overview}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="w-full overflow-hidden mb-5 rounded-xl">
              <img
                src={overview.bannerImg}
                alt={`${overview.name} баннер`}
                className="w-full h-auto object-cover max-h-64 block"
              />
            </div>
          )}

          <div className="mt-5 flex items-center mb-6 border-b border-gray-200 pb-4 md:flex-row flex-col md:items-center items-start gap-4">
            <div className="mr-4 md:mr-4 md:mb-0">
              <img
                src={overview.logoUrl}
                alt={overview.name}
                className="w-32 h-auto object-contain rounded-xl md:w-32 w-24"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h4 className="text-[#800000] font-semibold m-0 text-2xl md:text-2xl text-xl">
                {overview.name}
              </h4>
              <p className="text-gray-700 font-medium text-base">
                Рейтинг: {overview.rating}
              </p>
              <p className="text-[black] font-medium text-sm">
                {overview.location}
              </p>
              {overview.type && (
                <p className="text-gray-700 text-sm">
                  Тип компании: {overview.type}
                </p>
              )}
            </div>
            <div className="md:w-auto w-full flex">
              <Button
                className="bg-[#800000] text-white px-4 py-2 font-medium hover:bg-[#660000] w-full"
                onClick={handleAddReview}
              >
                Добавить отзыв
              </Button>
            </div>
          </div>

          <div className="flex gap-6 mb-6 border-b border-gray-200 overflow-x-auto md:gap-6 gap-4">
            {tabs.map((tab) => (
              <Link
                key={tab.label}
                href={`/companies/${companyId}/${tab.path}`}
                className={cn(
                  "inline-block no-underline text-gray-700 font-medium pb-3 border-b-2 border-transparent transition-colors whitespace-nowrap hover:text-[#800000]",
                  isActiveTab(tab.path) && "text-[#800000] border-b-[#800000]"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto p-4 mt-12 text-center">
          <h4 className="text-2xl font-semibold">Компания не найдена</h4>
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}

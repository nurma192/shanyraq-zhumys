import React, { Suspense } from "react";
import { Container } from "@/components/ui/container";
import SalariesContent from "./SalariesContent";
import { Loader2 } from "lucide-react";

export default function SalariesPage() {
  return (
    <Container className="p-4 sm:p-6 md:p-8">
      <Suspense
        fallback={
          <div className="w-full min-h-[50vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#628307] mb-4" />
              <p className="text-xl font-medium text-[#1D1D1D]">Загрузка данных о зарплатах...</p>
            </div>
          </div>
        }
      >
        <SalariesContent />
      </Suspense>
    </Container>
  );
}

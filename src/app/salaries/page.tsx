import React, { Suspense } from "react";
import { Container } from "@/components/ui/container";
import styles from "./Salaries.module.scss";
import SalariesContent from "./SalariesContent";
import { Loader2 } from "lucide-react";

export default function SalariesPage() {
  return (
    <Container className={styles.salariesContainer}>
      <Suspense fallback={
        <div className="w-full min-h-[50vh] flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#800000] mb-4" />
            <p className="text-xl font-medium">Загрузка данных о зарплатах...</p>
          </div>
        </div>
      }>
        <SalariesContent />
      </Suspense>
    </Container>
  );
}
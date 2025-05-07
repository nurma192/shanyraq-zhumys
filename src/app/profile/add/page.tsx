"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileText, DollarSign } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AddPage() {
  const router = useRouter();

  const handleSelectContentType = (path: string) => {
    router.push(path);
  };

  return (
    <Container className="py-6">
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Добавить контент
          </h2>
          <p className="text-gray-600">
            Поделитесь своим опытом работы и получите доступ к миллионам
            отзывов, данных о зарплатах и другой полезной информации
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="flex flex-col items-center text-center p-3">
                <div className="h-16 w-16 rounded-full bg-[#800000]/10 flex items-center justify-center mb-3">
                  <FileText size={30} className="text-[#800000]" />
                </div>
                <h3 className="text-xl font-semibold text-[#800000] mb-2">
                  Отзыв о компании
                </h3>
                <p className="text-gray-600 mb-4">
                  Добавьте отзыв о работе в компании, оцените условия труда,
                  корпоративную культуру и управление.
                </p>
                <Button
                  onClick={() => handleSelectContentType("/profile/add/review")}
                  className="bg-[#800000] hover:bg-[#660000]"
                >
                  Добавить отзыв
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow ">
            <CardContent>
              <div className="flex flex-col items-center text-center p-3">
                <div className="h-16 w-16 rounded-full bg-[#800000]/10 flex items-center justify-center mb-3">
                  <DollarSign size={30} className="text-[#800000]" />
                </div>
                <h3 className="text-xl font-semibold text-[#800000] mb-2">
                  Информация о зарплате
                </h3>
                <p className="text-gray-600 mb-4">
                  Поделитесь данными о вашей зарплате анонимно, чтобы помочь
                  другим специалистам в переговорах о вознаграждении.
                </p>
                <Button
                  onClick={() => handleSelectContentType("/profile/add/salary")}
                  className="bg-[#800000] hover:bg-[#660000]"
                >
                  Добавить зарплату
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

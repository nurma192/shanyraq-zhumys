"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileText, DollarSign, ChevronRight, Star, Building } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AddPage() {
  const router = useRouter();

  const handleSelectContentType = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white min-h-screen">
      <Container className="py-8 px-4 sm:px-6">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-bold text-[#1D1D1D] mb-4">Добавить контент</h2>
            <p className="text-[#1D1D1D]/70 text-lg">
              Поделитесь своим опытом работы и получите доступ к миллионам отзывов, данных о зарплатах и другой полезной информации
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-[#E6E6B0] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-3 bg-gradient-to-r from-[#628307] to-[#4D6706]"></div>
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="bg-[#E6E6B0]/20 p-6 flex items-center">
                    <div className="h-16 w-16 rounded-full bg-[#628307]/10 flex items-center justify-center mr-4">
                      <Star size={28} className="text-[#628307]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#628307]">Отзыв о компании</h3>
                      <p className="text-[#1D1D1D]/70 text-sm">Поделитесь своим опытом работы</p>
                    </div>
                  </div>

                  <div className="p-6 flex-grow">
                    <p className="text-[#1D1D1D]/80 mb-6">
                      Добавьте отзыв о работе в компании, оцените условия труда, корпоративную культуру и управление. Ваш отзыв поможет другим специалистам
                      сделать правильный выбор.
                    </p>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-[#1D1D1D]/70">
                        <ChevronRight size={16} className="text-[#628307] mr-2" />
                        <span>Анонимные отзывы</span>
                      </li>
                      <li className="flex items-center text-[#1D1D1D]/70">
                        <ChevronRight size={16} className="text-[#628307] mr-2" />
                        <span>Оценка по нескольким критериям</span>
                      </li>
                      <li className="flex items-center text-[#1D1D1D]/70">
                        <ChevronRight size={16} className="text-[#628307] mr-2" />
                        <span>Помощь сообществу</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Button
                      onClick={() => handleSelectContentType("/profile/add/review")}
                      className="w-full bg-[#628307] hover:bg-[#4D6706] text-white group-hover:shadow-md transition-all"
                    >
                      <FileText size={18} className="mr-2" />
                      Добавить отзыв
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#E6E6B0] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-3 bg-gradient-to-r from-[#628307] to-[#4D6706]"></div>
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="bg-[#E6E6B0]/20 p-6 flex items-center">
                    <div className="h-16 w-16 rounded-full bg-[#628307]/10 flex items-center justify-center mr-4">
                      <DollarSign size={28} className="text-[#628307]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#628307]">Информация о зарплате</h3>
                      <p className="text-[#1D1D1D]/70 text-sm">Поделитесь данными о вознаграждении</p>
                    </div>
                  </div>

                  <div className="p-6 flex-grow">
                    <p className="text-[#1D1D1D]/80 mb-6">
                      Поделитесь данными о вашей зарплате анонимно, чтобы помочь другим специалистам в переговорах о вознаграждении. Ваша информация поможет
                      создать прозрачный рынок труда.
                    </p>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-[#1D1D1D]/70">
                        <ChevronRight size={16} className="text-[#628307] mr-2" />
                        <span>Полная анонимность</span>
                      </li>
                      <li className="flex items-center text-[#1D1D1D]/70">
                        <ChevronRight size={16} className="text-[#628307] mr-2" />
                        <span>Детальная информация о компенсации</span>
                      </li>
                      <li className="flex items-center text-[#1D1D1D]/70">
                        <ChevronRight size={16} className="text-[#628307] mr-2" />
                        <span>Возможность прикрепить документы</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Button
                      onClick={() => handleSelectContentType("/profile/add/salary")}
                      className="w-full bg-[#628307] hover:bg-[#4D6706] text-white group-hover:shadow-md transition-all"
                    >
                      <DollarSign size={18} className="mr-2" />
                      Добавить зарплату
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-[#1D1D1D]/60 text-sm">Вся предоставленная информация проходит модерацию и публикуется анонимно</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#E6E6B0]/10 py-8 border-t border-[#E6E6B0]/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <h6 className="text-3xl font-bold text-[#628307] m-0">Shanyraq Zhumys</h6>
            </div>

            <div className="max-w-md text-center sm:text-right">
              <p className="text-[#1D1D1D]/70 text-base leading-relaxed m-0">Найдите свою идеальную работу и развивайте карьеру</p>
            </div>
          </div>

          <Separator className="bg-[#E6E6B0]/30 my-4" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[#1D1D1D]/60 text-sm">© {new Date().getFullYear()} iWork. Все права защищены.</div>

            <div className="text-[#1D1D1D]/60 text-sm font-medium">Казахстан</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

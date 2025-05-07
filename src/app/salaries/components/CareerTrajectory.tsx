// src/app/salaries/components/CareerTrajectory.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import styles from "./CareerTrajectory.module.scss";

interface TrajectoryItem {
  role: string;
  salaryRange: string;
  current: boolean;
}

interface CareerTrajectoryProps {
  data: TrajectoryItem[];
}

export default function CareerTrajectory({ data }: CareerTrajectoryProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#800000] mb-4">
        Динамика зарплаты по опыту
      </h2>

      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        {data.map((item, index) => (
          <Card
            key={index}
            className={`flex-1 relative ${
              item.current ? "border-[#800000] shadow-md" : "border-gray-200"
            }`}
          >
            <CardContent className="p-4">
              <div className="mb-2">
                {item.current && (
                  <Badge className="bg-[#800000] hover:bg-[#660000] mb-2">
                    Текущий
                  </Badge>
                )}
                <p className="font-semibold text-gray-800">{item.role}</p>
              </div>
              <p className="font-medium text-[#800000]">{item.salaryRange}</p>
            </CardContent>
            {index < data.length - 1 && (
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-sm md:block hidden">
                <ChevronRight className="h-5 w-5 text-[#800000]" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

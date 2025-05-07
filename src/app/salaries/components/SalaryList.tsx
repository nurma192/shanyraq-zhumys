// src/app/salaries/components/SalaryList.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "./SalaryList.module.scss";

interface SalaryListItem {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  salaryRange: {
    min: string;
    max: string;
    avg: string;
    count: number;
  };
  verified?: boolean;
}

interface SalaryListProps {
  data: SalaryListItem[];
}

export default function SalaryList({ data }: SalaryListProps) {
  const router = useRouter();

  const handleRowClick = (companyId: string) => {
    router.push(`/companies/${companyId}/salaries`);
  };

  // Helper to format the salary display based on range
  const formatSalaryDisplay = (item: SalaryListItem) => {
    const { min, max, count } = item.salaryRange;

    if (min === max) {
      return item.salaryRange.avg;
    }

    return (
      <div className="flex flex-col">
        <span>
          {min} - {max}
        </span>
        <span className="text-xs text-gray-500">
          В среднем: {item.salaryRange.avg}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.listContainer}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={styles.tableHead}>Компания</TableHead>
            <TableHead className={styles.tableHead}>Зарплата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className={`${styles.tableRow} cursor-pointer hover:bg-gray-50`}
              onClick={() => handleRowClick(item.companyId)}
            >
              <TableCell className={styles.companyCell}>
                <div className={styles.companyInfo}>
                  <div className={styles.companyLogo}>
                    <img
                      src={item.companyLogoUrl || "/placeholder.png"}
                      alt={item.companyName}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={styles.companyName}>{item.companyName}</p>
                      {item.salaryRange.count > 1 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 px-2 py-0 h-5 bg-gray-50"
                              >
                                <Users className="h-3 w-3" />
                                <span className="text-xs">
                                  {item.salaryRange.count}
                                </span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Количество записей: {item.salaryRange.count}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {item.verified && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200 text-xs flex items-center gap-1 mt-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Проверено</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className={styles.salaryCell}>
                <span className={styles.salaryText}>
                  {formatSalaryDisplay(item)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

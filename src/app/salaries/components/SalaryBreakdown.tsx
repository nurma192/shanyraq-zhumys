// src/app/salaries/components/SalaryBreakdown.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import styles from "./SalaryBreakdown.module.scss";

interface SalaryBreakdownProps {
  data: {
    basePay: {
      min: number;
      max: number;
    };
    additionalPay: {
      min: number;
      max: number;
    };
    totalEstimate: number;
  };
}

export default function SalaryBreakdown({ data }: SalaryBreakdownProps) {
  const formatK = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);
  };

  return (
    <Card className={styles.breakdownCard}>
      <CardContent className={styles.cardContent}>
        <h3 className={styles.title}>Структура оплаты</h3>

        <Separator className={styles.separator} />

        <div className={styles.breakdownItem}>
          <div className={styles.breakdownHeader}>
            <p className={styles.breakdownLabel}>Базовая оплата</p>
            <p className={styles.breakdownRange}>
              {formatK(data.basePay.min)} - {formatK(data.basePay.max)} ₸/год
            </p>
          </div>
          <div className="mt-2">
            <Progress value={100} className="h-2" />
          </div>
        </div>

        {data.additionalPay.max > 0 && (
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownHeader}>
              <p className={styles.breakdownLabel}>Дополнительная оплата</p>
              <p className={styles.breakdownRange}>
                {formatK(data.additionalPay.min)} -{" "}
                {formatK(data.additionalPay.max)} ₸/год
              </p>
            </div>
            <div className="mt-2">
              <Progress
                value={(data.additionalPay.max / data.basePay.max) * 100}
                className="h-2"
              />
            </div>
          </div>
        )}

        <div className={styles.additionalInfo}>
          <p className={styles.additionalText}>
            Дополнительная оплата может включать бонусы, комиссии, чаевые и
            участие в прибыли.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

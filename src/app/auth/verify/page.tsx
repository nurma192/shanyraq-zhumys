// src/app/auth/verify/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";

export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { verifyUserEmail, isLoading, error, resetAuth } = useAuth();

  useEffect(() => {
    // Get email from localStorage
    const email = sessionStorage.getItem("emailForVerification");
    if (email) {
      setEmailAddress(email);
    } else {
      // If no email in storage, redirect to register
      router.push("/auth/login");
    }

    return () => {
      resetAuth();
    };
  }, [router, resetAuth]);

  useEffect(() => {
    if (countdown > 0 && isResendDisabled) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [countdown, isResendDisabled]);

  const handleResendCode = () => {
    // In a real application, you would call an API endpoint to resend the code
    toast({
      title: "Код отправлен",
      description: "Новый код подтверждения был отправлен на ваш email",
    });
    setCountdown(60);
    setIsResendDisabled(true);
  };

  // Fix redirection after successful verification
  const handleSubmit = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите полный 6-значный код",
        variant: "destructive",
      });
      return;
    }

    if (!emailAddress) {
      toast({
        title: "Ошибка",
        description:
          "Email адрес не найден. Пожалуйста, зарегистрируйтесь снова.",
        variant: "destructive",
      });
      router.push("/auth/register");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyUserEmail({
        email: emailAddress,
        code: verificationCode,
      });

      toast({
        title: "Аккаунт подтвержден",
        description: "Ваш аккаунт успешно подтвержден",
      });

      // Clear email from storage
      sessionStorage.removeItem("emailForVerification");

      // Redirect to login
      router.push("/auth/login");
    } catch (err: any) {
      toast({
        title: "Ошибка",
        description:
          err.message || "Не удалось подтвердить аккаунт. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-[50px] px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-[#800000]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FiMail className="w-8 h-8 text-[#800000]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#800000]">
            Подтверждение аккаунта
          </CardTitle>
          <CardDescription>
            Мы отправили 6-значный код на ваш email. Введите его ниже для
            подтверждения аккаунта.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <React.Fragment key={index}>
                      {index === 3 && <InputOTPSeparator />}
                      <InputOTPSlot {...slot} />
                    </React.Fragment>
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={
              isLoading || isSubmitting || verificationCode.length !== 6
            }
            className="w-full bg-[#800000] hover:bg-[#660000]"
          >
            {isSubmitting || isLoading ? "Проверка..." : "Подтвердить аккаунт"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Не получили код?</p>
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className="text-[#800000] p-0 h-auto"
            >
              {isResendDisabled
                ? `Отправить повторно (${countdown}с)`
                : "Отправить повторно"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="text-gray-500" asChild>
            <Link href="/auth/login" className="flex items-center">
              <FiArrowLeft className="mr-2" /> Вернуться к авторизации
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

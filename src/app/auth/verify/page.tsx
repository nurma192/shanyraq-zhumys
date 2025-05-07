"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
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
    const email = sessionStorage.getItem("emailForVerification");
    if (email) {
      setEmailAddress(email);
    } else {
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
    toast({
      title: "Код отправлен",
      description: "Новый код подтверждения был отправлен на ваш email",
    });
    setCountdown(60);
    setIsResendDisabled(true);
  };

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
        description: "Email адрес не найден. Пожалуйста, зарегистрируйтесь снова.",
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

      sessionStorage.removeItem("emailForVerification");
      router.push("/auth/login");
    } catch (err: any) {
      toast({
        title: "Ошибка",
        description: err.message || "Не удалось подтвердить аккаунт. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex justify-center items-center py-12 px-4 bg-[#E6E6B0]/10">
      <Card className="w-full max-w-md border border-[#E6E6B0]/30 shadow-md bg-white">
        <CardHeader className="space-y-3 pb-6 border-b border-[#E6E6B0]/30 bg-[#E6E6B0]/20">
          <div className="mx-auto bg-[#628307]/10 w-20 h-20 rounded-full flex items-center justify-center mb-2">
            <FiMail className="w-10 h-10 text-[#628307]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#628307] text-center">Подтверждение аккаунта</CardTitle>
          <CardDescription className="text-[#1D1D1D]/70 text-center">
            Мы отправили 6-значный код на ваш email{emailAddress ? ` (${emailAddress})` : ""}. Введите его ниже для подтверждения аккаунта.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-8 flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, index) => (
                    <React.Fragment key={index}>
                      {index === 3 && <InputOTPSeparator />}
                      <InputOTPSlot {...slot} className="border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20 w-10 h-12 text-lg" />
                    </React.Fragment>
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          {error && <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md mb-4">{error}</div>}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting || verificationCode.length !== 6}
            className="w-full bg-[#628307] hover:bg-[#4D6706] text-white font-medium py-5"
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Проверка...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FiCheckCircle className="mr-2" />
                Подтвердить аккаунт
              </div>
            )}
          </Button>

          <div className="mt-6 p-4 bg-[#E6E6B0]/20 rounded-lg border border-[#E6E6B0]/30 text-center">
            <p className="text-sm text-[#1D1D1D]/70 mb-2">Не получили код?</p>
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className="text-[#628307] hover:text-[#4D6706] p-0 h-auto font-medium"
            >
              {isResendDisabled ? `Отправить повторно (${countdown}с)` : "Отправить повторно"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-[#E6E6B0]/30 pt-4">
          <Button variant="ghost" className="text-[#1D1D1D]/70 hover:text-[#628307] hover:bg-[#628307]/10" asChild>
            <Link href="/auth/login" className="flex items-center">
              <FiArrowLeft className="mr-2" /> Вернуться к авторизации
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

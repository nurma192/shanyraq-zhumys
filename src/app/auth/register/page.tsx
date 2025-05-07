"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Имя пользователя должно содержать минимум 3 символа",
      })
      .max(20, {
        message: "Имя пользователя должно содержать максимум 20 символов",
      })
      .regex(/^[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/, {
        message: "Имя пользователя должно начинаться с буквы и заканчиваться буквой или цифрой. Допустимы только буквы, цифры, точки и подчеркивания.",
      }),
    email: z.string().email({
      message: "Введите корректный email адрес",
    }),
    password: z
      .string()
      .min(8, {
        message: "Пароль должен содержать минимум 8 символов",
      })
      .regex(/[A-Z]/, {
        message: "Пароль должен содержать хотя бы одну заглавную букву (A-Z)",
      })
      .regex(/[a-z]/, {
        message: "Пароль должен содержать хотя бы одну строчную букву (a-z)",
      })
      .regex(/[0-9]/, {
        message: "Пароль должен содержать хотя бы одну цифру (0-9)",
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signupUser, isLoading, error, resetAuth } = useAuth();

  useEffect(() => {
    return () => {
      resetAuth();
    };
  }, [resetAuth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchPassword = form.watch("password");

  useEffect(() => {
    let strength = 0;
    if (watchPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(watchPassword)) strength += 1;
    if (/[a-z]/.test(watchPassword)) strength += 1;
    if (/[0-9]/.test(watchPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [watchPassword]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signupUser({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      toast({
        title: "Регистрация успешна",
        description: "Проверьте вашу почту для подтверждения аккаунта",
      });

      sessionStorage.setItem("emailForVerification", values.email);

      router.push("/auth/verify");
    } catch (err: any) {
      toast({
        title: "Ошибка регистрации",
        description: err.message || "Не удалось зарегистрироваться. Попробуйте снова.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex justify-center items-center py-12 px-4 bg-[#E6E6B0]/10">
      <Card className="w-full max-w-md border border-[#E6E6B0]/30 shadow-md bg-white">
        <CardHeader className="space-y-2 pb-6 border-b border-[#E6E6B0]/30 bg-[#E6E6B0]/20">
          <CardTitle className="text-2xl font-bold text-[#628307] text-center">Создание аккаунта</CardTitle>
          <CardDescription className="text-[#1D1D1D]/70 text-center">Введите данные для регистрации нового аккаунта</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1D] font-medium">Имя пользователя</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" />
                        <Input
                          className="pl-10 border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20"
                          placeholder="Введите имя пользователя"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-[#1D1D1D]/60">
                      Имя пользователя должно начинаться с буквы, содержать 3-20 символов. Допустимы буквы, цифры, точки и подчеркивания.
                    </FormDescription>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1D] font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" />
                        <Input
                          className="pl-10 border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20"
                          placeholder="Введите email адрес"
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1D] font-medium">Пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" />
                        <Input
                          className="pl-10 pr-10 border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20"
                          type={showPassword ? "text" : "password"}
                          placeholder="Введите пароль"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1D1D1D]/50 hover:text-[#628307]"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </FormControl>
                    <div className="mt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? "bg-red-500" : "bg-gray-200"}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? "bg-orange-500" : "bg-gray-200"}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? "bg-yellow-500" : "bg-gray-200"}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 4 ? "bg-[#628307]" : "bg-gray-200"}`}></div>
                      </div>
                    </div>
                    <FormDescription className="text-xs text-[#1D1D1D]/60">Пароль должен содержать минимум 8 символов, включая:</FormDescription>
                    <div className="mt-1 space-y-1 text-xs bg-[#E6E6B0]/20 p-3 rounded-md border border-[#E6E6B0]/30">
                      <div className={watchPassword.length >= 8 ? "text-[#628307] font-medium" : "text-[#1D1D1D]/60"}>• Минимум 8 символов</div>
                      <div className={/[A-Z]/.test(watchPassword) ? "text-[#628307] font-medium" : "text-[#1D1D1D]/60"}>
                        • Хотя бы одну заглавную букву (A-Z)
                      </div>
                      <div className={/[a-z]/.test(watchPassword) ? "text-[#628307] font-medium" : "text-[#1D1D1D]/60"}>
                        • Хотя бы одну строчную букву (a-z)
                      </div>
                      <div className={/[0-9]/.test(watchPassword) ? "text-[#628307] font-medium" : "text-[#1D1D1D]/60"}>• Хотя бы одну цифру (0-9)</div>
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1D] font-medium">Подтверждение пароля</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" />
                        <Input
                          className="pl-10 pr-10 border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Повторите пароль"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1D1D1D]/50 hover:text-[#628307]"
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="w-full bg-[#628307] hover:bg-[#4D6706] text-white font-medium py-5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Регистрация...
                  </div>
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-[#E6E6B0]/30 pt-4">
          <p className="text-center text-sm text-[#1D1D1D]/70">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-[#628307] hover:text-[#4D6706] font-medium">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

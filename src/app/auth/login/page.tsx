"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Имя пользователя не может быть пустым",
  }),
  password: z.string().min(1, {
    message: "Пароль не может быть пустым",
  }),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, isLoading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/companies");
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await loginUser({
        username: values.username,
        password: values.password,
      });
    } catch (err: any) {
      toast({
        title: "Ошибка входа",
        description: err.message || "Проверьте логин и пароль",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex justify-center items-center py-12 px-4 bg-[#E6E6B0]/10">
      <Card className="w-full max-w-md border border-[#E6E6B0]/30 shadow-md bg-white">
        <CardHeader className="space-y-2 pb-6 border-b border-[#E6E6B0]/30 bg-[#E6E6B0]/20">
          <CardTitle className="text-2xl font-bold text-[#628307] text-center">Добро пожаловать</CardTitle>
          <CardDescription className="text-[#1D1D1D]/70 text-center">Введите данные для входа в ваш аккаунт</CardDescription>
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
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {error && <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-100 rounded-md">{error}</div>}

              <Button type="submit" disabled={isLoading} className="w-full bg-[#628307] hover:bg-[#4D6706] text-white font-medium py-5">
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
                    Вход...
                  </div>
                ) : (
                  "Войти"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E6E6B0]/30" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#1D1D1D]/50">или</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col pt-0">
          <Button variant="outline" className="w-full border-[#628307] text-[#628307] hover:bg-[#628307]/10 mt-2 font-medium" asChild>
            <Link href="/auth/register">Создать аккаунт</Link>
          </Button>

          <div className="text-center mt-4 text-xs text-[#1D1D1D]/50">
            Нажимая "Войти", вы соглашаетесь с нашими условиями использования и политикой конфиденциальности
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

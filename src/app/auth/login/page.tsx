// Add router import and redirect after login
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
      // Redirection happens in the useEffect above when isAuthenticated changes
    } catch (err: any) {
      toast({
        title: "Ошибка входа",
        description: err.message || "Проверьте логин и пароль",
        variant: "destructive",
      });
    }
  };

  return (
    // Rest of the component remains the same
    <div className="flex justify-center items-center my-[50px] px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#800000]">
            Добро пожаловать
          </CardTitle>
          <CardDescription>
            Введите данные для входа в ваш аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10"
                          placeholder="Введите имя пользователя"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="Введите пароль"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#800000] hover:bg-[#660000]"
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">или</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            variant="outline"
            className="w-full border-[#800000] text-[#800000] hover:bg-[#800000]/5 mt-2"
            asChild
          >
            <Link href="/auth/register">Создать аккаунт</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

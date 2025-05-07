"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { User, FileText, DollarSign, PlusCircle, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { clearProfileData } from "@/features/profile/profileSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { clearAuth } from "@/features/auth/authSlice";

// Track initialization to prevent multiple calls
let hasCheckedAuth = false;

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, logoutUser, initAuth } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.role === "ROLE_ADMIN";

  // Redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Only run auth check once
      if (!hasCheckedAuth) {
        hasCheckedAuth = true;
        await initAuth();
      }

      // Short timeout to allow auth state to stabilize
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        if (!isAuthenticated) {
          router.push("/auth/login");
        }
      }, 100);

      return () => clearTimeout(timer);
    };

    checkAuth();
  }, [isAuthenticated, router, initAuth]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      hasCheckedAuth = false;
    };
  }, []);

  const menuItems = [
    {
      label: "Мой профиль",
      href: "/profile",
      icon: <User size={20} />,
      active: pathname === "/profile",
    },
    {
      label: isAdmin ? "Модерация отзывов" : "Мои отзывы",
      href: "/profile/reviews",
      icon: <FileText size={20} />,
      active: pathname === "/profile/reviews",
    },
    {
      label: isAdmin ? "Модерация зарплат" : "Мои зарплаты",
      href: "/profile/salaries",
      icon: <DollarSign size={20} />,
      active: pathname === "/profile/salaries",
    },
    {
      label: "Добавить контент",
      href: "/profile/add",
      icon: <PlusCircle size={20} />,
      active: pathname?.includes("/profile/add"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearProfileData());
      dispatch(clearAuth());
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
      // Force page refresh after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при выходе из системы",
        variant: "destructive",
      });
    }
  };

  const renderMenuItems = () => (
    <nav className="space-y-1 mt-4">
      {menuItems.map(item => (
        <Link key={item.href} href={item.href} className="block">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal mb-1",
              item.active ? "bg-[#628307]/10 text-[#628307] font-medium" : "text-[#1D1D1D]/70 hover:bg-[#628307]/5 hover:text-[#628307]"
            )}
          >
            <span className="mr-2 text-[#628307]">{item.icon}</span>
            {item.label}
          </Button>
        </Link>
      ))}

      <Separator className="my-4 bg-[#628307]/10" />

      <Button
        variant="ghost"
        className="w-full justify-start text-left font-normal text-[#1D1D1D]/70 hover:bg-[#628307]/5 hover:text-[#628307]"
        onClick={handleLogout}
      >
        <LogOut size={20} className="mr-2 text-[#628307]" />
        Выйти
      </Button>
    </nav>
  );

  // Show loading or redirect if not authenticated
  if (isPageLoading || isLoading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#628307] mb-4" />
            <p className="text-[#1D1D1D]/70">Загрузка профиля...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Desktop sidebar - Only shown when authenticated */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-lg border border-[#E6E6B0] shadow-sm">
            <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#628307]/5 to-transparent">
              <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                <AvatarImage src="/images/avatar-placeholder.jpg" alt="аватар" />
                <AvatarFallback className="bg-[#E6E6B0] text-[#1D1D1D]">{user?.username ? user.username.substring(0, 2).toUpperCase() : "ИИ"}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-medium text-[#1D1D1D]">{user?.username || <span className="text-[#1D1D1D]/50 italic">Имя не указано</span>}</h3>
                <p className="text-sm text-[#628307] font-medium">{user?.role === "ROLE_ADMIN" ? "Администратор" : "Пользователь"}</p>
              </div>
            </div>
            <Separator className="bg-[#E6E6B0]" />
            <div className="p-4">{renderMenuItems()}</div>
          </div>
        </aside>

        {/* Mobile navigation - Only visible on small screens */}
        <div className="lg:hidden mb-6 bg-white rounded-lg border border-[#E6E6B0] shadow-sm p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-[#E6E6B0]">
              <AvatarImage src="/images/avatar-placeholder.jpg" alt="аватар" />
              <AvatarFallback className="bg-[#E6E6B0] text-[#1D1D1D]">{user?.username ? user.username.substring(0, 2).toUpperCase() : "ИИ"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-[#1D1D1D]">{user?.username || <span className="text-[#1D1D1D]/50 italic">Имя не указано</span>}</h3>
              <p className="text-xs text-[#628307] font-medium">{user?.role === "ROLE_ADMIN" ? "Администратор" : "Пользователь"}</p>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2">
            {menuItems.map(item => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "whitespace-nowrap",
                    item.active
                      ? "bg-[#628307] hover:bg-[#4D6706] text-white"
                      : "border-[#E6E6B0] text-[#1D1D1D]/70 hover:bg-[#628307]/5 hover:text-[#628307] hover:border-[#628307]"
                  )}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap border-[#E6E6B0] text-[#1D1D1D]/70 hover:bg-[#628307]/5 hover:text-[#628307] hover:border-[#628307]"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Main content */}
        <main className="overflow-auto bg-white rounded-lg border border-[#E6E6B0] shadow-sm p-6">{children}</main>
      </div>
    </Container>
  );
}

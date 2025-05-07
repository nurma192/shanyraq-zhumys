"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, User, Menu, ChevronDown, FileText, DollarSign, LogOut, Building, BarChart2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import searchAPI from "@/services/searchAPI";

interface CompanySearchResult {
  id: string;
  name: string;
  logoUrl?: string;
}

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logoutUser } = useAuth();
  const pathname = usePathname();
  const { updateFilters } = useCompany();

  const isAdmin = user?.role === "ROLE_ADMIN";

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    if (path === "/companies") {
      return pathname === "/companies" || pathname?.startsWith("/companies/");
    }
    return pathname === path;
  };

  const closeDrawer = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      closeDrawer();
      window.location.href = "/companies";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setNoResultsFound(false);

    if (value.trim().length > 0) {
      setIsSearchLoading(true);
      try {
        const response = await searchAPI.searchCompanies(value);

        if (response.data && response.data.content && response.data.content.length > 0) {
          setSearchResults(response.data.content);
          setShowResults(true);
          setNoResultsFound(false);
        } else {
          setSearchResults([]);
          setShowResults(true);
          setNoResultsFound(true);
        }
      } catch (error) {
        console.error("Error searching companies:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearchLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      updateFilters({ search: searchValue.trim() });
      router.push("/companies");
      closeDrawer();
      setShowResults(false);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    router.push(`/companies/${companyId}`);
    setSearchValue("");
    setShowResults(false);
    closeDrawer();
  };

  return (
    <header className="bg-white border-b border-[#E6E6B0]/30 py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative">
          <Link href="/" className="text-2xl font-bold text-[#628307] mr-4 flex-shrink-0" onClick={closeDrawer}>
            Shanyraq Zhumys
          </Link>

          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D1D1D]/70" size={18} />
              <Input
                type="text"
                placeholder="Поиск по компаниям"
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-10 h-10 border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20"
              />

              {isSearchLoading && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#1D1D1D]/50" />
                </div>
              )}

              {showResults && (
                <div
                  className="absolute top-full left-0 w-full bg-white border border-[#E6E6B0]/30 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto"
                  ref={searchResultsRef}
                >
                  {noResultsFound ? (
                    <div className="px-4 py-3 text-[#1D1D1D]/70">Компания с названием "{searchValue}" не найдена</div>
                  ) : (
                    searchResults.map(company => (
                      <div
                        key={company.id}
                        className="px-4 py-2 hover:bg-[#E6E6B0]/20 cursor-pointer flex items-center"
                        onClick={() => handleCompanySelect(company.id)}
                      >
                        {company.logoUrl && <img src={company.logoUrl || "/placeholder.svg"} alt={company.name} className="w-6 h-6 mr-2 object-contain" />}
                        <span className="text-[#1D1D1D]">{company.name}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/companies"
              className={`text-[#1D1D1D] font-medium hover:text-[#628307] transition-colors relative ${
                isActive("/companies") ? "text-[#628307] font-semibold" : ""
              }`}
            >
              {isActive("/companies") && <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#628307]"></span>}
              Компании
            </Link>
            <Link
              href="/salaries"
              className={`text-[#1D1D1D] font-medium hover:text-[#628307] transition-colors relative ${
                isActive("/salaries") ? "text-[#628307] font-semibold" : ""
              }`}
            >
              {isActive("/salaries") && <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#628307]"></span>}
              Зарплаты
            </Link>

            {mounted && (
              <>
                {isAuthenticated ? (
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#628307]/10 text-[#1D1D1D] font-medium">
                        <User size={18} className="text-[#628307]" />
                        <span>Профиль</span>
                        <ChevronDown size={16} className="transition-transform duration-200 data-[state=open]:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 p-3 bg-white border border-[#E6E6B0]/30">
                        <DropdownMenuItem className="p-3 cursor-default focus:bg-transparent">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-[#1D1D1D]">{user?.username}</span>
                            <span className="text-xs text-[#1D1D1D]/70">{user?.email}</span>
                            <span className="text-xs px-2 py-0.5 bg-[#628307]/10 text-[#628307] rounded-full w-fit mt-1">
                              {user?.role === "ROLE_ADMIN" ? "Администратор" : "Пользователь"}
                            </span>
                          </div>
                        </DropdownMenuItem>

                        <div className="h-px bg-[#E6E6B0]/30 my-2"></div>

                        <Link href="/profile">
                          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#628307]/10 cursor-pointer text-[#1D1D1D] focus:bg-[#628307]/10 focus:text-[#1D1D1D]">
                            <User size={16} className="text-[#628307]" />
                            Мой профиль
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/profile/reviews">
                          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#628307]/10 cursor-pointer text-[#1D1D1D] focus:bg-[#628307]/10 focus:text-[#1D1D1D]">
                            <FileText size={16} className="text-[#628307]" />
                            {isAdmin ? "Модерация отзывов" : "Мои отзывы"}
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/profile/salaries">
                          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#628307]/10 cursor-pointer text-[#1D1D1D] focus:bg-[#628307]/10 focus:text-[#1D1D1D]">
                            <DollarSign size={16} className="text-[#628307]" />
                            {isAdmin ? "Модерация зарплат" : "Мои зарплаты"}
                          </DropdownMenuItem>
                        </Link>

                        <div className="h-px bg-[#E6E6B0]/30 my-2"></div>

                        <Link href="/profile/add">
                          <Button className="w-full bg-[#628307] hover:bg-[#4D6706] text-white">Оставить отзыв</Button>
                        </Link>

                        <div className="h-px bg-[#E6E6B0]/30 my-2"></div>

                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <LogOut size={16} />
                          Выйти
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" className="text-[#1D1D1D] hover:text-[#628307] hover:bg-[#628307]/10">
                        Войти
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="bg-[#628307] hover:bg-[#4D6706] text-white">Регистрация</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-[#628307]/10 text-[#1D1D1D]" onClick={toggleMenu}>
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r border-[#E6E6B0]/30 w-[280px]">
                <SheetHeader className="p-4 border-b border-[#E6E6B0]/30">
                  <SheetTitle className="text-2xl font-bold text-[#628307]">iWork</SheetTitle>
                </SheetHeader>

                <div className="p-4">
                  <form onSubmit={handleSearchSubmit} className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D1D1D]/70" size={18} />
                    <Input
                      type="text"
                      placeholder="Поиск по компаниям"
                      value={searchValue}
                      onChange={handleSearchChange}
                      className="pl-10 h-10 border-[#E6E6B0] focus:border-[#628307] focus:ring-[#628307]/20"
                    />
                    {isSearchLoading && (
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#1D1D1D]/50" />
                      </div>
                    )}
                  </form>

                  <div className="space-y-1 mb-6">
                    <Link
                      href="/companies"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${
                        isActive("/companies")
                          ? "bg-[#628307]/10 text-[#628307] font-semibold border-l-2 border-[#628307] pl-[10px]"
                          : "text-[#1D1D1D] hover:bg-[#E6E6B0]/20"
                      }`}
                      onClick={closeDrawer}
                    >
                      <Building size={20} />
                      <span>Компании</span>
                    </Link>
                    <Link
                      href="/salaries"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${
                        isActive("/salaries")
                          ? "bg-[#628307]/10 text-[#628307] font-semibold border-l-2 border-[#628307] pl-[10px]"
                          : "text-[#1D1D1D] hover:bg-[#E6E6B0]/20"
                      }`}
                      onClick={closeDrawer}
                    >
                      <BarChart2 size={20} />
                      <span>Зарплаты</span>
                    </Link>
                  </div>

                  <div className="h-px bg-[#E6E6B0]/30 my-4"></div>

                  {mounted && isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-[#628307]/10 rounded-md">
                        <div className="w-10 h-10 rounded-full bg-[#628307] text-white flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#1D1D1D]">{user?.username}</div>
                          <div className="text-xs text-[#1D1D1D]/70">{user?.email}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${
                            isActive("/profile")
                              ? "bg-[#628307]/10 text-[#628307] font-semibold border-l-2 border-[#628307] pl-[10px]"
                              : "text-[#1D1D1D] hover:bg-[#E6E6B0]/20"
                          }`}
                          onClick={closeDrawer}
                        >
                          <User size={20} />
                          <span>Мой профиль</span>
                        </Link>
                        <Link
                          href="/profile/reviews"
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${
                            isActive("/profile/reviews")
                              ? "bg-[#628307]/10 text-[#628307] font-semibold border-l-2 border-[#628307] pl-[10px]"
                              : "text-[#1D1D1D] hover:bg-[#E6E6B0]/20"
                          }`}
                          onClick={closeDrawer}
                        >
                          <FileText size={20} />
                          <span>{isAdmin ? "Модерация отзывов" : "Мои отзывы"}</span>
                        </Link>
                        <Link
                          href="/profile/salaries"
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${
                            isActive("/profile/salaries")
                              ? "bg-[#628307]/10 text-[#628307] font-semibold border-l-2 border-[#628307] pl-[10px]"
                              : "text-[#1D1D1D] hover:bg-[#E6E6B0]/20"
                          }`}
                          onClick={closeDrawer}
                        >
                          <DollarSign size={20} />
                          <span>{isAdmin ? "Модерация зарплат" : "Мои зарплаты"}</span>
                        </Link>
                      </div>

                      <Link href="/profile/add" onClick={closeDrawer}>
                        <Button className="w-full bg-[#628307] hover:bg-[#4D6706] text-white">Оставить отзыв</Button>
                      </Link>

                      <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-4" onClick={handleLogout}>
                        <LogOut size={18} className="mr-2" />
                        <span>Выйти</span>
                      </Button>
                    </div>
                  ) : (
                    mounted && (
                      <div className="space-y-3">
                        <Link href="/auth/login" onClick={closeDrawer}>
                          <Button variant="outline" className="w-full border-[#628307] text-[#628307] hover:bg-[#628307]/10">
                            Войти
                          </Button>
                        </Link>
                        <Link href="/auth/register" onClick={closeDrawer}>
                          <Button className="w-full bg-[#628307] hover:bg-[#4D6706] text-white">Регистрация</Button>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

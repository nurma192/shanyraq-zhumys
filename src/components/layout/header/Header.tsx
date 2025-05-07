"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  User,
  Menu,
  ChevronDown,
  FileText,
  DollarSign,
  LogOut,
  Building,
  BarChart2,
  Loader2,
} from "lucide-react";
import styles from "./Header.module.scss";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import searchAPI from "@/services/searchAPI";

// Define interface for company search results
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
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
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

        if (
          response.data &&
          response.data.content &&
          response.data.content.length > 0
        ) {
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
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo} onClick={closeDrawer}>
            iWork
          </Link>

          <div className={styles.searchBar}>
            <form
              onSubmit={handleSearchSubmit}
              className={styles.searchWrapper}
            >
              <Search className={styles.searchIcon} size={18} />
              <Input
                type="text"
                placeholder="Поиск по компаниям"
                value={searchValue}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />

              {isSearchLoading && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}

              {showResults && (
                <div
                  className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto"
                  ref={searchResultsRef}
                >
                  {noResultsFound ? (
                    <div className="px-4 py-3 text-gray-500">
                      Компания с названием "{searchValue}" не найдена
                    </div>
                  ) : (
                    searchResults.map((company) => (
                      <div
                        key={company.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleCompanySelect(company.id)}
                      >
                        {company.logoUrl && (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="w-6 h-6 mr-2 object-contain"
                          />
                        )}
                        <span>{company.name}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
            <Link
              href="/companies"
              className={`${styles.navLink} ${
                isActive("/companies") ? styles.activeLink : ""
              }`}
            >
              Компании
            </Link>
            <Link
              href="/salaries"
              className={`${styles.navLink} ${
                isActive("/salaries") ? styles.activeLink : ""
              }`}
            >
              Зарплаты
            </Link>

            {mounted && (
              <>
                {isAuthenticated ? (
                  <div className={styles.profileSection}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={styles.profileTrigger}>
                        <User size={18} className={styles.navIcon} />
                        <span>Профиль</span>
                        <ChevronDown size={16} className={styles.chevron} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={styles.profileDropdown}>
                        <DropdownMenuItem className={styles.profileItem}>
                          <div className={styles.profileInfo}>
                            <span className={styles.userName}>
                              {user?.username}
                            </span>
                            <span className={styles.userEmail}>
                              {user?.email}
                            </span>
                            <span className={styles.userRole}>
                              {user?.role === "ROLE_ADMIN"
                                ? "Администратор"
                                : "Пользователь"}
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <Link href="/profile" className={styles.profileLink}>
                          <DropdownMenuItem>
                            <User size={16} className={styles.menuIcon} />
                            Мой профиль
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          href="/profile/reviews"
                          className={styles.profileLink}
                        >
                          <DropdownMenuItem>
                            <FileText size={16} className={styles.menuIcon} />
                            {isAdmin ? "Модерация отзывов" : "Мои отзывы"}
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          href="/profile/salaries"
                          className={styles.profileLink}
                        >
                          <DropdownMenuItem>
                            <DollarSign size={16} className={styles.menuIcon} />
                            {isAdmin ? "Модерация зарплат" : "Мои зарплаты"}
                          </DropdownMenuItem>
                        </Link>
                        <div className={styles.dropdownDivider}></div>
                        <Link href="/profile/add">
                          <Button size="sm" className={styles.reviewButton}>
                            Оставить отзыв
                          </Button>
                        </Link>
                        <div className={styles.dropdownDivider}></div>
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className={styles.logoutItem}
                        >
                          <LogOut size={16} className={styles.menuIcon} />
                          Выйти
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className={styles.authButtons}>
                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.loginButton}
                      >
                        Войти
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm" className={styles.registerButton}>
                        Регистрация
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          <div className={styles.mobileNav}>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className={styles.menuToggle} onClick={toggleMenu}>
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className={styles.mobileMenu}>
                <SheetHeader className={styles.mobileMenuHeader}>
                  <SheetTitle className={styles.mobileLogo}>iWork</SheetTitle>
                </SheetHeader>

                <div className={styles.mobileMenuContent}>
                  <div className={styles.mobileMenuPrimary}>
                    <Link
                      href="/companies"
                      className={`${styles.mobileMenuItem} ${
                        isActive("/companies")
                          ? styles.mobileMenuItemActive
                          : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <Building size={20} />
                      <span>Компании</span>
                    </Link>
                    <Link
                      href="/salaries"
                      className={`${styles.mobileMenuItem} ${
                        isActive("/salaries") ? styles.mobileMenuItemActive : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <BarChart2 size={20} />
                      <span>Зарплаты</span>
                    </Link>
                  </div>

                  <div className={styles.mobileMenuDivider}></div>

                  {mounted && isAuthenticated ? (
                    <div className={styles.mobileMenuSecondary}>
                      <div className={styles.mobileProfileInfo}>
                        <User size={24} className={styles.mobileProfileIcon} />
                        <div>
                          <div className={styles.mobileUserName}>
                            {user?.username}
                          </div>
                          <div className={styles.mobileUserEmail}>
                            {user?.email}
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className={`${styles.mobileMenuItem} ${
                          isActive("/profile")
                            ? styles.mobileMenuItemActive
                            : ""
                        }`}
                        onClick={closeDrawer}
                      >
                        <User size={20} />
                        <span>Мой профиль</span>
                      </Link>
                      <Link
                        href="/profile/reviews"
                        className={`${styles.mobileMenuItem} ${
                          isActive("/profile/reviews")
                            ? styles.mobileMenuItemActive
                            : ""
                        }`}
                        onClick={closeDrawer}
                      >
                        <FileText size={20} />
                        <span>
                          {isAdmin ? "Модерация отзывов" : "Мои отзывы"}
                        </span>
                      </Link>
                      <Link
                        href="/profile/salaries"
                        className={`${styles.mobileMenuItem} ${
                          isActive("/profile/salaries")
                            ? styles.mobileMenuItemActive
                            : ""
                        }`}
                        onClick={closeDrawer}
                      >
                        <DollarSign size={20} />
                        <span>
                          {isAdmin ? "Модерация зарплат" : "Мои зарплаты"}
                        </span>
                      </Link>

                      <Link href="/profile/add" onClick={closeDrawer}>
                        <Button className={styles.mobileAddButton}>
                          Оставить отзыв
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        className={styles.mobileLogoutButton}
                        onClick={handleLogout}
                      >
                        <LogOut size={18} />
                        <span>Выйти</span>
                      </Button>
                    </div>
                  ) : (
                    mounted && (
                      <div className={styles.mobileAuthButtons}>
                        <Link href="/auth/login" onClick={closeDrawer}>
                          <Button
                            variant="outline"
                            className={styles.mobileLoginButton}
                          >
                            Войти
                          </Button>
                        </Link>
                        <Link href="/auth/register" onClick={closeDrawer}>
                          <Button className={styles.mobileRegisterButton}>
                            Регистрация
                          </Button>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
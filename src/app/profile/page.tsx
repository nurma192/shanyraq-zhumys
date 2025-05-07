"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Edit,
  ArrowRight,
  KeyRound,
  User,
  Briefcase,
  Building,
  MapPin,
  Phone,
  EyeOff,
  Eye,
  Loader2,
  Mail,
  Calendar,
  Shield,
  Star,
  DollarSign,
  FileText,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/services/apiClient";
import debounce from "lodash/debounce";

export default function ProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState<any[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const { toast } = useToast();

  const { user, isAuthenticated } = useAuth();
  const { data: profileData, isLoading: profileLoading, error: profileError, fetchProfile, updateUserProfile, changePassword, fetchedOnce } = useProfile();

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated && !fetchedOnce) {
        try {
          await fetchProfile();
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Ошибка загрузки профиля",
            description: "Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.",
            variant: "destructive",
          });
        }
      }
    };

    loadProfile();
  }, [isAuthenticated, fetchedOnce]);

  // Create debounced fetch functions for jobs and locations
  const fetchJobs = useMemo(
    () =>
      debounce(async (search: string) => {
        if (!search) return;

        setIsLoadingJobs(true);
        // Close location suggestions when jobs suggestions are opened
        setLocationSuggestions([]);

        try {
          const response = await apiClient.get(`/jobs?search=${search}`);
          if (response.data && response.data.data) {
            setJobSuggestions(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
        } finally {
          setIsLoadingJobs(false);
        }
      }, 300),
    []
  );

  const fetchLocations = useMemo(
    () =>
      debounce(async (search: string) => {
        if (!search) return;

        setIsLoadingLocations(true);
        // Close job suggestions when location suggestions are opened
        setJobSuggestions([]);

        try {
          const response = await apiClient.get(`/locations?search=${search}`);
          if (response.data && response.data.data) {
            setLocationSuggestions(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoadingLocations(false);
        }
      }, 300),
    []
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      fetchJobs.cancel();
      fetchLocations.cancel();
    };
  }, [fetchJobs, fetchLocations]);

  // Use profile data if available, otherwise fall back to auth user data
  const userData = {
    name: profileData?.username || user?.username || "",
    jobTitle: profileData?.jobTitle || user?.jobTitle || "",
    location: profileData?.location || user?.location || "",
    email: profileData?.email || user?.email || "",
    phone: profileData?.phone || user?.phone || "",
    joinDate: profileData?.withUsSince || user?.withUsSince || "",
    company: profileData?.company || user?.company || "",
    reviewCount: profileData?.reviewsCount || user?.reviewsCount || 0,
    salaryCount: profileData?.salaryCount || user?.salaryCount || 0,
    role: profileData?.role || user?.role || "ROLE_USER",
  };

  // Phone validation for +7XXXXXXXXXX format
  const phoneRegex = /^\+7\d{10}$/;

  const profileFormSchema = z.object({
    name: z.string().min(2, {
      message: "Имя должно содержать минимум 2 символа",
    }),
    jobTitle: z.string().min(2, {
      message: "Должность должна содержать минимум 2 символа",
    }),
    company: z.string(),
    location: z.string(),
    phone: z.string().regex(phoneRegex, {
      message: "Номер телефона должен быть в формате +7XXXXXXXXXX",
    }),
  });

  const passwordFormSchema = z
    .object({
      oldPassword: z.string().min(8, {
        message: "Пароль должен содержать минимум 8 символов",
      }),
      newPassword: z.string().min(8, {
        message: "Пароль должен содержать минимум 8 символов",
      }),
      confirmPassword: z.string().min(8, {
        message: "Пароль должен содержать минимум 8 символов",
      }),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: "Пароли не совпадают",
      path: ["confirmPassword"],
    });

  // Initialize form with userData
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      jobTitle: userData.jobTitle,
      company: userData.company,
      location: userData.location,
      phone: userData.phone,
    },
  });

  // Update form values when profile data changes
  useEffect(() => {
    if (profileData) {
      profileForm.reset({
        name: profileData.username || userData.name,
        jobTitle: profileData.jobTitle || userData.jobTitle,
        company: profileData.company || userData.company,
        location: profileData.location || userData.location,
        phone: profileData.phone || userData.phone,
      });
    } else if (user) {
      profileForm.reset({
        name: user.username || userData.name,
        jobTitle: user.jobTitle || userData.jobTitle,
        company: user.company || userData.company,
        location: user.location || userData.location,
        phone: user.phone || userData.phone,
      });
    }
  }, [profileData, user]);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    // Validate that job and location were selected from the list
    if (!selectedJobId) {
      toast({
        title: "Ошибка",
        description: "Необходимо выбрать должность из предложенного списка",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocationId) {
      toast({
        title: "Ошибка",
        description: "Необходимо выбрать локацию из предложенного списка",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({
        username: values.name,
        jobTitle: values.jobTitle,
        jobId: selectedJobId,
        locationId: selectedLocationId,
        company: values.company,
        location: values.location,
        phone: values.phone,
      });

      toast({
        title: "Профиль обновлен",
        description: "Данные профиля успешно обновлены",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true);
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: "",
        currentPassword: "",
      });

      toast({
        title: "Пароль изменен",
        description: "Ваш пароль успешно изменен",
      });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle job selection
  const handleJobSelect = (job: any) => {
    profileForm.setValue("jobTitle", job.title);
    setSelectedJobId(job.id);
    setJobSuggestions([]);
  };

  // Handle location selection
  const handleLocationSelect = (location: any) => {
    profileForm.setValue("location", location.locationValue);
    setSelectedLocationId(location.id);
    setLocationSuggestions([]);
  };

  // Handle dialog open to reset suggestions
  const handleEditDialogOpen = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setJobSuggestions([]);
      setLocationSuggestions([]);
    }
  };

  // Determine user role for display
  const roleDisplayText = userData.role === "ROLE_ADMIN" ? "Администратор" : "Пользователь";

  // Helper function to display fields that might be empty
  const displayField = (value: string) => {
    if (!value) {
      return <span className="text-[#1D1D1D]/50 italic">Не указано</span>;
    }
    return <span className="text-[#1D1D1D]">{value}</span>;
  };

  // Format phone number input to ensure +7 prefix
  const formatPhoneNumber = (value: string) => {
    if (!value) return "";

    // If it doesn't start with +7, add it
    if (!value.startsWith("+7")) {
      return "+7";
    }

    // Remove any non-digit characters after +7
    const digitsOnly = value.slice(2).replace(/\D/g, "");

    // Ensure we only have up to 10 digits after +7
    const truncated = digitsOnly.slice(0, 10);

    return "+7" + truncated;
  };

  return (
    <div className="space-y-8">
      {/* Profile Header with Avatar */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#628307] to-[#4D6706] p-6 rounded-lg text-white">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarImage src="/images/avatar-placeholder.jpg" alt="аватар" />
          <AvatarFallback className="bg-[#E6E6B0] text-[#1D1D1D] text-xl">{userData.name ? userData.name.substring(0, 2).toUpperCase() : "ИИ"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold mb-1">{userData.name || <span className="italic opacity-70">Имя не указано</span>}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            <Badge className="bg-white/20 hover:bg-white/30 text-white">{roleDisplayText}</Badge>
            {userData.jobTitle && <Badge className="bg-[#E6E6B0]/20 hover:bg-[#E6E6B0]/30 text-white">{userData.jobTitle}</Badge>}
          </div>
          <p className="text-white/80">
            {userData.company && userData.location
              ? `${userData.company}, ${userData.location}`
              : userData.company || userData.location || "Информация о компании и местоположении не указана"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-white text-[#628307] hover:bg-[#E6E6B0] hover:text-[#4D6706] flex items-center gap-2"
                disabled={profileLoading}
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#628307]">Редактировать профиль</DialogTitle>
                <DialogDescription>Внесите изменения в профиль и нажмите сохранить, когда закончите.</DialogDescription>
              </DialogHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пользователь</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input {...field} className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Должность</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input
                              {...field}
                              className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                              onChange={e => {
                                field.onChange(e);
                                fetchJobs(e.target.value);
                                setSelectedJobId(null);
                              }}
                            />
                            {isLoadingJobs && <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-[#628307]" />}
                            {jobSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-[#E6E6B0] rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                {jobSuggestions.map(job => (
                                  <div key={job.id} className="px-4 py-2 cursor-pointer hover:bg-[#E6E6B0]/20" onClick={() => handleJobSelect(job)}>
                                    {job.title}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-[#1D1D1D]/70">Выберите должность из списка</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Компания</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input {...field} className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Локация</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input
                              {...field}
                              className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                              onChange={e => {
                                field.onChange(e);
                                fetchLocations(e.target.value);
                                setSelectedLocationId(null);
                              }}
                            />
                            {isLoadingLocations && (
                              <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-[#628307]" />
                            )}
                            {locationSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-[#E6E6B0] rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                {locationSuggestions.map(location => (
                                  <div
                                    key={location.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-[#E6E6B0]/20"
                                    onClick={() => handleLocationSelect(location)}
                                  >
                                    {location.locationValue}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-[#1D1D1D]/70">Выберите локацию из списка</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input
                              {...field}
                              className="pl-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                              value={formatPhoneNumber(field.value)}
                              onChange={e => {
                                const formatted = formatPhoneNumber(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-[#1D1D1D]/70">Формат: +7XXXXXXXXXX (введите только цифры после +7)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading} className="bg-[#628307] hover:bg-[#4D6706] text-white">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        "Сохранить"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-white/80 text-[#628307] hover:bg-[#E6E6B0] hover:text-[#4D6706] flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Сменить пароль
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#628307]">Сменить пароль</DialogTitle>
                <DialogDescription>Введите текущий и новый пароль для смены.</DialogDescription>
              </DialogHeader>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Текущий пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              {...field}
                              className="pl-10 pr-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#1D1D1D]/50 hover:text-[#628307]"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Новый пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              {...field}
                              className="pl-10 pr-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#1D1D1D]/50 hover:text-[#628307]"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#628307]" size={16} />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                              className="pl-10 pr-10 border-[#E6E6B0] focus-visible:ring-[#628307]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#1D1D1D]/50 hover:text-[#628307]"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading} className="bg-[#628307] hover:bg-[#4D6706] text-white">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        "Сохранить"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <Card className="border border-[#E6E6B0] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#628307] flex items-center gap-2">
              <User className="h-5 w-5" />
              Основная информация
            </CardTitle>
            <Separator className="bg-[#E6E6B0]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Роль</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <Shield className="h-4 w-4 text-[#628307]" />
                  <span className="text-[#1D1D1D]">{roleDisplayText}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Пользователь</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <User className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.name)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Должность</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.jobTitle)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Компания</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <Building className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.company)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Локация</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.location)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card className="border border-[#E6E6B0] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#628307] flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Контактная информация
            </CardTitle>
            <Separator className="bg-[#E6E6B0]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Email</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <Mail className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.email)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">Телефон</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <Phone className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.phone)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <span className="text-sm font-medium text-[#1D1D1D]/70">С нами с</span>
                <span className="sm:col-span-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-[#628307]" />
                  {displayField(userData.joinDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Contribution Card */}
      <Card className="border border-[#E6E6B0] shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#628307] flex items-center gap-2">
            <Star className="h-5 w-5" />
            Ваш вклад в сообщество
          </CardTitle>
          <Separator className="bg-[#E6E6B0]" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#E6E6B0]/10 rounded-lg p-6 border border-[#E6E6B0]/30 flex flex-col items-center text-center">
              <div className="bg-[#628307]/10 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-[#628307]" />
              </div>
              <span className="text-3xl font-bold text-[#628307] mb-2">{userData.reviewCount}</span>
              <span className="text-[#1D1D1D]/70 mb-4">Отзывов о компаниях</span>
              <Button variant="outline" className="border-[#628307] text-[#628307] hover:bg-[#628307]/10 hover:text-[#628307]" asChild>
                <a href="/profile/reviews" className="flex items-center gap-1">
                  Просмотреть
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="bg-[#E6E6B0]/10 rounded-lg p-6 border border-[#E6E6B0]/30 flex flex-col items-center text-center">
              <div className="bg-[#628307]/10 p-3 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-[#628307]" />
              </div>
              <span className="text-3xl font-bold text-[#628307] mb-2">{userData.salaryCount}</span>
              <span className="text-[#1D1D1D]/70 mb-4">Записей о зарплатах</span>
              <Button variant="outline" className="border-[#628307] text-[#628307] hover:bg-[#628307]/10 hover:text-[#628307]" asChild>
                <a href="/profile/salaries" className="flex items-center gap-1">
                  Просмотреть
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

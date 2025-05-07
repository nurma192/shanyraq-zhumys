"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const { toast } = useToast();

  const { user, isAuthenticated } = useAuth();
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    fetchProfile,
    updateUserProfile,
    changePassword,
    fetchedOnce,
  } = useProfile();

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
            description:
              "Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.",
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
    .refine((data) => data.newPassword === data.confirmPassword, {
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
        confirmPassword:"",
        currentPassword:""
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
  const roleDisplayText =
    userData.role === "ROLE_ADMIN" ? "Администратор" : "Пользователь";

  // Helper function to display fields that might be empty
  const displayField = (value: string) => {
    if (!value) {
      return <span className="text-gray-400 italic">Не указано</span>;
    }
    return <span className="text-slate-900">{value}</span>;
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Мой профиль</h1>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled={profileLoading}
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle>Редактировать профиль</DialogTitle>
                <DialogDescription>
                  Внесите изменения в профиль и нажмите сохранить, когда
                  закончите.
                </DialogDescription>
              </DialogHeader>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пользователь</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input {...field} className="pl-10" />
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
                            <Briefcase
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input
                              {...field}
                              className="pl-10"
                              onChange={(e) => {
                                field.onChange(e);
                                fetchJobs(e.target.value);
                                setSelectedJobId(null);
                              }}
                            />
                            {isLoadingJobs && (
                              <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2" />
                            )}
                            {jobSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                {jobSuggestions.map((job) => (
                                  <div
                                    key={job.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleJobSelect(job)}
                                  >
                                    {job.title}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Выберите должность из списка
                        </FormDescription>
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
                            <Building
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input {...field} className="pl-10" />
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
                            <MapPin
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input
                              {...field}
                              className="pl-10"
                              onChange={(e) => {
                                field.onChange(e);
                                fetchLocations(e.target.value);
                                setSelectedLocationId(null);
                              }}
                            />
                            {isLoadingLocations && (
                              <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2" />
                            )}
                            {locationSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                {locationSuggestions.map((location) => (
                                  <div
                                    key={location.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      handleLocationSelect(location)
                                    }
                                  >
                                    {location.locationValue}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Выберите локацию из списка
                        </FormDescription>
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
                            <Phone
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input
                              {...field}
                              className="pl-10"
                              value={formatPhoneNumber(field.value)}
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(
                                  e.target.value
                                );
                                field.onChange(formatted);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Формат: +7XXXXXXXXXX (введите только цифры после +7)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {profileError && (
                    <p className="text-red-500 text-sm">{profileError}</p>
                  )}
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
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

          <Dialog
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Сменить пароль
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle>Сменить пароль</DialogTitle>
                <DialogDescription>
                  Введите текущий и новый пароль для смены.
                </DialogDescription>
              </DialogHeader>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Текущий пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              {...field}
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
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
                            <KeyRound
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              {...field}
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
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
                            <KeyRound
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#800000]">
              Основная информация
            </CardTitle>
            <Separator className="bg-[#800000]/10" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">Роль</span>
                <span className="col-span-2 text-slate-900">
                  {roleDisplayText}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  Пользователь
                </span>
                <span className="col-span-2">
                  {displayField(userData.name)}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  Должность
                </span>
                <span className="col-span-2">
                  {displayField(userData.jobTitle)}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  Компания
                </span>
                <span className="col-span-2">
                  {displayField(userData.company)}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  Локация
                </span>
                <span className="col-span-2">
                  {displayField(userData.location)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#800000]">
              Контактная информация
            </CardTitle>
            <Separator className="bg-[#800000]/10" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  Email
                </span>
                <span className="col-span-2">
                  {displayField(userData.email)}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  Телефон
                </span>
                <span className="col-span-2">
                  {displayField(userData.phone)}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-slate-500">
                  С нами с
                </span>
                <span className="col-span-2">
                  {displayField(userData.joinDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#800000]">
            Ваш вклад в сообщество
          </CardTitle>
          <Separator className="bg-[#800000]/10" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="flex flex-col items-center justify-center p-4 bg-[#800000]/5 rounded-lg max-w-md w-full">
              <span className="text-3xl font-bold text-[#800000]">
                {userData.reviewCount}
              </span>
              <span className="text-sm text-slate-600 mt-1 mb-4 text-center">
                Отзывов о компаниях
              </span>
              <Button
                variant="link"
                className="text-[#800000] no-underline"
                size="sm"
                asChild
              >
                <a href="/profile/reviews" className="flex items-center">
                  Просмотреть
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-[#800000]/5 rounded-lg max-w-md w-full">
              <span className="text-3xl font-bold text-[#800000]">
                {userData.salaryCount}
              </span>
              <span className="text-sm text-slate-600 mt-1 mb-4 text-center">
                Записей о зарплатах
              </span>
              <Button
                variant="link"
                className="text-[#800000] no-underline"
                size="sm"
                asChild
              >
                <a href="/profile/salaries" className="flex items-center">
                  Просмотреть
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

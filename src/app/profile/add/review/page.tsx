"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Rating } from "@/components/ui/rating";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Building,
  Briefcase,
  Star,
  FileUp,
  Loader2,
} from "lucide-react";
import searchAPI from "@/services/searchAPI";
import reviewAPI from "@/features/review/reviewAPI";
import debounce from "lodash/debounce";
import { RootState, AppDispatch } from "@/store";
import {
  fetchUserReviews,
  fetchReviewById,
} from "@/features/review/reviewSlice";

// Define employment status and type mapping interfaces
interface StatusMapping {
  CURRENT_EMPLOYEE: string;
  FORMER_EMPLOYEE: string;
  current: string;
  former: string;
  [key: string]: string;
}

interface TypeMapping {
  FULL_TIME: string;
  PART_TIME: string;
  CONTRACT: string;
  INTERNSHIP: string;
  FREELANCE: string;
  "full-time": string;
  "part-time": string;
  contract: string;
  internship: string;
  freelance: string;
  [key: string]: string;
}

export default function AddReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const reviewId = searchParams.get("id");
  const isEditing = !!reviewId;

  // Get the reviews from the Redux store
  const {
    userReviews,
    currentReview,
    isLoading: storeLoading,
  } = useSelector((state: RootState) => state.review);

  // State for stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Компания и должность",
    "Ваш опыт",
    "Детали отзыва",
    "Подтверждение",
  ];

  // State for API data
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewLoaded, setReviewLoaded] = useState(false);

  // Form state - updated initial ratings to be 0 instead of 3
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    employmentStatus: "current", // 'current' or 'former'
    employmentType: "full-time", // 'full-time', 'part-time', 'contract', etc.
    employmentContract: null as File | null, // To store the uploaded file
    overallRating: 0, // Changed from 3 to 0
    careerOpportunities: 0, // Changed from 3 to 0
    workLifeBalance: 0, // Changed from 3 to 0
    compensation: 0, // Changed from 3 to 0
    jobSecurity: 0, // Changed from 3 to 0
    management: 0, // Changed from 3 to 0
    title: "",
    body: "", // Main review content
    pros: "",
    cons: "",
    advice: "",
    recommendToFriend: "yes",
    anonymous: false,
    confirmTruthful: false,
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load review data for editing
  useEffect(() => {
    if (isEditing && !reviewLoaded) {
      // Try to find the review in the userReviews array
      const existingReview = userReviews.find(
        (review) => review.id.toString() === reviewId
      );

      if (existingReview) {
        // Review found in the store, use it to prefill the form
        prefillFormData(existingReview);
        setReviewLoaded(true);
      } else {
        // Review not found in the store, fetch it from the API
        dispatch(fetchReviewById(reviewId!))
          .unwrap()
          .then((data) => {
            if (data) {
              prefillFormData(data);
            }
            setReviewLoaded(true);
          })
          .catch((error) => {
            console.error("Failed to fetch review:", error);
            toast({
              title: "Ошибка",
              description: "Не удалось загрузить данные отзыва",
              variant: "destructive",
            });
            setReviewLoaded(true);
          });
      }
    }
  }, [isEditing, reviewId, userReviews, dispatch, reviewLoaded, toast]);

  // When currentReview changes (after API fetch), prefill the form
  useEffect(() => {
    if (isEditing && currentReview && !reviewLoaded) {
      prefillFormData(currentReview);
      setReviewLoaded(true);
    }
  }, [currentReview, isEditing, reviewLoaded]);

  // Helper function to prefill form data from a review
  const prefillFormData = (review: any) => {
    // Map employmentStatus from API to form format
    const statusMapping: StatusMapping = {
      CURRENT_EMPLOYEE: "current",
      FORMER_EMPLOYEE: "former",
      current: "current",
      former: "former",
    };

    // Map employmentType from API to form format
    const typeMapping: TypeMapping = {
      FULL_TIME: "full-time",
      PART_TIME: "part-time",
      CONTRACT: "contract",
      INTERNSHIP: "internship",
      FREELANCE: "freelance",
      "full-time": "full-time",
      "part-time": "part-time",
      contract: "contract",
      internship: "internship",
      freelance: "freelance",
    };

    const employmentStatus = review.employmentStatus
      ? statusMapping[review.employmentStatus] || "current"
      : "current";

    const employmentType = review.employmentType
      ? typeMapping[review.employmentType] || "full-time"
      : "full-time";

    setFormData({
      companyName: review.companyName || "",
      position: review.position || "",
      employmentStatus,
      employmentType,
      employmentContract: null, // Can't prefill file input
      overallRating: review.rating || 0, // Changed from 3 to 0
      careerOpportunities: review.careerOpportunities || 0, // Changed from 3 to 0
      workLifeBalance: review.workLifeBalance || 0, // Changed from 3 to 0
      compensation: review.compensation || 0, // Changed from 3 to 0
      jobSecurity: review.jobSecurity || 0, // Changed from 3 to 0
      management: review.management || 0, // Changed from 3 to 0
      title: review.title || "",
      body: review.body || "",
      pros: review.pros || "",
      cons: review.cons || "",
      advice: review.advice || "",
      recommendToFriend: review.recommendToFriend ? "yes" : "no",
      anonymous: review.anonymous || false,
      confirmTruthful: true, // Always true when editing
    });

    // Set IDs for company and job
    if (review.companyId) {
      setSelectedCompanyId(review.companyId);
    }

    if (review.jobId) {
      setSelectedJobId(review.jobId);
    }
  };

  // Debounced search functions
  const searchCompanies = useRef(
    debounce(async (query: string) => {
      if (!query || query.length < 2) return;
      setIsLoadingCompanies(true);
      try {
        const response = await searchAPI.searchCompanies(query);
        if (response?.data?.content) {
          setCompanies(response.data.content);
        }
      } catch (error) {
        console.error("Error searching companies:", error);
      } finally {
        setIsLoadingCompanies(false);
      }
    }, 300)
  ).current;

  const searchJobs = useRef(
    debounce(async (query: string) => {
      if (!query || query.length < 2) return;
      setIsLoadingJobs(true);
      try {
        const response = await searchAPI.searchJobs(query);
        if (response?.data) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Error searching jobs:", error);
      } finally {
        setIsLoadingJobs(false);
      }
    }, 300)
  ).current;

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      searchCompanies.cancel();
      searchJobs.cancel();
    };
  }, [searchCompanies, searchJobs]);

  // Updated validateStep function to validate ratings in step 1
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!selectedCompanyId) {
          newErrors.companyName = "Выберите компанию из списка";
        }
        if (!selectedJobId) {
          newErrors.position = "Выберите должность из списка";
        }
        break;
      case 1:
        if (formData.overallRating === 0) {
          newErrors.overallRating = "Пожалуйста, поставьте общую оценку";
        }
        if (formData.careerOpportunities === 0) {
          newErrors.careerOpportunities =
            "Пожалуйста, оцените карьерные возможности";
        }
        if (formData.workLifeBalance === 0) {
          newErrors.workLifeBalance =
            "Пожалуйста, оцените баланс работы и жизни";
        }
        if (formData.compensation === 0) {
          newErrors.compensation = "Пожалуйста, оцените компенсацию";
        }
        if (formData.jobSecurity === 0) {
          newErrors.jobSecurity = "Пожалуйста, оцените стабильность работы";
        }
        if (formData.management === 0) {
          newErrors.management = "Пожалуйста, оцените качество управления";
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          newErrors.title = "Добавьте заголовок отзыва";
        }
        if (!formData.body.trim()) {
          newErrors.body = "Добавьте основной текст отзыва";
        }
        if (!formData.pros.trim()) {
          newErrors.pros = "Добавьте плюсы";
        }
        if (!formData.cons.trim()) {
          newErrors.cons = "Добавьте минусы";
        }
        break;
      case 3:
        if (!formData.confirmTruthful) {
          newErrors.confirmTruthful =
            "Необходимо подтвердить достоверность информации";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target as { name?: string; value: unknown };
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRatingChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        employmentContract: files[0],
      }));
    }
  };

  const handleCompanySelect = (company: any) => {
    setFormData((prev) => ({ ...prev, companyName: company.name }));
    setSelectedCompanyId(company.id);
    setCompanies([]);
  };

  const handleJobSelect = (job: any) => {
    setFormData((prev) => ({ ...prev, position: job.title }));
    setSelectedJobId(job.id);
    setJobs([]);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      const reviewData = {
        companyId: selectedCompanyId,
        companyName: formData.companyName,
        jobId: selectedJobId,
        position: formData.position,
        employmentStatus: formData.employmentStatus,
        employmentType: formData.employmentType,
        rating: formData.overallRating,
        careerOpportunities: formData.careerOpportunities,
        workLifeBalance: formData.workLifeBalance,
        compensation: formData.compensation,
        jobSecurity: formData.jobSecurity,
        management: formData.management,
        title: formData.title,
        body: formData.body,
        pros: formData.pros,
        cons: formData.cons,
        advice: formData.advice,
        recommendToFriend: formData.recommendToFriend === "yes",
        anonymous: formData.anonymous,
        confirmTruthful: formData.confirmTruthful,
      };

      submitData.append(
        "review",
        new Blob([JSON.stringify(reviewData)], { type: "application/json" })
      );

      if (formData.employmentContract) {
        submitData.append("contractFile", formData.employmentContract);
      }

      let response;
      if (isEditing && reviewId) {
        // Update existing review
        response = await reviewAPI.updateReview(reviewId, submitData);
        toast({
          title: "Успешно!",
          description: "Ваш отзыв успешно обновлен",
        });
      } else {
        // Create new review
        response = await reviewAPI.submitReview(submitData);
        toast({
          title: "Успешно!",
          description: "Ваш отзыв успешно отправлен",
        });
      }

      // Refresh user reviews after submission
      dispatch(fetchUserReviews());

      router.push("/profile/reviews");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Ошибка",
        description:
          error.response?.data?.message ||
          "Произошла ошибка при отправке отзыва",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // If we're in edit mode but still loading the review, show a loading state
  if (isEditing && !reviewLoaded && storeLoading) {
    return (
      <Container className="py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#800000]" />
            <p className="text-gray-600">Загрузка данных отзыва...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Редактирование отзыва" : "Добавление отзыва"}
          </h1>

          {/* Mobile Cancel Button */}
          <Button
            variant="outline"
            onClick={handleCancel}
            className="md:hidden flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X size={18} className="mr-1" />
            Отмена
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Stepper - Mobile uses numbers, desktop uses text */}
            <div className="mb-6">
              <div className="flex justify-between w-full mb-2">
                {steps.map((label, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center text-xs md:text-sm w-full ${
                      activeStep >= index
                        ? "text-[#800000] font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`
                      h-2 w-full ${
                        index === 0
                          ? "ml-auto w-1/2"
                          : index === steps.length - 1
                          ? "mr-auto w-1/2"
                          : ""
                      }
                      ${activeStep >= index ? "bg-[#800000]" : "bg-gray-200"}
                    `}
                    ></div>
                    <div className="mt-2 text-center flex flex-col items-center">
                      {/* Mobile - show numbers */}
                      <span className="md:hidden text-lg font-semibold flex items-center justify-center w-7 h-7 rounded-full border border-current">
                        {index + 1}
                      </span>
                      {/* Desktop - show text */}
                      <span className="hidden md:block">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="min-h-[350px] mb-6">
              {activeStep === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#800000] mb-4">
                    Информация о компании и должности
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Компания *</Label>
                    <p className="text-sm text-gray-500 mb-1">
                      Введите название компании
                    </p>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => {
                          handleChange(e);
                          searchCompanies(e.target.value);
                          setSelectedCompanyId(null);
                        }}
                        className={`pl-10 ${
                          errors.companyName ? "border-red-500" : ""
                        }`}
                        placeholder="Название компании"
                      />
                      {isLoadingCompanies && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>
                    {companies.length > 0 && (
                      <div className="absolute z-10 mt-1 max-w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {companies.map((company) => (
                          <div
                            key={company.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => handleCompanySelect(company)}
                          >
                            {company.logoUrl && (
                              <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <span>{company.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.companyName && (
                      <p className="text-red-500 text-sm">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Должность *</Label>
                    <p className="text-sm text-gray-500 mb-1">
                      Введите должность
                    </p>
                    <div className="relative">
                      <Briefcase
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={(e) => {
                          handleChange(e);
                          searchJobs(e.target.value);
                          setSelectedJobId(null);
                        }}
                        className={`pl-10 ${
                          errors.position ? "border-red-500" : ""
                        }`}
                        placeholder="Ваша должность в компании"
                      />
                      {isLoadingJobs && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>
                    {jobs.length > 0 && (
                      <div className="absolute z-10 mt-1 max-w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleJobSelect(job)}
                          >
                            <div className="font-medium">{job.title}</div>
                            <div className="text-xs text-gray-500">
                              {job.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.position && (
                      <p className="text-red-500 text-sm">{errors.position}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Статус работы *</Label>
                    <RadioGroup
                      id="employmentStatus"
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onValueChange={(value) =>
                        handleChange({
                          target: { name: "employmentStatus", value },
                        })
                      }
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="current" id="current" />
                        <Label htmlFor="current">Текущий сотрудник</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="former" id="former" />
                        <Label htmlFor="former">Бывший сотрудник</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Тип занятости</Label>
                    <select
                      id="employmentType"
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={(e) => handleChange(e)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="full-time">Полная занятость</option>
                      <option value="part-time">Частичная занятость</option>
                      <option value="contract">Контракт</option>
                      <option value="internship">Стажировка</option>
                      <option value="freelance">Фриланс</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="employmentContract"
                      className="flex items-center"
                    >
                      Трудовой договор{" "}
                      <span className="text-gray-400 text-sm ml-2">
                        {isEditing
                          ? "(при необходимости обновить)"
                          : "(необязательно)"}
                      </span>
                    </Label>
                    <div className="relative">
                      <Label
                        htmlFor="employmentContract"
                        className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50"
                      >
                        <FileUp size={20} className="text-[#800000]" />
                        <span>
                          {formData.employmentContract
                            ? formData.employmentContract.name
                            : isEditing
                            ? "Обновить трудовой договор (необязательно)"
                            : "Загрузить трудовой договор"}
                        </span>
                      </Label>
                      <Input
                        id="employmentContract"
                        name="employmentContract"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Загрузите документ, подтверждающий ваше трудоустройство.
                      Это поможет верифицировать ваш отзыв.
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#800000] mb-4">
                    Оцените свой опыт работы
                  </h2>

                  <p className="text-gray-600 mb-4">
                    Пожалуйста, оцените следующие аспекты работы, выбрав
                    соответствующее количество звезд (обязательно)
                  </p>

                  <div className="space-y-2">
                    <Label>
                      Общая оценка <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Rating
                        value={formData.overallRating}
                        onValueChange={(value) =>
                          handleRatingChange("overallRating", value)
                        }
                        icon={
                          <Star className="fill-[#f5b400] stroke-[#f5b400]" />
                        }
                        emptyIcon={
                          <Star className="fill-gray-200 stroke-gray-200" />
                        }
                        className="text-2xl"
                      />
                      <span className="text-gray-600">
                        {formData.overallRating} / 5
                      </span>
                    </div>
                    {errors.overallRating && (
                      <p className="text-red-500 text-sm">
                        {errors.overallRating}
                      </p>
                    )}
                  </div>

                  <Separator className="my-4 bg-[#800000]/10" />

                  <h3 className="text-lg font-medium text-[#800000]">
                    Оцените по категориям
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label className="min-w-[180px]">
                        Карьерные возможности{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Rating
                        value={formData.careerOpportunities}
                        onValueChange={(value) =>
                          handleRatingChange("careerOpportunities", value)
                        }
                        className="text-xl"
                      />
                    </div>
                    {errors.careerOpportunities && (
                      <p className="text-red-500 text-sm">
                        {errors.careerOpportunities}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label className="min-w-[180px]">
                        Баланс работы и личной жизни{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Rating
                        value={formData.workLifeBalance}
                        onValueChange={(value) =>
                          handleRatingChange("workLifeBalance", value)
                        }
                        className="text-xl"
                      />
                    </div>
                    {errors.workLifeBalance && (
                      <p className="text-red-500 text-sm">
                        {errors.workLifeBalance}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label className="min-w-[180px]">
                        Компенсация и льготы{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Rating
                        value={formData.compensation}
                        onValueChange={(value) =>
                          handleRatingChange("compensation", value)
                        }
                        className="text-xl"
                      />
                    </div>
                    {errors.compensation && (
                      <p className="text-red-500 text-sm">
                        {errors.compensation}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label className="min-w-[180px]">
                        Стабильность работы{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Rating
                        value={formData.jobSecurity}
                        onValueChange={(value) =>
                          handleRatingChange("jobSecurity", value)
                        }
                        className="text-xl"
                      />
                    </div>
                    {errors.jobSecurity && (
                      <p className="text-red-500 text-sm">
                        {errors.jobSecurity}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label className="min-w-[180px]">
                        Качество управления{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Rating
                        value={formData.management}
                        onValueChange={(value) =>
                          handleRatingChange("management", value)
                        }
                        className="text-xl"
                      />
                    </div>
                    {errors.management && (
                      <p className="text-red-500 text-sm">
                        {errors.management}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#800000] mb-4">
                    Подробности вашего отзыва
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="title">Заголовок отзыва *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={errors.title ? "border-red-500" : ""}
                      placeholder="Кратко опишите ваш опыт работы в компании"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Основной отзыв *</Label>
                    <Textarea
                      id="body"
                      name="body"
                      value={formData.body}
                      onChange={handleChange}
                      className={`min-h-[100px] ${
                        errors.body ? "border-red-500" : ""
                      }`}
                      placeholder="Опишите ваш общий опыт работы в компании"
                    />
                    {errors.body && (
                      <p className="text-red-500 text-sm">{errors.body}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pros">
                      Плюсы <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="pros"
                      name="pros"
                      value={formData.pros}
                      onChange={handleChange}
                      className={`min-h-[100px] ${
                        errors.pros ? "border-red-500" : ""
                      }`}
                      placeholder="Что вам нравилось в компании?"
                    />
                    {errors.pros && (
                      <p className="text-red-500 text-sm">{errors.pros}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cons">
                      Минусы <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="cons"
                      name="cons"
                      value={formData.cons}
                      onChange={handleChange}
                      className={`min-h-[100px] ${
                        errors.cons ? "border-red-500" : ""
                      }`}
                      placeholder="Что можно было бы улучшить?"
                    />
                    {errors.cons && (
                      <p className="text-red-500 text-sm">{errors.cons}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advice">
                      Советы руководству{" "}
                      <span className="text-gray-400">(необязательно)</span>
                    </Label>
                    <Textarea
                      id="advice"
                      name="advice"
                      value={formData.advice}
                      onChange={handleChange}
                      className="min-h-[80px]"
                      placeholder="Что бы вы посоветовали руководству компании?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Рекомендуете ли вы эту компанию?</Label>
                    <RadioGroup
                      name="recommendToFriend"
                      value={formData.recommendToFriend}
                      onValueChange={(value) =>
                        handleChange({
                          target: { name: "recommendToFriend", value },
                        })
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="recommend-yes" />
                        <Label htmlFor="recommend-yes">Да</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="recommend-no" />
                        <Label htmlFor="recommend-no">Нет</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#800000] mb-4">
                    Подтверждение и отправка
                  </h2>

                  <Card className="border border-[#800000]/10">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-[#800000] mb-2 pb-2 border-b border-[#800000]/10">
                        Предварительный просмотр
                      </h3>

                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h4 className="text-xl font-medium">
                            {formData.title}
                          </h4>
                          <div className="flex items-center">
                            <Rating
                              value={formData.overallRating}
                              readOnly
                              className="text-lg"
                            />
                            <span className="ml-2 text-sm font-medium">
                              {formData.overallRating} / 5
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[#800000] font-medium">
                            {formData.companyName} | {formData.position}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formData.employmentStatus === "current"
                              ? "Текущий сотрудник"
                              : "Бывший сотрудник"}{" "}
                            |{" "}
                            {
                              {
                                "full-time": "Полная занятость",
                                "part-time": "Частичная занятость",
                                contract: "Контракт",
                                internship: "Стажировка",
                                freelance: "Фриланс",
                              }[formData.employmentType]
                            }
                          </p>
                          {(formData.employmentContract || isEditing) && (
                            <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                              <span className="w-2 h-2 inline-block bg-green-600 rounded-full"></span>
                              Верифицирован трудовым договором
                            </p>
                          )}
                        </div>

                        <div>
                          <h5 className="font-medium">Основной отзыв</h5>
                          <p className="text-gray-700">{formData.body}</p>
                        </div>

                        {formData.pros && (
                          <div>
                            <h5 className="font-medium">Плюсы</h5>
                            <p className="text-gray-700">{formData.pros}</p>
                          </div>
                        )}

                        {formData.cons && (
                          <div>
                            <h5 className="font-medium">Минусы</h5>
                            <p className="text-gray-700">{formData.cons}</p>
                          </div>
                        )}

                        {formData.advice && (
                          <div>
                            <h5 className="font-medium">Советы руководству</h5>
                            <p className="text-gray-700">{formData.advice}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.anonymous}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("anonymous", checked as boolean)
                        }
                      />
                      <Label htmlFor="anonymous">Оставить отзыв анонимно</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="confirmTruthful"
                        checked={formData.confirmTruthful}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "confirmTruthful",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="confirmTruthful">
                        Я подтверждаю, что этот отзыв основан на моем личном
                        опыте работы, и информация в нем достоверна
                      </Label>
                    </div>
                    {errors.confirmTruthful && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmTruthful}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-[#800000]/10">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 hidden md:flex"
              >
                <X size={18} className="mr-2" />
                Отмена
              </Button>

              <div className="flex gap-3 w-full md:w-auto justify-end">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="text-gray-600"
                >
                  <ChevronLeft size={18} className="mr-1" />
                  Назад
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#2e7d32] hover:bg-[#1b5e20]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        {isEditing ? "Сохранить изменения" : "Отправить отзыв"}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-[#800000] hover:bg-[#660000]"
                  >
                    Далее
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

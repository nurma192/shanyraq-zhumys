"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Building,
  Briefcase,
  Users,
  MapPin,
  FileUp,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import salaryAPI from "@/features/salary/salaryAPI";
import searchAPI from "@/services/searchAPI";
import debounce from "lodash/debounce";
import { RootState, AppDispatch } from "@/store";
import {
  fetchUserSalaries,
  fetchSalaryById,
} from "@/features/salary/salarySlice";

// Define proper type interfaces for status and type mappings
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

export default function AddSalaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const salaryId = searchParams.get("id");
  const isEditing = !!salaryId;

  // Get salaries from the Redux store
  const {
    userSalaries,
    currentSalary,
    isLoading: storeLoading,
  } = useSelector((state: RootState) => state.salary);

  // State for stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Компания и должность",
    "Информация о зарплате",
    "Дополнительно",
    "Подтверждение",
  ];

  // State for API data
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salaryLoaded, setSalaryLoaded] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    department: "",
    employmentStatus: "current",
    employmentType: "full-time",
    employmentContract: null as File | null,
    salary: "",
    currency: "KZT",
    payPeriod: "monthly",
    bonuses: "",
    stockOptions: "",
    experience: "1-3",
    location: "",
    anonymous: true,
    confirmTruthful: false,
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load salary data for editing
  useEffect(() => {
    if (isEditing && !salaryLoaded) {
      // Try to find the salary in the userSalaries array
      const existingSalary = userSalaries.find(
        (salary) => salary.id.toString() === salaryId
      );

      if (existingSalary) {
        // Salary found in the store, use it to prefill the form
        prefillFormData(existingSalary);
        setSalaryLoaded(true);
      } else {
        // Salary not found in the store, fetch it from the API
        dispatch(fetchSalaryById(salaryId!))
          .unwrap()
          .then((data) => {
            if (data) {
              prefillFormData(data);
            }
            setSalaryLoaded(true);
          })
          .catch((error) => {
            console.error("Failed to fetch salary:", error);
            toast({
              title: "Ошибка",
              description: "Не удалось загрузить данные о зарплате",
              variant: "destructive",
            });
            setSalaryLoaded(true);
          });
      }
    }
  }, [isEditing, salaryId, userSalaries, dispatch, salaryLoaded, toast]);

  // When currentSalary changes (after API fetch), prefill the form
  useEffect(() => {
    if (isEditing && currentSalary && !salaryLoaded) {
      prefillFormData(currentSalary);
      setSalaryLoaded(true);
    }
  }, [currentSalary, isEditing, salaryLoaded]);

  // Helper function to prefill form data from a salary record
  const prefillFormData = (salary: any) => {
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

    const employmentStatus = salary.employmentStatus ? 
      (statusMapping[salary.employmentStatus] || "current") : "current";
      
    const employmentType = salary.employmentType ? 
      (typeMapping[salary.employmentType] || "full-time") : "full-time";

    setFormData({
      companyName: salary.companyName || "",
      position: salary.position || "",
      department: salary.department || "",
      employmentStatus,
      employmentType,
      employmentContract: null, // Can't prefill file input
      salary: salary.salary ? salary.salary.toString() : "",
      currency: salary.currency || "KZT",
      payPeriod: salary.payPeriod || "monthly",
      bonuses: salary.bonuses || "",
      stockOptions: salary.stockOptions || "",
      experience: salary.experience || "1-3",
      location: salary.location || "",
      anonymous: salary.anonymous !== undefined ? salary.anonymous : true,
      confirmTruthful: true, // Always true when editing
    });

    // Set IDs for company, job, and location
    if (salary.companyId) {
      setSelectedCompanyId(salary.companyId);
    }

    if (salary.jobId) {
      setSelectedJobId(salary.jobId);
    }

    if (salary.locationId) {
      setSelectedLocationId(salary.locationId);
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

  const searchLocations = useRef(
    debounce(async (query: string) => {
      if (!query || query.length < 2) return;
      setIsLoadingLocations(true);
      try {
        const response = await searchAPI.searchLocations(query);
        if (response?.data) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    }, 300)
  ).current;

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      searchCompanies.cancel();
      searchJobs.cancel();
      searchLocations.cancel();
    };
  }, [searchCompanies, searchJobs, searchLocations]);

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
        if (!formData.salary.trim()) {
          newErrors.salary = "Укажите размер базовой зарплаты";
        } else if (isNaN(Number(formData.salary))) {
          newErrors.salary = "Зарплата должна быть числом";
        }
        if (!formData.currency.trim()) {
          newErrors.currency = "Укажите валюту";
        }
        break;
      case 2:
        if (!formData.location.trim()) {
          newErrors.location = "Укажите местоположение";
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

  const handleLocationSelect = (location: any) => {
    setFormData((prev) => ({ ...prev, location: location.locationValue }));
    setSelectedLocationId(location.id);
    setLocations([]);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "KZT":
        return "₸";
      case "RUB":
        return "₽";
      default:
        return currencyCode;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      const salaryData = {
        companyId: selectedCompanyId,
        companyName: formData.companyName,
        jobId: selectedJobId,
        position: formData.position,
        department: formData.department,
        employmentStatus: formData.employmentStatus,
        employmentType: formData.employmentType,
        salary: parseFloat(formData.salary),
        currency: formData.currency,
        payPeriod: formData.payPeriod,
        bonuses: formData.bonuses,
        stockOptions: formData.stockOptions,
        experience: formData.experience,
        locationId: selectedLocationId,
        location: formData.location,
        anonymous: formData.anonymous,
      };

      submitData.append(
        "salary",
        new Blob([JSON.stringify(salaryData)], { type: "application/json" })
      );

      if (formData.employmentContract) {
        submitData.append("contractFile", formData.employmentContract);
      }

      let response;
      if (isEditing && salaryId) {
        // Update existing salary
        response = await salaryAPI.updateSalary(salaryId, submitData);
        toast({
          title: "Успешно!",
          description: "Информация о зарплате успешно обновлена",
        });
      } else {
        // Create new salary
        response = await salaryAPI.submitSalary(submitData);
        toast({
          title: "Успешно!",
          description: "Информация о зарплате успешно добавлена",
        });
      }

      // Refresh user salaries after submission
      dispatch(fetchUserSalaries());

      router.push("/profile/salaries");
    } catch (error: any) {
      console.error("Error submitting salary:", error);
      toast({
        title: "Ошибка",
        description:
          error.response?.data?.message ||
          "Произошла ошибка при отправке данных",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // If we're in edit mode but still loading the salary, show a loading state
  if (isEditing && !salaryLoaded && storeLoading) {
    return (
      <Container className="py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#800000]" />
            <p className="text-gray-600">Загрузка данных о зарплате...</p>
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
            {isEditing
              ? "Редактирование данных о зарплате"
              : "Добавление данных о зарплате"}
          </h1>

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
                      <span className="md:hidden text-lg font-semibold flex items-center justify-center w-7 h-7 rounded-full border border-current">
                        {index + 1}
                      </span>
                      <span className="hidden md:block">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                    <Label htmlFor="department">Отдел/Департамент</Label>
                    <div className="relative">
                      <Users
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Название отдела"
                      />
                    </div>
                    <p className="text-gray-500 text-sm">Необязательно</p>
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
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                      Загрузите документ, подтверждающий вашу зарплату и
                      трудоустройство. Это поможет верифицировать ваши данные.
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#800000] mb-4">
                    Данные о зарплате
                  </h2>

                  <div className="space-y-2">
                    <Label>Базовая зарплата *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {getCurrencySymbol(formData.currency)}
                        </div>
                        <Input
                          name="salary"
                          type="number"
                          value={formData.salary}
                          onChange={handleChange}
                          className={`h-10 pl-10 ${
                            errors.salary ? "border-red-500" : ""
                          }`}
                          placeholder="Сумма"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className={`w-full h-10 rounded-md border ${
                            errors.currency ? "border-red-500" : "border-input"
                          } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="KZT">KZT</option>
                          <option value="RUB">RUB</option>
                        </select>
                      </div>

                      <div className="sm:col-span-1">
                        <select
                          name="payPeriod"
                          value={formData.payPeriod}
                          onChange={handleChange}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="monthly">в месяц</option>
                          <option value="yearly">в год</option>
                        </select>
                      </div>
                    </div>
                    {errors.salary && (
                      <p className="text-red-500 text-sm">{errors.salary}</p>
                    )}
                    {errors.currency && (
                      <p className="text-red-500 text-sm">{errors.currency}</p>
                    )}
                  </div>

                  <Separator className="my-4 bg-[#800000]/10" />

                  <h3 className="text-lg font-medium text-[#800000]">
                    Дополнительные выплаты
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="bonuses">Бонусы и премии</Label>
                    <Input
                      id="bonuses"
                      name="bonuses"
                      value={formData.bonuses}
                      onChange={handleChange}
                      placeholder="Например: Квартальная премия до 20% от оклада"
                    />
                    <p className="text-gray-500 text-sm">Необязательно</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockOptions">Опционы и акции</Label>
                    <Input
                      id="stockOptions"
                      name="stockOptions"
                      value={formData.stockOptions}
                      onChange={handleChange}
                      placeholder="Например: Опционы на акции после года работы"
                    />
                    <p className="text-gray-500 text-sm">Необязательно</p>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#800000] mb-4">
                    Дополнительная информация
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Опыт работы</Label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="0-1">Менее 1 года</option>
                      <option value="1-3">1-3 года</option>
                      <option value="3-5">3-5 лет</option>
                      <option value="5-10">5-10 лет</option>
                      <option value="10+">Более 10 лет</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Местоположение *</Label>
                    <p className="text-sm text-gray-500 mb-1">
                      Введите название города
                    </p>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={(e) => {
                          handleChange(e);
                          searchLocations(e.target.value);
                          setSelectedLocationId(null);
                        }}
                        className={`pl-10 ${
                          errors.location ? "border-red-500" : ""
                        }`}
                        placeholder="Например: Алматы, Казахстан"
                      />
                      {isLoadingLocations && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>
                    {locations.length > 0 && (
                      <div className="absolute z-10 mt-1 max-w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {locations.map((location) => (
                          <div
                            key={location.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleLocationSelect(location)}
                          >
                            {location.locationValue}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.location && (
                      <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                    <p className="text-gray-500 text-sm">
                      Город и страна, где вы работаете
                    </p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.anonymous}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("anonymous", checked as boolean)
                        }
                      />
                      <Label htmlFor="anonymous">
                        Оставить данные о зарплате анонимно
                      </Label>
                    </div>
                    <p className="text-gray-500 text-sm ml-6">
                      Ваше имя не будет отображаться рядом с данными о зарплате
                    </p>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-lg font-medium mb-1">
                            {formData.position}
                          </h4>
                          <p className="text-[#800000] font-medium">
                            {formData.companyName}
                          </p>
                          {formData.department && (
                            <p className="text-gray-600 text-sm">
                              {formData.department}
                            </p>
                          )}
                          {formData.employmentContract && (
                            <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                              <span className="w-2 h-2 inline-block bg-green-600 rounded-full"></span>
                              С верификацией трудовым договором
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xl font-bold text-[#800000]">
                            {getCurrencySymbol(formData.currency)}
                            {formData.salary}{" "}
                            {formData.payPeriod === "monthly"
                              ? "в месяц"
                              : "в год"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 font-medium">
                            Опыт работы:
                          </p>
                          <p>
                            {
                              {
                                "0-1": "Менее 1 года",
                                "1-3": "1-3 года",
                                "3-5": "3-5 лет",
                                "5-10": "5-10 лет",
                                "10+": "Более 10 лет",
                              }[formData.experience]
                            }
                          </p>
                        </div>

                        {formData.location && (
                          <div>
                            <p className="text-gray-600 font-medium">
                              Местоположение:
                            </p>
                            <p>{formData.location}</p>
                          </div>
                        )}

                        {formData.bonuses && (
                          <div>
                            <p className="text-gray-600 font-medium">Бонусы:</p>
                            <p>{formData.bonuses}</p>
                          </div>
                        )}

                        {formData.stockOptions && (
                          <div>
                            <p className="text-gray-600 font-medium">
                              Опционы и акции:
                            </p>
                            <p>{formData.stockOptions}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-gray-600 font-medium">Статус:</p>
                          <p>
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
                        </div>

                        <div>
                          <p className="text-gray-600 font-medium">
                            Анонимность:
                          </p>
                          <p>
                            {formData.anonymous ? "Анонимно" : "Не анонимно"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
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
                        Я подтверждаю, что эта информация основана на моем
                        личном опыте работы, и данные достоверны
                      </Label>
                    </div>
                    {errors.confirmTruthful && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmTruthful}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-[#800000]/5 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      Ваша информация будет использована только в обобщенном
                      виде. Мы не раскрываем личные данные пользователей.
                    </p>
                  </div>
                </div>
              )}
            </div>

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
                        {isEditing ? "Сохранить изменения" : "Отправить данные"}
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
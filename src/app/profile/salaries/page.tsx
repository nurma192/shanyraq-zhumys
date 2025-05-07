"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  fetchUserSalaries,
  fetchAllSalaries,
  deleteSalary,
  updateSalaryStatus,
} from "@/features/salary/salarySlice";
import { RootState, AppDispatch } from "@/store";
import { useAuth } from "@/hooks/useAuth";

type SalaryApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "AI_REJECTED";
type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

interface SalaryData {
  id: number;
  companyName: string;
  position: string;
  department?: string;
  salary: number;
  currency: string;
  payPeriod: string;
  experience: string;
  location: string;
  employmentType: EmploymentType;
  employmentStatus: "current" | "former";
  bonuses?: string;
  stockOptions?: string;
  approvalStatus: SalaryApprovalStatus;
  adminComment?: string;
  date: string;
  formattedAmount?: string;
  contractDocumentUrl?: string;
  hasVerification?: boolean;
}

export default function SalariesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const isAdmin = user?.role === "ROLE_ADMIN";

  const [currentTab, setCurrentTab] = useState("Все");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [verifyContract, setVerifyContract] = useState(false);

  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const {
    userSalaries = [],
    allSalaries = [],
    isLoading,
    error,
    userSalariesLoaded,
    allSalariesLoaded,
  } = useSelector((state: RootState) => state.salary);

  useEffect(() => {
    if (isAdmin) {
      if (!allSalariesLoaded) {
        dispatch(fetchAllSalaries(undefined));
      }
    } else {
      if (!userSalariesLoaded) {
        dispatch(fetchUserSalaries());
      }
    }
  }, [dispatch, isAdmin, allSalariesLoaded, userSalariesLoaded]);

  const statusTabs = ["Все", "Новые", "Одобренные", "Отклоненные"];

  const handleAddSalary = () => {
    router.push("/profile/add/salary");
  };

  const handleEditSalary = (salaryId: string) => {
    router.push(`/profile/add/salary?id=${salaryId}`);
  };

  const handleDeleteSalary = (salaryId: string) => {
    setSelectedSalaryId(salaryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSalaryId) {
      try {
        await dispatch(deleteSalary(selectedSalaryId)).unwrap();
        toast({
          title: "Запись удалена",
          description: "Запись о зарплате была успешно удалена",
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить запись о зарплате",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedSalaryId(null);
  };

  const handleViewDetails = (salary: SalaryData) => {
    setSelectedSalary(salary);
    setAdminComment("");
    setVerifyContract(salary.hasVerification || false);
    setDetailsDialogOpen(true);
  };

  const handleViewDocument = (url: string) => {
    const viewableUrl = url.includes("?") ? `${url}&view=1` : `${url}?view=1`;

    setDocumentUrl(viewableUrl);
    setDocumentDialogOpen(true);
  };

  const handleApproveClick = (salaryId: string) => {
    setSelectedSalaryId(salaryId);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (salaryId: string) => {
    setSelectedSalaryId(salaryId);
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (selectedSalaryId) {
      try {
        const data = {
          status: "APPROVED",
          adminComment:
            adminComment.trim() ||
            "Информация о зарплате соответствует рыночным показателям",
          verified: isAdmin ? verifyContract : undefined,
        };

        await dispatch(
          updateSalaryStatus({ salaryId: selectedSalaryId, data })
        ).unwrap();

        toast({
          title: "Запись одобрена",
          description: "Запись о зарплате была успешно одобрена",
        });

        setApproveDialogOpen(false);
        setSelectedSalaryId(null);
        setAdminComment("");
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось одобрить запись о зарплате",
          variant: "destructive",
        });
      }
    }
  };

  const confirmReject = async () => {
    if (!adminComment.trim() && isAdmin) {
      toast({
        title: "Требуется комментарий",
        description: "Пожалуйста, укажите причину отклонения записи о зарплате",
        variant: "destructive",
      });
      return;
    }

    if (selectedSalaryId) {
      try {
        const data = {
          status: "REJECTED",
          adminComment: adminComment,
          verified: isAdmin ? verifyContract : undefined,
        };

        await dispatch(
          updateSalaryStatus({ salaryId: selectedSalaryId, data })
        ).unwrap();

        toast({
          title: "Запись отклонена",
          description: "Запись о зарплате была отклонена",
        });

        setRejectDialogOpen(false);
        setSelectedSalaryId(null);
        setAdminComment("");
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось отклонить запись о зарплате",
          variant: "destructive",
        });
      }
    }
  };

  const updateVerificationStatus = async () => {
    if (selectedSalary && isAdmin) {
      try {
        const data = {
          status: selectedSalary.approvalStatus,
          adminComment: selectedSalary.adminComment || "",
          verified: verifyContract,
        };

        await dispatch(
          updateSalaryStatus({ salaryId: selectedSalary.id.toString(), data })
        ).unwrap();

        toast({
          title: "Верификация обновлена",
          description: verifyContract
            ? "Трудовой договор подтверждён"
            : "Верификация трудового договора отменена",
        });

        setSelectedSalary({
          ...selectedSalary,
          hasVerification: verifyContract,
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус верификации",
          variant: "destructive",
        });
      }
    }
  };

  const getFilteredSalaries = (): SalaryData[] => {
    const salaries = isAdmin ? allSalaries : userSalaries;

    if (currentTab === "Все") return salaries as SalaryData[];

    const statusMap: Record<string, string> = {
      Новые: "PENDING",
      Одобренные: "APPROVED",
      Отклоненные: "REJECTED",
    };

    return (salaries as SalaryData[]).filter(
      (salary) => salary.approvalStatus === statusMap[currentTab]
    );
  };

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "destructive" | "secondary" | "outline" | "primary" => {
    if (status === "APPROVED") return "primary";
    if (status === "REJECTED" || status === "AI_REJECTED") return "destructive";
    return "secondary";
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Новый",
      APPROVED: "Одобрено",
      REJECTED: "Отказано",
      AI_REJECTED: "Отказано от AI",
    };
    return statusMap[status] || status;
  };

  const getFormattedAmount = (salary: SalaryData) => {
    if (salary.formattedAmount) return salary.formattedAmount;

    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      RUB: "₽",
      KZT: "₸",
    };

    const symbol = currencySymbols[salary.currency] || salary.currency;
    const period = salary.payPeriod === "monthly" ? "в месяц" : "в год";

    return `${symbol}${salary.salary} ${period}`;
  };

  const canEdit = (salary: SalaryData) => {
    return (
      salary.approvalStatus === "PENDING" ||
      salary.approvalStatus === "REJECTED"
    );
  };

  const getEmploymentTypeDisplay = (type: EmploymentType): string => {
    const employmentTypeMap: Record<EmploymentType, string> = {
      "full-time": "Полная занятость",
      "part-time": "Частичная занятость",
      contract: "Контракт",
      internship: "Стажировка",
      freelance: "Фриланс",
    };

    return employmentTypeMap[type];
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Модерация зарплат" : "Мои зарплаты"}
        </h1>

        {!isAdmin && (
          <Button
            onClick={handleAddSalary}
            className="bg-[#800000] hover:bg-[#660000]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить зарплату
          </Button>
        )}
      </div>

      <Tabs defaultValue="Все" onValueChange={setCurrentTab} className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg mb-6 w-full grid grid-cols-4">
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-white data-[state=active]:text-[#800000] data-[state=active]:shadow-sm py-2 font-medium"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
                      <p>Загрузка данных...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center p-8 text-red-500">
                    <p>Ошибка загрузки: {error}</p>
                  </div>
                ) : getFilteredSalaries().length === 0 ? (
                  <div className="flex justify-center items-center p-8 text-gray-500">
                    <p>Записи о зарплатах не найдены</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[#800000] font-semibold">
                            Компания
                          </TableHead>
                          <TableHead className="text-[#800000] font-semibold">
                            Должность
                          </TableHead>
                          <TableHead className="text-[#800000] font-semibold">
                            Зарплата
                          </TableHead>
                          <TableHead className="text-[#800000] font-semibold hidden sm:table-cell">
                            Опыт
                          </TableHead>
                          <TableHead className="text-[#800000] font-semibold hidden md:table-cell">
                            Дата
                          </TableHead>
                          <TableHead className="text-[#800000] font-semibold">
                            Статус
                          </TableHead>
                          <TableHead className="text-[#800000] font-semibold text-right">
                            Действия
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredSalaries().map((salary) => (
                          <TableRow
                            key={salary.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{salary.companyName}</span>
                                {salary.hasVerification && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{salary.position}</TableCell>
                            <TableCell className="font-semibold text-[#800000]">
                              {getFormattedAmount(salary)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {salary.experience}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {salary.date}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    salary.approvalStatus
                                  )}
                                >
                                  {getStatusDisplay(salary.approvalStatus)}
                                </Badge>
                                {salary.contractDocumentUrl && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <FileText className="w-4 h-4 text-blue-600" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Прикреплен трудовой договор</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleViewDetails(salary)
                                        }
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Просмотреть</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {!isAdmin && canEdit(salary) && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleEditSalary(
                                              salary.id.toString()
                                            )
                                          }
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Редактировать</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}

                                {!isAdmin && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleDeleteSalary(
                                              salary.id.toString()
                                            )
                                          }
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Удалить</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}

                                {isAdmin &&
                                  salary.approvalStatus === "PENDING" && (
                                    <>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                setVerifyContract(
                                                  salary.hasVerification ||
                                                    false
                                                );
                                                handleApproveClick(
                                                  salary.id.toString()
                                                );
                                              }}
                                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                              <CheckCircle className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Одобрить</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() =>
                                                handleRejectClick(
                                                  salary.id.toString()
                                                )
                                              }
                                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                              <XCircle className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Отклонить</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление записи о зарплате</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту запись о зарплате? Это действие
              нельзя будет отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Подтверждение одобрения</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите одобрить эту запись о зарплате?
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label
              htmlFor="admin-comment"
              className="block text-gray-600 font-medium mb-2"
            >
              Комментарий администратора (необязательно):
            </label>
            <Textarea
              id="admin-comment"
              placeholder="Введите комментарий..."
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              rows={3}
            />
          </div>

          

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Одобрить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Подтверждение отклонения</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отклонить эту запись о зарплате?
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label
              htmlFor="admin-comment"
              className="block text-gray-600 font-medium mb-2"
            >
              Комментарий администратора:{" "}
              <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="admin-comment"
              placeholder="Введите причину отклонения записи о зарплате..."
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              rows={3}
              className={!adminComment.trim() ? "border-red-300" : ""}
            />
            {!adminComment.trim() && (
              <p className="text-red-500 text-sm mt-1">
                Пожалуйста, укажите причину отклонения
              </p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={!adminComment.trim()}
            >
              Отклонить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Просмотр трудового договора</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] overflow-hidden bg-gray-100 flex items-center justify-center">
            {documentUrl ? (
              <iframe
                src={documentUrl}
                className="w-full h-full border-none"
                title="Трудовой договор"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="text-gray-500">Загрузка документа...</div>
            )}
          </div>
          <DialogFooter className="p-4 border-t">
            <Button
              variant="outline"
              onClick={() => setDocumentDialogOpen(false)}
            >
              Закрыть
            </Button>
            {documentUrl && (
              <Button
                onClick={() => window.open(documentUrl, "_blank")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Открыть в новой вкладке
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        {selectedSalary && (
          <DialogContent className="sm:max-w-md md:max-w-xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Детали зарплаты
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-[#800000]">
                  {selectedSalary.companyName}
                </h3>
                <p className="text-gray-600">{selectedSalary.position}</p>
                {selectedSalary.department && (
                  <p className="text-gray-500 text-sm">
                    {selectedSalary.department}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex">
                  <span className="w-48 text-gray-600 font-medium">
                    Зарплата:
                  </span>
                  <span className="font-medium text-[#800000]">
                    {getFormattedAmount(selectedSalary)}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-48 text-gray-600 font-medium">
                    Опыт работы:
                  </span>
                  <span className="font-medium">
                    {selectedSalary.experience}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-48 text-gray-600 font-medium">
                    Местоположение:
                  </span>
                  <span className="font-medium">{selectedSalary.location}</span>
                </div>

                <div className="flex">
                  <span className="w-48 text-gray-600 font-medium">
                    Тип занятости:
                  </span>
                  <span className="font-medium">
                    {getEmploymentTypeDisplay(selectedSalary.employmentType)}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-48 text-gray-600 font-medium">
                    Статус работы:
                  </span>
                  <span className="font-medium">
                    {selectedSalary.employmentStatus === "current"
                      ? "Текущий сотрудник"
                      : "Бывший сотрудник"}
                  </span>
                </div>

                {selectedSalary.bonuses && (
                  <div className="flex">
                    <span className="w-48 text-gray-600 font-medium">
                      Бонусы:
                    </span>
                    <span className="font-medium">
                      {selectedSalary.bonuses}
                    </span>
                  </div>
                )}

                {selectedSalary.stockOptions && (
                  <div className="flex">
                    <span className="w-48 text-gray-600 font-medium">
                      Опционы:
                    </span>
                    <span className="font-medium">
                      {selectedSalary.stockOptions}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="w-48 text-gray-600 font-medium">
                    Статус:
                  </span>
                  <Badge
                    variant={getStatusBadgeVariant(
                      selectedSalary.approvalStatus
                    )}
                  >
                    {getStatusDisplay(selectedSalary.approvalStatus)}
                  </Badge>
                </div>

                <div className="flex">
                  <span className="w-48 text-gray-600 font-medium">Дата:</span>
                  <span className="font-medium">{selectedSalary.date}</span>
                </div>

                {selectedSalary.contractDocumentUrl && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <FileText className="text-blue-600" size={18} />
                      <p
                        className={`font-medium ${
                          selectedSalary.hasVerification
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        Трудовой договор
                        {selectedSalary.hasVerification && " (Подтвержден)"}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 ml-8"
                      onClick={() =>
                        handleViewDocument(
                          selectedSalary.contractDocumentUrl as string
                        )
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Просмотреть договор
                    </Button>

                    
                  </div>
                )}

                {selectedSalary.adminComment && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-gray-600 font-medium">
                      Комментарий администратора:
                    </span>
                    <div className="bg-gray-50 p-3 rounded-md mt-2 text-gray-800">
                      {selectedSalary.adminComment}
                    </div>
                  </div>
                )}

                {isAdmin && selectedSalary.approvalStatus === "PENDING" && (
                  <div className="mt-4 pt-4 border-t">
                    <label
                      htmlFor="admin-comment-details"
                      className="block text-gray-600 font-medium mb-2"
                    >
                      Комментарий администратора:
                    </label>
                    <Textarea
                      id="admin-comment-details"
                      placeholder="Введите комментарий..."
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              {!isAdmin && canEdit(selectedSalary) && (
                <Button
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditSalary(selectedSalary.id.toString());
                  }}
                  className="mr-auto"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              )}

              {isAdmin && selectedSalary.approvalStatus === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleApproveClick(selectedSalary.id.toString());
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить
                  </Button>
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleRejectClick(selectedSalary.id.toString());
                    }}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Отклонить
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setDetailsDialogOpen(false)}
              >
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

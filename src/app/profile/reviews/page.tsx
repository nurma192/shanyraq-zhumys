"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit2, Trash2, Eye, MessageCircle, CheckCircle, XCircle, AlertCircle, Bot, FileText, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { fetchUserReviews, fetchAllReviews, deleteReview, updateReviewStatus } from "@/features/review/reviewSlice";
import { RootState, AppDispatch } from "@/store";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const isAdmin = user?.role === "ROLE_ADMIN";

  const [currentTab, setCurrentTab] = useState("Все");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adminComment, setAdminComment] = useState("");

  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const { userReviews, allReviews, isLoading, error, userReviewsLoaded, allReviewsLoaded } = useSelector((state: RootState) => state.review);

  useEffect(() => {
    if (isAdmin) {
      if (!allReviewsLoaded) {
        dispatch(fetchAllReviews(undefined));
      }
    } else {
      if (!userReviewsLoaded) {
        dispatch(fetchUserReviews());
      }
    }
  }, [dispatch, isAdmin, allReviewsLoaded, userReviewsLoaded]);

  const statusTabs = ["Все", "Новые", "Одобренные", "Отклоненные"];

  const handleAddReview = () => {
    router.push("/profile/add/review");
  };

  const handleEditReview = (reviewId: string) => {
    router.push(`/profile/add/review?id=${reviewId}`);
  };

  const handleDeleteReview = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedReviewId) {
      try {
        await dispatch(deleteReview(selectedReviewId)).unwrap();
        toast({
          title: "Отзыв удален",
          description: "Отзыв был успешно удален",
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить отзыв",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedReviewId(null);
  };

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setAdminComment("");
    setIsVerified(review.hasVerification);
    setDetailsDialogOpen(true);
  };

  const handleViewDocument = (url: string) => {
    const viewableUrl = url.includes("?") ? `${url}&view=1` : `${url}?view=1`;

    setDocumentUrl(viewableUrl);
    setDocumentDialogOpen(true);
  };

  const handleApproveClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (selectedReviewId) {
      try {
        const data = {
          status: "APPROVED",
          adminComment: adminComment.trim() || "Отзыв соответствует правилам сервиса",
          verified: isAdmin ? isVerified : undefined,
        };

        await dispatch(updateReviewStatus({ reviewId: selectedReviewId, data })).unwrap();

        toast({
          title: "Отзыв одобрен",
          description: "Отзыв был успешно одобрен",
        });

        setApproveDialogOpen(false);
        setSelectedReviewId(null);
        setAdminComment("");
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось одобрить отзыв",
          variant: "destructive",
        });
      }
    }
  };

  const confirmReject = async () => {
    if (!adminComment.trim() && isAdmin) {
      toast({
        title: "Требуется комментарий",
        description: "Пожалуйста, укажите причину отклонения отзыва",
        variant: "destructive",
      });
      return;
    }

    if (selectedReviewId) {
      try {
        const data = {
          status: "REJECTED",
          adminComment: adminComment,
          verified: isAdmin ? isVerified : undefined,
        };

        await dispatch(updateReviewStatus({ reviewId: selectedReviewId, data })).unwrap();

        toast({
          title: "Отзыв отклонен",
          description: "Отзыв был отклонен",
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось отклонить отзыв",
          variant: "destructive",
        });
      }
    }
    setRejectDialogOpen(false);
    setSelectedReviewId(null);
    setAdminComment("");
  };

  const updateVerificationStatus = async () => {
    if (selectedReview && isAdmin) {
      try {
        const data = {
          status: selectedReview.status,
          adminComment: selectedReview.adminComment || "",
          verified: isVerified,
        };

        await dispatch(updateReviewStatus({ reviewId: selectedReview.id.toString(), data })).unwrap();

        toast({
          title: "Верификация обновлена",
          description: isVerified ? "Трудовой договор подтверждён" : "Верификация трудового договора отменена",
        });

        setSelectedReview({
          ...selectedReview,
          hasVerification: isVerified,
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

  const handleModerate = (reviewId: string, action: "approve" | "reject") => {
    if (action === "approve") {
      handleApproveClick(reviewId);
    } else if (action === "reject") {
      const review = (isAdmin ? allReviews : userReviews).find(r => r.id.toString() === reviewId);
      if (review) {
        setSelectedReview(review);
        setSelectedReviewId(reviewId);
        setRejectDialogOpen(true);
      }
    }
  };

  const getFilteredReviews = () => {
    const reviews = isAdmin ? allReviews : userReviews;

    if (currentTab === "Все") return reviews;

    const statusMap: Record<string, string> = {
      Новые: "PENDING",
      Одобренные: "APPROVED",
      Отклоненные: "REJECTED",
    };

    return reviews.filter(review => review.approvalStatus === statusMap[currentTab]);
  };

  const getStatusBadgeVariant = (status: string) => {
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

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
        ))}
      </div>
    );
  };

  const canEdit = (review: any) => {
    return review.approvalStatus === "PENDING" || review.approvalStatus === "REJECTED";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1D1D1D]">{isAdmin ? "Модерация отзывов" : "Мои отзывы"}</h1>

        {!isAdmin && (
          <Button onClick={handleAddReview} className="bg-[#628307] hover:bg-[#4D6706] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Добавить отзыв
          </Button>
        )}
      </div>

      <Tabs defaultValue="Все" onValueChange={setCurrentTab} className="w-full">
        <TabsList className="bg-[#E6E6B0]/20 p-1 rounded-lg mb-6 w-full grid grid-cols-4">
          {statusTabs.map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-white data-[state=active]:text-[#628307] data-[state=active]:shadow-sm py-2 font-medium"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map(tab => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <Card className="border border-[#E6E6B0]">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <p className="text-[#1D1D1D]/70">Загрузка отзывов...</p>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center p-8 text-red-500">
                    <p>Ошибка загрузки: {error}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#E6E6B0]/10">
                        <TableRow>
                          <TableHead className="text-[#628307] font-semibold">Компания</TableHead>
                          <TableHead className="text-[#628307] font-semibold hidden md:table-cell">Должность</TableHead>
                          <TableHead className="text-[#628307] font-semibold">Рейтинг</TableHead>
                          <TableHead className="text-[#628307] font-semibold hidden sm:table-cell">Заголовок</TableHead>
                          <TableHead className="text-[#628307] font-semibold hidden lg:table-cell">Дата</TableHead>
                          <TableHead className="text-[#628307] font-semibold">Статус</TableHead>
                          <TableHead className="text-[#628307] font-semibold text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredReviews().map(review => (
                          <TableRow key={review.id} className="hover:bg-[#628307]/5">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-[#1D1D1D]">{review.companyName}</span>
                                {review.hasVerification && (
                                  <Badge variant="outline" className="text-xs bg-[#628307]/10 text-[#628307] border-[#628307]/20">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-[#1D1D1D]/80">{review.position}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#628307]">{review.rating}</span>
                                <span className="hidden sm:flex">{renderStarRating(review.rating)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-[#1D1D1D]/80">
                              <p className="truncate max-w-[150px]">{review.title}</p>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-[#1D1D1D]/70">{review.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant={getStatusBadgeVariant(review.approvalStatus)}
                                  className={
                                    review.approvalStatus === "APPROVED"
                                      ? "bg-[#628307]/10 text-[#628307] hover:bg-[#628307]/20"
                                      : review.approvalStatus === "REJECTED" || review.approvalStatus === "AI_REJECTED"
                                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                                      : "bg-[#E6E6B0]/30 text-[#1D1D1D]/70 hover:bg-[#E6E6B0]/50"
                                  }
                                >
                                  {getStatusDisplay(review.approvalStatus)}
                                </Badge>
                                {review.hasAdminComment && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <MessageCircle className="w-4 h-4 text-[#628307]" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Есть комментарий от модератора</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {review.contractDocumentUrl && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <FileText className="w-4 h-4 text-[#628307]" />
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
                                        onClick={() => handleViewDetails(review)}
                                        className="hover:bg-[#628307]/10 hover:text-[#628307]"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Просмотреть</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {!isAdmin && canEdit(review) && (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditReview(review.id.toString())}
                                            className="hover:bg-[#628307]/10 hover:text-[#628307]"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Редактировать</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}

                                {!isAdmin && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteReview(review.id.toString())}
                                          className="hover:bg-red-100 hover:text-red-600"
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

                                {isAdmin && review.approvalStatus === "PENDING" && (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleModerate(review.id.toString(), "approve")}
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
                                            onClick={() => handleModerate(review.id.toString(), "reject")}
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
            <AlertDialogTitle>Удаление отзыва</AlertDialogTitle>
            <AlertDialogDescription>Вы уверены, что хотите удалить этот отзыв? Это действие нельзя будет отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E6E6B0] hover:bg-[#E6E6B0]/20 text-[#1D1D1D]">Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#628307]">Подтверждение одобрения</DialogTitle>
            <DialogDescription>Вы уверены, что хотите одобрить этот отзыв?</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label htmlFor="admin-comment" className="block text-[#1D1D1D]/80 font-medium mb-2">
              Комментарий администратора (необязательно):
            </label>
            <Textarea
              id="admin-comment"
              placeholder="Введите комментарий..."
              value={adminComment}
              onChange={e => setAdminComment(e.target.value)}
              rows={3}
              className="border-[#E6E6B0] focus-visible:ring-[#628307]"
            />
          </div>

          {isAdmin && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verify-contract"
                  checked={isVerified}
                  onCheckedChange={checked => setIsVerified(!!checked)}
                  className="border-[#628307] data-[state=checked]:bg-[#628307] data-[state=checked]:border-[#628307]"
                />
                <label
                  htmlFor="verify-contract"
                  className="text-sm font-medium leading-none text-[#1D1D1D]/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Подтвердить подлинность трудового договора
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)} className="border-[#E6E6B0] hover:bg-[#E6E6B0]/20 text-[#1D1D1D]">
              Отмена
            </Button>
            <Button onClick={confirmApprove} className="bg-[#628307] hover:bg-[#4D6706]">
              Одобрить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#628307]">Подтверждение отклонения</DialogTitle>
            <DialogDescription>Вы уверены, что хотите отклонить этот отзыв?</DialogDescription>
          </DialogHeader>

          {selectedReview && selectedReview.aiAnalysis && (
            <div className="mt-4 bg-[#E6E6B0]/20 border border-[#E6E6B0]/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-[#628307]" />
                <h4 className="font-medium text-[#1D1D1D]">Анализ ИИ:</h4>
              </div>
              <p className="text-[#1D1D1D]/80 text-sm">{selectedReview.aiAnalysis}</p>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="admin-comment" className="block text-[#1D1D1D]/80 font-medium mb-2">
              Комментарий администратора: <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="admin-comment"
              placeholder="Введите причину отклонения отзыва..."
              value={adminComment}
              onChange={e => setAdminComment(e.target.value)}
              rows={3}
              className={!adminComment.trim() ? "border-red-300 focus-visible:ring-red-500" : "border-[#E6E6B0] focus-visible:ring-[#628307]"}
            />
            {!adminComment.trim() && <p className="text-red-500 text-sm mt-1">Пожалуйста, укажите причину отклонения отзыва</p>}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="border-[#E6E6B0] hover:bg-[#E6E6B0]/20 text-[#1D1D1D]">
              Отмена
            </Button>
            <Button onClick={confirmReject} className="bg-red-600 hover:bg-red-700" disabled={!adminComment.trim()}>
              Отклонить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b border-[#E6E6B0]">
            <DialogTitle className="text-[#628307]">Просмотр трудового договора</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] overflow-hidden bg-[#E6E6B0]/10 flex items-center justify-center">
            {documentUrl ? (
              <iframe src={documentUrl} className="w-full h-full border-none" title="Трудовой договор" sandbox="allow-scripts allow-same-origin" />
            ) : (
              <div className="text-[#1D1D1D]/50">Загрузка документа...</div>
            )}
          </div>
          <DialogFooter className="p-4 border-t border-[#E6E6B0]">
            <Button variant="outline" onClick={() => setDocumentDialogOpen(false)} className="border-[#E6E6B0] hover:bg-[#E6E6B0]/20 text-[#1D1D1D]">
              Закрыть
            </Button>
            {documentUrl && (
              <Button onClick={() => window.open(documentUrl, "_blank")} className="bg-[#628307] hover:bg-[#4D6706]">
                <ExternalLink className="w-4 h-4 mr-2" />
                Открыть в новой вкладке
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        {selectedReview && (
          <DialogContent className="sm:max-w-md md:max-w-xl bg-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[#628307]">{selectedReview.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#E6E6B0] pb-4">
                <h3 className="font-semibold text-[#628307]">{selectedReview.companyName}</h3>
                <p className="text-[#1D1D1D]/70">{selectedReview.position}</p>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[#1D1D1D]/80">Общая оценка:</span>
                  <span className="font-semibold text-[#628307]">{selectedReview.rating} / 5</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-1 text-[#1D1D1D]">Основной отзыв</h5>
                  <p className="text-[#1D1D1D]/80 leading-relaxed">{selectedReview.body}</p>
                </div>

                {selectedReview.pros && (
                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Плюсы</h5>
                    <p className="text-[#1D1D1D]/80">{selectedReview.pros}</p>
                  </div>
                )}

                {selectedReview.cons && (
                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Минусы</h5>
                    <p className="text-[#1D1D1D]/80">{selectedReview.cons}</p>
                  </div>
                )}

                {selectedReview.advice && (
                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Советы руководству</h5>
                    <p className="text-[#1D1D1D]/80">{selectedReview.advice}</p>
                  </div>
                )}

                {selectedReview.contractDocumentUrl && (
                  <div className="mt-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#628307]" />
                      <h5 className="font-medium text-[#1D1D1D]">Трудовой договор</h5>
                      {selectedReview.hasVerification && (
                        <Badge variant="outline" className="text-xs bg-[#628307]/10 text-[#628307] border-[#628307]/20">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 text-[#628307] border-[#E6E6B0] hover:bg-[#628307]/10"
                      onClick={() => handleViewDocument(selectedReview.contractDocumentUrl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Просмотреть документ
                    </Button>
                  </div>
                )}

                <Separator className="my-4 bg-[#E6E6B0]" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Карьерный рост</h5>
                    <div className="flex items-center">
                      <span className="mr-2 text-[#628307] font-medium">{selectedReview.careerOpportunities}</span>
                      {renderStarRating(selectedReview.careerOpportunities)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Баланс работы/жизни</h5>
                    <div className="flex items-center">
                      <span className="mr-2 text-[#628307] font-medium">{selectedReview.workLifeBalance}</span>
                      {renderStarRating(selectedReview.workLifeBalance)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Компенсация</h5>
                    <div className="flex items-center">
                      <span className="mr-2 text-[#628307] font-medium">{selectedReview.compensation}</span>
                      {renderStarRating(selectedReview.compensation)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Безопасность работы</h5>
                    <div className="flex items-center">
                      <span className="mr-2 text-[#628307] font-medium">{selectedReview.jobSecurity}</span>
                      {renderStarRating(selectedReview.jobSecurity)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 text-[#1D1D1D]">Управление</h5>
                    <div className="flex items-center">
                      <span className="mr-2 text-[#628307] font-medium">{selectedReview.management}</span>
                      {renderStarRating(selectedReview.management)}
                    </div>
                  </div>
                </div>

                {selectedReview.hasAdminComment && selectedReview.adminComment && (
                  <div className="bg-red-50 border-l-4 border-red-500 pl-4 py-3 pr-3 mt-4">
                    <h4 className="text-red-600 font-medium mb-1">Комментарий модератора:</h4>
                    <p className="text-[#1D1D1D]/80">{selectedReview.adminComment}</p>
                  </div>
                )}

                {isAdmin && selectedReview.aiAnalysis && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-[#628307]" />
                      <h4 className="font-medium text-[#1D1D1D]">Обратная связь от ИИ:</h4>
                    </div>
                    <div className="bg-[#E6E6B0]/20 border border-[#E6E6B0]/30 rounded-lg p-3">
                      <p className="text-[#1D1D1D]/80 text-sm">{selectedReview.aiAnalysis}</p>
                    </div>
                  </div>
                )}

                {isAdmin && selectedReview.approvalStatus === "PENDING" && (
                  <div className="mt-4">
                    <label htmlFor="admin-comment-details" className="block text-[#1D1D1D]/80 font-medium mb-2">
                      Комментарий администратора:
                    </label>
                    <Textarea
                      id="admin-comment-details"
                      placeholder="Введите комментарий..."
                      value={adminComment}
                      onChange={e => setAdminComment(e.target.value)}
                      rows={3}
                      className="border-[#E6E6B0] focus-visible:ring-[#628307]"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              {!isAdmin && canEdit(selectedReview) && (
                <Button
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditReview(selectedReview.id.toString());
                  }}
                  className="mr-auto bg-[#628307] hover:bg-[#4D6706]"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              )}

              {isAdmin && selectedReview.approvalStatus === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleApproveClick(selectedReview.id.toString());
                    }}
                    className="bg-[#628307] hover:bg-[#4D6706]"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить
                  </Button>
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleRejectClick(selectedReview.id.toString());
                    }}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Отклонить
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)} className="border-[#E6E6B0] hover:bg-[#E6E6B0]/20 text-[#1D1D1D]">
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

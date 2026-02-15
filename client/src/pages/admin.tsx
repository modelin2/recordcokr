import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, Mail, User, Phone, Music, Coffee, ShoppingBag, CheckCircle, AlertCircle, Timer, XCircle, Filter, Search, Send, Users as UserIcon, LogOut, Camera, Trash2, Edit } from "lucide-react";
import type { Booking, VisitReservation, HotelBooking, Announcement, AdminSchedule } from "@shared/schema";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useLocation } from "wouter";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/50", 
  "in-progress": "bg-purple-500/20 text-purple-300 border-purple-500/50",
  completed: "bg-green-500/20 text-green-300 border-green-500/50",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/50"
};

const paymentStatusColors = {
  paid: "bg-green-500/20 text-green-300 border-green-500/50",
  unpaid: "bg-gray-500/20 text-gray-300 border-gray-500/50",
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
};

const paymentStatusLabels = {
  paid: "💳 Paid",
  unpaid: "Unpaid",
  pending: "⏳ 결제 대기중"
};

const statusIcons = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  "in-progress": Timer,
  completed: CheckCircle,
  cancelled: XCircle
};

function PromoManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/promo-coupons"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, couponAmount, adminNote }: { id: number; status: string; couponAmount?: number; adminNote?: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/promo-coupons/${id}`, { status, couponAmount, adminNote });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-coupons"] });
      toast({ title: "쿠폰 상태 업데이트 완료" });
    },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");

  const pendingCoupons = coupons.filter((c: any) => c.status === "pending");
  const processedCoupons = coupons.filter((c: any) => c.status !== "pending");

  const handleApprove = (id: number) => {
    const amount = parseInt(editAmount);
    if (!amount || amount < 10000 || amount > 500000) {
      toast({ title: "쿠폰 금액을 확인해주세요", description: "₩10,000 ~ ₩500,000 범위로 입력", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id, status: "approved", couponAmount: amount, adminNote: editNote });
    setEditingId(null);
    setEditAmount("");
    setEditNote("");
  };

  const handleReject = (id: number) => {
    updateMutation.mutate({ id, status: "rejected", adminNote: editNote });
    setEditingId(null);
    setEditAmount("");
    setEditNote("");
  };

  if (isLoading) return <div className="text-white text-center py-8">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            🎁 SNS 후기 쿠폰 관리
            {pendingCoupons.length > 0 && (
              <Badge className="bg-yellow-500 text-black font-bold">{pendingCoupons.length}건 대기</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
            <p className="font-bold mb-2">📋 운영 프로세스</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-blue-200">
              <li>고객이 NFT 키링 페이지에서 SNS 후기 URL을 제출합니다</li>
              <li>아래 목록에 "대기중" 상태로 표시됩니다</li>
              <li>링크를 클릭하여 후기 내용과 영향력을 확인합니다</li>
              <li>쿠폰 금액(₩10,000~₩500,000)을 입력하고 승인 또는 반려합니다</li>
              <li>승인된 쿠폰은 고객의 NFT 페이지에 자동으로 표시됩니다</li>
              <li>고객이 추가 서비스 신청 시 쿠폰을 사용할 수 있습니다</li>
            </ol>
          </div>

          {pendingCoupons.length === 0 && processedCoupons.length === 0 && (
            <p className="text-gray-400 text-center py-8">아직 제출된 후기가 없습니다</p>
          )}

          {pendingCoupons.length > 0 && (
            <div>
              <h3 className="text-yellow-400 font-bold text-sm mb-3">⏳ 검토 대기</h3>
              <div className="space-y-3">
                {pendingCoupons.map((c: any) => (
                  <div key={c.id} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-sm">{c.customerName}</span>
                          <Badge className="text-[10px] bg-gray-700">{c.snsPlatform}</Badge>
                        </div>
                        <a
                          href={c.snsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 text-xs break-all underline"
                        >
                          {c.snsUrl}
                        </a>
                        <p className="text-gray-500 text-[11px] mt-1">{new Date(c.createdAt).toLocaleString("ko-KR")}</p>
                      </div>
                    </div>

                    {editingId === c.id ? (
                      <div className="mt-3 space-y-2 bg-black/30 rounded-lg p-3">
                        <div>
                          <Label className="text-xs text-gray-400">쿠폰 금액 (₩)</Label>
                          <Input
                            type="number"
                            min="10000"
                            max="500000"
                            step="10000"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            placeholder="예: 50000"
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">관리자 메모 (선택)</Label>
                          <Input
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder="메모 입력..."
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApprove(c.id)} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                            ✅ 승인
                          </Button>
                          <Button size="sm" onClick={() => handleReject(c.id)} className="bg-red-600 hover:bg-red-700 text-white flex-1">
                            ❌ 반려
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-gray-400 border-gray-600">
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <Button size="sm" onClick={() => setEditingId(c.id)} className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30">
                          검토하기
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {processedCoupons.length > 0 && (
            <div>
              <h3 className="text-gray-400 font-bold text-sm mb-3">📜 처리 완료</h3>
              <div className="space-y-2">
                {processedCoupons.map((c: any) => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{c.customerName}</span>
                        <Badge className="text-[10px] bg-gray-700">{c.snsPlatform}</Badge>
                        <a href={c.snsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          <Copy className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.status === "approved" && c.couponAmount && (
                          <span className="text-green-400 font-bold text-sm">₩{c.couponAmount.toLocaleString()}</span>
                        )}
                        <Badge className={c.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {c.status === "approved" ? "승인" : "반려"}
                        </Badge>
                      </div>
                    </div>
                    {c.adminNote && <p className="text-gray-500 text-xs mt-1">메모: {c.adminNote}</p>}
                    <p className="text-gray-600 text-[11px] mt-1">{new Date(c.createdAt).toLocaleString("ko-KR")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NftManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const { data: nftPages = [], isLoading } = useQuery({
    queryKey: ["/api/admin/nft-pages"],
  });

  const uploadAudioMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(",")[1];
            await apiRequest("POST", `/api/admin/nft-pages/${id}/upload-audio`, {
              fileName: file.name,
              fileData: base64,
            });
            resolve();
          } catch (e) { reject(e); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nft-pages"] });
      toast({ title: "음원 업로드 완료" });
      setUploadingId(null);
    },
    onError: () => {
      toast({ title: "업로드 실패", variant: "destructive" });
    },
  });

  const deleteAudioMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/nft-pages/${id}/audio`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nft-pages"] });
      toast({ title: "음원 삭제 완료" });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/nft-pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nft-pages"] });
      toast({ title: "NFT 페이지 삭제 완료" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, requestId, status }: { id: number; requestId: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/nft-pages/${id}/service-request`, { requestId, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nft-pages"] });
      toast({ title: "서비스 상태 업데이트 완료" });
    },
  });

  const uploadDeliveryMutation = useMutation({
    mutationFn: async ({ pageId, requestId, file }: { pageId: number; requestId: number; file: File }) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(",")[1];
            await apiRequest("POST", `/api/admin/nft-pages/${pageId}/service-request/${requestId}/upload-file`, {
              fileName: file.name,
              fileData: base64,
            });
            resolve();
          } catch (e) { reject(e); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nft-pages"] });
      toast({ title: "파일 전달 완료" });
    },
    onError: () => {
      toast({ title: "파일 업로드 실패", variant: "destructive" });
    },
  });

  const deleteDeliveryFileMutation = useMutation({
    mutationFn: async ({ pageId, requestId, fileIndex }: { pageId: number; requestId: number; fileIndex: number }) => {
      await apiRequest("DELETE", `/api/admin/nft-pages/${pageId}/service-request/${requestId}/file/${fileIndex}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nft-pages"] });
      toast({ title: "전달 파일 삭제 완료" });
    },
  });

  const handleDeliveryFileSelect = (pageId: number, requestId: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*,video/*,.mp3,.wav,.m4a,.flac,.mp4,.mov,.zip";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadDeliveryMutation.mutate({ pageId, requestId, file });
      }
    };
    input.click();
  };

  const handleFileSelect = (id: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*,.mp3,.wav,.m4a,.flac";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadingId(id);
        uploadAudioMutation.mutate({ id, file });
      }
    };
    input.click();
  };

  if (isLoading) return <div className="text-center py-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">NFT 키링 페이지 관리</CardTitle>
        </CardHeader>
        <CardContent>
          {(nftPages as any[]).length === 0 ? (
            <p className="text-gray-400 text-center py-8">생성된 NFT 페이지가 없습니다. CD 키링을 생성하면 자동으로 생성됩니다.</p>
          ) : (
            <div className="space-y-4">
              {(nftPages as any[]).map((page: any) => {
                const serviceRequests = page.serviceRequests ? JSON.parse(page.serviceRequests) : [];
                const pendingRequests = serviceRequests.filter((r: any) => r.status === "pending");
                return (
                  <div key={page.id} className="border border-white/10 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {page.customerName}
                          {page.koreanName && <span className="text-gray-400 text-sm ml-2">({page.koreanName})</span>}
                        </h3>
                        <p className="text-gray-500 text-xs">{page.recordingDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          page.audioStatus === "ready" ? "bg-green-500/20 text-green-300" :
                          page.audioStatus === "downloaded" ? "bg-blue-500/20 text-blue-300" :
                          "bg-yellow-500/20 text-yellow-300"
                        }>
                          {page.audioStatus === "ready" ? "다운로드 가능" :
                           page.audioStatus === "downloaded" ? "다운로드 완료" : "후반작업 중"}
                        </Badge>
                        {pendingRequests.length > 0 && (
                          <Badge className="bg-red-500/20 text-red-300">서비스 신청 {pendingRequests.length}건</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">NFT URL:</span>
                      <a
                        href={`/nft/${page.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 bg-white/5 px-2 py-0.5 rounded text-xs hover:text-yellow-300 hover:underline cursor-pointer"
                      >
                        /nft/{page.token} ↗
                      </a>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => handleFileSelect(page.id)}
                        disabled={uploadAudioMutation.isPending && uploadingId === page.id}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                      >
                        <Music className="w-3 h-3 mr-1" />
                        {uploadAudioMutation.isPending && uploadingId === page.id ? "업로드중..." : "음원 업로드"}
                      </Button>
                      {page.hasAudioFile && (
                        <>
                          <span className="text-green-400 text-xs flex items-center gap-1">
                            <Music className="w-3 h-3" /> {page.audioFileName || "recording.mp3"}
                          </span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteAudioMutation.mutate(page.id)}
                            disabled={deleteAudioMutation.isPending}
                            className="text-xs h-8"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> 음원 삭제
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePageMutation.mutate(page.id)}
                        disabled={deletePageMutation.isPending}
                        className="text-xs h-8 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> 페이지 삭제
                      </Button>
                    </div>

                    {serviceRequests.length > 0 && (
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-gray-400 text-xs font-bold mb-2">추가 서비스 신청</p>
                        {serviceRequests.map((req: any) => (
                          <div key={req.id} className="bg-white/5 rounded p-2 mb-2">
                            <div className="flex items-center justify-between text-xs">
                              <div>
                                <span className="text-gray-300">
                                  {req.services?.map((s: any) => s.name || s.nameEn).join(", ")}
                                </span>
                                <span className="text-gray-600 ml-2">{new Date(req.requestedAt).toLocaleDateString("ko-KR")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={req.status === "pending" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}>
                                  {req.status === "pending" ? "대기" : "완료"}
                                </Badge>
                                {req.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                                    onClick={() => updateServiceMutation.mutate({ id: page.id, requestId: req.id, status: "completed" })}
                                  >
                                    완료처리
                                  </Button>
                                )}
                              </div>
                            </div>
                            {req.couponApplied > 0 && (
                              <div className="flex items-center gap-1 mt-1 text-[11px] text-green-400">
                                <span>🎁 쿠폰 적용: ₩{req.couponApplied.toLocaleString()}</span>
                                <span className="text-gray-600">| 합계: ₩{(req.services?.reduce((sum: number, s: any) => sum + (s.price || 0), 0) || 0).toLocaleString()}</span>
                                <span className="text-yellow-400 font-bold">→ ₩{Math.max(0, (req.services?.reduce((sum: number, s: any) => sum + (s.price || 0), 0) || 0) - req.couponApplied).toLocaleString()}</span>
                              </div>
                            )}
                            {req.paypalOrderId && (
                              <div className="flex items-center gap-1 mt-1 text-[11px] text-blue-400">
                                <span>💳 PayPal 결제: {req.paypalOrderId}</span>
                              </div>
                            )}
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                              <Button
                                size="sm"
                                className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleDeliveryFileSelect(page.id, req.id)}
                                disabled={uploadDeliveryMutation.isPending}
                              >
                                📁 {uploadDeliveryMutation.isPending ? "업로드중..." : "파일 전달"}
                              </Button>
                              {req.deliveryFiles?.map((f: any, fi: number) => (
                                <div key={fi} className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] ${f.downloaded ? "bg-gray-700/30" : "bg-blue-900/30"}`}>
                                  <span className={`truncate max-w-[120px] ${f.downloaded ? "text-gray-500 line-through" : "text-blue-300"}`}>{f.name}</span>
                                  {f.downloaded && <span className="text-green-500 text-[10px]">✓수신</span>}
                                  <button
                                    onClick={() => deleteDeliveryFileMutation.mutate({ pageId: page.id, requestId: req.id, fileIndex: fi })}
                                    className="text-red-400 hover:text-red-300 ml-1"
                                  >×</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "visit-reservations" | "hotel-bookings" | "calendar" | "nft" | "promo">("bookings");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAdmin, error } = useAuth();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "관리자 페이지에 접근하려면 로그인이 필요합니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/login");
        }, 1500);
      } else if (!isAdmin) {
        toast({
          title: "접근 권한 없음",
          description: "관리자 권한이 필요합니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/");
        }, 1500);
      }
    }
  }, [authLoading, user, isAdmin, setLocation, toast, error]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      setLocation("/login");
    },
    onError: () => {
      toast({
        title: "Logout Failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch all bookings and addons for better display
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
  });

  const { data: addons = [] } = useQuery<any[]>({
    queryKey: ['/api/addons'],
  });

  // Fetch visit reservations
  const { data: visitReservations = [], isLoading: visitReservationsLoading } = useQuery<VisitReservation[]>({
    queryKey: ['/api/visit-reservations'],
  });

  // Fetch hotel bookings
  const { data: hotelBookings = [], isLoading: hotelBookingsLoading } = useQuery<HotelBooking[]>({
    queryKey: ['/api/hotel-bookings'],
  });

  // Fetch announcements
  const { data: announcementsList = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements'],
  });

  // Fetch admin schedules for calendar
  const { data: adminSchedules = [] } = useQuery<AdminSchedule[]>({
    queryKey: ['/api/admin-schedules'],
  });

  // Announcement state
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<number | null>(null);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [editingAnnouncement, setEditingAnnouncement] = useState<number | null>(null);
  const [editAnnouncementTitle, setEditAnnouncementTitle] = useState("");
  const [editAnnouncementContent, setEditAnnouncementContent] = useState("");

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [newScheduleDate, setNewScheduleDate] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");
  const [newScheduleTitle, setNewScheduleTitle] = useState("");
  const [newScheduleDescription, setNewScheduleDescription] = useState("");
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<{type: 'visit' | 'hotel' | 'schedule', data: any} | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Fetch available time slots when schedule date changes
  useEffect(() => {
    if (newScheduleDate) {
      fetch(`/api/booked-times/${newScheduleDate}`)
        .then(res => res.json())
        .then(data => {
          const bookedTimes = data.bookedTimes || [];
          // Generate all 10-minute interval slots from 10:00 to 21:50
          const allSlots: string[] = [];
          for (let hour = 10; hour <= 21; hour++) {
            for (let min = 0; min < 60; min += 10) {
              const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
              allSlots.push(timeStr);
            }
          }
          // Filter out booked times
          const available = allSlots.filter(slot => !bookedTimes.includes(slot));
          setAvailableTimeSlots(available);
        })
        .catch(() => setAvailableTimeSlots([]));
    } else {
      setAvailableTimeSlots([]);
    }
  }, [newScheduleDate]);

  // Update visit reservation status mutation
  const updateVisitStatusMutation = useMutation({
    mutationFn: async ({ reservationId, status }: { reservationId: number; status: string }) => {
      return apiRequest("PATCH", `/api/visit-reservations/${reservationId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visit-reservations'] });
      toast({
        title: "Status Updated",
        description: "Visit reservation status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update visit reservation status.",
        variant: "destructive",
      });
    },
  });

  // Update hotel booking status mutation
  const updateHotelBookingStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number; status: string }) => {
      return apiRequest("PATCH", `/api/hotel-bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hotel-bookings'] });
      toast({
        title: "Status Updated",
        description: "Hotel booking status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update hotel booking status.",
        variant: "destructive",
      });
    },
  });

  // Delete visit reservation mutation
  const deleteVisitReservationMutation = useMutation({
    mutationFn: async (reservationId: number) => {
      return apiRequest("DELETE", `/api/visit-reservations/${reservationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visit-reservations'] });
      toast({
        title: "삭제 완료",
        description: "홈페이지 예약이 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "홈페이지 예약 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete hotel booking mutation
  const deleteHotelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      return apiRequest("DELETE", `/api/hotel-bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hotel-bookings'] });
      toast({
        title: "삭제 완료",
        description: "제휴사 예약이 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "제휴사 예약 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete booking mutation (메뉴 선택)
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      return apiRequest("DELETE", `/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({
        title: "삭제 완료",
        description: "예약이 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "예약 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      return apiRequest("POST", "/api/announcements", { title, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setNewAnnouncementTitle("");
      setNewAnnouncementContent("");
      toast({
        title: "공지 등록 완료",
        description: "새 공지사항이 등록되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "등록 실패",
        description: "공지사항 등록에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({
        title: "삭제 완료",
        description: "공지사항이 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "공지사항 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update announcement mutation
  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: number; title: string; content: string }) => {
      return apiRequest("PATCH", `/api/announcements/${id}`, { title, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setEditingAnnouncement(null);
      setEditAnnouncementTitle("");
      setEditAnnouncementContent("");
      toast({
        title: "수정 완료",
        description: "공지사항이 수정되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "수정 실패",
        description: "공지사항 수정에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Create admin schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async ({ title, description, scheduleDate, scheduleTime }: { title: string; description?: string; scheduleDate: string; scheduleTime?: string }) => {
      return apiRequest("POST", "/api/admin-schedules", { title, description, scheduleDate, scheduleTime });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-schedules'] });
      setNewScheduleTitle("");
      setNewScheduleDescription("");
      setNewScheduleDate("");
      setNewScheduleTime("");
      toast({
        title: "스케줄 등록 완료",
        description: "새 스케줄이 등록되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "등록 실패",
        description: "스케줄 등록에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete admin schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin-schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-schedules'] });
      toast({
        title: "삭제 완료",
        description: "스케줄이 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "스케줄 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Helper function to convert URLs to clickable links
  const renderContentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 underline hover:text-blue-300"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const isSuperAdmin = (user as any)?.role === 'super_admin';

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    },
  });

  // Show loading or redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async ({ bookingId, subject, message }: { bookingId: number; subject: string; message: string }) => {
      return apiRequest("POST", `/api/admin/bookings/${bookingId}/send-email`, {
        subject,
        message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Email has been sent successfully.",
      });
      setEmailSubject("");
      setEmailMessage("");
      setSelectedBooking(null);
    },
    onError: () => {
      toast({
        title: "Email Failed",
        description: "Failed to send email.",
        variant: "destructive",
      });
    },
  });

  // Copy YouTube URL function
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "URL 복사됨",
        description: "YouTube URL이 클립보드에 복사되었습니다!",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "URL 복사에 실패했습니다",
        variant: "destructive",
      });
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      (booking.bookingType === "klook" && "klook".includes(searchQuery.toLowerCase())) ||
      (booking.bookingType === "direct" && "direct".includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    inProgress: bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    updateStatusMutation.mutate({ bookingId, status: newStatus });
  };

  const handleSendEmail = () => {
    if (!selectedBooking || !emailSubject || !emailMessage) return;
    sendEmailMutation.mutate({
      bookingId: selectedBooking.id,
      subject: emailSubject,
      message: emailMessage,
    });
  };

  // Pre-defined email templates
  const emailTemplates = {
    confirmation: {
      subject: "Recording Session Confirmed - Recording Cafe",
      message: `안녕하세요 {{name}}님,

Recording Cafe에서 예약해 주셔서 감사합니다.

예약 정보:
- 날짜: {{date}}
- 시간: {{time}}
- 음료: {{drink}}
- 총 금액: ₩{{price}}

스튜디오 위치: 서울시 강남구 신사동
문의사항이 있으시면 언제든 연락 주세요.

감사합니다.
Recording Cafe Team`
    },
    reminder: {
      subject: "Recording Session Reminder - Tomorrow",
      message: `안녕하세요 {{name}}님,

내일 예정된 녹음 세션을 잊지 마세요!

예약 정보:
- 날짜: {{date}}
- 시간: {{time}}
- YouTube 트랙: {{track}}

준비사항:
1. 백킹 트랙 미리 연습해 주세요
2. 편안한 복장으로 오세요
3. 물을 충분히 마셔주세요

기대하고 있겠습니다!
Recording Cafe Team`
    },
    completion: {
      subject: "Recording Complete - Download Your Track",
      message: `안녕하세요 {{name}}님,

녹음 세션이 완료되었습니다!

첨부파일로 완성된 트랙을 보내드립니다.
소셜미디어에 공유하실 때 @k_recording_cafe를 태그해 주세요!

다음에 또 뵙겠습니다.
Recording Cafe Team`
    }
  };

  const applyEmailTemplate = (template: keyof typeof emailTemplates) => {
    if (!selectedBooking) return;
    
    const { subject, message } = emailTemplates[template];
    setEmailSubject(subject);
    
    let processedMessage = message
      .replace(/{{name}}/g, selectedBooking.name)
      .replace(/{{date}}/g, selectedBooking.bookingDate || "TBD")
      .replace(/{{time}}/g, selectedBooking.bookingTime || "TBD")
      .replace(/{{drink}}/g, selectedBooking.selectedDrink || "Not selected")
      .replace(/{{price}}/g, selectedBooking.totalPrice.toLocaleString())
      .replace(/{{track}}/g, selectedBooking.youtubeTrackUrl || "Not provided");
    
    setEmailMessage(processedMessage);
  };

  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Welcome back, {(user as any)?.username} ({(user as any)?.role})</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => window.location.href = '/admin/users'}
              className="k-gradient-pink-purple text-white"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              사용자 관리
            </Button>
            <Button 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Announcement Board */}
        <Card className="glass border-white/20 mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              📢 Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Super Admin: New Announcement Form */}
            {isSuperAdmin && (
              <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="space-y-3">
                  <Input
                    placeholder="제목 / Title"
                    value={newAnnouncementTitle}
                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Textarea
                    placeholder="내용 / Content (URL은 자동으로 링크됩니다)"
                    value={newAnnouncementContent}
                    onChange={(e) => setNewAnnouncementContent(e.target.value)}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    onClick={() => {
                      if (newAnnouncementTitle && newAnnouncementContent) {
                        createAnnouncementMutation.mutate({
                          title: newAnnouncementTitle,
                          content: newAnnouncementContent,
                        });
                      }
                    }}
                    disabled={!newAnnouncementTitle || !newAnnouncementContent || createAnnouncementMutation.isPending}
                    className="k-gradient-pink-purple text-white"
                  >
                    {createAnnouncementMutation.isPending ? "등록 중..." : "공지 등록"}
                  </Button>
                </div>
              </div>
            )}

            {/* Announcement List */}
            {announcementsList.length === 0 ? (
              <div className="text-gray-400 text-center py-4">등록된 공지사항이 없습니다.</div>
            ) : (
              <div className="space-y-2">
                {announcementsList.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className="border border-white/10 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="p-3 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors flex justify-between items-center"
                      onClick={() => setExpandedAnnouncement(
                        expandedAnnouncement === announcement.id ? null : announcement.id
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{announcement.title}</span>
                        {announcement.createdAt && (Date.now() - new Date(announcement.createdAt).getTime()) < 24 * 60 * 60 * 1000 && (
                          <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                        )}
                        <span className="text-gray-400 text-xs">
                          {announcement.createdAt ? format(new Date(announcement.createdAt), 'yyyy-MM-dd') : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSuperAdmin && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAnnouncement(announcement.id);
                                setEditAnnouncementTitle(announcement.title);
                                setEditAnnouncementContent(announcement.content);
                              }}
                              className="text-gray-400 hover:text-white hover:bg-white/10 h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm("이 공지를 삭제하시겠습니까?")) {
                                  deleteAnnouncementMutation.mutate(announcement.id);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-300 hover:bg-white/10 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Edit Form */}
                    {editingAnnouncement === announcement.id && (
                      <div className="p-4 bg-white/10 border-t border-white/10 space-y-3">
                        <Input
                          value={editAnnouncementTitle}
                          onChange={(e) => setEditAnnouncementTitle(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="제목"
                        />
                        <Textarea
                          value={editAnnouncementContent}
                          onChange={(e) => setEditAnnouncementContent(e.target.value)}
                          rows={3}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="내용"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              updateAnnouncementMutation.mutate({
                                id: announcement.id,
                                title: editAnnouncementTitle,
                                content: editAnnouncementContent,
                              });
                            }}
                            disabled={updateAnnouncementMutation.isPending}
                            className="k-gradient-pink-purple text-white"
                            size="sm"
                          >
                            {updateAnnouncementMutation.isPending ? "저장 중..." : "저장"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAnnouncement(null)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    )}
                    {/* Content Display */}
                    {expandedAnnouncement === announcement.id && editingAnnouncement !== announcement.id && (
                      <div className="p-4 bg-white/5 border-t border-white/10 text-gray-300 whitespace-pre-wrap">
                        {renderContentWithLinks(announcement.content)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "bookings" | "visit-reservations" | "hotel-bookings" | "calendar" | "nft" | "promo")} className="w-full">
          <TabsList className="grid w-full grid-cols-3 grid-rows-2 bg-white/10 mb-6 h-auto p-1 gap-1">
            <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/20 text-[11px] sm:text-xs py-2 px-1">
              📋 메뉴 선택
            </TabsTrigger>
            <TabsTrigger value="visit-reservations" className="text-white data-[state=active]:bg-white/20 text-[11px] sm:text-xs py-2 px-1">
              🎯 홈페이지
              {visitReservations.length > 0 && (
                <Badge className="ml-1 bg-pink-500/50 text-white text-[9px] px-1 h-4">{visitReservations.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="hotel-bookings" className="text-white data-[state=active]:bg-white/20 text-[11px] sm:text-xs py-2 px-1">
              🏨 제휴사
              {hotelBookings.length > 0 && (
                <Badge className="ml-1 bg-blue-500/50 text-white text-[9px] px-1 h-4">{hotelBookings.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-white/20 text-[11px] sm:text-xs py-2 px-1">
              📅 캘린더
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-white data-[state=active]:bg-white/20 text-[11px] sm:text-xs py-2 px-1">
              💿 NFT 키링
            </TabsTrigger>
            <TabsTrigger value="promo" className="text-white data-[state=active]:bg-white/20 text-[11px] sm:text-xs py-2 px-1">
              🎁 쿠폰
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {/* Filters */}
            <Card className="glass border-white/20 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-white mb-2 block">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email, phone, or booking type (klook/direct)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Status Filter</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking: Booking) => {
                const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];
            
            return (
              <Card key={booking.id} className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-white">{booking.name}</span>
                        </div>
                        <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        {booking.bookingType === "klook" && (
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                            Klook
                          </Badge>
                        )}
                        {(booking as any).paymentStatus && (booking as any).paymentStatus !== "unpaid" && (
                          <Badge className={paymentStatusColors[(booking as any).paymentStatus as keyof typeof paymentStatusColors] || paymentStatusColors.unpaid}>
                            {paymentStatusLabels[(booking as any).paymentStatus as keyof typeof paymentStatusLabels] || "Unknown"}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {booking.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {booking.phone}
                        </div>
                        {(booking as any).bookingDate && (booking as any).bookingTime && (
                          <>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {(booking as any).bookingDate}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {(booking as any).bookingTime}
                            </div>
                          </>
                        )}
                        {(booking as any).selectedDrink && (
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4" />
                            {(booking as any).selectedDrink}
                            {(booking as any).drinkTemperature && ` (${(booking as any).drinkTemperature})`}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          ₩{booking.totalPrice.toLocaleString()}
                        </div>
                        {booking.klookBookingId && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">Klook ID: {booking.klookBookingId}</span>
                          </div>
                        )}
                        {(booking as any).lpDeliveryAddress && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 text-xs mt-0.5">📦</span>
                            <div className="text-xs text-gray-300">
                              <div className="font-medium">LP Delivery:</div>
                              <div className="text-gray-400">{(booking as any).lpDeliveryAddress}</div>
                            </div>
                          </div>
                        )}
                        {(booking as any).youtubeTrackUrl && (
                          <div className="col-span-full space-y-2 mt-3">
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4 flex-shrink-0" />
                              <span className="text-gray-300 text-sm font-medium">YouTube Track:</span>
                            </div>
                            <div className="flex items-center gap-2 ml-6">
                              <div className="flex-1 bg-white/5 rounded px-3 py-2 text-sm text-gray-300 font-mono break-all max-w-[400px]">
                                {(booking as any).youtubeTrackUrl}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard((booking as any).youtubeTrackUrl)}
                                className="h-8 px-3 text-sm text-white border-white/40 hover:bg-white/20 bg-white/5 flex-shrink-0"
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                복사
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Display selectedServices (new system) */}
                      {(booking as any).selectedServices && (() => {
                        try {
                          const services = JSON.parse((booking as any).selectedServices);
                          if (Array.isArray(services) && services.length > 0) {
                            const totalServicesPrice = services.reduce((sum: number, svc: { price: number }) => sum + svc.price, 0);
                            return (
                              <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <ShoppingBag className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-300 font-medium">Selected Services:</span>
                                </div>
                                <div className="space-y-1">
                                  {services.map((svc: { name: string; price: number }, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-300">{svc.name}</span>
                                      <span className="text-green-400 font-mono">₩{svc.price.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                                  <span className="text-sm text-white font-bold">Total:</span>
                                  <span className="text-yellow-400 font-mono font-bold">₩{totalServicesPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          }
                        } catch (e) { /* ignore parse errors */ }
                        return null;
                      })()}
                      
                      {/* Fall back to legacy selectedAddons if no selectedServices */}
                      {!(booking as any).selectedServices && (booking as any).selectedAddons && (booking as any).selectedAddons.length > 0 && (
                        <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-300 font-medium">Additional Services:</span>
                          </div>
                          <div className="space-y-1">
                            {(booking as any).selectedAddons.map((addonId: number) => {
                              const addon = addons.find((a: any) => a.id === addonId);
                              return (
                                <div key={addonId} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-300">
                                    {addon ? addon.name : `Service #${addonId}`}
                                  </span>
                                  {addon && (
                                    <span className="text-green-400 font-mono">
                                      ₩{addon.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Payment Method & Amount Info */}
                      {((booking as any).paymentMethod || (booking as any).paidAmount) && (
                        <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-blue-300 font-medium">💳 Payment Info:</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            {(booking as any).paymentMethod && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300">Method:</span>
                                <Badge className={
                                  (booking as any).paymentMethod === "online" 
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/50" 
                                    : "bg-orange-500/20 text-orange-300 border-orange-500/50"
                                }>
                                  {(booking as any).paymentMethod === "online" ? "🌐 Online (PayPal)" : "🏪 Offline (Store)"}
                                </Badge>
                              </div>
                            )}
                            {(booking as any).paidAmount && (booking as any).paidAmount > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300">Paid Amount:</span>
                                <span className="text-green-400 font-mono font-bold">₩{(booking as any).paidAmount.toLocaleString()}</span>
                              </div>
                            )}
                            {(booking as any).paypalOrderId && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300">PayPal Order ID:</span>
                                <span className="text-gray-400 font-mono text-xs">{(booking as any).paypalOrderId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm("정말 이 예약을 삭제하시겠습니까?\nAre you sure you want to delete this booking?")) {
                              deleteBookingMutation.mutate(booking.id);
                            }
                          }}
                          disabled={deleteBookingMutation.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/photo?customer=${encodeURIComponent(booking.name)}`)}
                        className="text-white border-white/40 hover:bg-white/20 bg-white/5"
                        data-testid={`btn-photo-${booking.id}`}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        사진출력
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                            className="text-white border-white/40 hover:bg-white/20 bg-white/5"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Send Email to {booking.name}</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              Send a custom email or use a pre-defined template
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Tabs defaultValue="custom" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-white/10">
                              <TabsTrigger value="custom">Custom Email</TabsTrigger>
                              <TabsTrigger value="templates">Templates</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="custom" className="space-y-4">
                              <div>
                                <Label className="text-white">Subject</Label>
                                <Input
                                  value={emailSubject}
                                  onChange={(e) => setEmailSubject(e.target.value)}
                                  placeholder="Email subject..."
                                  className="bg-white/10 border-white/20 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Message</Label>
                                <Textarea
                                  value={emailMessage}
                                  onChange={(e) => setEmailMessage(e.target.value)}
                                  placeholder="Your message..."
                                  rows={8}
                                  className="bg-white/10 border-white/20 text-white"
                                />
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="templates" className="space-y-4">
                              <div className="grid gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => applyEmailTemplate("confirmation")}
                                  className="text-white border-white/40 hover:bg-white/20 bg-white/5 justify-start"
                                >
                                  <span className="font-medium">Booking Confirmation</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => applyEmailTemplate("reminder")}
                                  className="text-white border-white/40 hover:bg-white/20 bg-white/5 justify-start"
                                >
                                  <span className="font-medium">Session Reminder</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => applyEmailTemplate("completion")}
                                  className="text-white border-white/40 hover:bg-white/20 bg-white/5 justify-start"
                                >
                                  <span className="font-medium">Recording Complete</span>
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                          
                          <DialogFooter>
                            <Button
                              onClick={handleSendEmail}
                              disabled={!emailSubject || !emailMessage || sendEmailMutation.isPending}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                    Created: {booking.createdAt ? format(new Date(booking.createdAt), 'PPp') : 'Unknown'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

            {filteredBookings.length === 0 && (
              <Card className="glass border-white/20">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    No bookings found
                  </div>
                  <p className="text-gray-300">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "No bookings have been made yet"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="visit-reservations">
            <Card className="glass border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  홈페이지 예약 목록 / Homepage Reservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visitReservationsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
                  </div>
                ) : visitReservations.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>No visit reservations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visitReservations.map((reservation) => (
                      <Card key={reservation.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <User className="h-4 w-4 text-pink-400" />
                                <span className="font-semibold text-white">{reservation.name}</span>
                                <Badge className={reservation.paymentStatus === "paid" 
                                  ? "bg-green-500/20 text-green-300 border-green-500/50"
                                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                                }>
                                  {reservation.paymentStatus === "paid" ? "💳 Paid" : "⏳ Pending"}
                                </Badge>
                                <Badge className={
                                  reservation.status === "confirmed" ? "bg-blue-500/20 text-blue-300 border-blue-500/50" :
                                  reservation.status === "visited" ? "bg-green-500/20 text-green-300 border-green-500/50" :
                                  "bg-red-500/20 text-red-300 border-red-500/50"
                                }>
                                  {reservation.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {reservation.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {reservation.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {reservation.reservationDate} {reservation.reservationTime}
                                </div>
                              </div>
                              
                              <div className="mt-2 text-sm text-gray-400">
                                {reservation.numberOfPeople && `${reservation.numberOfPeople}명 | `}
                                ${reservation.totalAmountUsd || 28} USD
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Select 
                                value={reservation.status} 
                                onValueChange={(val) => updateVisitStatusMutation.mutate({ reservationId: reservation.id, status: val })}
                              >
                                <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="visited">Visited</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm("정말 이 예약을 삭제하시겠습니까?\nAre you sure you want to delete this reservation?")) {
                                    deleteVisitReservationMutation.mutate(reservation.id);
                                  }
                                }}
                                disabled={deleteVisitReservationMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                            <span className="mr-4">Source: {reservation.source === "homepage" ? "🌐 홈페이지 예약" : "📱 광고 접수"}</span>
                            Created: {reservation.createdAt ? format(new Date(reservation.createdAt), 'PPp') : 'Unknown'}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotel Bookings Tab */}
          <TabsContent value="hotel-bookings">
            <Card className="glass border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🏨 제휴사 예약 / Partner Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hotelBookingsLoading ? (
                  <div className="text-white text-center py-8">Loading hotel bookings...</div>
                ) : hotelBookings.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No hotel bookings yet</div>
                ) : (
                  <div className="space-y-4">
                    {hotelBookings.map((booking) => (
                      <Card key={booking.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <User className="h-4 w-4 text-blue-400" />
                                <span className="font-semibold text-white">{booking.guestName}</span>
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                                  {booking.hotelSource === "riverside" ? "Riverside Hotel" : booking.hotelSource === "lacasa" ? "La Casa Hotel" : booking.hotelSource}
                                </Badge>
                                <Badge className={
                                  booking.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" :
                                  booking.status === "confirmed" ? "bg-blue-500/20 text-blue-300 border-blue-500/50" :
                                  booking.status === "visited" ? "bg-green-500/20 text-green-300 border-green-500/50" :
                                  "bg-red-500/20 text-red-300 border-red-500/50"
                                }>
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-300">
                                {booking.roomNumber && (
                                  <div className="flex items-center gap-2">
                                    🚪 Room: {booking.roomNumber}
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  👥 {booking.numberOfPeople}명
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {booking.visitDate}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {booking.visitTime}
                                </div>
                              </div>
                              
                              {booking.notes && (
                                <div className="mt-2 text-sm text-gray-400">
                                  📝 {booking.notes}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Select 
                                value={booking.status} 
                                onValueChange={(val) => updateHotelBookingStatusMutation.mutate({ bookingId: booking.id, status: val })}
                              >
                                <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="visited">Visited</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm("정말 이 예약을 삭제하시겠습니까?\nAre you sure you want to delete this reservation?")) {
                                    deleteHotelBookingMutation.mutate(booking.id);
                                  }
                                }}
                                disabled={deleteHotelBookingMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                            Created: {booking.createdAt ? format(new Date(booking.createdAt), 'PPp') : 'Unknown'}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <Card className="glass border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {format(calendarMonth, 'yyyy년 M월')}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                        className="border-white/30 text-white hover:bg-white/20 bg-white/10"
                      >
                        ◀ 이전
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCalendarMonth(new Date())}
                        className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20 bg-pink-500/10"
                      >
                        오늘
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                        className="border-white/30 text-white hover:bg-white/20 bg-white/10"
                      >
                        다음 ▶
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                      <div key={day} className="text-gray-400 text-sm py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const days = [];
                      
                      // Empty cells for days before first day of month
                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 rounded" />);
                      }
                      
                      // Days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
                        
                        // Get events for this day (excluding menu selection - only studio schedules)
                        const dayVisitRes = visitReservations.filter(r => r.reservationDate === dateStr);
                        const dayHotelBookings = hotelBookings.filter(h => h.visitDate === dateStr);
                        const daySchedules = adminSchedules.filter(s => s.scheduleDate === dateStr);
                        
                        const totalEvents = dayVisitRes.length + dayHotelBookings.length + daySchedules.length;
                        
                        days.push(
                          <div 
                            key={day} 
                            className={`h-24 bg-white/5 rounded p-1 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors ${isToday ? 'ring-2 ring-pink-500' : ''}`}
                            onClick={() => setNewScheduleDate(dateStr)}
                          >
                            <div className={`text-xs font-bold mb-1 ${isToday ? 'text-pink-400' : 'text-white'}`}>{day}</div>
                            <div className="space-y-0.5 overflow-hidden">
                              {dayVisitRes.slice(0, 2).map((r, i) => (
                                <div 
                                  key={`v-${i}`} 
                                  className="text-[10px] bg-pink-500/50 text-white px-1 rounded truncate cursor-pointer hover:bg-pink-500/70"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCalendarEvent({ type: 'visit', data: r });
                                  }}
                                >
                                  {r.reservationTime} {r.name}
                                </div>
                              ))}
                              {dayHotelBookings.slice(0, 2).map((h, i) => (
                                <div 
                                  key={`h-${i}`} 
                                  className="text-[10px] bg-blue-500/50 text-white px-1 rounded truncate cursor-pointer hover:bg-blue-500/70"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCalendarEvent({ type: 'hotel', data: h });
                                  }}
                                >
                                  {h.visitTime} {h.guestName}
                                </div>
                              ))}
                              {daySchedules.slice(0, 2).map((s, i) => (
                                <div 
                                  key={`s-${i}`} 
                                  className="text-[10px] bg-amber-500/50 text-white px-1 rounded truncate cursor-pointer hover:bg-amber-500/70"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCalendarEvent({ type: 'schedule', data: s });
                                  }}
                                >
                                  {s.scheduleTime || '종일'} {s.title}
                                </div>
                              ))}
                              {totalEvents > 4 && (
                                <div className="text-[10px] text-gray-400">+{totalEvents - 4} more</div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      
                      return days;
                    })()}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex gap-4 mt-4 text-xs text-gray-300">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-pink-500/50 rounded"></div> 홈페이지</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500/50 rounded"></div> 제휴사</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500/50 rounded"></div> 수동등록</div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Add Schedule Form */}
              <Card className="glass border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">스케줄 추가</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">날짜</Label>
                    <Input
                      type="date"
                      value={newScheduleDate}
                      onChange={(e) => {
                        setNewScheduleDate(e.target.value);
                        setNewScheduleTime(""); // Reset time when date changes
                      }}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">시간 (10분 단위)</Label>
                    {newScheduleDate ? (
                      availableTimeSlots.length > 0 ? (
                        <Select value={newScheduleTime} onValueChange={setNewScheduleTime}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="시간 선택..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {availableTimeSlots.map(slot => (
                              <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-yellow-400 text-sm py-2">예약 가능한 시간이 없습니다</div>
                      )
                    ) : (
                      <div className="text-gray-400 text-sm py-2">먼저 날짜를 선택하세요</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">제목</Label>
                    <Input
                      value={newScheduleTitle}
                      onChange={(e) => setNewScheduleTitle(e.target.value)}
                      placeholder="스케줄 제목"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">메모 (선택)</Label>
                    <Textarea
                      value={newScheduleDescription}
                      onChange={(e) => setNewScheduleDescription(e.target.value)}
                      placeholder="추가 정보"
                      rows={2}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newScheduleDate && newScheduleTitle) {
                        createScheduleMutation.mutate({
                          title: newScheduleTitle,
                          description: newScheduleDescription || undefined,
                          scheduleDate: newScheduleDate,
                          scheduleTime: newScheduleTime || undefined,
                        });
                      }
                    }}
                    disabled={!newScheduleDate || !newScheduleTitle || createScheduleMutation.isPending}
                    className="w-full k-gradient-pink-purple text-white"
                  >
                    {createScheduleMutation.isPending ? "등록 중..." : "스케줄 등록"}
                  </Button>
                  
                  {/* Manual Schedules List */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-white font-medium mb-3">수동 등록 스케줄</h4>
                    {adminSchedules.length === 0 ? (
                      <div className="text-gray-400 text-sm text-center py-4">등록된 스케줄이 없습니다</div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {adminSchedules.map(schedule => (
                          <div key={schedule.id} className="bg-white/5 p-2 rounded flex justify-between items-start">
                            <div>
                              <div className="text-white text-sm font-medium">{schedule.title}</div>
                              <div className="text-gray-400 text-xs">
                                {schedule.scheduleDate} {schedule.scheduleTime || '종일'}
                              </div>
                              {schedule.description && (
                                <div className="text-gray-500 text-xs mt-1">{schedule.description}</div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm("이 스케줄을 삭제하시겠습니까?")) {
                                  deleteScheduleMutation.mutate(schedule.id);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-300 hover:bg-white/10 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nft">
            <NftManagement />
          </TabsContent>

          <TabsContent value="promo">
            <PromoManagement />
          </TabsContent>
        </Tabs>

        {/* Event Detail Dialog */}
        <Dialog open={selectedCalendarEvent !== null} onOpenChange={(open) => !open && setSelectedCalendarEvent(null)}>
          <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCalendarEvent?.type === 'visit' && <span className="w-3 h-3 bg-pink-500 rounded-full"></span>}
                {selectedCalendarEvent?.type === 'hotel' && <span className="w-3 h-3 bg-blue-500 rounded-full"></span>}
                {selectedCalendarEvent?.type === 'schedule' && <span className="w-3 h-3 bg-amber-500 rounded-full"></span>}
                {selectedCalendarEvent?.type === 'visit' && '홈페이지 예약'}
                {selectedCalendarEvent?.type === 'hotel' && '제휴사 예약'}
                {selectedCalendarEvent?.type === 'schedule' && '수동 스케줄'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3 text-sm">
              {selectedCalendarEvent?.type === 'visit' && selectedCalendarEvent.data && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">이름</div>
                    <div className="text-white font-medium">{selectedCalendarEvent.data.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">이메일</div>
                    <div className="text-white">{selectedCalendarEvent.data.email}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">연락처</div>
                    <div className="text-white">{selectedCalendarEvent.data.phone}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">날짜</div>
                    <div className="text-white">{selectedCalendarEvent.data.reservationDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">시간</div>
                    <div className="text-white">{selectedCalendarEvent.data.reservationTime}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">인원</div>
                    <div className="text-white">{selectedCalendarEvent.data.numberOfPeople}명</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">금액</div>
                    <div className="text-green-400">${selectedCalendarEvent.data.totalAmountUsd}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">상태</div>
                    <Badge className={statusColors[selectedCalendarEvent.data.status as keyof typeof statusColors]}>
                      {selectedCalendarEvent.data.status}
                    </Badge>
                  </div>
                  {selectedCalendarEvent.data.notes && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-gray-400 mb-1">메모</div>
                      <div className="text-white text-sm">{selectedCalendarEvent.data.notes}</div>
                    </div>
                  )}
                </>
              )}
              
              {selectedCalendarEvent?.type === 'hotel' && selectedCalendarEvent.data && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">고객명</div>
                    <div className="text-white font-medium">{selectedCalendarEvent.data.guestName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">호텔</div>
                    <div className="text-white">{selectedCalendarEvent.data.hotelSource === "riverside" ? "Riverside Hotel" : selectedCalendarEvent.data.hotelSource === "lacasa" ? "La Casa Hotel" : selectedCalendarEvent.data.hotelSource}</div>
                  </div>
                  {selectedCalendarEvent.data.roomNumber && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-400">객실번호</div>
                      <div className="text-white">{selectedCalendarEvent.data.roomNumber}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">날짜</div>
                    <div className="text-white">{selectedCalendarEvent.data.visitDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">시간</div>
                    <div className="text-white">{selectedCalendarEvent.data.visitTime}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">인원</div>
                    <div className="text-white">{selectedCalendarEvent.data.numberOfPeople}명</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">상태</div>
                    <Badge className={statusColors[selectedCalendarEvent.data.status as keyof typeof statusColors]}>
                      {selectedCalendarEvent.data.status}
                    </Badge>
                  </div>
                  {selectedCalendarEvent.data.notes && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-gray-400 mb-1">메모</div>
                      <div className="text-white text-sm">{selectedCalendarEvent.data.notes}</div>
                    </div>
                  )}
                </>
              )}
              
              {selectedCalendarEvent?.type === 'schedule' && selectedCalendarEvent.data && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">제목</div>
                    <div className="text-white font-medium">{selectedCalendarEvent.data.title}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">날짜</div>
                    <div className="text-white">{selectedCalendarEvent.data.scheduleDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">시간</div>
                    <div className="text-white">{selectedCalendarEvent.data.scheduleTime || '종일'}</div>
                  </div>
                  {selectedCalendarEvent.data.description && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-gray-400 mb-1">메모</div>
                      <div className="text-white text-sm">{selectedCalendarEvent.data.description}</div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedCalendarEvent(null)}
                className="bg-white text-gray-800 hover:bg-gray-100 font-medium"
              >
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
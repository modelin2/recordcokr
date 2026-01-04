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
import { Calendar, Clock, Mail, User, Phone, Music, Coffee, ShoppingBag, CheckCircle, AlertCircle, Timer, XCircle, Filter, Search, Send, Users as UserIcon, LogOut, Camera } from "lucide-react";
import type { Booking, VisitReservation } from "@shared/schema";
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

export default function AdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "visit-reservations">("bookings");
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
              className="border-white/40 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card 
            className={`glass border-white/20 cursor-pointer transition-all hover:scale-105 ${
              statusFilter === "all" ? "ring-2 ring-white/50" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-300">Total</div>
            </CardContent>
          </Card>
          <Card 
            className={`glass border-white/20 cursor-pointer transition-all hover:scale-105 ${
              statusFilter === "pending" ? "ring-2 ring-yellow-400/50" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-gray-300">Pending</div>
            </CardContent>
          </Card>
          <Card 
            className={`glass border-white/20 cursor-pointer transition-all hover:scale-105 ${
              statusFilter === "confirmed" ? "ring-2 ring-blue-400/50" : ""
            }`}
            onClick={() => setStatusFilter("confirmed")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.confirmed}</div>
              <div className="text-sm text-gray-300">Confirmed</div>
            </CardContent>
          </Card>
          <Card 
            className={`glass border-white/20 cursor-pointer transition-all hover:scale-105 ${
              statusFilter === "in-progress" ? "ring-2 ring-purple-400/50" : ""
            }`}
            onClick={() => setStatusFilter("in-progress")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-300">In Progress</div>
            </CardContent>
          </Card>
          <Card 
            className={`glass border-white/20 cursor-pointer transition-all hover:scale-105 ${
              statusFilter === "completed" ? "ring-2 ring-green-400/50" : ""
            }`}
            onClick={() => setStatusFilter("completed")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-300">Completed</div>
            </CardContent>
          </Card>
          <Card 
            className={`glass border-white/20 cursor-pointer transition-all hover:scale-105 ${
              statusFilter === "cancelled" ? "ring-2 ring-red-400/50" : ""
            }`}
            onClick={() => setStatusFilter("cancelled")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
              <div className="text-sm text-gray-300">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "bookings" | "visit-reservations")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-6">
            <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/20">
              📋 예약 관리 / Bookings
            </TabsTrigger>
            <TabsTrigger value="visit-reservations" className="text-white data-[state=active]:bg-white/20">
              🎯 방문 예약 / Visit Reservations
              {visitReservations.length > 0 && (
                <Badge className="ml-2 bg-pink-500/50 text-white">{visitReservations.length}</Badge>
              )}
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
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  방문 예약 목록 / Visit Reservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  인스타그램 마케팅을 통해 예약한 고객 리스트입니다. 예약금 ₩10,000이 결제된 방문 예정 고객입니다.
                </p>
                
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
                                예약금: ₩{reservation.depositAmount?.toLocaleString() || "10,000"}
                                {reservation.source && ` | 유입경로: ${reservation.source}`}
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
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
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
        </Tabs>
      </div>
    </div>
  );
}
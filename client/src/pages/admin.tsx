import { useState } from "react";
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
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, Mail, User, Phone, Music, Coffee, ShoppingBag, CheckCircle, AlertCircle, Timer, XCircle, Filter, Search, Send, Users as UserIcon } from "lucide-react";
import type { Booking } from "@shared/schema";
import { format } from "date-fns";
import { Copy } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/50", 
  "in-progress": "bg-purple-500/20 text-purple-300 border-purple-500/50",
  completed: "bg-green-500/20 text-green-300 border-green-500/50",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/50"
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all bookings and addons for better display
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
  });

  const { data: addons = [] } = useQuery<any[]>({
    queryKey: ['/api/addons'],
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
      subject: "Recording Session Confirmed - K-Recording Cafe",
      message: `안녕하세요 {{name}}님,

K-Recording Cafe에서 예약해 주셔서 감사합니다.

예약 정보:
- 날짜: {{date}}
- 시간: {{time}}
- 음료: {{drink}}
- 총 금액: ₩{{price}}

스튜디오 위치: 서울시 강남구 신사동
문의사항이 있으시면 언제든 연락 주세요.

감사합니다.
K-Recording Cafe Team`
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
K-Recording Cafe Team`
    },
    completion: {
      subject: "Recording Complete - Download Your Track",
      message: `안녕하세요 {{name}}님,

녹음 세션이 완료되었습니다!

첨부파일로 완성된 트랙을 보내드립니다.
소셜미디어에 공유하실 때 @k_recording_cafe를 태그해 주세요!

다음에 또 뵙겠습니다.
K-Recording Cafe Team`
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
      .replace(/{{drink}}/g, selectedBooking.selectedDrink)
      .replace(/{{price}}/g, selectedBooking.totalPrice.toLocaleString())
      .replace(/{{track}}/g, selectedBooking.youtubeTrackUrl);
    
    setEmailMessage(processedMessage);
  };

  if (isLoading) {
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
            <p className="text-gray-300">Manage bookings and communicate with customers</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.href = '/admin/users'}
              className="k-gradient-pink-purple text-white"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              사용자 관리
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
                        {(booking as any).selectedDate && (booking as any).selectedTime && (
                          <>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {(booking as any).selectedDate}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {(booking as any).selectedTime}
                            </div>
                          </>
                        )}
                        {(booking as any).selectedBeverages && (booking as any).selectedBeverages.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4" />
                            {(booking as any).selectedBeverages.join(', ')}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          ₩{booking.totalPrice.toLocaleString()}
                        </div>
                        {booking.klookBookingId && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">ID: {booking.klookBookingId}</span>
                          </div>
                        )}
                        {(booking as any).youtubeTrack && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">YouTube Track:</span>
                            </div>
                            <div className="flex items-center gap-2 ml-6">
                              <div className="flex-1 bg-white/5 rounded px-2 py-1 text-xs text-gray-300 font-mono break-all">
                                {(booking as any).youtubeTrack}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard((booking as any).youtubeTrack)}
                                className="h-6 px-2 text-xs text-white border-white/40 hover:bg-white/20 bg-white/5 flex-shrink-0"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                복사
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {(booking as any).addons && (booking as any).addons.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-gray-400">Additional Services: </span>
                          <span className="text-xs text-gray-300">
                            {(booking as any).addons.map((addonId: number) => {
                              const addon = addons.find((a: any) => a.id === addonId);
                              return addon ? addon.name : `Service #${addonId}`;
                            }).join(", ")}
                          </span>
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
      </div>
    </div>
  );
}
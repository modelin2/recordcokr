import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Hotel, 
  LogOut, 
  Users, 
  Calendar, 
  Clock, 
  Lock,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import type { HotelBooking } from "@shared/schema";

interface HotelAdmin {
  id: number;
  username: string;
  hotelSource: string;
  hotelName: string;
}

export default function RiverAdminPage() {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState<HotelAdmin | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetch("/api/hotel-admin/init", { method: "POST" });
    
    fetch("/api/hotel-admin/me")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then(data => {
        setAdmin(data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const { data: bookings = [], isLoading, refetch } = useQuery<HotelBooking[]>({
    queryKey: ["/api/hotel-admin/bookings"],
    enabled: isLoggedIn,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/hotel-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAdmin(data.admin);
        setIsLoggedIn(true);
        setPassword("");
        toast({
          title: "로그인 성공",
          description: `${data.admin.hotelName} 관리자로 로그인되었습니다.`,
        });
      } else {
        toast({
          title: "로그인 실패",
          description: data.message || "아이디 또는 비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "로그인 오류",
        description: "서버 연결에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/hotel-admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    setAdmin(null);
    queryClient.invalidateQueries({ queryKey: ["/api/hotel-admin/bookings"] });
    toast({
      title: "로그아웃",
      description: "성공적으로 로그아웃되었습니다.",
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 4자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/hotel-admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "비밀번호 변경 완료",
          description: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "변경 실패",
          description: data.message || "비밀번호 변경에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "서버 연결에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "대기중", className: "bg-yellow-500" },
      confirmed: { label: "확정", className: "bg-green-500" },
      cancelled: { label: "취소", className: "bg-red-500" },
      visited: { label: "방문완료", className: "bg-blue-500" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-500" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    visited: bookings.filter(b => b.status === "visited").length,
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 shadow-2xl">
          <CardHeader className="text-center bg-blue-800 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Hotel className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl">Riverside Hotel</CardTitle>
            <p className="text-blue-200 text-sm">Partner Admin Portal</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디 입력"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "로그인 중..." : "로그인"}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-6">
              Recording Cafe Partner Portal
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hotel className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">{admin?.hotelName || "Hotel"} Dashboard</h1>
              <p className="text-blue-200 text-sm">Recording Cafe 송객 현황</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChangePassword(true)}
              className="text-white hover:bg-blue-700"
            >
              <Lock className="w-4 h-4 mr-1" />
              비밀번호 변경
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-blue-700"
            >
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
              <p className="text-sm text-gray-600">전체 예약</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">대기중</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              <p className="text-sm text-gray-600">확정</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.visited}</p>
              <p className="text-sm text-gray-600">방문완료</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              투숙객 예약 목록
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-500 mt-2">데이터 로딩 중...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>아직 예약이 없습니다.</p>
                <p className="text-sm">투숙객이 Recording Cafe를 예약하면 여기에 표시됩니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">방문일</th>
                      <th className="text-left p-3 font-medium">시간</th>
                      <th className="text-left p-3 font-medium">고객명</th>
                      <th className="text-left p-3 font-medium">객실</th>
                      <th className="text-left p-3 font-medium">인원</th>
                      <th className="text-left p-3 font-medium">상태</th>
                      <th className="text-left p-3 font-medium">예약일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {booking.visitDate}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {booking.visitTime}
                          </div>
                        </td>
                        <td className="p-3 font-medium">{booking.guestName}</td>
                        <td className="p-3">{booking.roomNumber || "-"}</td>
                        <td className="p-3">{booking.numberOfPeople}명</td>
                        <td className="p-3">{getStatusBadge(booking.status)}</td>
                        <td className="p-3 text-sm text-gray-500">
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleString('ko-KR') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                비밀번호 변경
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label>현재 비밀번호</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>새 비밀번호</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 입력 (4자 이상)"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>새 비밀번호 확인</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    취소
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-800 hover:bg-blue-900">
                    변경하기
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-8">
        <p className="text-sm">Recording Cafe Partner Portal</p>
        <p className="text-xs mt-1">© 2025 Recording Cafe. All rights reserved.</p>
      </footer>
    </div>
  );
}

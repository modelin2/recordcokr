import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, UserCheck, UserX, Trash2, Mail, Shield, ShieldCheck } from "lucide-react";
import type { User } from "@shared/schema";

const roleColors = {
  super_admin: "bg-red-500/20 text-red-300 border-red-500/50",
  admin: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  user: "bg-gray-500/20 text-gray-300 border-gray-500/50"
};

const roleIcons = {
  super_admin: ShieldCheck,
  admin: Shield,
  user: UserCheck
};

export default function UserManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserRole, setNewUserRole] = useState("admin");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all admin users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // Create admin mutation
  const createAdminMutation = useMutation({
    mutationFn: async ({ email, username, role }: { email: string; username: string; role: string }) => {
      return apiRequest("POST", "/api/admin/users", { email, username, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "관리자 추가됨",
        description: "새로운 관리자가 성공적으로 추가되었습니다.",
      });
      setIsAddDialogOpen(false);
      setNewUserEmail("");
      setNewUserUsername("");
      setNewUserRole("admin");
    },
    onError: (error: any) => {
      toast({
        title: "추가 실패",
        description: error.message || "관리자 추가에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      return apiRequest("PATCH", `/api/admin/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "상태 업데이트됨",
        description: "사용자 상태가 업데이트되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "업데이트 실패",
        description: error.message || "상태 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "관리자 삭제됨",
        description: "관리자가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "삭제 실패",
        description: error.message || "관리자 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleCreateAdmin = () => {
    if (!newUserEmail || !newUserUsername) {
      toast({
        title: "입력 오류",
        description: "이메일과 사용자명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    createAdminMutation.mutate({
      email: newUserEmail,
      username: newUserUsername,
      role: newUserRole,
    });
  };

  const handleStatusToggle = (userId: number, currentStatus: boolean) => {
    updateStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const handleDeleteAdmin = (userId: number) => {
    if (confirm("정말로 이 관리자를 삭제하시겠습니까?")) {
      deleteAdminMutation.mutate(userId);
    }
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
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">사용자 관리</h1>
            <p className="text-gray-300">관리자 계정을 추가하고 관리하세요</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="k-gradient-pink-purple text-white">
                <Plus className="h-4 w-4 mr-2" />
                새 관리자 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">새 관리자 추가</DialogTitle>
                <DialogDescription className="text-gray-300">
                  새로운 관리자의 정보를 입력해주세요. 임시 비밀번호가 자동으로 생성됩니다.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">이메일 주소</Label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">사용자명</Label>
                  <Input
                    placeholder="admin_username"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">역할</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">일반 관리자</SelectItem>
                      <SelectItem value="super_admin">슈퍼 관리자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  onClick={handleCreateAdmin}
                  disabled={createAdminMutation.isPending}
                  className="k-gradient-pink-purple text-white"
                >
                  {createAdminMutation.isPending ? "추가 중..." : "관리자 추가"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{users.length}</div>
              <div className="text-gray-300">총 관리자</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {users.filter(u => u.isActive).length}
              </div>
              <div className="text-gray-300">활성 사용자</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {users.filter(u => u.role === "super_admin").length}
              </div>
              <div className="text-gray-300">슈퍼 관리자</div>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <div className="grid gap-6">
          {users.map((user) => {
            const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || UserCheck;
            
            return (
              <Card key={user.id} className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <RoleIcon className="h-5 w-5 text-white" />
                        <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                        <Badge className={roleColors[user.role as keyof typeof roleColors] || roleColors.user}>
                          {user.role === "super_admin" ? "슈퍼 관리자" : 
                           user.role === "admin" ? "일반 관리자" : "사용자"}
                        </Badge>
                        <Badge className={user.isActive ? "bg-green-500/20 text-green-300 border-green-500/50" : "bg-red-500/30 text-red-200 border-red-400/60 font-medium"}>
                          {user.isActive ? "활성" : "비활성"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email || "이메일 없음"}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          생성일: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : "알 수 없음"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusToggle(user.id, user.isActive || false)}
                        disabled={updateStatusMutation.isPending}
                        className={user.isActive 
                          ? "text-red-300 border-red-400/50 hover:bg-red-400/20 font-medium" 
                          : "text-green-300 border-green-400/50 hover:bg-green-400/20 font-medium"
                        }
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        {user.isActive ? "비활성화" : "활성화"}
                      </Button>
                      
                      {user.role !== "super_admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(user.id)}
                          disabled={deleteAdminMutation.isPending}
                          className="text-red-400 border-red-400/40 hover:bg-red-400/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          삭제
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {users.length === 0 && (
          <Card className="glass border-white/20">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Shield className="h-12 w-12 mx-auto mb-4" />
                관리자가 없습니다
              </div>
              <p className="text-gray-300">
                첫 번째 관리자를 추가해보세요
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
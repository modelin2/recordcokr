import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireSuperAdmin = false, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin, isSuperAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "이 페이지에 접근하려면 로그인이 필요합니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation(redirectTo);
        }, 1500);
        return;
      }

      if (requireSuperAdmin && !isSuperAdmin) {
        toast({
          title: "접근 권한 없음",
          description: "최고 관리자 권한이 필요합니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/");
        }, 1500);
        return;
      }

      if (requireAdmin && !isAdmin) {
        toast({
          title: "접근 권한 없음",
          description: "관리자 권한이 필요합니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/");
        }, 1500);
        return;
      }
    }
  }, [isLoading, user, isAdmin, isSuperAdmin, requireAdmin, requireSuperAdmin, setLocation, toast, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or doesn't have required permissions
  if (!user) return null;
  if (requireSuperAdmin && !isSuperAdmin) return null;
  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
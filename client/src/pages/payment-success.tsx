import { useEffect, useState } from "react";
// Using URLSearchParams directly
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const { toast } = useToast();

  const urlParams = new URLSearchParams(window.location.search);
  const paymentKey = urlParams.get('paymentKey');
  const orderId = urlParams.get('orderId');
  const amount = urlParams.get('amount');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        toast({
          title: "결제 확인 실패",
          description: "결제 정보가 올바르지 않습니다.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      try {
        const response = await apiRequest("POST", "/api/payments/confirm", {
          paymentKey,
          orderId,
          amount: parseInt(amount as string),
        });

        if (response.success) {
          setPaymentResult(response.data);
          
          // Clear stored payment data
          sessionStorage.removeItem('pendingPayment');
          
          toast({
            title: "결제 완료!",
            description: "녹음 세션 예약이 성공적으로 완료되었습니다.",
          });
        } else {
          throw new Error(response.message || "결제 확인 실패");
        }
      } catch (error: any) {
        console.error('Payment confirmation error:', error);
        toast({
          title: "결제 확인 실패",
          description: error.message || "결제 확인 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  const goHome = () => {
    setLocation("/");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">결제 완료!</h1>
          <p className="text-gray-300 text-lg">Recording Cafe 녹음 세션 예약이 완료되었습니다.</p>
        </div>

        {/* Payment Details */}
        {paymentResult && (
          <Card className="mb-8 glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white">결제 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">예약 번호:</span>
                <span className="text-white font-semibold">#{paymentResult.booking?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">결제 금액:</span>
                <span className="text-yellow-400 font-bold">₩{parseInt(amount as string).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">결제 방법:</span>
                <span className="text-white">{paymentResult.payment?.method || '카드'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">결제 일시:</span>
                <span className="text-white">
                  {paymentResult.payment?.approvedAt ? 
                    new Date(paymentResult.payment.approvedAt).toLocaleString('ko-KR') : 
                    new Date().toLocaleString('ko-KR')
                  }
                </span>
              </div>
              {paymentResult.booking?.bookingDate && (
                <div className="flex justify-between">
                  <span className="text-gray-300">녹음 예정일:</span>
                  <span className="text-white font-semibold">
                    {paymentResult.booking.bookingDate} {paymentResult.booking.bookingTime}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8 glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              다음 단계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-pink-500 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold">이메일 확인</h4>
                <p className="text-gray-300 text-sm">
                  예약 확인서와 상세 안내가 등록하신 이메일로 발송됩니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold">준비사항</h4>
                <p className="text-gray-300 text-sm">
                  녹음할 반주 음원을 미리 준비해주시고, 예약 시간 10분 전까지 도착해주세요.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold">위치 안내</h4>
                <p className="text-gray-300 text-sm">
                  서울시 강남구 신사동 - 지하철 3호선 신사역 8번 출구에서 도보 3분
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button 
            onClick={goHome}
            className="w-full k-gradient-pink-purple text-lg py-6"
          >
            홈페이지로 돌아가기
          </Button>
          
          <div className="text-sm text-gray-400">
            <p>문의사항이 있으시면 카카오톡 @krecordingcafe로 연락주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
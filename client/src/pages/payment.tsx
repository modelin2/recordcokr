import { useEffect, useState } from "react";
import { useLocation } from "wouter";
// Using URLSearchParams directly since wouter doesn't have useSearchParams
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [tossPayments, setTossPayments] = useState<any>(null);
  const { toast } = useToast();

  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('bookingId');
  const amount = urlParams.get('amount');

  useEffect(() => {
    // Load TossPayments SDK
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    script.onload = () => {
      if (window.TossPayments) {
        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
        if (clientKey) {
          const toss = window.TossPayments(clientKey);
          setTossPayments(toss);
        } else {
          toast({
            title: "설정 오류",
            description: "결제 시스템 설정에 문제가 있습니다.",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    };
    document.head.appendChild(script);

    // Get payment data from sessionStorage
    const pendingPayment = sessionStorage.getItem('pendingPayment');
    if (pendingPayment) {
      setPaymentData(JSON.parse(pendingPayment));
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!tossPayments || !paymentData) {
      toast({
        title: "오류",
        description: "결제 시스템이 준비되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create payment with server
      console.log('Payment request data:', {
        bookingId: bookingId,
        amount: amount,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
      });
      
      const paymentResponse = await apiRequest("POST", "/api/payments/initialize", {
        bookingId: paymentData.bookingId,
        amount: paymentData.totalPrice,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || "결제 초기화 실패");
      }

      // Request payment with TossPayments
      await tossPayments.requestPayment('카드', {
        amount: paymentData.totalPrice,
        orderId: paymentResponse.orderId,
        orderName: `K-Recording Cafe 녹음 세션 #${paymentData.bookingId}`,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        successUrl: `${window.location.origin}/payment-success`,
        failUrl: `${window.location.origin}/payment-fail`,
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "결제 실패",
        description: error.message || "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">결제 시스템을 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!paymentData || !paymentData.bookingId || !paymentData.totalPrice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <Card className="w-full max-w-md glass border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-white">결제 정보 없음</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-center">
              유효하지 않은 결제 요청입니다.
            </p>
            <Button onClick={goBack} className="w-full" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">결제하기</h1>
          <p className="text-gray-300">K-Recording Cafe 녹음 세션</p>
        </div>

        {/* Payment Summary */}
        <Card className="mb-8 glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              결제 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">예약 번호:</span>
              <span className="text-white font-semibold">#{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">고객명:</span>
              <span className="text-white">{paymentData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">이메일:</span>
              <span className="text-white">{paymentData.customerEmail}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-300">총 결제 금액:</span>
              <span className="text-yellow-400">₩{parseInt(amount as string).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-8 glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white">결제 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handlePayment} 
              className="w-full k-gradient-pink-purple text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  카드로 결제하기
                </>
              )}
            </Button>
            
            <div className="text-center">
              <Button 
                onClick={goBack} 
                variant="outline" 
                className="mt-4 border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                예약으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-400">
          <p>🔒 토스페이먼츠의 보안 결제 시스템으로 안전하게 결제됩니다.</p>
          <p>결제 정보는 암호화되어 안전하게 처리됩니다.</p>
        </div>
      </div>
    </div>
  );
}
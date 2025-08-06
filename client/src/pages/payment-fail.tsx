import { useEffect } from "react";
// Using URLSearchParams directly
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCcw, HelpCircle } from "lucide-react";

export default function PaymentFailPage() {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const message = urlParams.get('message');

  useEffect(() => {
    // Clear stored payment data on payment failure
    sessionStorage.removeItem('pendingPayment');
  }, []);

  const goBack = () => {
    setLocation("/");
  };

  const retryPayment = () => {
    // Go back to homepage to restart booking process
    setLocation("/");
  };

  const getFailureReason = (code: string | undefined) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소했습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 과정에서 오류가 발생했습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다.';
      case 'INVALID_CARD_COMPANY':
        return '유효하지 않은 카드입니다.';
      case 'NOT_SUPPORTED_CARD_COMPANY':
        return '지원하지 않는 카드사입니다.';
      case 'INVALID_CARD_NUMBER':
        return '카드 번호가 올바르지 않습니다.';
      case 'LOW_CASH_BALANCE':
        return '잔액이 부족합니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다.';
      case 'EXCEED_MAX_PAYMENT_AMOUNT':
        return '최대 결제 금액을 초과했습니다.';
      case 'CARD_PROCESSING_ERROR':
        return '카드 처리 중 오류가 발생했습니다.';
      case 'SYSTEM_ERROR':
        return '시스템 오류가 발생했습니다.';
      default:
        return message || '결제 처리 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Error Header */}
        <div className="text-center mb-8">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">결제 실패</h1>
          <p className="text-gray-300 text-lg">결제가 완료되지 않았습니다.</p>
        </div>

        {/* Error Details */}
        <Card className="mb-8 glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              실패 사유
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <p className="text-red-300 font-semibold">
                {getFailureReason(code)}
              </p>
              {code && (
                <p className="text-red-400 text-sm mt-2">
                  오류 코드: {code}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Solutions */}
        <Card className="mb-8 glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white">해결 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-white font-semibold">카드 정보 확인</h4>
                  <p className="text-gray-300 text-sm">
                    카드 번호, 유효기간, CVC 번호를 다시 확인해주세요.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-white font-semibold">결제 한도 확인</h4>
                  <p className="text-gray-300 text-sm">
                    카드 결제 한도나 잔액을 확인하고 다시 시도해주세요.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-white font-semibold">다른 결제 방법 사용</h4>
                  <p className="text-gray-300 text-sm">
                    다른 카드나 계좌를 이용해서 다시 결제를 시도해보세요.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={retryPayment}
            className="w-full k-gradient-pink-purple text-lg py-6"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            다시 예약하기
          </Button>
          
          <Button 
            onClick={goBack}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈페이지로 돌아가기
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <h4 className="text-yellow-300 font-semibold mb-2">도움이 필요하신가요?</h4>
            <p className="text-yellow-200 text-sm">
              결제 문제가 지속되면 카카오톡 <strong>@krecordingcafe</strong>로 문의해주세요.
            </p>
            <p className="text-yellow-200 text-sm mt-1">
              평일 오전 10시 - 오후 10시 운영
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
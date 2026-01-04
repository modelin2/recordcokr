import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, ArrowRight } from "lucide-react";

export default function BookingOptionsSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Book Your K-pop Recording Session
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            이미 예약하셨나요? 메뉴와 서비스를 선택하세요.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Already have a reservation? Select your menu and services.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-purple-400"
            onClick={() => setLocation("/menu")}
            data-testid="card-menu-selection"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">방문자 메뉴선택</CardTitle>
              <CardTitle className="text-xl text-gray-500">Visitor Menu Selection</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base mb-4">
                이미 가게에 계신가요? 메뉴와 서비스를 선택하세요.
              </CardDescription>
              <CardDescription className="text-base mb-6">
                Already at our cafe? Select your menu and services.
              </CardDescription>
              <div className="bg-purple-100 rounded-lg p-4 mb-6">
                <p className="text-purple-700 font-semibold">매장 내 태블릿</p>
                <p className="text-sm text-purple-600">In-store Tablet Ordering</p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                size="lg"
              >
                메뉴 선택하기 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

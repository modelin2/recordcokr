import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function BookingOptionsSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            이미 예약하셨나요?
          </h2>
          
          <Button 
            onClick={() => setLocation("/menu")}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-2xl py-8 px-16 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            data-testid="button-menu-selection"
          >
            메뉴 선택하기 <ArrowRight className="ml-3 w-7 h-7" />
          </Button>
          
          <p className="text-gray-500 mt-6">
            Select your menu and services
          </p>
        </div>
      </div>
    </section>
  );
}

import { Coffee, Snowflake, Zap } from "lucide-react";
import menuImage from "@assets/recordingcafemenu_1751782203762.jpg";

const menuItems = {
  hot: [
    { name: "Americano", korean: "아메리카노", price: "₩5,000" },
    { name: "Ice Americano", korean: "아이스 아메리카노", price: "₩5,500" },
    { name: "Latte", korean: "라떼", price: "₩6,000" },
    { name: "Vanilla Latte", korean: "바닐라라떼", price: "₩6,500" },
    { name: "Mango Juice", korean: "망고 주스", price: "₩7,000" },
    { name: "Passion Fruit Juice", korean: "패션프루트 주스", price: "₩7,000" }
  ],
  cold: [
    { name: "Americano", korean: "아메리카노", price: "₩5,500" },
    { name: "Green Tea (Organic)", korean: "녹차(유기농재료)", price: "₩6,000" },
    { name: "Earl Grey", korean: "얼그레이", price: "₩6,000" },
    { name: "Lemon Tea", korean: "유자차", price: "₩6,500" },
    { name: "Grapefruit Tea", korean: "대추차", price: "₩6,500" },
    { name: "Ginger Tea", korean: "황차고", price: "₩7,000" }
  ]
};

export default function MenuSection() {
  return (
    <section id="menu" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Cafe Menu</h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Menu Content */}
          <div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">You are welcome to visit and order drinks only. However, if you book a recording package, you will receive one premium drink for free.  Please note: If you visit for drinks only, use of the recording booth may not be available depending on existing reservations.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hot Drinks */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Coffee className="text-[hsl(var(--k-coral))] mr-3" size={24} />
                  <h3 className="text-2xl font-bold text-white">Hot Drinks</h3>
                </div>
                <div className="space-y-3">
                  {menuItems.hot.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-gray-400 text-sm">{item.korean}</div>
                      </div>
                      <div className="text-[hsl(var(--k-pink))] font-bold">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cold Drinks */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Snowflake className="text-[hsl(var(--k-blue))] mr-3" size={24} />
                  <h3 className="text-2xl font-bold text-white">Cold Drinks & Teas</h3>
                </div>
                <div className="space-y-3">
                  {menuItems.cold.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-gray-400 text-sm">{item.korean}</div>
                      </div>
                      <div className="text-[hsl(var(--k-purple))] font-bold">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Note */}
            <div className="mt-8 p-6 k-gradient-pink-purple rounded-2xl">
              <div className="flex items-center mb-3">
                <Zap className="text-white mr-3" size={24} />
                <h4 className="text-xl font-bold text-white">What's Included</h4>
              </div>
              <p className="text-white">
                Your recording session includes one premium drink of your choice from our full menu. Additional drinks can be purchased separately to keep you refreshed throughout your K-pop experience.
              </p>
            </div>
          </div>

          {/* Menu Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={menuImage} 
                alt="Vinyl record cafe menu with Korean drinks"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[hsl(var(--k-pink))] rounded-full opacity-20 animate-float hidden lg:block"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[hsl(var(--k-purple))] rounded-full opacity-20 animate-float hidden lg:block" style={{ animationDelay: '-2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
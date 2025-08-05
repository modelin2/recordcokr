import { Coffee, Snowflake, Zap } from "lucide-react";
import menuImage from "@assets/recordingcafemenu_1751782203762.jpg";

const menuItems = {
  hot: [
    { name: "Coffee (Hot)", korean: "커피 (핫)", price: "₩5,000" },
    { name: "Coffee Decaf (Hot)", korean: "커피(디카페인) (핫)", price: "₩5,000" },
    { name: "Green Tea (Hot)", korean: "그린티 (핫)", price: "₩6,000" },
    { name: "Hibiscus (Hot)", korean: "히비스커스 (핫)", price: "₩6,000" },
    { name: "Earl Grey (Hot)", korean: "얼그레이 (핫)", price: "₩6,000" },
    { name: "Peppermint (Hot)", korean: "페퍼민트 (핫)", price: "₩6,000" },
    { name: "Chamomile (Hot)", korean: "캐모마일 (핫)", price: "₩6,000" },
    { name: "Hot Chocolate", korean: "핫초코 (핫)", price: "₩6,000" }
  ],
  cold: [
    { name: "Coffee (Iced)", korean: "커피 (아이스)", price: "₩5,000" },
    { name: "Coffee Decaf (Iced)", korean: "커피(디카페인) (아이스)", price: "₩5,000" },
    { name: "Lemonade", korean: "레몬에이드 (아이스)", price: "₩7,000" },
    { name: "Strawberry Ade", korean: "딸기에이드 (아이스)", price: "₩7,000" },
    { name: "Orange Ade", korean: "오렌지에이드 (아이스)", price: "₩7,000" },
    { name: "Grapefruit Ade", korean: "자몽에이드 (아이스)", price: "₩7,000" },
    { name: "Iced Tea", korean: "아이스티 (아이스)", price: "₩6,000" },
    { name: "Green Tea (Iced)", korean: "그린티 (아이스)", price: "₩6,000" },
    { name: "Hibiscus (Iced)", korean: "히비스커스 (아이스)", price: "₩6,000" },
    { name: "Earl Grey (Iced)", korean: "얼그레이 (아이스)", price: "₩6,000" },
    { name: "Peppermint (Iced)", korean: "페퍼민트 (아이스)", price: "₩6,000" },
    { name: "Chamomile (Iced)", korean: "캐모마일 (아이스)", price: "₩6,000" }
  ]
};

export default function MenuSection() {
  return (
    <section id="menu" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Cafe Menu</h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Menu Content */}
          <div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">You are welcome to visit and order drinks only</p>
            
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
                  <h3 className="text-2xl font-bold text-white">Cold Drinks</h3>
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
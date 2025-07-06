import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Palette, Video, Edit, Film } from "lucide-react";
import type { Package, Addon } from "@shared/schema";

export default function PackagesSection() {
  const { data: addons = [], isLoading: addonsLoading } = useQuery<Addon[]>({
    queryKey: ['/api/addons'],
  });

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getIconForAddon = (iconName: string) => {
    switch (iconName) {
      case 'fas fa-palette':
        return <Palette className="text-3xl text-[hsl(var(--k-pink))] mb-4" size={32} />;
      case 'fas fa-video':
        return <Video className="text-3xl text-[hsl(var(--k-purple))] mb-4" size={32} />;
      case 'fas fa-edit':
        return <Edit className="text-3xl text-[hsl(var(--k-blue))] mb-4" size={32} />;
      case 'fas fa-film':
        return <Film className="text-3xl text-[hsl(var(--k-gold))] mb-4" size={32} />;
      default:
        return <Star className="text-3xl text-[hsl(var(--k-pink))] mb-4" size={32} />;
    }
  };

  if (addonsLoading) {
    return (
      <section id="packages" className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Loading Packages...</h2>
        </div>
      </section>
    );
  }

  // Separate addons into different categories
  const upgradeAddons = addons.filter(addon => 
    addon.name.includes('Pack') || addon.name.includes('Release')
  );
  const premiumAddons = addons.filter(addon => 
    !addon.name.includes('Pack') && !addon.name.includes('Release')
  );

  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Choose Your Package</h2>
        
        {/* Pricing Table */}
        <div className="glass p-8 rounded-3xl mb-16 max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="text-xl font-bold text-white pb-4 pr-4 border-r border-white/20">Songs</th>
                  <th className="text-lg font-bold text-[hsl(var(--k-pink))] pb-4 px-4 border-r border-white/20">
                    10:00~13:00<br/>
                    <span className="text-sm font-normal">(-20% D.C)</span>
                  </th>
                  <th className="text-lg font-bold text-[hsl(var(--k-gold))] pb-4 px-4 border-r border-white/20">
                    13:00~18:00<br/>
                    <span className="text-sm font-normal">(Base Price)</span>
                  </th>
                  <th className="text-lg font-bold text-[hsl(var(--k-purple))] pb-4 pl-4">
                    18:00~22:00<br/>
                    <span className="text-sm font-normal">(-10%)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/20">
                  <td className="text-lg font-semibold text-white py-4 pr-4 border-r border-white/20">1 Song</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-pink))] py-4 px-4 border-r border-white/20">₩30,000</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-gold))] py-4 px-4 border-r border-white/20">₩37,500</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-purple))] py-4 pl-4">₩33,000</td>
                </tr>
                <tr className="bg-white/5 border-t border-white/20">
                  <td className="text-lg font-semibold text-white py-4 pr-4 border-r border-white/20">2 Songs</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-pink))] py-4 px-4 border-r border-white/20">₩60,000</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-gold))] py-4 px-4 border-r border-white/20">₩75,000</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-purple))] py-4 pl-4">₩66,000</td>
                </tr>
                <tr className="border-t border-white/20">
                  <td className="text-lg font-semibold text-white py-4 pr-4 border-r border-white/20">4 Songs</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-pink))] py-4 px-4 border-r border-white/20">₩120,000</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-gold))] py-4 px-4 border-r border-white/20">₩150,000</td>
                  <td className="text-2xl font-bold text-[hsl(var(--k-purple))] py-4 pl-4">₩132,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-300 mb-4">All packages include: Premium drink + Recording session + Raw files + Free self-photography</p>
            <Button 
              onClick={scrollToBooking}
              className="k-gradient-pink-purple px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-0"
            >
              Book Your Session
            </Button>
          </div>
        </div>

        {/* Upgrade Options */}
        {upgradeAddons.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">Upgrade Your Recording</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {upgradeAddons.map((addon) => (
                <div key={addon.id} className="glass p-6 rounded-2xl text-center">
                  <h4 className="text-xl font-bold mb-2">{addon.name}</h4>
                  <div className="text-2xl font-bold text-[hsl(var(--k-coral))] mb-4">
                    +₩{addon.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-300">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Add-ons */}
        {premiumAddons.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-center mb-8">Premium Add-ons</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumAddons.map((addon) => (
                <div key={addon.id} className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
                  {getIconForAddon(addon.icon)}
                  <h4 className="text-lg font-bold mb-2">{addon.name}</h4>
                  <div className="text-xl font-bold text-[hsl(var(--k-pink))]">
                    ₩{addon.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

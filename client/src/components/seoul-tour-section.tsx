import { Button } from "@/components/ui/button";

export default function SeoulTourSection() {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="tours" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">🌟 Seoul Experience Packages</h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Combine your K-pop recording with authentic Seoul experiences! Both locations are just a 10-minute walk from our studio.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Hangang Tour Package */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--k-pink))]">Hangang Park Tour + Recording</h3>
            <div className="text-3xl font-bold text-white mb-4">₩85,000</div>
            <p className="text-gray-300 mb-6">Recording session + authentic Korean riverside experience</p>
            
            <ul className="space-y-2 mb-8">
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                1 Song Recording & Premium Drink
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                Hangang Park Walking Tour (10 min walk)
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                Choose One: K-Drama Ramyeon Experience
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                OR Han River Cruise Experience
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                OR Floating Starbucks Visit (World's Only!)
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                Professional Photos at Scenic Spots
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2">✓</span>
                Local Guide Included
              </li>
            </ul>

            <Button 
              onClick={scrollToBooking}
              className="w-full k-gradient-pink-purple px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-0"
            >
              Book Hangang Tour
            </Button>
          </div>

          {/* Garosu-gil Tour Package */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--k-purple))]">Garosu-gil Tour + Recording</h3>
            <div className="text-3xl font-bold text-white mb-4">₩75,000</div>
            <p className="text-gray-300 mb-6">Recording session + trendy Gangnam district exploration</p>
            
            <ul className="space-y-2 mb-8">
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                1 Song Recording & Premium Drink
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                Garosu-gil Walking Tour (10 min walk)
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                K-Fashion Boutique Visits
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                Trendy Cafe Photo Spots
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                Street Art & Culture Guide
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                Shopping Recommendations
              </li>
              <li className="flex items-center text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2">✓</span>
                Local Insider Tips
              </li>
            </ul>

            <Button 
              onClick={scrollToBooking}
              className="w-full glass px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-white/30"
            >
              Book Garosu-gil Tour
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-blue-200 font-semibold mb-2">💡 Perfect for International Visitors</p>
            <p className="text-blue-100 text-sm leading-relaxed">
              These packages are specially designed for tourists who want to experience authentic Seoul culture combined with K-pop recording. 
              Both locations showcase different sides of Seoul - traditional riverside culture and modern Gangnam lifestyle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
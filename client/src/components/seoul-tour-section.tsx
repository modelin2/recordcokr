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
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">🗺️ Seoul Walking Guide</h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Effective travel routes from our studio in Sinsa! Explore Seoul's best spots just minutes away on foot.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Hangang Tour Package */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              SCENIC
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--k-pink))]">🌊 Han River Park Walking Route</h3>
            <div className="text-2xl font-bold text-white mb-4">10 minutes walk</div>
            <p className="text-gray-300 mb-6">Perfect riverside experience in Seoul's heart</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2 mt-1">🚶</span>
                <div>
                  <strong>Step 1:</strong> Exit studio, turn right toward Sinsa Station
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2 mt-1">🚇</span>
                <div>
                  <strong>Step 2:</strong> Walk 3 mins to Sinsa Station (Exit 8)
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2 mt-1">🌉</span>
                <div>
                  <strong>Step 3:</strong> Cross Jamsu Bridge underpass
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2 mt-1">🌸</span>
                <div>
                  <strong>Step 4:</strong> Arrive at Banpo Hangang Park entrance
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-pink))] mr-2 mt-1">📍</span>
                <div>
                  <strong>Tip:</strong> Best spots: Rainbow Bridge, picnic areas, floating cafe
                </div>
              </li>
            </ul>

            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
              <p className="text-blue-300 text-sm font-medium">💡 Travel Tip: Perfect for sunset photos and relaxation after recording!</p>
            </div>
          </div>

          {/* Garosu-gil Tour Package */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              TRENDY
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--k-purple))]">🛍️ Garosu-gil Walking Route</h3>
            <div className="text-2xl font-bold text-white mb-4">5 minutes walk</div>
            <p className="text-gray-300 mb-6">Seoul's trendiest fashion street in Gangnam</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2 mt-1">🚶</span>
                <div>
                  <strong>Step 1:</strong> Exit studio, head south toward Garosu-gil
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2 mt-1">🌳</span>
                <div>
                  <strong>Step 2:</strong> Turn left at tree-lined main street (Garosu-gil)
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2 mt-1">☕</span>
                <div>
                  <strong>Step 3:</strong> Explore trendy cafes and boutiques
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2 mt-1">📸</span>
                <div>
                  <strong>Step 4:</strong> Visit famous Instagram spots and art galleries
                </div>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-[hsl(var(--k-purple))] mr-2 mt-1">🛒</span>
                <div>
                  <strong>Tip:</strong> Best for K-fashion shopping and trendy cafe hopping
                </div>
              </li>
            </ul>

            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-500/30">
              <p className="text-purple-300 text-sm font-medium">💡 Travel Tip: Perfect for daytime shopping and evening cafe culture!</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-white font-semibold mb-2">💡 Perfect Seoul Travel Routes</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              These walking routes are designed for international visitors exploring Seoul. Both destinations showcase different sides of the city - 
              peaceful riverside culture at Han River and trendy modern lifestyle at Garosu-gil.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
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
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
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
                    <span className="text-sm font-normal">(-12% D.C)</span>
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
          </div>
        </div>



        <div className="glass p-8 rounded-3xl mb-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl p-4 max-w-2xl mx-auto mb-6">
              <p className="text-yellow-200 font-semibold mb-2">⚠️ Please Note:</p>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Each session is for one person only.<br/>
                If two people wish to enter together, please book two consecutive sessions.<br/>
                This allows both participants to enter at the same time and take turns recording.
              </p>
            </div>
            <Button 
              onClick={scrollToBooking}
              className="k-gradient-pink-purple px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-0"
            >
              Book Your Session
            </Button>
          </div>
        </div>



        {/* Optional Add-ons */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">🎧 Optional Add-ons</h3>
          
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-2xl">
            <p className="text-green-200 font-semibold">✅ Raw Recording File – Provided free of charge</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-[hsl(var(--k-pink))] mb-3">🎵 Full Track Mixing</h4>
              <p className="text-gray-300 text-sm mb-4">
                Includes pitch and timing correction, plus mixing your vocal with the instrumental to complete the track
              </p>
              <p className="text-2xl font-bold text-white">₩100,000</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-[hsl(var(--k-purple))] mb-3">🎥 Recording Video</h4>
              <p className="text-gray-300 text-sm mb-4">
                Professional videographer captures your recording session naturally
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Raw footage only</span>
                  <span className="font-bold text-white">₩50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Edited with song</span>
                  <span className="font-bold text-white">₩100,000</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-[hsl(var(--k-coral))] mb-3">💄 Makeup Service</h4>
              <p className="text-gray-300 text-sm mb-4">
                Professional full-face makeup before your recording or video shoot
              </p>
              <p className="text-2xl font-bold text-white">₩100,000</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-[hsl(var(--k-blue))] mb-3">🌍 Global Distribution</h4>
              <p className="text-gray-300 text-sm mb-4">
                Original licensing + backing track production + mixing, mastering. Release your music on Youtube, Instagram, Apple Music, Spotify, Melon and more
              </p>
              <p className="text-2xl font-bold text-white">₩1,300,000</p>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-8 gradient-text">🎵 Our Portfolio</h3>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h4 className="text-xl font-bold text-white mb-2">Featured Releases</h4>
                <p className="text-gray-300 text-sm">
                  Listen to music created and distributed through our Global Distribution service
                </p>
              </div>
              
              <div className="grid md:grid-cols-1 gap-6">
                {/* First Album */}
                <div className="rounded-xl overflow-hidden shadow-lg pointer-events-none">
                  <iframe 
                    style={{borderRadius: '12px', pointerEvents: 'auto'}} 
                    src="https://open.spotify.com/embed/album/2tcxqXIboZSjfKDwfB1Nfe?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <p className="text-center text-gray-400 text-sm mt-3">Original by BTS</p>
                </div>
                
                {/* Second Album */}
                <div className="rounded-xl overflow-hidden shadow-lg pointer-events-none">
                  <iframe 
                    style={{borderRadius: '12px', pointerEvents: 'auto'}} 
                    src="https://open.spotify.com/embed/album/00KYWt8M3AKjgVGh5gqpjK?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <p className="text-center text-gray-400 text-sm mt-3">Original by Wiz Khalifa</p>
                </div>
                
                {/* Third Album */}
                <div className="rounded-xl overflow-hidden shadow-lg pointer-events-none">
                  <iframe 
                    style={{borderRadius: '12px', pointerEvents: 'auto'}} 
                    src="https://open.spotify.com/embed/album/5w8H7uZ5xcHLxlHwaZXxNx?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <p className="text-center text-gray-400 text-sm mt-3">Original by BTS</p>
                </div>
                
                {/* Fourth Album */}
                <div className="rounded-xl overflow-hidden shadow-lg pointer-events-none">
                  <iframe 
                    style={{borderRadius: '12px', pointerEvents: 'auto'}} 
                    src="https://open.spotify.com/embed/album/1ejP5R7daB3J1tERADOeO5?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <p className="text-center text-gray-400 text-sm mt-3">Original by Glen Hansard, Marketa Irglova</p>
                </div>
                
                {/* Fifth Album */}
                <div className="rounded-xl overflow-hidden shadow-lg pointer-events-none">
                  <iframe 
                    style={{borderRadius: '12px', pointerEvents: 'auto'}} 
                    src="https://open.spotify.com/embed/album/0MFEVLwo8p3raviwqgIzDq?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <p className="text-center text-gray-400 text-sm mt-3">Original by Audrey Hepburn</p>
                </div>
                
                {/* Sixth Album */}
                <div className="rounded-xl overflow-hidden shadow-lg pointer-events-none">
                  <iframe 
                    style={{borderRadius: '12px', pointerEvents: 'auto'}} 
                    src="https://open.spotify.com/embed/album/6Nj37Cyd17JVbwmk0rnaxq?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <p className="text-center text-gray-400 text-sm mt-3">Original by Adele</p>
                </div>
              </div>
              

            </div>
          </div>

          {/* Royalty Income Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8 gradient-text">💰 Lifetime Royalty Income</h3>
            <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 p-8 rounded-3xl border border-yellow-500/30 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-[hsl(var(--k-gold))] mb-4">Your Music, Your Income - Forever</h4>
                <p className="text-lg text-gray-200 leading-relaxed">
                  When you choose our Global Distribution service, you're not just releasing music - you're creating a lifetime income stream that follows you anywhere in the world.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-yellow-500/20">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🌍</span>
                    <h5 className="text-xl font-bold text-[hsl(var(--k-gold))]">Global Royalty Collection</h5>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Receive monthly royalty payments from streaming platforms worldwide - Spotify, Apple Music, YouTube Music, and more. Your music earns money while you sleep, whether you're in Seoul or back home.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-2xl border border-orange-500/20">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">⏰</span>
                    <h5 className="text-xl font-bold text-[hsl(var(--k-coral))]">70 Years of Income</h5>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Copyright protection lasts for 70 years after creation, meaning decades of potential income from a single recording session. Your Korean travel memory becomes a lifelong investment.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-500/30 mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🎵</span>
                  <h5 className="text-xl font-bold text-[hsl(var(--k-purple))]">Professional K-Pop Distribution Network</h5>
                </div>
                <p className="text-gray-200 leading-relaxed mb-4">
                  Our distribution system is identical to what major K-pop artists use. Your music enters the same professional ecosystem as BTS, BLACKPINK, and NewJeans - giving you access to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    <span className="text-gray-300">Official ISRC codes for tracking</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-300">Billboard chart eligibility</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    <span className="text-gray-300">Global streaming analytics</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-300">Professional metadata management</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-full font-bold text-lg mb-4">
                  The Most Meaningful Souvenir from Korea
                </div>
                <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  Unlike traditional souvenirs that fade or break, your music lives forever. Every stream, every play, every discovery of your song generates income that finds you anywhere in the world. 
                  Transform your Korean adventure into a lasting legacy that pays dividends for decades to come.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl border border-yellow-500/40">
              <h4 className="text-xl font-bold text-[hsl(var(--k-gold))] mb-3">📈 Billboard Marketing Package</h4>
              <p className="text-gray-300 text-sm mb-4">
                Includes ISRC code issuance, social media promotion, and distributor coordination
              </p>
              <p className="text-lg font-bold text-yellow-200">Custom quote required</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-500/40">
              <h4 className="text-xl font-bold text-[hsl(var(--k-coral))] mb-3">📌 Billboard Album Chart Eligibility</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Single</span>
                  <span className="text-white">1–2 tracks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">EP (Extended Play)</span>
                  <span className="text-white">Min 4 tracks or 30 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import heroImage from "@assets/k-recording-cafe_1751779914043.png";

// Create a lightweight base64 placeholder for instant loading
const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1NzFkZGIiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2RkMjU5MiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzI1NjNlYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=";

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the hero image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = heroImage;
  }, []);

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-end justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900"></div>
      
      {/* Placeholder background for instant loading */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${placeholderImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px)',
          transform: 'scale(1.1)'
        }}
      ></div>
      
      {/* High-quality background image - fade in when loaded */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${imageLoaded ? 'opacity-50' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Mobile-specific background positioning */}
      <div 
        className={`md:hidden absolute inset-0 bg-cover bg-no-repeat bg-center transition-opacity duration-700 ${imageLoaded ? 'opacity-50' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 30%'
        }}
      ></div>
      
      <div className="container mx-auto max-w-7xl relative z-10 text-center px-6 lg:px-8 xl:px-12 pb-20 md:pb-32">
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Record your K-pop dreams in Seoul's most exclusive recording cafe. Professional studio meets trendy cafe experience near Sinsa Station.
        </p>
        
        <div className="flex justify-center">
          <Button 
            onClick={scrollToBooking}
            className="k-gradient-pink-purple px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform animate-glow text-white border-0"
          >
            Start Recording Journey
          </Button>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[hsl(var(--k-pink))] rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-[hsl(var(--k-purple))] rounded-full opacity-20 animate-float" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[hsl(var(--k-blue))] rounded-full opacity-20 animate-float" style={{ animationDelay: '-4s' }}></div>
    </section>
  );
}
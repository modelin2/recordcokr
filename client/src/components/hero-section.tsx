import { Button } from "@/components/ui/button";
import heroImage from "@assets/K-Recording Cafe_1751777707836.png";

export default function HeroSection() {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900"></div>
      
      {/* Two-column layout for desktop, stacked for mobile */}
      <div className="container mx-auto px-6 h-screen flex flex-col lg:flex-row items-center">
        {/* Left side - Text content */}
        <div className="w-full lg:w-1/2 z-10 text-center lg:text-left py-20 lg:py-0">
          <div className="animate-float">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Recording</span><br />
              <span className="text-white">VIBES</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto lg:mx-0">
            Record your K-pop dreams in Seoul's most exclusive recording cafe. Professional studio meets trendy cafe experience near Sinsa Station.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              onClick={scrollToBooking}
              className="k-gradient-pink-purple px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform animate-glow text-white border-0"
            >
              Start Recording Journey
            </Button>
            <Button 
              variant="outline"
              className="glass px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform text-white border-white/30"
            >
              Watch Experience Video
            </Button>
          </div>
        </div>

        {/* Right side - Studio image */}
        <div className="w-full lg:w-1/2 h-64 md:h-80 lg:h-full relative">
          <div className="absolute inset-0 lg:inset-4 rounded-3xl overflow-hidden">
            <img 
              src={heroImage} 
              alt="Recording studio with professional microphone and equipment"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
          
          {/* Floating elements around image */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-[hsl(var(--k-pink))] rounded-full opacity-30 animate-float hidden lg:block"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[hsl(var(--k-purple))] rounded-full opacity-30 animate-float hidden lg:block" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute top-1/4 -left-6 w-8 h-8 bg-[hsl(var(--k-blue))] rounded-full opacity-30 animate-float hidden lg:block" style={{ animationDelay: '-4s' }}></div>
        </div>
      </div>

      {/* Mobile floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-[hsl(var(--k-pink))] rounded-full opacity-20 animate-float lg:hidden"></div>
      <div className="absolute bottom-32 right-10 w-12 h-12 bg-[hsl(var(--k-purple))] rounded-full opacity-20 animate-float lg:hidden" style={{ animationDelay: '-2s' }}></div>
    </section>
  );
}

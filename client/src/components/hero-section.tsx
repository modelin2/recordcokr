import { Button } from "@/components/ui/button";
import heroImage from "@assets/k-recording-cafe_1751779914043.png";

export default function HeroSection() {
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
      
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Mobile-specific background positioning */}
      <div className="md:hidden absolute inset-0 opacity-50 bg-cover bg-no-repeat bg-center"
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

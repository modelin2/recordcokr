import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900"></div>
      
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 text-center px-6">
        <div className="animate-float">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">Recording</span><br />
            <span className="text-white">VIBES</span>
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Record your K-pop dreams in Seoul's most exclusive recording cafe. Professional studio meets trendy cafe experience near Sinsa Station.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
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

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[hsl(var(--k-pink))] rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-[hsl(var(--k-purple))] rounded-full opacity-20 animate-float" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[hsl(var(--k-blue))] rounded-full opacity-20 animate-float" style={{ animationDelay: '-4s' }}></div>
    </section>
  );
}

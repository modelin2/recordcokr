import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90' : 'glass'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold gradient-text">STUDIO VIBES</div>
        
        <div className="hidden md:flex space-x-8">
          <button 
            onClick={() => scrollToSection('home')}
            className="hover:text-[hsl(var(--k-pink))] transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('experience')}
            className="hover:text-[hsl(var(--k-pink))] transition-colors"
          >
            Experience
          </button>
          <button 
            onClick={() => scrollToSection('packages')}
            className="hover:text-[hsl(var(--k-pink))] transition-colors"
          >
            Packages
          </button>
          <button 
            onClick={() => scrollToSection('gallery')}
            className="hover:text-[hsl(var(--k-pink))] transition-colors"
          >
            Gallery
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="hover:text-[hsl(var(--k-pink))] transition-colors"
          >
            Contact
          </button>
        </div>
        
        <Button 
          onClick={() => scrollToSection('booking')}
          className="k-gradient-pink-purple px-6 py-2 rounded-full hover:scale-105 transition-transform text-white border-0"
        >
          Book Now
        </Button>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

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

  const isHomePage = location === '/';

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90' : 'glass'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 py-4 flex items-center justify-between max-w-7xl">
        {isHomePage ? (
          <button 
            onClick={() => scrollToSection('home')}
            className="text-2xl font-bold gradient-text hover:scale-105 transition-transform"
          >
            K-Recording Cafe
          </button>
        ) : (
          <Link href="/">
            <button className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
              K-Recording Cafe
            </button>
          </Link>
        )}
        
        <div className="hidden md:flex space-x-8">
          {/* Hidden menu items - only accessible via direct URL */}
        </div>
        
        {isHomePage ? (
          <Button 
            onClick={() => scrollToSection('booking')}
            className="k-gradient-pink-purple px-6 py-2 rounded-full hover:scale-105 transition-transform text-white border-0"
          >
            Book Now
          </Button>
        ) : (
          <Link href="/#booking">
            <Button className="k-gradient-pink-purple px-6 py-2 rounded-full hover:scale-105 transition-transform text-white border-0">
              Book Now
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

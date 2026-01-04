import { MapPin, Train, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiInstagram, SiYoutube, SiTiktok, SiSpotify } from "react-icons/si";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Visit Us in Sinsa</h2>
        
        {/* YouTube Shorts - Directions from Sinsa Station */}
        <div className="max-w-sm mx-auto mb-12">
          <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/PO2j8QzG3ZU"
              title="Directions from Sinsa Station to Recording Cafe"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-center text-gray-400 text-sm mt-3">📍 Walk from Sinsa Station to Recording Cafe</p>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Location</h3>
          <div className="space-y-4 text-lg">
            <div className="flex items-center justify-center">
              <MapPin className="text-[hsl(var(--k-pink))] mr-4" size={20} />
              <span>2F. 21, Gangnam-daero 107-gil, Seocho-gu, Seoul, Republic of Korea</span>
            </div>
            <div className="flex items-center justify-center">
              <Train className="text-[hsl(var(--k-purple))] mr-4" size={20} />
              <span>4 mins walk from Sinsa Station (Line 3)</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="text-[hsl(var(--k-blue))] mr-4" size={20} />
              <span>Open Daily: 12:00 PM - 09:00 PM</span>
            </div>
            <div className="flex items-center justify-center">
              <Phone className="text-[hsl(var(--k-coral))] mr-4" size={20} />
              <span>+82-2-6959-9338</span>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-xl font-bold mb-4">Follow Our K-pop Journey</h4>
            <div className="flex space-x-4 justify-center">
              <a 
                href="#" 
                className="w-12 h-12 k-gradient-pink-purple rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <SiInstagram className="text-white" size={24} />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 k-gradient-purple-blue rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <SiYoutube className="text-white" size={24} />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 k-gradient-blue-coral rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <SiTiktok className="text-white" size={24} />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 k-gradient-coral-gold rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <SiSpotify className="text-white" size={24} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Transportation Guide */}
        <div className="mt-12 glass p-8 rounded-3xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Getting Here</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-bold text-[hsl(var(--k-pink))] mb-2">From Incheon Airport</h4>
              <p className="text-gray-300 text-sm">Airport Express → Hongik Univ. → Line 6 to Sinsa</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-[hsl(var(--k-purple))] mb-2">From Gangnam Station</h4>
              <p className="text-gray-300 text-sm">Line 2 → Line 3 to Sinsa (1 transfer)</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-[hsl(var(--k-blue))] mb-2">From Myeongdong</h4>
              <p className="text-gray-300 text-sm">Line 4 → Line 3 to Sinsa (1 transfer)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

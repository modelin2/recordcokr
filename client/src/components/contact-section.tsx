import { MapPin, Train, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiInstagram, SiYoutube, SiTiktok, SiSpotify } from "react-icons/si";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Visit Us in Sinsa</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Studio Vibes Location</h3>
            <div className="space-y-4 text-lg">
              <div className="flex items-center">
                <MapPin className="text-[hsl(var(--k-pink))] mr-4" size={20} />
                <span>123 Sinsa-ro, Gangnam-gu, Seoul</span>
              </div>
              <div className="flex items-center">
                <Train className="text-[hsl(var(--k-purple))] mr-4" size={20} />
                <span>2 mins walk from Sinsa Station (Line 3)</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-[hsl(var(--k-blue))] mr-4" size={20} />
                <span>Open Daily: 10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-[hsl(var(--k-coral))] mr-4" size={20} />
                <span>+82-2-123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-[hsl(var(--k-gold))] mr-4" size={20} />
                <span>hello@studiovibes.kr</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-xl font-bold mb-4">Follow Our K-pop Journey</h4>
              <div className="flex space-x-4">
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
          
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Getting Here</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[hsl(var(--k-pink))]">From Incheon Airport</h4>
                <p className="text-gray-300">Airport Express → Hongik Univ. → Line 6 to Sinsa</p>
              </div>
              <div>
                <h4 className="font-bold text-[hsl(var(--k-purple))]">From Gangnam Station</h4>
                <p className="text-gray-300">Line 2 → Line 3 to Sinsa (1 transfer)</p>
              </div>
              <div>
                <h4 className="font-bold text-[hsl(var(--k-blue))]">From Myeongdong</h4>
                <p className="text-gray-300">Line 4 → Line 3 to Sinsa (1 transfer)</p>
              </div>
            </div>
            
            <Button className="w-full mt-6 k-gradient-pink-purple py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-0">
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

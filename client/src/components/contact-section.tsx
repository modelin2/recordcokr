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
        
        {/* How to Find Directions */}
        <div className="max-w-2xl mx-auto mb-12 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-6 text-white">📍 How to Find Our Recording Cafe</h3>
          
          <p className="text-gray-300 text-center mb-6">
            Many visitors find it confusing to locate our recording cafe.<br />
            The easiest way is to go directly to <span className="text-[hsl(var(--k-pink))] font-semibold">Riverside Hotel</span> first.<br />
            Our cafe is located just 1 minute from the main entrance of Riverside Hotel.
          </p>
          
          <div className="bg-gray-700/50 rounded-xl p-5 mb-6">
            <h4 className="font-bold text-white mb-3">From Sinsa Station Exit 5:</h4>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Walk straight ahead for about 4 minutes toward Riverside Hotel</li>
              <li>• Do not turn or change direction — just walk straight</li>
              <li>• When you see Riverside Hotel,</li>
              <li className="pl-4">→ Turn left once at the hotel</li>
              <li className="pl-4">→ Walk about 1 minute</li>
              <li className="pl-4">→ You will see the building on your left-hand side</li>
            </ul>
          </div>
          
          <p className="text-gray-300 text-center mb-4">
            Please enter through the main entrance, take the elevator to the <span className="text-[hsl(var(--k-purple))] font-semibold">2nd floor</span>, and you will find our recording cafe.
          </p>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
            <p className="text-center text-gray-200">
              📌 <span className="font-semibold">Tip:</span> If you search for "<span className="text-[hsl(var(--k-coral))]">Riverside Hotel Seoul</span>" on Google Maps or Naver Map, you will arrive very close to our location.
            </p>
          </div>
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
      </div>
    </section>
  );
}

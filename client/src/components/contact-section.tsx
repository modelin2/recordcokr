import { MapPin, Train, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiInstagram, SiYoutube, SiTiktok, SiSpotify } from "react-icons/si";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Visit Us in Sinsa</h2>
        
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div>
            <h3 className="text-3xl font-bold mb-6">Location</h3>
            <div className="space-y-4 text-lg">
              <div className="flex items-center">
                <MapPin className="text-[hsl(var(--k-pink))] mr-4" size={20} />
                <span>서울 서초구 강남대로 107길 21. 대능빌딩 2층</span>
              </div>
              <div className="flex items-center">
                <Train className="text-[hsl(var(--k-purple))] mr-4" size={20} />
                <span>4 mins walk from Sinsa Station (Line 3)</span>
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

          {/* Google Maps Embed */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6">Find Us on the Map</h3>
            <div className="glass rounded-3xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.0836421445946!2d127.01951091531474!3d37.51679307980646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca154db1a8c6d%3A0x8e734e1d0ac7d862!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsi6Dsgqzrj5kg542gIOu2gDU0Mi0xMw!5e0!3m2!1sko!2skr!4v1625123456789!5m2!1sko!2skr"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96"
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <Button 
                onClick={() => window.open('https://maps.app.goo.gl/KcCkZEXZy5pzKJ8P7', '_blank')}
                className="k-gradient-pink-purple px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform text-white border-0"
              >
                Open in Google Maps
              </Button>
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

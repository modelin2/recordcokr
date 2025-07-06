import { Coffee, Tablet, Mic, Check } from "lucide-react";
import cafeImage from "@assets/recording cafe2_1751780941116.jpg";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">The K-pop Experience</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="text-center p-8 glass rounded-3xl hover:scale-105 transition-transform">
            <div className="w-20 h-20 k-gradient-pink-purple rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="text-3xl text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Order & Relax</h3>
            <p className="text-gray-300">Start with premium Korean beverages in our stylish cafe atmosphere</p>
          </div>

          {/* Step 2 */}
          <div className="text-center p-8 glass rounded-3xl hover:scale-105 transition-transform">
            <div className="w-20 h-20 k-gradient-purple-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Tablet className="text-3xl text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Choose Your Song</h3>
            <p className="text-gray-300">Browse K-pop hits on our tablet and reserve your recording slot</p>
          </div>

          {/* Step 3 */}
          <div className="text-center p-8 glass rounded-3xl hover:scale-105 transition-transform">
            <div className="w-20 h-20 k-gradient-blue-coral rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="text-3xl text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Record Like a Star</h3>
            <p className="text-gray-300">Professional recording studio with built-in selfie sticks for memories</p>
          </div>
        </div>

        {/* Experience Gallery */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Why International Visitors Love Us</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center">
                <Check className="text-[hsl(var(--k-pink))] mr-3" size={20} />
                Professional K-pop recording experience
              </li>
              <li className="flex items-center">
                <Check className="text-[hsl(var(--k-pink))] mr-3" size={20} />
                English-speaking staff support
              </li>
              <li className="flex items-center">
                <Check className="text-[hsl(var(--k-pink))] mr-3" size={20} />
                Instagram-worthy cafe & studio
              </li>
              <li className="flex items-center">
                <Check className="text-[hsl(var(--k-pink))] mr-3" size={20} />
                Located in trendy Sinsa district
              </li>
              <li className="flex items-center">
                <Check className="text-[hsl(var(--k-pink))] mr-3" size={20} />
                Take home your K-pop recording
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src={cafeImage} 
              alt="Recording cafe interior with seating and audio equipment" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--k-pink))]/20 to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

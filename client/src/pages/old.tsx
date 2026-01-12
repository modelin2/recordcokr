import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ExperienceSection from "@/components/experience-section";
import HowToUseSection from "@/components/how-to-use-section";
import PackagesSection from "@/components/packages-section";
import MenuSection from "@/components/menu-section";
import GallerySection from "@/components/gallery-section";
import SeoulTourSection from "@/components/seoul-tour-section";
import FAQSection from "@/components/faq-section";
import BookingOptionsSection from "@/components/booking-options-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function OldHome() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0060") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-purple-400" />
          </div>
          <h2 className="text-white text-xl font-bold text-center mb-6">Password Required</h2>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mb-4 bg-gray-700 border-gray-600 text-white"
          />
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Enter
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ExperienceSection />
      <MenuSection />
      <GallerySection />
      <PackagesSection />
      <SeoulTourSection />
      <HowToUseSection />
      <FAQSection />
      <BookingOptionsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

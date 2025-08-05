import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ExperienceSection from "@/components/experience-section";
import HowToUseSection from "@/components/how-to-use-section";
import PackagesSection from "@/components/packages-section";
import MenuSection from "@/components/menu-section";
import GallerySection from "@/components/gallery-section";
import SeoulTourSection from "@/components/seoul-tour-section";
import FAQSection from "@/components/faq-section";
import EnhancedBookingSection from "@/components/enhanced-booking-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
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
      <EnhancedBookingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

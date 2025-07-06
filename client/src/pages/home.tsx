import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ExperienceSection from "@/components/experience-section";
import PackagesSection from "@/components/packages-section";
import MenuSection from "@/components/menu-section";
import GallerySection from "@/components/gallery-section";
import FAQSection from "@/components/faq-section";
import BookingSection from "@/components/booking-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ExperienceSection />
      <MenuSection />
      <PackagesSection />
      <GallerySection />
      <FAQSection />
      <BookingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

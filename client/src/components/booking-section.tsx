import { Button } from "@/components/ui/button";

export default function BookingSection() {
  const handleBookingClick = () => {
    // Open external booking link or contact method
    window.open('tel:+82-10-1234-5678', '_self');
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-[hsl(var(--k-pink))] via-[hsl(var(--k-purple))] to-[hsl(var(--k-blue))]">
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 text-center max-w-7xl">
        <h2 className="text-5xl font-bold mb-8 text-white">Ready to Record Your K-pop Dream?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-white">Join thousands of international visitors who've created their K-pop memories at Studio Vibes</p>
        
        <Button 
          onClick={handleBookingClick}
          className="k-gradient-pink-purple px-12 py-6 rounded-full text-xl font-bold hover:scale-105 transition-transform text-white border-0 shadow-2xl"
        >
          Book Now
        </Button>
      </div>
    </section>
  );
}

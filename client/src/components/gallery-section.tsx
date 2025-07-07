import { Card } from "@/components/ui/card";
import recordingcafe0_1 from "@assets/recordingcafe0 (1)_1751872328126.jpg";
import recordingcafe0_3 from "@assets/recordingcafe0 (3)_1751872328126.jpg";
import recordingcafe0_4 from "@assets/recordingcafe0(4)_1751872328126.jpg";
import recordingcafe0_5 from "@assets/recordingcafe0(5)_1751872328127.png";
import recordingcafe1 from "@assets/Recordingcafe1_1751872328127.png";
import recordingcafe2 from "@assets/Recordingcafe2_1751872328127.png";
import recordingcafe3 from "@assets/Recordingcafe3_1751872328127.png";
import recordingcafe4 from "@assets/Recordingcafe4_1751872328128.png";
import recordingcafe5 from "@assets/Recordingcafe5_1751872328128.png";
import recordingcafe6 from "@assets/Recordingcafe6_1751872328128.png";
import recordingcafe7 from "@assets/Recordingcafe7_1751872328128.png";
import recordingcafe8 from "@assets/Recordingcafe8_1751872328129.png";

export default function GallerySection() {
  const galleryImages = [
    {
      src: recordingcafe0_1,
      title: "Professional Recording Studio",
      gradient: "from-[hsl(var(--k-pink))]/50"
    },
    {
      src: recordingcafe0_3,
      title: "Recording in Progress",
      gradient: "from-[hsl(var(--k-purple))]/50"
    },
    {
      src: recordingcafe0_4,
      title: "K-pop Artist Experience",
      gradient: "from-[hsl(var(--k-blue))]/50"
    },
    {
      src: recordingcafe0_5,
      title: "Professional Microphone Setup",
      gradient: "from-[hsl(var(--k-coral))]/50"
    },
    {
      src: recordingcafe1,
      title: "Young Artist Recording",
      gradient: "from-[hsl(var(--k-gold))]/50"
    },
    {
      src: recordingcafe2,
      title: "Stylish Recording Session",
      gradient: "from-[hsl(var(--k-pink))]/50"
    },
    {
      src: recordingcafe3,
      title: "Professional K-pop Experience",
      gradient: "from-[hsl(var(--k-purple))]/50"
    },
    {
      src: recordingcafe4,
      title: "International Visitors Welcome",
      gradient: "from-[hsl(var(--k-blue))]/50"
    },
    {
      src: recordingcafe5,
      title: "Inclusive Recording Environment",
      gradient: "from-[hsl(var(--k-coral))]/50"
    },
    {
      src: recordingcafe6,
      title: "Global Music Community",
      gradient: "from-[hsl(var(--k-gold))]/50"
    },
    {
      src: recordingcafe7,
      title: "K-pop Culture Experience",
      gradient: "from-[hsl(var(--k-pink))]/50"
    },
    {
      src: recordingcafe8,
      title: "Professional Studio Sessions",
      gradient: "from-[hsl(var(--k-purple))]/50"
    }
  ];

  const testimonials = [
    {
      rating: "⭐⭐⭐⭐⭐",
      text: "Amazing experience! Felt like a real K-pop star. The staff was so helpful and the recording quality is incredible!",
      author: "Sarah from Australia"
    },
    {
      rating: "⭐⭐⭐⭐⭐",
      text: "Perfect activity for K-pop fans visiting Seoul. Great location near Sinsa Station and the cafe drinks are delicious too!",
      author: "Mike from USA"
    },
    {
      rating: "⭐⭐⭐⭐⭐",
      text: "Bucket list item checked! The professional setup and friendly English support made this unforgettable.",
      author: "Emma from UK"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Experience Gallery</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-3xl hover:scale-105 transition-transform">
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-64 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${image.gradient} to-transparent`}></div>
              <div className="absolute bottom-4 left-4 text-white font-bold">{image.title}</div>
            </div>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass p-6 rounded-3xl text-center bg-transparent border-white/20">
              <div className="text-3xl mb-4">{testimonial.rating}</div>
              <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
              <div className="font-bold">- {testimonial.author}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

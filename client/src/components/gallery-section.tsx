import { Card } from "@/components/ui/card";

export default function GallerySection() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
      title: "Professional Studio",
      gradient: "from-[hsl(var(--k-pink))]/50"
    },
    {
      src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80",
      title: "Trendy Cafe Space",
      gradient: "from-[hsl(var(--k-purple))]/50"
    },
    {
      src: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Happy Memories",
      gradient: "from-[hsl(var(--k-blue))]/50"
    },
    {
      src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Recording Booth",
      gradient: "from-[hsl(var(--k-coral))]/50"
    },
    {
      src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Mixing Console",
      gradient: "from-[hsl(var(--k-gold))]/50"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "K-Culture Experience",
      gradient: "from-[hsl(var(--k-pink))]/50"
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

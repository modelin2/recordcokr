import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const imagesPerPage = 12;

  const galleryImages = [
    {
      src: recordingcafe0_1,
      title: "Professional Recording Studio",
      description: "State-of-the-art mixing console and monitoring setup",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe0_3,
      title: "Recording in Progress",
      description: "Atmospheric black & white recording session",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe0_4,
      title: "K-pop Artist Experience",
      description: "Professional recording booth session",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe0_5,
      title: "Professional Microphone Setup",
      description: "High-quality condenser microphone recording",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe1,
      title: "Young Artist Recording",
      description: "International visitor enjoying K-pop recording",
      category: "Customer Experience"
    },
    {
      src: recordingcafe2,
      title: "Stylish Recording Session",
      description: "Trendy K-pop style recording experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe3,
      title: "Professional K-pop Experience",
      description: "Blonde artist in professional recording booth",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe4,
      title: "International Visitors Welcome",
      description: "Happy customer enjoying recording experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe5,
      title: "Inclusive Recording Environment",
      description: "Welcoming atmosphere for all visitors",
      category: "Customer Experience"
    },
    {
      src: recordingcafe6,
      title: "Global Music Community",
      description: "Diverse customers creating music together",
      category: "Customer Experience"
    },
    {
      src: recordingcafe7,
      title: "K-pop Culture Experience",
      description: "Colorful hair and K-pop vibes in studio",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe8,
      title: "Professional Studio Sessions",
      description: "High-end recording equipment and setup",
      category: "Studio Equipment"
    },
    // Placeholder for additional images - ready for 50+ images
    ...Array.from({ length: 38 }, (_, i) => ({
      src: recordingcafe0_1, // Will be replaced with actual images
      title: `Studio Experience ${i + 13}`,
      description: `Additional recording studio experience ${i + 13}`,
      category: i % 3 === 0 ? "Studio Equipment" : i % 3 === 1 ? "Recording Sessions" : "Customer Experience"
    }))
  ];

  const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = galleryImages.slice(startIndex, startIndex + imagesPerPage);

  const gradients = [
    "from-[hsl(var(--k-pink))]/70 to-transparent",
    "from-[hsl(var(--k-purple))]/70 to-transparent", 
    "from-[hsl(var(--k-blue))]/70 to-transparent",
    "from-[hsl(var(--k-coral))]/70 to-transparent",
    "from-[hsl(var(--k-gold))]/70 to-transparent"
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
        <h2 className="text-5xl font-bold text-center mb-8 gradient-text">Studio Gallery</h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Explore authentic moments from our K-pop recording studio - real customers, professional equipment, and unforgettable experiences
        </p>
        
        {/* Gallery Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}
              variant="outline"
              className="glass border-white/30"
            >
              {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              {viewMode === 'grid' ? 'Masonry View' : 'Grid View'}
            </Button>
            <span className="text-gray-300 text-sm">
              Showing {startIndex + 1}-{Math.min(startIndex + imagesPerPage, galleryImages.length)} of {galleryImages.length} images
            </span>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="glass border-white/30"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-white px-3 py-1 bg-white/20 rounded">
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="glass border-white/30"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className={viewMode === 'masonry' ? 
          "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4" : 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        }>
          {currentImages.map((image, index) => (
            <div 
              key={startIndex + index} 
              className={`relative group cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}
              onClick={() => setSelectedImage(startIndex + index)}
            >
              <div className="overflow-hidden rounded-2xl bg-gray-700">
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className={`w-full object-cover transition-all duration-300 group-hover:scale-110 ${
                    viewMode === 'grid' ? 'h-64' : 'h-auto'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-black/70 rounded-lg p-3 backdrop-blur-sm">
                    <h3 className="font-bold text-sm mb-1">{image.title}</h3>
                    <p className="text-xs text-gray-300 mb-2">{image.description}</p>
                    <span className="inline-block bg-white/20 rounded-full px-2 py-1 text-xs">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img 
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4 text-white">
                <h3 className="font-bold text-lg mb-2">{galleryImages[selectedImage].title}</h3>
                <p className="text-gray-300">{galleryImages[selectedImage].description}</p>
              </div>
              <Button
                onClick={() => setSelectedImage(null)}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-black/50 border-white/30"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {/* Customer Testimonials */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">What Our Customers Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass p-6 border-white/20">
                <div className="text-2xl mb-3">{testimonial.rating}</div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-[hsl(var(--k-pink))] font-semibold">- {testimonial.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

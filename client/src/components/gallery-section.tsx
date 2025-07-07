import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Star, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

// Import featured images for "See The Magic Happen" section
import recordingcafe0_1 from "@assets/recordingcafe0 (1)_1751872328126.jpg";
import recordingcafe0_3 from "@assets/recordingcafe0 (3)_1751872328126.jpg";
import recordingcafe0_4 from "@assets/recordingcafe0(4)_1751872328126.jpg";
import recordingcafe0_5 from "@assets/recordingcafe0(5)_1751872328127.png";

// Import all images in numerical order
import recordingcafe1 from "@assets/Recordingcafe1_1751872328127.png";
import recordingcafe2 from "@assets/Recordingcafe2_1751872328127.png";
import recordingcafe3 from "@assets/Recordingcafe3_1751872328127.png";
import recordingcafe4 from "@assets/Recordingcafe4_1751872328128.png";
import recordingcafe5 from "@assets/Recordingcafe5_1751872328128.png";
import recordingcafe6 from "@assets/Recordingcafe6_1751872328128.png";
import recordingcafe7 from "@assets/Recordingcafe7_1751872328128.png";
import recordingcafe8 from "@assets/Recordingcafe8_1751872328129.png";
import recordingcafe9 from "@assets/Recordingcafe9_1751877203471.png";
import recordingcafe10 from "@assets/Recordingcafe10_1751877203471.png";
import recordingcafe11 from "@assets/Recordingcafe11_1751877203471.png";
import recordingcafe12 from "@assets/Recordingcafe12_1751877203472.png";
import recordingcafe15 from "@assets/Recordingcafe15_1751877203472.png";
import recordingcafe16 from "@assets/Recordingcafe16_1751877203473.png";
import recordingcafe17 from "@assets/Recordingcafe17_1751877203473.png";
import recordingcafe18 from "@assets/Recordingcafe18_1751877203473.png";
import recordingcafe19 from "@assets/Recordingcafe19_1751877203473.png";
import recordingcafe20 from "@assets/Recordingcafe20_1751877203474.png";
import recordingcafe21 from "@assets/Recordingcafe21_1751877203474.png";
import recordingcafe22 from "@assets/Recordingcafe22_1751877203474.png";
import recordingcafe23 from "@assets/Recordingcafe23_1751877203475.png";
import recordingcafe24 from "@assets/Recordingcafe24_1751877203475.png";
import recordingcafe25 from "@assets/Recordingcafe25_1751877203475.png";
import recordingcafe26 from "@assets/Recordingcafe26_1751879234411.png";
import recordingcafe27 from "@assets/Recordingcafe27_1751879234411.png";
import recordingcafe29 from "@assets/Recordingcafe29_1751879234412.png";
import recordingcafe30 from "@assets/Recordingcafe30_1751879234412.png";
import recordingcafe31 from "@assets/Recordingcafe31_1751879234412.png";
import recordingcafe32 from "@assets/Recordingcafe32_1751879234412.png";
import recordingcafe35 from "@assets/Recordingcafe35_1751879234412.png";
import recordingcafe36 from "@assets/Recordingcafe36_1751879234413.png";
import recordingcafe38 from "@assets/Recordingcafe38_1751879234413.png";
import recordingcafe39 from "@assets/Recordingcafe39_1751879234413.png";
import recordingcafe40 from "@assets/Recordingcafe40_1751879234413.png";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  // Featured images for "See The Magic Happen" carousel
  const featuredImages = [
    {
      src: recordingcafe0_1,
      title: "Professional Studio Environment",
      description: "State-of-the-art recording facility with premium equipment",
      category: "Studio Environment"
    },
    {
      src: recordingcafe0_3,
      title: "Modern Recording Setup",
      description: "Professional mixing console and monitoring equipment",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe0_4,
      title: "Recording Booth",
      description: "Acoustically treated recording space with professional microphones",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe0_5,
      title: "Studio Atmosphere",
      description: "Comfortable and inspiring environment for K-pop recording",
      category: "Studio Environment"
    }
  ];

  // Gallery images in numerical order
  const galleryImages = [
    {
      src: recordingcafe1,
      title: "Professional Recording Studio",
      description: "Recording booth with professional microphone setup",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe2,
      title: "Mixing Console Setup",
      description: "State-of-the-art digital mixing board",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe3,
      title: "Recording Session",
      description: "Artist recording in our professional booth",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe4,
      title: "Studio Atmosphere",
      description: "Comfortable recording environment with modern design",
      category: "Studio Environment"
    },
    {
      src: recordingcafe5,
      title: "Customer Recording",
      description: "International visitor enjoying K-pop recording experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe6,
      title: "Professional Equipment",
      description: "High-end microphones and audio equipment",
      category: "Studio Equipment"
    },
    {
      src: recordingcafe7,
      title: "Recording Session in Progress",
      description: "Artist performing with professional headphones",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe8,
      title: "Studio Interior",
      description: "Modern studio design with premium acoustics",
      category: "Studio Environment"
    },
    {
      src: recordingcafe9,
      title: "Happy Customer",
      description: "International artist enjoying K-pop recording experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe10,
      title: "Recording Session",
      description: "Professional recording with studio headphones",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe11,
      title: "Studio Performance",
      description: "Artist recording with professional microphone setup",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe12,
      title: "Studio Team",
      description: "Professional recording staff and customers",
      category: "Customer Experience"
    },
    {
      src: recordingcafe15,
      title: "Cafe Area",
      description: "Studio staff in the beautiful cafe environment",
      category: "Cafe Experience"
    },
    {
      src: recordingcafe16,
      title: "International Customer",
      description: "Foreign visitor enjoying the recording cafe experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe17,
      title: "Cafe Staff",
      description: "Friendly staff member in the cafe area",
      category: "Cafe Experience"
    },
    {
      src: recordingcafe18,
      title: "Professional Portrait",
      description: "Studio customer in professional recording environment",
      category: "Customer Experience"
    },
    {
      src: recordingcafe19,
      title: "Happy Customer",
      description: "International visitor enjoying the K-pop experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe20,
      title: "Cafe Experience",
      description: "Customer enjoying the cafe atmosphere",
      category: "Cafe Experience"
    },
    {
      src: recordingcafe21,
      title: "International Visitor",
      description: "Foreign customer at the recording cafe",
      category: "Customer Experience"
    },
    {
      src: recordingcafe22,
      title: "Studio Recording",
      description: "Professional recording session in progress",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe23,
      title: "Customer Experience",
      description: "Happy customer in the studio environment",
      category: "Customer Experience"
    },
    {
      src: recordingcafe24,
      title: "Professional Session",
      description: "Recording artist with studio equipment",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe25,
      title: "Studio Recording",
      description: "Customer enjoying K-pop recording experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe26,
      title: "Professional Customer",
      description: "Elegant customer in the cafe recording environment",
      category: "Customer Experience"
    },
    {
      src: recordingcafe27,
      title: "Control Room Session",
      description: "International customer in professional control room",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe29,
      title: "Studio Engineer",
      description: "Professional audio engineer in control room",
      category: "Studio Staff"
    },
    {
      src: recordingcafe30,
      title: "Recording Artist",
      description: "International artist in professional studio environment",
      category: "Customer Experience"
    },
    {
      src: recordingcafe31,
      title: "Happy Recording Session",
      description: "Joyful customer enjoying the recording experience",
      category: "Customer Experience"
    },
    {
      src: recordingcafe32,
      title: "Studio Portrait",
      description: "Beautiful portrait in professional recording environment",
      category: "Customer Experience"
    },
    {
      src: recordingcafe35,
      title: "Professional Recording",
      description: "International customer in state-of-the-art studio",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe36,
      title: "Studio Experience",
      description: "Customer enjoying professional recording session",
      category: "Customer Experience"
    },
    {
      src: recordingcafe38,
      title: "Creative Session",
      description: "Artist in professional recording environment",
      category: "Recording Sessions"
    },
    {
      src: recordingcafe39,
      title: "International Recording",
      description: "Foreign visitor in professional studio setup",
      category: "Customer Experience"
    },
    {
      src: recordingcafe40,
      title: "Studio Professional",
      description: "Happy customer in premium recording facility",
      category: "Customer Experience"
    }
  ];
  const filteredImages = galleryImages;

  const testimonials = [
    {
      text: "Amazing K-pop recording experience! The staff was so professional and helped me sound like a real idol.",
      author: "Sarah from USA",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      text: "The studio quality is incredible. I felt like I was recording in SM Entertainment! Will definitely come back.",
      author: "Yuki from Japan",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      text: "Perfect combination of professional recording and cozy cafe atmosphere. Highly recommended for K-pop fans!",
      author: "Emma from Germany",
      rating: "⭐⭐⭐⭐⭐"
    }
  ];

  const toggleLike = (index: number) => {
    const newLiked = new Set(liked);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
    }
    setLiked(newLiked);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
  };

  return (
    <section id="gallery" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2">
            Studio Gallery
          </Badge>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            See The Magic Happen
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Step inside our professional K-pop recording studio and see real customers living their idol dreams
          </p>
        </div>

        {/* Featured Carousel */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Featured Moments</h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-[500px] rounded-3xl overflow-hidden">
              <img
                src={featuredImages[currentSlide].src}
                alt={featuredImages[currentSlide].title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <Badge className="mb-3 bg-pink-500/90">
                  {featuredImages[currentSlide].category}
                </Badge>
                <h4 className="text-2xl font-bold mb-2">{featuredImages[currentSlide].title}</h4>
                <p className="text-gray-300">{featuredImages[currentSlide].description}</p>
              </div>

              {/* Navigation */}
              <Button
                onClick={prevSlide}
                variant="outline"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/30 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={nextSlide}
                variant="outline"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/30 text-white hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {featuredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-pink-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredImages.map((image, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden rounded-2xl bg-black/20 border-white/10 hover:border-pink-500/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="mb-2 bg-pink-500/90 text-xs">
                      {image.category}
                    </Badge>
                    <h4 className="text-white font-semibold text-sm mb-1">{image.title}</h4>
                    <p className="text-gray-300 text-xs">{image.description}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 bg-black/50 border-white/30 text-white hover:bg-pink-500/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-8 h-8 p-0 border-white/30 text-white transition-colors ${
                      liked.has(index) 
                        ? 'bg-pink-500/80 hover:bg-pink-600/80' 
                        : 'bg-black/50 hover:bg-pink-500/80'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(index);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${liked.has(index) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Featured Badge */}
                {image.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2 bg-pink-500/90">
                      {filteredImages[selectedImage].category}
                    </Badge>
                    <h3 className="font-bold text-xl mb-2">{filteredImages[selectedImage].title}</h3>
                    <p className="text-gray-300">{filteredImages[selectedImage].description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-white/30 text-white transition-colors ${
                      liked.has(selectedImage) 
                        ? 'bg-pink-500/80 hover:bg-pink-600/80' 
                        : 'bg-black/50 hover:bg-pink-500/80'
                    }`}
                    onClick={() => toggleLike(selectedImage)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked.has(selectedImage) ? 'fill-current' : ''}`} />
                    {liked.has(selectedImage) ? 'Liked' : 'Like'}
                  </Button>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setSelectedImage(null)}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-black/50 border-white/30 text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Navigation */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    onClick={() => setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length)}
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/30 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setSelectedImage((selectedImage + 1) % filteredImages.length)}
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/30 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Customer Testimonials */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">What Our Customers Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass p-6 border-white/20 bg-black/20">
                <div className="text-2xl mb-3">{testimonial.rating}</div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-pink-400 font-semibold">- {testimonial.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
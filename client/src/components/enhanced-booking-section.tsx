import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, Coffee, Music, ShoppingBag, Sparkles, ExternalLink, CheckCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";

// PayPal payment links for additional services
const paypalLinks: Record<string, string> = {
  "Recording Video (Raw)": "https://www.paypal.com/ncp/payment/KCAEA9TSL4UDC",
  "Recording Video (Edited)": "https://www.paypal.com/ncp/payment/A555WXMCPFUP8",
  "LP Record Production": "https://www.paypal.com/ncp/payment/93R6M35YLRQPL",
  "Full Track Mixing": "https://www.paypal.com/ncp/payment/ZAAE5ZA56ABRW",
  "Global Distribution": "https://www.paypal.com/ncp/payment/N6WJ29SGK4ZLG",
};
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Addon } from "@shared/schema";

// Booking form schema with conditional validation
const bookingFormSchema = z.object({
  bookingType: z.enum(["direct", "klook"]).default("direct"),
  klookBookingId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  selectedDrink: z.string().min(1, "Please select a drink"),
  drinkTemperature: z.string().optional(),
  youtubeTrackUrl: z.string().url("Please enter a valid YouTube URL"),
  selectedAddons: z.array(z.number()).default([]),
  lpDeliveryAddress: z.string().optional(),
  bookingDate: z.string().optional(),
  bookingTime: z.string().optional(),
}).superRefine((data, ctx) => {
  // For direct bookings, date and time are required
  if (data.bookingType === "direct") {
    if (!data.bookingDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a date",
        path: ["bookingDate"],
      });
    }
    if (!data.bookingTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a time",
        path: ["bookingTime"],
      });
    }
  }
  // For klook bookings, klook booking ID is required
  if (data.bookingType === "klook" && !data.klookBookingId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter your Klook booking ID",
      path: ["klookBookingId"],
    });
  }
  // If LP Record Production is selected, delivery address is required
  if (data.selectedAddons.includes(4) && (!data.lpDeliveryAddress || data.lpDeliveryAddress.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "LP delivery address is required for LP Record Production",
      path: ["lpDeliveryAddress"],
    });
  }
});

type BookingForm = z.infer<typeof bookingFormSchema>;

interface PaymentModalData {
  bookingId: number;
  selectedServices: { name: string; price: number; paypalLink: string }[];
}

export default function EnhancedBookingSection() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [bookingStep, setBookingStep] = useState<"select-type" | "booking-form">("select-type");
  const [selectedBookingType, setSelectedBookingType] = useState<"direct" | "klook">();
  const [paymentModal, setPaymentModal] = useState<PaymentModalData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: addons = [] } = useQuery<Addon[]>({
    queryKey: ['/api/addons'],
  });

  // Fetch time slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const fetchTimeSlots = async () => {
      setLoadingTimes(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        console.log('Fetching time slots for:', dateStr);
        
        const response = await fetch(`/api/timeslots/${dateStr}`);
        if (!response.ok) {
          throw new Error('Failed to fetch time slots');
        }
        const data = await response.json();
        console.log('Received time slots:', data);
        setAvailableTimes(data || []);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setAvailableTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingType: selectedBookingType || "direct",
      klookBookingId: "",
      name: "",
      email: "",
      phone: "",
      selectedDrink: "",
      drinkTemperature: "",
      youtubeTrackUrl: "",
      selectedAddons: [],
      bookingDate: "",
      bookingTime: "",
    },
  });

  // Check if URL has klook anchor and scroll to booking section (but keep selection screen)
  useEffect(() => {
    const checkKlookHash = () => {
      if (window.location.hash === '#klook-booking' || window.location.hash === '#klook') {
        console.log("Klook hash detected, scrolling to booking section");
        
        // DON'T auto-select klook mode - keep the selection screen
        // Scroll directly to the booking type cards
        setTimeout(() => {
          console.log("Attempting to scroll to booking-type-cards");
          const cardContainer = document.getElementById('booking-type-cards');
          const bookingSection = document.getElementById('booking');
          
          if (cardContainer) {
            console.log("Found booking-type-cards, scrolling to it");
            // Get the position of the card container
            const rect = cardContainer.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - 150; // Offset to show cards better
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          } else if (bookingSection) {
            console.log("Fallback: scrolling to booking section");
            bookingSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 800); // Increased delay to ensure elements are rendered
      }
    };
    
    // Check immediately and also listen for hash changes
    checkKlookHash();
    window.addEventListener('hashchange', checkKlookHash);
    
    return () => {
      window.removeEventListener('hashchange', checkKlookHash);
    };
  }, [form]);

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      const totalPrice = calculateTotalPrice(data.selectedAddons, data.bookingTime, data.bookingType);
      
      const bookingData = {
        ...data,
        bookingDate: data.bookingType === "direct" ? (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '') : undefined,
        totalPrice: Math.round(totalPrice), // Korean won
      };

      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return { json: await response.json(), selectedAddons: data.selectedAddons };
    },
    onSuccess: (response) => {
      console.log('Booking creation response:', response);
      
      // Extract bookingId from response
      const bookingId = response.json.id;
      console.log('Extracted bookingId:', bookingId);
      
      if (!bookingId) {
        console.error('No bookingId in response:', response);
        toast({
          title: "Booking Failed",
          description: "An error occurred while processing your booking.",
          variant: "destructive",
        });
        return;
      }

      // Check for selected addons with PayPal links
      const selectedAddonIds = response.selectedAddons || [];
      const selectedServices = selectedAddonIds
        .map((id: number) => {
          const addon = addons.find(a => a.id === id);
          if (addon && paypalLinks[addon.name]) {
            return { name: addon.name, price: addon.price, paypalLink: paypalLinks[addon.name] };
          }
          return null;
        })
        .filter((service): service is { name: string; price: number; paypalLink: string } => service !== null);
      
      if (selectedServices.length > 0) {
        // Show payment modal with buttons
        setPaymentModal({
          bookingId,
          selectedServices,
        });
      } else {
        toast({
          title: "Booking Confirmed!",
          description: `Booking #${bookingId} has been successfully received. We will contact you soon.`,
          duration: 5000,
        });
      }
      
      // Reset form and selections
      form.reset();
      setSelectedDate(undefined);
      setAvailableTimes([]);
      setBookingStep("select-type");
      setSelectedBookingType(undefined);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/timeslots'] });
      
      // Optional: Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate base price based on time slot
  const getBasePrice = (time: string): number => {
    if (!time) return 0;
    
    const hour = parseInt(time.split(':')[0]);
    const minute = parseInt(time.split(':')[1]);
    const timeInMinutes = hour * 60 + minute;
    
    // AM10:00~PM12:50 (10:00-12:50) - ₩40,000
    if (timeInMinutes >= 600 && timeInMinutes <= 770) {
      return 40000;
    }
    // PM01:00~PM05:50 (13:00-17:50) - ₩50,000  
    else if (timeInMinutes >= 780 && timeInMinutes <= 1070) {
      return 50000;
    }
    // PM06:00~PM10:00 (18:00-22:00) - ₩44,000
    else if (timeInMinutes >= 1080 && timeInMinutes <= 1320) {
      return 44000;
    }
    
    return 0;
  };

  const calculateTotalPrice = (selectedAddonIds: number[], bookingTime: string = "", bookingType: string = "direct") => {
    // For Klook bookings, base price is 0 (already paid through Klook)
    // For Direct bookings, include base price based on time slot
    const basePrice = bookingType === "klook" ? 0 : getBasePrice(bookingTime);
    
    // Always include addon prices for both booking types
    const addonsPrice = selectedAddonIds.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    
    return basePrice + addonsPrice;
  };

  const onSubmit = (data: BookingForm) => {
    bookingMutation.mutate(data);
  };

  const drinkOptions = [
    { value: "coffee", label: "Coffee", hasTemperature: true },
    { value: "coffee-decaf", label: "Coffee (Decaffeinated)", hasTemperature: true },
    { value: "lemonade", label: "Lemonade", hasTemperature: false },
    { value: "strawberry-ade", label: "Strawberry Ade", hasTemperature: false },
    { value: "orange-ade", label: "Orange Ade", hasTemperature: false },
    { value: "grapefruit-ade", label: "Grapefruit Ade", hasTemperature: false },
    { value: "iced-tea", label: "Iced Tea", hasTemperature: false },
    { value: "green-tea", label: "Green Tea", hasTemperature: true },
    { value: "hibiscus", label: "Hibiscus", hasTemperature: true },
    { value: "earl-grey", label: "Earl Grey", hasTemperature: true },
    { value: "peppermint", label: "Peppermint", hasTemperature: true },
    { value: "chamomile", label: "Chamomile", hasTemperature: true },
    { value: "hot-chocolate", label: "Hot Chocolate", hasTemperature: false, hotOnly: true },
  ];

  const selectedDrinkOption = drinkOptions.find(d => d.value === form.watch("selectedDrink"));
  const currentBookingType = form.watch("bookingType");

  // Handle booking type selection
  const handleBookingTypeSelect = (type: "direct" | "klook") => {
    console.log("Booking type selected:", type);
    setSelectedBookingType(type);
    form.setValue("bookingType", type);
    setBookingStep("booking-form");
    
    // Update URL hash for klook bookings
    if (type === "klook") {
      window.location.hash = '#klook-booking';
    }
  };

  // If we're in the type selection step, show the selection UI
  if (bookingStep === "select-type") {
    return (
      <section id="booking" className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 gradient-text">Book Your K-pop Recording Session</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How would you like to make your booking?
            </p>
          </div>

          <div id="booking-type-cards" className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Klook Booking - First Position */}
            <Card 
              id="klook-booking"
              className="glass border-white/20 cursor-pointer hover:border-blue-500/50 transition-all duration-300"
              onClick={() => handleBookingTypeSelect("klook")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Klook Reservation</h3>
                <p className="text-gray-300 mb-6">
                  Already booked through Klook? Complete your experience here
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>✓ Use your Klook booking ID</li>
                  <li>✓ Select drinks & add-ons</li>
                  <li>✓ Quick check-in process</li>
                </ul>
              </CardContent>
            </Card>

            {/* Direct Booking - Second Position */}
            <Card 
              className="glass border-white/20 cursor-pointer hover:border-pink-500/50 transition-all duration-300"
              onClick={() => handleBookingTypeSelect("direct")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Direct Booking</h3>
                <p className="text-gray-300 mb-6">
                  Book directly with us and choose your preferred date and time
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>✓ Choose your preferred time slot</li>
                  <li>✓ Real-time availability</li>
                  <li>✓ Instant confirmation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Naver Booking Button */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-1 rounded-2xl">
              <Card 
                className="bg-gray-900 border-0 cursor-pointer hover:bg-gray-800 transition-all duration-300"
                onClick={() => setLocation("/naver-booking")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white mb-1">
                        네이버 예약자 주문
                      </h3>
                      <p className="text-sm text-gray-300">
                        네이버에서 예약하신 고객님 전용 추가 주문 페이지 (50% 할인)
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        data-testid="button-naver-booking"
                      >
                        바로가기 →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8 gradient-text">Book Your K-pop Recording Session</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete your booking with drink selection and additional services
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Music className="h-6 w-6" />
                {currentBookingType === "klook" ? "Complete Your Klook Reservation" : "Recording Session Booking"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {currentBookingType === "klook" 
                  ? "Select your drink and additional services for your reserved session"
                  : "Fill in your details to book your K-pop recording experience"
                }
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setBookingStep("select-type")}
                className="w-fit mt-2 text-blue-400 border-blue-400/50 hover:bg-blue-400/10 hover:text-blue-300"
              >
                ← Change Booking Type
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your full name" 
                              className="bg-white/10 border-white/20 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Phone Number *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+82-10-0000-0000" 
                              className="bg-white/10 border-white/20 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email (for recording file delivery) *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your@email.com" 
                              type="email"
                              className="bg-white/10 border-white/20 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Klook Booking ID (only for Klook bookings) */}
                  {currentBookingType === "klook" && (
                    <FormField
                      control={form.control}
                      name="klookBookingId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Klook Booking ID *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your Klook booking confirmation ID" 
                              className="bg-white/10 border-white/20 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Drink Selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Coffee className="h-5 w-5" />
                      Drink Selection
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="selectedDrink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Choose Your Drink *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Select a drink" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {drinkOptions.map((drink) => (
                                  <SelectItem key={drink.value} value={drink.value}>
                                    {drink.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {selectedDrinkOption?.hasTemperature && !selectedDrinkOption?.hotOnly && (
                        <FormField
                          control={form.control}
                          name="drinkTemperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Temperature</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Hot or Iced" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="hot">Hot</SelectItem>
                                  <SelectItem value="iced">Iced</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* YouTube Track URL */}
                  <FormField
                    control={form.control}
                    name="youtubeTrackUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Backing Track YouTube URL *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            className="bg-white/10 border-white/20 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time Selection (only for direct bookings) */}
                  {currentBookingType === "direct" && (
                    <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bookingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">Booking Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-white/10 border-white/20 text-white",
                                    !selectedDate && "text-gray-400"
                                  )}
                                >
                                  {selectedDate ? (
                                    format(selectedDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  console.log('Date selected:', date);
                                  setSelectedDate(date);
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                  // Reset time selection when date changes
                                  form.setValue('bookingTime', '');

                                }}
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bookingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Booking Time * 
                            <div className="text-sm text-gray-300 mt-1">
                              AM10:00-PM12:50: ₩40,000 | PM01:00-PM05:50: ₩50,000 | PM06:00-PM10:00: ₩44,000
                            </div>
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!selectedDate || loadingTimes}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder={
                                  !selectedDate 
                                    ? "Select a date first" 
                                    : loadingTimes 
                                    ? "Loading times..." 
                                    : "Select time"
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loadingTimes ? (
                                <div className="p-4 text-center text-gray-500">
                                  Loading available times...
                                </div>
                              ) : availableTimes.length > 0 ? (
                                availableTimes.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))
                              ) : selectedDate ? (
                                <div className="p-4 text-center text-gray-500">
                                  No available times for {format(selectedDate, 'yyyy-MM-dd')}
                                </div>
                              ) : null}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  )}

                  {/* Additional Services */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Additional Services
                    </h3>
                    <FormField
                      control={form.control}
                      name="selectedAddons"
                      render={() => (
                        <FormItem>
                          <div className="grid md:grid-cols-2 gap-4">
                            {addons.map((addon) => (
                              <FormField
                                key={addon.id}
                                control={form.control}
                                name="selectedAddons"
                                render={({ field }) => {
                                  const hasPaypalLink = paypalLinks[addon.name];
                                  return (
                                    <FormItem
                                      key={addon.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/20 p-4"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(addon.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, addon.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== addon.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none flex-1">
                                        <div className="flex items-center gap-2">
                                          <FormLabel className="text-white font-semibold">
                                            {addon.name}
                                          </FormLabel>
                                          {hasPaypalLink && (
                                            <ExternalLink className="h-3 w-3 text-yellow-400" />
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-300">
                                          {addon.description}
                                        </p>
                                        <p className="text-lg font-bold text-yellow-400">
                                          ₩{addon.price.toLocaleString()}
                                        </p>
                                        {hasPaypalLink && (
                                          <p className="text-xs text-green-400">
                                            PayPal payment available
                                          </p>
                                        )}
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* LP Delivery Address - only show if LP Record Production is selected */}
                  {form.watch("selectedAddons")?.includes(4) && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        LP Delivery Information
                      </h3>
                      <FormField
                        control={form.control}
                        name="lpDeliveryAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Delivery Address *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full delivery address for LP vinyl record..."
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-gray-400">
                              Your vinyl LP record will be shipped to this address within 2-3 weeks after production.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">
                        {currentBookingType === "klook" ? "Additional Services Total:" : "Total Price:"}
                      </span>
                      <span className="text-2xl font-bold text-yellow-400">
                        ₩{calculateTotalPrice(form.watch("selectedAddons"), form.watch("bookingTime"), currentBookingType).toLocaleString()}
                      </span>
                    </div>
                    {currentBookingType === "klook" && (
                      <p className="text-sm text-gray-400 mt-2">
                        * Recording session fee already paid through Klook
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full k-gradient-pink-purple text-lg py-6"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? "Processing..." : 
                     currentBookingType === "direct" ? "Proceed to Payment" : "Complete Booking"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Payment Modal */}
      <Dialog open={!!paymentModal} onOpenChange={(open) => !open && setPaymentModal(null)}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-xl">
              <CheckCircle className="h-6 w-6 text-green-400" />
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Booking #{paymentModal?.bookingId} has been successfully received.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 text-sm font-medium mb-2">
                💳 Payment Required for Additional Services
              </p>
              <p className="text-gray-300 text-sm">
                Please click each button below to complete payment via PayPal. 
                If a new window doesn't open, please check your popup blocker settings.
              </p>
            </div>
            
            <div className="space-y-3">
              {paymentModal?.selectedServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-yellow-400 text-sm">₩{service.price.toLocaleString()}</p>
                  </div>
                  <Button
                    onClick={() => window.open(service.paypalLink, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay with PayPal
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <Button
                onClick={() => setPaymentModal(null)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Coffee, Music, ShoppingBag, Snowflake, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Addon } from "@shared/schema";

// Booking form schema
const bookingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  selectedDrink: z.string().min(1, "Please select a drink"),
  drinkTemperature: z.string().optional(),
  youtubeTrackUrl: z.string().url("Please enter a valid YouTube URL"),
  selectedAddons: z.array(z.number()).default([]),
  bookingDate: z.string().min(1, "Please select a date"),
  bookingTime: z.string().min(1, "Please select a time"),
});

type BookingForm = z.infer<typeof bookingFormSchema>;

export default function EnhancedBookingSection() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
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
      name: "",
      nickname: "",
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

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      const totalPrice = calculateTotalPrice(data.selectedAddons, data.bookingTime);
      
      const bookingData = {
        ...data,
        bookingDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        totalPrice: Math.round(totalPrice), // Korean won
      };

      return apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful!",
        description: "Your recording session has been booked. We'll send confirmation details to your email.",
      });
      form.reset();
      setSelectedDate(undefined);
      setAvailableTimes([]);
      queryClient.invalidateQueries({ queryKey: ['/api/timeslots'] });
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

  const calculateTotalPrice = (selectedAddonIds: number[], bookingTime: string = "") => {
    const basePrice = getBasePrice(bookingTime);
    const addonsPrice = selectedAddonIds.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return basePrice + addonsPrice;
  };

  const onSubmit = (data: BookingForm) => {
    bookingMutation.mutate(data);
  };

  // Drink options matching the cafe menu
  const drinkCategories = {
    hot: [
      { value: "americano", name: "Americano", korean: "아메리카노", price: "₩5,000" },
      { value: "latte", name: "Latte", korean: "라떼", price: "₩6,000" },
      { value: "vanilla-latte", name: "Vanilla Latte", korean: "바닐라라떼", price: "₩6,500" },
      { value: "green-tea", name: "Green Tea (Organic)", korean: "녹차(유기농재료)", price: "₩6,000" },
      { value: "earl-grey", name: "Earl Grey", korean: "얼그레이", price: "₩6,000" },
      { value: "lemon-tea", name: "Lemon Tea", korean: "유자차", price: "₩6,500" }
    ],
    cold: [
      { value: "ice-americano", name: "Ice Americano", korean: "아이스 아메리카노", price: "₩5,500" },
      { value: "mango-juice", name: "Mango Juice", korean: "망고 주스", price: "₩7,000" },
      { value: "passion-fruit-juice", name: "Passion Fruit Juice", korean: "패션프루트 주스", price: "₩7,000" },
      { value: "grapefruit-tea", name: "Grapefruit Tea", korean: "대추차", price: "₩6,500" },
      { value: "ginger-tea", name: "Ginger Tea", korean: "황차고", price: "₩7,000" }
    ]
  };

  // Get all drink options for the form
  const allDrinkOptions = [...drinkCategories.hot, ...drinkCategories.cold];
  const selectedDrink = form.watch("selectedDrink");
  const selectedDrinkOption = allDrinkOptions.find(d => d.value === selectedDrink);

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
                Recording Session Booking
              </CardTitle>
              <CardDescription className="text-gray-300">
                Fill in your details to book your K-pop recording experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nickname</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your preferred nickname" 
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

                  {/* Drink Selection */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white text-center gradient-text">Choose Your Drink</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Hot Drinks */}
                      <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center mb-4">
                          <Coffee className="text-[hsl(var(--k-coral))] mr-3" size={24} />
                          <h4 className="text-xl font-bold text-white">Hot Drinks</h4>
                        </div>
                        <FormField
                          control={form.control}
                          name="selectedDrink"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              {drinkCategories.hot.map((drink) => (
                                <div key={drink.value} className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="radio"
                                      value={drink.value}
                                      checked={field.value === drink.value}
                                      onChange={() => field.onChange(drink.value)}
                                      className="text-[hsl(var(--k-pink))]"
                                    />
                                  </FormControl>
                                  <div className="flex justify-between items-center w-full">
                                    <div className="flex-1">
                                      <div className="text-white font-medium">{drink.name}</div>
                                      <div className="text-gray-400 text-sm">{drink.korean}</div>
                                    </div>
                                    <div className="text-[hsl(var(--k-pink))] font-bold">{drink.price}</div>
                                  </div>
                                </div>
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Cold Drinks */}
                      <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center mb-4">
                          <Snowflake className="text-[hsl(var(--k-blue))] mr-3" size={24} />
                          <h4 className="text-xl font-bold text-white">Cold Drinks & Teas</h4>
                        </div>
                        <FormField
                          control={form.control}
                          name="selectedDrink"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              {drinkCategories.cold.map((drink) => (
                                <div key={drink.value} className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="radio"
                                      value={drink.value}
                                      checked={field.value === drink.value}
                                      onChange={() => field.onChange(drink.value)}
                                      className="text-[hsl(var(--k-purple))]"
                                    />
                                  </FormControl>
                                  <div className="flex justify-between items-center w-full">
                                    <div className="flex-1">
                                      <div className="text-white font-medium">{drink.name}</div>
                                      <div className="text-gray-400 text-sm">{drink.korean}</div>
                                    </div>
                                    <div className="text-[hsl(var(--k-purple))] font-bold">{drink.price}</div>
                                  </div>
                                </div>
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* What's Included Note */}
                    <div className="p-6 k-gradient-pink-purple rounded-2xl">
                      <div className="flex items-center mb-3">
                        <Zap className="text-white mr-3" size={24} />
                        <h4 className="text-xl font-bold text-white">What's Included</h4>
                      </div>
                      <p className="text-white">
                        Your recording session includes one premium drink of your choice from our full menu. The drink price is included in your session fee.
                      </p>
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

                  {/* Date and Time Selection */}
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
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-white font-semibold">
                                          {addon.name}
                                        </FormLabel>
                                        <p className="text-sm text-gray-300">
                                          {addon.description}
                                        </p>
                                        <p className="text-lg font-bold text-yellow-400">
                                          ₩{addon.price.toLocaleString()}
                                        </p>
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

                  {/* Total Price */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total Price:</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        ₩{calculateTotalPrice(form.watch("selectedAddons"), form.watch("bookingTime")).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full k-gradient-pink-purple text-lg py-6"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? "Processing..." : "Complete Booking"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
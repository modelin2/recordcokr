import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Package, Addon, TimeSlot, InsertBooking } from "@shared/schema";

export default function BookingSection() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSongCount, setSelectedSongCount] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { toast } = useToast();

  const { data: addons = [] } = useQuery<Addon[]>({
    queryKey: ['/api/addons'],
  });

  const { data: timeSlots = [], isLoading: timeSlotsLoading } = useQuery<TimeSlot[]>({
    queryKey: ['/api/timeslots', selectedDate?.toISOString().split('T')[0]],
    enabled: !!selectedDate,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: InsertBooking) => {
      const response = await apiRequest('POST', '/api/bookings', bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your K-pop recording session has been booked successfully. We'll send you a confirmation email shortly.",
      });
      // Reset form
      setFormData({ name: "", email: "", phone: "" });
      setSelectedSongCount("");
      setSelectedAddons([]);
      setSelectedDate(undefined);
      setSelectedTime("");
      // Invalidate time slots to update availability
      queryClient.invalidateQueries({ queryKey: ['/api/timeslots'] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !selectedSongCount || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const bookingData: InsertBooking = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      packageId: parseInt(selectedSongCount), // Using song count as package ID for simplicity
      selectedAddons,
      bookingDate: selectedDate.toISOString().split('T')[0],
      bookingTime: selectedTime,
      totalPrice: calculateTotalPrice(), // Calculate on client side
      status: "confirmed",
    };

    bookingMutation.mutate(bookingData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddonToggle = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
    } else {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
    // Calculate base price based on song count and time
    if (selectedSongCount && selectedTime) {
      const songCount = parseInt(selectedSongCount);
      const hour = parseInt(selectedTime.split(':')[0]);
      
      let basePrice = 0;
      if (songCount === 1) {
        if (hour >= 10 && hour < 13) basePrice = 30000; // 20% discount
        else if (hour >= 13 && hour < 18) basePrice = 37500; // Base price
        else if (hour >= 18 && hour < 22) basePrice = 33000; // 10% discount
      } else if (songCount === 2) {
        if (hour >= 10 && hour < 13) basePrice = 60000; // 20% discount
        else if (hour >= 13 && hour < 18) basePrice = 75000; // Base price
        else if (hour >= 18 && hour < 22) basePrice = 66000; // 10% discount
      } else if (songCount === 4) {
        if (hour >= 10 && hour < 13) basePrice = 120000; // 20% discount
        else if (hour >= 13 && hour < 18) basePrice = 150000; // Base price
        else if (hour >= 18 && hour < 22) basePrice = 132000; // 10% discount
      }
      
      total += basePrice;
    }
    
    // Add addon prices
    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id.toString() === addonId);
      if (addon) total += addon.price;
    });
    
    return total;
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-[hsl(var(--k-pink))] via-[hsl(var(--k-purple))] to-[hsl(var(--k-blue))]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-8 text-white">Ready to Record Your K-pop Dream?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-white">
          Join thousands of international visitors who've created their K-pop memories at Studio Vibes
        </p>
        
        <Card className="glass p-8 rounded-3xl max-w-2xl mx-auto bg-white/10 border-white/30">
          <h3 className="text-2xl font-bold mb-6 text-white">Book Your Session</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white text-left block">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your Name"
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-left block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email Address"
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white text-left block">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone Number"
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
              />
            </div>

            {/* Song Count Selection */}
            <div className="space-y-2">
              <Label className="text-white text-left block">Choose Number of Songs *</Label>
              <Select value={selectedSongCount} onValueChange={setSelectedSongCount} required>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Select number of songs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Song</SelectItem>
                  <SelectItem value="2">2 Songs</SelectItem>
                  <SelectItem value="4">4 Songs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add-ons Selection */}
            {addons.length > 0 && (
              <div className="space-y-4">
                <Label className="text-white text-left block">Add-ons (Optional)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {addons.map((addon) => (
                    <div key={addon.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={selectedAddons.includes(addon.id.toString())}
                        onCheckedChange={(checked) => 
                          handleAddonToggle(addon.id.toString(), checked as boolean)
                        }
                        className="border-white"
                      />
                      <Label 
                        htmlFor={`addon-${addon.id}`} 
                        className="text-white text-sm cursor-pointer"
                      >
                        {addon.name} (+₩{addon.price.toLocaleString()})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-white text-left block">Select Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30",
                      !selectedDate && "text-gray-300"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-2">
                <Label className="text-white text-left block">Select Time *</Label>
                {timeSlotsLoading ? (
                  <div className="text-white">Loading available times...</div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-white">No available times for this date</div>
                ) : (
                  <Select value={selectedTime} onValueChange={setSelectedTime} required>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.time}>
                          {slot.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Total Price */}
            {selectedSongCount && selectedTime && (
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-white text-lg font-bold">
                  Total: ₩{calculateTotalPrice().toLocaleString()}
                </div>
                <div className="text-gray-300 text-sm mt-1">
                  Includes: Premium drink + {selectedSongCount} song{selectedSongCount !== "1" ? "s" : ""} + Raw files + Free photography
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={bookingMutation.isPending}
              className="w-full bg-white text-[hsl(var(--k-purple))] py-4 rounded-full font-bold hover:scale-105 transition-transform border-0"
            >
              {bookingMutation.isPending ? "Booking..." : "Reserve Your Spot"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}

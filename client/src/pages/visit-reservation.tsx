import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";

declare global {
  interface Window {
    paypal?: any;
  }
}

const visitReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  reservationDate: z.string().min(1, "Date is required"),
  reservationTime: z.string().min(1, "Time is required"),
  source: z.string().default("instagram"),
});

type VisitReservationForm = z.infer<typeof visitReservationSchema>;

const DEPOSIT_AMOUNT_KRW = 10000;
const KRW_TO_USD_RATE = 1400;

export default function VisitReservationPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pendingReservationId, setPendingReservationId] = useState<number | null>(null);
  const pendingReservationIdRef = useRef<number | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: paypalConfig } = useQuery<{ clientId: string }>({
    queryKey: ["/api/paypal/client-id"],
  });

  const form = useForm<VisitReservationForm>({
    resolver: zodResolver(visitReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reservationDate: "",
      reservationTime: "",
      source: "instagram",
    },
  });

  const formValues = form.watch();
  const isFormValid = formValues.name && formValues.email && formValues.phone && 
                      formValues.reservationDate && formValues.reservationTime;

  useEffect(() => {
    if (!paypalConfig?.clientId || paypalLoaded) return;

    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      const checkPaypal = setInterval(() => {
        if (window.paypal) {
          setPaypalLoaded(true);
          clearInterval(checkPaypal);
        }
      }, 100);
      setTimeout(() => clearInterval(checkPaypal), 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=USD&disable-funding=card,credit`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      toast({ title: "Payment system unavailable", variant: "destructive" });
    };
    document.body.appendChild(script);
  }, [paypalConfig, paypalLoaded, toast]);

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalButtonRef.current || !isFormValid) return;

    paypalButtonRef.current.innerHTML = "";

    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
        height: 50
      },
      createOrder: async () => {
        setPaymentProcessing(true);
        try {
          const validatedData = visitReservationSchema.parse(formValues);
          
          const response = await apiRequest("POST", "/api/visit-reservations", validatedData);
          const reservation = await response.json() as { id: number };
          setPendingReservationId(reservation.id);
          pendingReservationIdRef.current = reservation.id;

          const orderResponse = await apiRequest("POST", `/api/visit-reservations/${reservation.id}/create-paypal-order`, {});
          const orderData = await orderResponse.json() as { id: string };
          return orderData.id;
        } catch (error: any) {
          setPaymentProcessing(false);
          toast({ title: "Error creating reservation", variant: "destructive" });
          throw error;
        }
      },
      onApprove: async (data: any) => {
        try {
          const reservationId = pendingReservationIdRef.current;
          if (!reservationId) {
            throw new Error("No reservation ID found");
          }
          
          const response = await apiRequest("POST", `/api/visit-reservations/${reservationId}/capture-payment`, {
            orderId: data.orderID
          });
          const captureData = await response.json() as { success?: boolean };
          
          if (captureData.success) {
            toast({ title: "Reservation confirmed! Deposit payment received." });
            setIsComplete(true);
          } else {
            throw new Error("Capture failed");
          }
        } catch (error) {
          toast({ title: "Payment error", variant: "destructive" });
        } finally {
          setPaymentProcessing(false);
        }
      },
      onError: () => {
        setPaymentProcessing(false);
        toast({ title: "Payment error", variant: "destructive" });
      },
      onCancel: () => {
        setPaymentProcessing(false);
      }
    }).render(paypalButtonRef.current);
  }, [paypalLoaded, isFormValid, formValues.name, formValues.email, formValues.phone, formValues.reservationDate, formValues.reservationTime]);

  const availableTimes = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <Link href="/">
              <img src={logoImage} alt="Logo" className="h-16 mx-auto mb-8 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <Card className="border-2 border-green-500 shadow-xl">
              <CardContent className="pt-10 pb-10">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Reservation Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your deposit of ₩10,000 has been received. We look forward to seeing you!
                </p>
                <Button 
                  onClick={() => {
                    setIsComplete(false);
                    form.reset();
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Make Another Reservation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/">
            <img src={logoImage} alt="Logo" className="h-16 mx-auto mb-6 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            방문예약 / Visit Reservation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            처음 오셨나요? 방문 날짜와 시간을 예약하세요.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            First time here? Reserve your visit date and time.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="shadow-xl border-2 border-pink-200">
            <CardHeader className="text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">예약 정보 입력</CardTitle>
              <CardDescription className="text-pink-100">
                Reserve your recording session with a ₩10,000 deposit
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name / 이름</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} data-testid="input-name" />
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
                        <FormLabel>Email / 이메일</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone / 연락처</FormLabel>
                        <FormControl>
                          <Input placeholder="+82 10-1234-5678" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reservationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date / 날짜</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="button-date-picker"
                              >
                                {field.value ? format(new Date(field.value), "PPP") : "Select date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                setSelectedDate(date);
                                if (date) {
                                  field.onChange(format(date, "yyyy-MM-dd"));
                                }
                              }}
                              disabled={(date) => date < new Date()}
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
                    name="reservationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time / 시간</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-time">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200 mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Deposit Amount</span>
                      <span className="text-xl font-bold text-pink-600">₩10,000</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      ≈ ${(DEPOSIT_AMOUNT_KRW / KRW_TO_USD_RATE).toFixed(2)} USD
                    </p>
                  </div>

                  <div className="pt-4">
                    {paymentProcessing && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                        <p className="text-gray-600">Processing payment...</p>
                      </div>
                    )}
                    
                    {!isFormValid && (
                      <p className="text-center text-gray-500 text-sm mb-4">
                        Please fill in all fields to proceed with payment
                      </p>
                    )}

                    <div 
                      ref={paypalButtonRef} 
                      className={cn(
                        "min-h-[60px]",
                        (!isFormValid || paymentProcessing) && "opacity-50 pointer-events-none"
                      )}
                      data-testid="paypal-button-container"
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                홈으로 돌아가기 / Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

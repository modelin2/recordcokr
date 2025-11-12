import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Music2, Coffee, CheckCircle2, Sparkles } from "lucide-react";
import type { PartnerAddon } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const naverBookingSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  naverReservationId: z.string().min(1, "네이버 예약번호를 입력해주세요"),
  bookingDate: z.string().min(1, "예약 날짜를 입력해주세요"),
  bookingTime: z.string().min(1, "예약 시간을 입력해주세요"),
  selectedDrink: z.string().min(1, "음료를 선택해주세요"),
  drinkTemperature: z.string().optional(),
  youtubeTrackUrl: z.string().optional(),
  selectedPartnerAddons: z.array(z.number()).default([]),
  lpDeliveryAddress: z.string().optional(),
});

type NaverBookingForm = z.infer<typeof naverBookingSchema>;

export default function NaverBooking() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [naverAddons, setNaverAddons] = useState<PartnerAddon[]>([]);
  const [loading, setLoading] = useState(true);

  const drinkOptions = [
    { value: "coffee", label: "커피 (Coffee)", hasTemperature: true },
    { value: "coffee-decaf", label: "디카페인 커피 (Decaf Coffee)", hasTemperature: true },
    { value: "lemonade", label: "레모네이드 (Lemonade)", hasTemperature: false },
    { value: "strawberry-ade", label: "딸기 에이드 (Strawberry Ade)", hasTemperature: false },
    { value: "orange-ade", label: "오렌지 에이드 (Orange Ade)", hasTemperature: false },
  ];

  const form = useForm<NaverBookingForm>({
    resolver: zodResolver(naverBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      naverReservationId: "",
      bookingDate: "",
      bookingTime: "",
      selectedDrink: "",
      drinkTemperature: "iced",
      youtubeTrackUrl: "",
      selectedPartnerAddons: [],
      lpDeliveryAddress: "",
    },
  });

  // Fetch Naver addons on component mount
  useState(() => {
    fetch("/api/naver/addons")
      .then((res) => res.json())
      .then((data) => {
        setNaverAddons(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch Naver addons:", error);
        toast({
          title: "오류",
          description: "추가 옵션을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
        setLoading(false);
      });
  });

  const selectedDrinkOption = drinkOptions.find(
    (d) => d.value === form.watch("selectedDrink")
  );

  const selectedAddonIds = form.watch("selectedPartnerAddons");
  const totalAddonPrice = naverAddons
    .filter((addon) => selectedAddonIds.includes(addon.id))
    .reduce((sum, addon) => sum + (addon.isManualProcessing ? 0 : addon.discountedPrice), 0);

  const createBookingMutation = useMutation({
    mutationFn: async (data: NaverBookingForm) => {
      return await apiRequest("/api/naver/bookings", "POST", {
        ...data,
        bookingType: "naver",
      });
    },
    onSuccess: () => {
      toast({
        title: "예약 완료!",
        description: "네이버 예약자 추가 주문이 성공적으로 접수되었습니다.",
      });
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      toast({
        title: "예약 실패",
        description: error.message || "예약 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NaverBookingForm) => {
    createBookingMutation.mutate(data);
  };

  const toggleAddon = (addonId: number) => {
    const current = form.getValues("selectedPartnerAddons");
    if (current.includes(addonId)) {
      form.setValue(
        "selectedPartnerAddons",
        current.filter((id) => id !== addonId)
      );
    } else {
      form.setValue("selectedPartnerAddons", [...current, addonId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">네이버 예약 고객 전용</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            네이버 예약자 추가 주문
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            네이버에서 예약하신 고객님께 특별한 할인 혜택을 제공합니다.
            <br />
            음료를 선택하시고, 추가 옵션을 50% 할인가로 만나보세요!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Information */}
            <Card data-testid="card-customer-info">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  고객 정보
                </CardTitle>
                <CardDescription>
                  네이버 예약 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="홍길동"
                            data-testid="input-name"
                          />
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
                        <FormLabel>전화번호</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="010-1234-5678"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@email.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="naverReservationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>네이버 예약번호</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="NAVER123456"
                            data-testid="input-naver-id"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>예약 날짜</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            data-testid="input-booking-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>예약 시간</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            data-testid="input-booking-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Beverage Selection */}
            <Card data-testid="card-beverage-selection">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="w-6 h-6 text-amber-600" />
                  음료 선택
                </CardTitle>
                <CardDescription>
                  녹음 중 드실 음료를 선택해주세요 (무료 제공)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="selectedDrink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>음료 종류</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-drink">
                            <SelectValue placeholder="음료를 선택해주세요" />
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

                {selectedDrinkOption?.hasTemperature && (
                  <FormField
                    control={form.control}
                    name="drinkTemperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>온도</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-temperature">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hot">뜨겁게 (Hot)</SelectItem>
                            <SelectItem value="iced">차갑게 (Iced)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Track Information */}
            <Card data-testid="card-track-info">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music2 className="w-6 h-6 text-purple-600" />
                  곡 정보
                </CardTitle>
                <CardDescription>
                  녹음하실 곡의 유튜브 링크를 입력해주세요 (MR/반주 영상)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="youtubeTrackUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>유튜브 MR 링크 (선택사항)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://youtube.com/watch?v=..."
                          data-testid="input-youtube-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Services with Discount */}
            <Card data-testid="card-additional-services">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-pink-600" />
                    추가 옵션 선택
                  </span>
                  <span className="text-sm font-normal bg-gradient-to-r from-pink-600 to-orange-500 text-white px-4 py-1 rounded-full">
                    50% 할인
                  </span>
                </CardTitle>
                <CardDescription>
                  네이버 예약 고객 특별 할인가로 추가 서비스를 이용하실 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                    <p className="mt-2 text-gray-600">옵션 불러오는 중...</p>
                  </div>
                ) : (
                  naverAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedAddonIds.includes(addon.id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => toggleAddon(addon.id)}
                      data-testid={`addon-${addon.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedAddonIds.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                          data-testid={`checkbox-addon-${addon.id}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {addon.nameKo}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {addon.descriptionKo}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {addon.isManualProcessing ? (
                                <div className="text-sm font-medium text-purple-600">
                                  별도 견적
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm text-gray-400 line-through">
                                    ₩{addon.originalPrice.toLocaleString()}
                                  </div>
                                  <div className="text-lg font-bold text-purple-600">
                                    ₩{addon.discountedPrice.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-pink-600 font-semibold">
                                    {addon.discountRate}% 할인
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* LP Delivery Address (if LP addon selected) */}
            {selectedAddonIds.some((id) => {
              const addon = naverAddons.find((a) => a.id === id);
              return addon?.nameKo.includes("LP");
            }) && (
              <Card data-testid="card-lp-delivery">
                <CardHeader>
                  <CardTitle>LP 레코드 배송 주소</CardTitle>
                  <CardDescription>
                    LP 레코드 제작 옵션을 선택하셨습니다. 배송 주소를 입력해주세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="lpDeliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>배송 주소</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="서울시 강남구..."
                            data-testid="input-lp-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Summary and Submit */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50" data-testid="card-summary">
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">네이버 기본 예약</span>
                    <span className="font-semibold text-green-600">
                      ✓ 결제 완료
                    </span>
                  </div>
                  {selectedAddonIds.length > 0 && (
                    <>
                      <div className="border-t pt-2 mt-2">
                        <div className="text-sm font-semibold mb-2">
                          추가 옵션:
                        </div>
                        {naverAddons
                          .filter((addon) => selectedAddonIds.includes(addon.id))
                          .map((addon) => (
                            <div
                              key={addon.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600">
                                {addon.nameKo}
                              </span>
                              <span className="font-medium">
                                {addon.isManualProcessing
                                  ? "별도 견적"
                                  : `₩${addon.discountedPrice.toLocaleString()}`}
                              </span>
                            </div>
                          ))}
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>추가 옵션 합계</span>
                        <span className="text-purple-600">
                          ₩{totalAddonPrice.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold py-6 text-lg"
                  disabled={createBookingMutation.isPending}
                  data-testid="button-submit"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      예약 처리 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      예약 확정하기
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  예약 확정 시 입력하신 정보로 예약이 등록됩니다.
                </p>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

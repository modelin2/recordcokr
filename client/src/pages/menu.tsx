import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, Coffee, Music, User, ShoppingCart, Check, ArrowRight, ArrowLeft,
  Headphones, Video, Disc, Share2, Volume2, Play, Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";

type Language = "ko" | "en" | "ja" | "zh";

const translations: Record<Language, {
  selectLanguage: string;
  welcome: string;
  selectDrink: string;
  drinkOptions: { id: string; name: string; icon: string }[];
  temperature: string;
  hot: string;
  iced: string;
  backingTrack: string;
  backingTrackPlaceholder: string;
  customerInfo: string;
  name: string;
  namePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  additionalServices: string;
  listenSample: string;
  watchSample: string;
  before: string;
  after: string;
  next: string;
  back: string;
  confirm: string;
  total: string;
  submit: string;
  success: string;
  successMessage: string;
  required: string;
  services: { id: number; name: string; price: number; description: string; type: "audio" | "video" | "none" }[];
}> = {
  ko: {
    selectLanguage: "언어를 선택하세요",
    welcome: "레코딩 카페에 오신 것을 환영합니다",
    selectDrink: "음료를 선택하세요",
    drinkOptions: [
      { id: "americano", name: "아메리카노", icon: "☕" },
      { id: "latte", name: "카페라떼", icon: "🥛" },
      { id: "tea", name: "차", icon: "🍵" },
      { id: "juice", name: "주스", icon: "🧃" },
      { id: "none", name: "음료 없음", icon: "❌" },
    ],
    temperature: "온도 선택",
    hot: "핫",
    iced: "아이스",
    backingTrack: "백킹트랙 URL",
    backingTrackPlaceholder: "YouTube URL을 입력하세요",
    customerInfo: "고객 정보",
    name: "이름",
    namePlaceholder: "이름을 입력하세요",
    phone: "전화번호",
    phonePlaceholder: "전화번호를 입력하세요",
    email: "이메일",
    emailPlaceholder: "이메일을 입력하세요",
    additionalServices: "추가 서비스",
    listenSample: "샘플 듣기",
    watchSample: "샘플 보기",
    before: "보정 전",
    after: "보정 후",
    next: "다음",
    back: "이전",
    confirm: "확인",
    total: "총 금액",
    submit: "예약 완료",
    success: "예약 완료!",
    successMessage: "예약이 성공적으로 완료되었습니다. 즐거운 레코딩 되세요!",
    required: "필수 입력",
    services: [
      { id: 1, name: "간단한 믹싱", price: 20000, description: "기본적인 음량 조절과 EQ 보정", type: "audio" },
      { id: 2, name: "풀트랙 믹싱", price: 100000, description: "전문적인 믹싱과 마스터링", type: "audio" },
      { id: 3, name: "레코딩 비디오", price: 20000, description: "녹음 현장 영상 촬영", type: "video" },
      { id: 4, name: "비디오 편집", price: 100000, description: "전문 편집과 자막 추가", type: "video" },
      { id: 5, name: "LP 제작", price: 300000, description: "나만의 LP 레코드 제작", type: "none" },
      { id: 6, name: "음원 유통", price: 200000, description: "전 세계 스트리밍 플랫폼 배포", type: "none" },
    ],
  },
  en: {
    selectLanguage: "Select Language",
    welcome: "Welcome to Recording Cafe",
    selectDrink: "Select Your Drink",
    drinkOptions: [
      { id: "americano", name: "Americano", icon: "☕" },
      { id: "latte", name: "Cafe Latte", icon: "🥛" },
      { id: "tea", name: "Tea", icon: "🍵" },
      { id: "juice", name: "Juice", icon: "🧃" },
      { id: "none", name: "No Drink", icon: "❌" },
    ],
    temperature: "Temperature",
    hot: "Hot",
    iced: "Iced",
    backingTrack: "Backing Track URL",
    backingTrackPlaceholder: "Enter YouTube URL",
    customerInfo: "Customer Information",
    name: "Name",
    namePlaceholder: "Enter your name",
    phone: "Phone",
    phonePlaceholder: "Enter your phone number",
    email: "Email",
    emailPlaceholder: "Enter your email",
    additionalServices: "Additional Services",
    listenSample: "Listen Sample",
    watchSample: "Watch Sample",
    before: "Before",
    after: "After",
    next: "Next",
    back: "Back",
    confirm: "Confirm",
    total: "Total",
    submit: "Complete Booking",
    success: "Booking Complete!",
    successMessage: "Your booking has been successfully completed. Enjoy your recording!",
    required: "Required",
    services: [
      { id: 1, name: "Simple Mixing", price: 20000, description: "Basic volume and EQ adjustment", type: "audio" },
      { id: 2, name: "Full Track Mixing", price: 100000, description: "Professional mixing and mastering", type: "audio" },
      { id: 3, name: "Recording Video", price: 20000, description: "Recording session video capture", type: "video" },
      { id: 4, name: "Video Editing", price: 100000, description: "Professional editing with subtitles", type: "video" },
      { id: 5, name: "LP Production", price: 300000, description: "Create your own LP record", type: "none" },
      { id: 6, name: "Music Distribution", price: 200000, description: "Global streaming platform distribution", type: "none" },
    ],
  },
  ja: {
    selectLanguage: "言語を選択",
    welcome: "レコーディングカフェへようこそ",
    selectDrink: "ドリンクを選択",
    drinkOptions: [
      { id: "americano", name: "アメリカーノ", icon: "☕" },
      { id: "latte", name: "カフェラテ", icon: "🥛" },
      { id: "tea", name: "お茶", icon: "🍵" },
      { id: "juice", name: "ジュース", icon: "🧃" },
      { id: "none", name: "ドリンクなし", icon: "❌" },
    ],
    temperature: "温度選択",
    hot: "ホット",
    iced: "アイス",
    backingTrack: "バッキングトラックURL",
    backingTrackPlaceholder: "YouTube URLを入力",
    customerInfo: "お客様情報",
    name: "お名前",
    namePlaceholder: "お名前を入力",
    phone: "電話番号",
    phonePlaceholder: "電話番号を入力",
    email: "メール",
    emailPlaceholder: "メールアドレスを入力",
    additionalServices: "追加サービス",
    listenSample: "サンプルを聴く",
    watchSample: "サンプルを見る",
    before: "補正前",
    after: "補正後",
    next: "次へ",
    back: "戻る",
    confirm: "確認",
    total: "合計金額",
    submit: "予約完了",
    success: "予約完了！",
    successMessage: "予約が正常に完了しました。レコーディングをお楽しみください！",
    required: "必須入力",
    services: [
      { id: 1, name: "シンプルミキシング", price: 20000, description: "基本的な音量とEQ調整", type: "audio" },
      { id: 2, name: "フルトラックミキシング", price: 100000, description: "プロフェッショナルなミキシングとマスタリング", type: "audio" },
      { id: 3, name: "レコーディング動画", price: 20000, description: "録音現場の映像撮影", type: "video" },
      { id: 4, name: "動画編集", price: 100000, description: "プロ編集と字幕追加", type: "video" },
      { id: 5, name: "LP制作", price: 300000, description: "オリジナルLPレコード制作", type: "none" },
      { id: 6, name: "音源配信", price: 200000, description: "世界中のストリーミングプラットフォームへ配信", type: "none" },
    ],
  },
  zh: {
    selectLanguage: "选择语言",
    welcome: "欢迎来到录音咖啡厅",
    selectDrink: "选择饮料",
    drinkOptions: [
      { id: "americano", name: "美式咖啡", icon: "☕" },
      { id: "latte", name: "拿铁", icon: "🥛" },
      { id: "tea", name: "茶", icon: "🍵" },
      { id: "juice", name: "果汁", icon: "🧃" },
      { id: "none", name: "不需要饮料", icon: "❌" },
    ],
    temperature: "温度选择",
    hot: "热",
    iced: "冰",
    backingTrack: "伴奏URL",
    backingTrackPlaceholder: "请输入YouTube URL",
    customerInfo: "顾客信息",
    name: "姓名",
    namePlaceholder: "请输入姓名",
    phone: "电话号码",
    phonePlaceholder: "请输入电话号码",
    email: "邮箱",
    emailPlaceholder: "请输入邮箱",
    additionalServices: "附加服务",
    listenSample: "试听样本",
    watchSample: "观看样本",
    before: "修正前",
    after: "修正后",
    next: "下一步",
    back: "上一步",
    confirm: "确认",
    total: "总金额",
    submit: "完成预约",
    success: "预约成功！",
    successMessage: "您的预约已成功完成。祝您录音愉快！",
    required: "必填",
    services: [
      { id: 1, name: "简单混音", price: 20000, description: "基本音量和EQ调整", type: "audio" },
      { id: 2, name: "全曲混音", price: 100000, description: "专业混音和母带处理", type: "audio" },
      { id: 3, name: "录音视频", price: 20000, description: "录音现场视频拍摄", type: "video" },
      { id: 4, name: "视频编辑", price: 100000, description: "专业编辑和字幕添加", type: "video" },
      { id: 5, name: "LP制作", price: 300000, description: "制作您自己的LP唱片", type: "none" },
      { id: 6, name: "音乐发行", price: 200000, description: "全球流媒体平台发行", type: "none" },
    ],
  },
};

const languageOptions = [
  { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
];

export default function MenuPage() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<Language | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string>("");
  const [drinkTemperature, setDrinkTemperature] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const t = language ? translations[language] : translations.ko;

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: () => {
      setIsComplete(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = t.services.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = () => {
    if (!name || !phone || !email) {
      toast({
        title: t.required,
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate({
      bookingType: "direct",
      name,
      email,
      phone,
      selectedDrink: selectedDrink || "none",
      drinkTemperature: drinkTemperature || "none",
      youtubeTrackUrl: youtubeUrl || "https://youtube.com",
      selectedAddons: selectedServices,
      totalPrice,
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedDrink !== "";
      case 2: return youtubeUrl !== "" && name !== "" && phone !== "" && email !== "";
      case 3: return true;
      default: return true;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setStep(step + newDirection);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.success}</h1>
          <p className="text-xl text-gray-600 mb-8">{t.successMessage}</p>
          <Button
            onClick={() => {
              setIsComplete(false);
              setStep(0);
              setLanguage(null);
              setSelectedDrink("");
              setDrinkTemperature("");
              setYoutubeUrl("");
              setName("");
              setPhone("");
              setEmail("");
              setSelectedServices([]);
            }}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 text-xl"
          >
            {t.back}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {step === 0 && (
            <motion.div
              key="language"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-12">
                <img src={logoImage} alt="Recording Cafe" className="h-24 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                  <Globe className="w-8 h-8 text-pink-500" />
                  {translations.en.selectLanguage}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {languageOptions.map((lang) => (
                  <Card
                    key={lang.code}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                      language === lang.code ? "ring-4 ring-pink-500 bg-pink-50" : ""
                    }`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setTimeout(() => paginate(1), 300);
                    }}
                    data-testid={`button-language-${lang.code}`}
                  >
                    <CardContent className="p-8 text-center">
                      <span className="text-6xl mb-4 block">{lang.flag}</span>
                      <span className="text-2xl font-semibold text-gray-700">{lang.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="drink"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-3xl"
            >
              <div className="text-center mb-8">
                <Coffee className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">{t.selectDrink}</h1>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {t.drinkOptions.map((drink) => (
                  <Card
                    key={drink.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedDrink === drink.id ? "ring-4 ring-pink-500 bg-pink-50" : ""
                    }`}
                    onClick={() => setSelectedDrink(drink.id)}
                    data-testid={`button-drink-${drink.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <span className="text-5xl mb-3 block">{drink.icon}</span>
                      <span className="text-lg font-medium text-gray-700">{drink.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {selectedDrink && selectedDrink !== "none" && (
                <div className="flex justify-center gap-4 mb-8">
                  <Button
                    variant={drinkTemperature === "hot" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setDrinkTemperature("hot")}
                    className={drinkTemperature === "hot" ? "bg-red-500 hover:bg-red-600" : ""}
                    data-testid="button-temp-hot"
                  >
                    🔥 {t.hot}
                  </Button>
                  <Button
                    variant={drinkTemperature === "iced" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setDrinkTemperature("iced")}
                    className={drinkTemperature === "iced" ? "bg-blue-500 hover:bg-blue-600" : ""}
                    data-testid="button-temp-iced"
                  >
                    ❄️ {t.iced}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="info"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <User className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">{t.customerInfo}</h1>
              </div>
              <Card className="mb-6">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                      <Music className="w-5 h-5 text-pink-500" />
                      {t.backingTrack}
                    </label>
                    <Input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder={t.backingTrackPlaceholder}
                      className="text-lg p-4 h-14"
                      data-testid="input-youtube-url"
                    />
                  </div>
                  <div>
                    <label className="text-lg font-medium text-gray-700 mb-2 block">{t.name} *</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="text-lg p-4 h-14"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-lg font-medium text-gray-700 mb-2 block">{t.phone} *</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="text-lg p-4 h-14"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label className="text-lg font-medium text-gray-700 mb-2 block">{t.email} *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="text-lg p-4 h-14"
                      data-testid="input-email"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="services"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-4xl"
            >
              <div className="text-center mb-6">
                <ShoppingCart className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">{t.additionalServices}</h1>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {t.services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  const IconComponent = service.type === "audio" ? Headphones : service.type === "video" ? Video : service.id === 5 ? Disc : Share2;
                  
                  return (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? "ring-4 ring-green-500 bg-green-50" : "hover:shadow-lg"
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                      data-testid={`button-service-${service.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={isSelected}
                            className="mt-1 h-6 w-6"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <span className="font-semibold text-lg">{service.name}</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-2">{service.description}</p>
                            <p className="text-xl font-bold text-pink-600">{formatPrice(service.price)}</p>
                          </div>
                          {service.type !== "none" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayingAudio(playingAudio === `${service.id}` ? null : `${service.id}`);
                              }}
                              className="flex items-center gap-1"
                              data-testid={`button-sample-${service.id}`}
                            >
                              {service.type === "audio" ? (
                                <>
                                  <Volume2 className="w-4 h-4" />
                                  {t.listenSample}
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  {t.watchSample}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        {playingAudio === `${service.id}` && service.type === "audio" && (
                          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">🎧 {t.before} / {t.after}</p>
                            <p className="text-xs text-gray-500">휴대폰을 연결하여 샘플을 청취하세요</p>
                          </div>
                        )}
                        {playingAudio === `${service.id}` && service.type === "video" && (
                          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">🎬 {t.watchSample}</p>
                            <p className="text-xs text-gray-500">휴대폰을 연결하여 샘플을 시청하세요</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="confirm"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">{t.confirm}</h1>
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{t.name}</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{t.phone}</span>
                    <span className="font-medium">{phone}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{t.email}</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{t.selectDrink}</span>
                    <span className="font-medium">
                      {t.drinkOptions.find(d => d.id === selectedDrink)?.name}
                      {drinkTemperature && ` (${drinkTemperature === "hot" ? t.hot : t.iced})`}
                    </span>
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="py-3 border-b">
                      <span className="text-gray-600 block mb-2">{t.additionalServices}</span>
                      <div className="space-y-1">
                        {selectedServices.map(id => {
                          const service = t.services.find(s => s.id === id);
                          return service ? (
                            <div key={id} className="flex justify-between text-sm">
                              <span>{service.name}</span>
                              <span>{formatPrice(service.price)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between py-4 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                    <span>{t.total}</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={() => paginate(-1)}
              className="flex items-center gap-2 px-8 py-6 text-lg"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.back}
            </Button>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-all ${
                    s === step ? "bg-pink-500 w-8" : s < step ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {step < 4 ? (
              <Button
                size="lg"
                onClick={() => paginate(1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-6 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                data-testid="button-next"
              >
                {t.next}
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={bookingMutation.isPending}
                className="flex items-center gap-2 px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                data-testid="button-submit"
              >
                {bookingMutation.isPending ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {t.submit}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

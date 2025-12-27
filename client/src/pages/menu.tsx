import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, Coffee, Music, User, Check, ArrowRight, ArrowLeft,
  Headphones, Video, Disc, Share2, Volume2, Play, Minus, Plus, Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";

type Language = "ko" | "en" | "ja" | "zh";

interface DrinkOrder {
  id: string;
  quantity: number;
  temperature: "hot" | "iced" | "none";
}

const drinkCatalog = [
  { id: "coffee", hasTemp: true, hotOnly: false, icon: "☕" },
  { id: "coffee-decaf", hasTemp: true, hotOnly: false, icon: "☕" },
  { id: "lemonade", hasTemp: false, hotOnly: false, icon: "🍋" },
  { id: "strawberry-ade", hasTemp: false, hotOnly: false, icon: "🍓" },
  { id: "orange-ade", hasTemp: false, hotOnly: false, icon: "🍊" },
  { id: "grapefruit-ade", hasTemp: false, hotOnly: false, icon: "🍹" },
  { id: "iced-tea", hasTemp: false, hotOnly: false, icon: "🧊" },
  { id: "green-tea", hasTemp: true, hotOnly: false, icon: "🍵" },
  { id: "hibiscus", hasTemp: true, hotOnly: false, icon: "🌺" },
  { id: "earl-grey", hasTemp: true, hotOnly: false, icon: "🫖" },
  { id: "peppermint", hasTemp: true, hotOnly: false, icon: "🌿" },
  { id: "chamomile", hasTemp: true, hotOnly: false, icon: "🌼" },
  { id: "hot-chocolate", hasTemp: false, hotOnly: true, icon: "🍫" },
];

const translations: Record<Language, {
  selectLanguage: string;
  welcome: string;
  selectDrink: string;
  drinks: Record<string, string>;
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
  mixingService: string;
  mixingDesc: string;
  videoService: string;
  videoDesc: string;
  distributionService: string;
  lpService: string;
  listenSample: string;
  watchSample: string;
  next: string;
  back: string;
  confirm: string;
  total: string;
  selectComplete: string;
  success: string;
  successMessage: string;
  required: string;
  mixingOptions: { id: string; name: string; price: number; desc: string }[];
  videoOptions: { id: string; name: string; price: number; desc: string }[];
  distributionOption: { name: string; price: number; desc: string };
  lpOption: { name: string; price: number; desc: string };
}> = {
  ko: {
    selectLanguage: "언어를 선택하세요",
    welcome: "레코딩 카페",
    selectDrink: "음료 선택",
    drinks: {
      "coffee": "커피",
      "coffee-decaf": "디카페인 커피",
      "lemonade": "레몬에이드",
      "strawberry-ade": "딸기에이드",
      "orange-ade": "오렌지에이드",
      "grapefruit-ade": "자몽에이드",
      "iced-tea": "아이스티",
      "green-tea": "녹차",
      "hibiscus": "히비스커스",
      "earl-grey": "얼그레이",
      "peppermint": "페퍼민트",
      "chamomile": "캐모마일",
      "hot-chocolate": "핫초코",
    },
    hot: "HOT",
    iced: "ICE",
    backingTrack: "반주 URL (YouTube)",
    backingTrackPlaceholder: "YouTube URL을 입력하세요",
    customerInfo: "고객 정보",
    name: "이름",
    namePlaceholder: "이름을 입력하세요",
    phone: "전화번호",
    phonePlaceholder: "전화번호를 입력하세요",
    email: "이메일",
    emailPlaceholder: "이메일을 입력하세요",
    mixingService: "믹싱 서비스",
    mixingDesc: "녹음 후 어떤 수준의 믹싱을 원하시나요?",
    videoService: "비디오 서비스",
    videoDesc: "녹음 영상을 어떻게 촬영하시겠어요?",
    distributionService: "음원 유통",
    lpService: "LP 레코드 제작",
    listenSample: "샘플 듣기",
    watchSample: "샘플 보기",
    next: "다음",
    back: "이전",
    confirm: "선택 확인",
    total: "총 금액",
    selectComplete: "선택완료",
    success: "선택완료!",
    successMessage: "선택이 완료되었습니다. 즐거운 레코딩 되세요!",
    required: "필수 입력",
    mixingOptions: [
      { id: "raw", name: "녹음 원본", price: 0, desc: "믹싱 없이 녹음 원본 그대로 제공" },
      { id: "basic", name: "기본 믹싱", price: 0, desc: "음량 조절, 기본 EQ, 리버브 적용" },
      { id: "ai", name: "AI 보정", price: 20000, desc: "AI 기반 피치 보정, 타이밍 조절 추가" },
      { id: "engineer", name: "엔지니어 수동", price: 100000, desc: "전문 엔지니어의 세밀한 수동 믹싱" },
    ],
    videoOptions: [
      { id: "self", name: "셀프 촬영", price: 0, desc: "스탠드 제공, 직접 촬영" },
      { id: "cameraman", name: "촬영기사 촬영", price: 20000, desc: "전문 촬영기사가 원본 영상 제공" },
      { id: "full", name: "촬영 + 편집", price: 100000, desc: "촬영기사 촬영 후 전문 편집까지" },
    ],
    distributionOption: { name: "음원 유통", price: 200000, desc: "Spotify, Apple Music 등 전 세계 150개 플랫폼 배포" },
    lpOption: { name: "LP 레코드 제작", price: 300000, desc: "나만의 LP 레코드 제작 (4-6주 소요)" },
  },
  en: {
    selectLanguage: "Select Language",
    welcome: "Recording Cafe",
    selectDrink: "Select Drinks",
    drinks: {
      "coffee": "Coffee",
      "coffee-decaf": "Decaf Coffee",
      "lemonade": "Lemonade",
      "strawberry-ade": "Strawberry Ade",
      "orange-ade": "Orange Ade",
      "grapefruit-ade": "Grapefruit Ade",
      "iced-tea": "Iced Tea",
      "green-tea": "Green Tea",
      "hibiscus": "Hibiscus",
      "earl-grey": "Earl Grey",
      "peppermint": "Peppermint",
      "chamomile": "Chamomile",
      "hot-chocolate": "Hot Chocolate",
    },
    hot: "HOT",
    iced: "ICE",
    backingTrack: "Backing Track URL (YouTube)",
    backingTrackPlaceholder: "Enter YouTube URL",
    customerInfo: "Customer Info",
    name: "Name",
    namePlaceholder: "Enter your name",
    phone: "Phone",
    phonePlaceholder: "Enter phone number",
    email: "Email",
    emailPlaceholder: "Enter your email",
    mixingService: "Mixing Service",
    mixingDesc: "What level of mixing do you want?",
    videoService: "Video Service",
    videoDesc: "How would you like to record your video?",
    distributionService: "Music Distribution",
    lpService: "LP Record Production",
    listenSample: "Listen Sample",
    watchSample: "Watch Sample",
    next: "Next",
    back: "Back",
    confirm: "Confirm",
    total: "Total",
    selectComplete: "Complete",
    success: "Complete!",
    successMessage: "Your selection is complete. Enjoy your recording!",
    required: "Required",
    mixingOptions: [
      { id: "raw", name: "Raw Recording", price: 0, desc: "Original recording without mixing" },
      { id: "basic", name: "Basic Mixing", price: 0, desc: "Volume adjustment, basic EQ, reverb" },
      { id: "ai", name: "AI Enhancement", price: 20000, desc: "AI-based pitch correction and timing" },
      { id: "engineer", name: "Engineer Manual", price: 100000, desc: "Professional engineer's detailed mixing" },
    ],
    videoOptions: [
      { id: "self", name: "Self Recording", price: 0, desc: "Stand provided, record yourself" },
      { id: "cameraman", name: "Cameraman", price: 20000, desc: "Professional cameraman, raw footage" },
      { id: "full", name: "Filming + Editing", price: 100000, desc: "Cameraman + professional editing" },
    ],
    distributionOption: { name: "Music Distribution", price: 200000, desc: "Distribute to 150+ platforms worldwide" },
    lpOption: { name: "LP Record Production", price: 300000, desc: "Create your own LP record (4-6 weeks)" },
  },
  ja: {
    selectLanguage: "言語を選択",
    welcome: "レコーディングカフェ",
    selectDrink: "ドリンク選択",
    drinks: {
      "coffee": "コーヒー",
      "coffee-decaf": "デカフェ",
      "lemonade": "レモネード",
      "strawberry-ade": "ストロベリーエイド",
      "orange-ade": "オレンジエイド",
      "grapefruit-ade": "グレープフルーツエイド",
      "iced-tea": "アイスティー",
      "green-tea": "緑茶",
      "hibiscus": "ハイビスカス",
      "earl-grey": "アールグレイ",
      "peppermint": "ペパーミント",
      "chamomile": "カモミール",
      "hot-chocolate": "ホットチョコレート",
    },
    hot: "HOT",
    iced: "ICE",
    backingTrack: "バッキングトラックURL",
    backingTrackPlaceholder: "YouTube URLを入力",
    customerInfo: "お客様情報",
    name: "お名前",
    namePlaceholder: "お名前を入力",
    phone: "電話番号",
    phonePlaceholder: "電話番号を入力",
    email: "メール",
    emailPlaceholder: "メールを入力",
    mixingService: "ミキシング",
    mixingDesc: "どのレベルのミキシングをご希望ですか？",
    videoService: "ビデオサービス",
    videoDesc: "動画の撮影方法を選択してください",
    distributionService: "音源配信",
    lpService: "LPレコード制作",
    listenSample: "サンプルを聴く",
    watchSample: "サンプルを見る",
    next: "次へ",
    back: "戻る",
    confirm: "確認",
    total: "合計",
    selectComplete: "選択完了",
    success: "選択完了！",
    successMessage: "選択が完了しました。レコーディングをお楽しみください！",
    required: "必須",
    mixingOptions: [
      { id: "raw", name: "録音原本", price: 0, desc: "ミキシングなしの原本提供" },
      { id: "basic", name: "基本ミキシング", price: 0, desc: "音量調整、基本EQ、リバーブ" },
      { id: "ai", name: "AI補正", price: 20000, desc: "AIベースのピッチ・タイミング補正" },
      { id: "engineer", name: "エンジニア手動", price: 100000, desc: "プロエンジニアの詳細ミキシング" },
    ],
    videoOptions: [
      { id: "self", name: "セルフ撮影", price: 0, desc: "スタンド提供、自分で撮影" },
      { id: "cameraman", name: "カメラマン撮影", price: 20000, desc: "プロカメラマン、原本映像" },
      { id: "full", name: "撮影+編集", price: 100000, desc: "カメラマン撮影後プロ編集" },
    ],
    distributionOption: { name: "音源配信", price: 200000, desc: "世界150以上のプラットフォームに配信" },
    lpOption: { name: "LPレコード制作", price: 300000, desc: "オリジナルLP制作（4-6週間）" },
  },
  zh: {
    selectLanguage: "选择语言",
    welcome: "录音咖啡厅",
    selectDrink: "选择饮料",
    drinks: {
      "coffee": "咖啡",
      "coffee-decaf": "低因咖啡",
      "lemonade": "柠檬水",
      "strawberry-ade": "草莓汽水",
      "orange-ade": "橙子汽水",
      "grapefruit-ade": "西柚汽水",
      "iced-tea": "冰茶",
      "green-tea": "绿茶",
      "hibiscus": "木槿花茶",
      "earl-grey": "伯爵茶",
      "peppermint": "薄荷茶",
      "chamomile": "洋甘菊",
      "hot-chocolate": "热巧克力",
    },
    hot: "热",
    iced: "冰",
    backingTrack: "伴奏URL (YouTube)",
    backingTrackPlaceholder: "输入YouTube URL",
    customerInfo: "顾客信息",
    name: "姓名",
    namePlaceholder: "输入姓名",
    phone: "电话",
    phonePlaceholder: "输入电话号码",
    email: "邮箱",
    emailPlaceholder: "输入邮箱",
    mixingService: "混音服务",
    mixingDesc: "您想要什么级别的混音？",
    videoService: "视频服务",
    videoDesc: "您想如何录制视频？",
    distributionService: "音乐发行",
    lpService: "LP唱片制作",
    listenSample: "试听样本",
    watchSample: "观看样本",
    next: "下一步",
    back: "上一步",
    confirm: "确认",
    total: "总计",
    selectComplete: "选择完成",
    success: "选择完成！",
    successMessage: "选择已完成。祝您录音愉快！",
    required: "必填",
    mixingOptions: [
      { id: "raw", name: "录音原版", price: 0, desc: "无混音的原始录音" },
      { id: "basic", name: "基础混音", price: 0, desc: "音量调整、基本EQ、混响" },
      { id: "ai", name: "AI修正", price: 20000, desc: "AI音高和时间修正" },
      { id: "engineer", name: "工程师手动", price: 100000, desc: "专业工程师的细致混音" },
    ],
    videoOptions: [
      { id: "self", name: "自拍", price: 0, desc: "提供支架，自己拍摄" },
      { id: "cameraman", name: "摄影师拍摄", price: 20000, desc: "专业摄影师，原始视频" },
      { id: "full", name: "拍摄+剪辑", price: 100000, desc: "摄影师拍摄后专业剪辑" },
    ],
    distributionOption: { name: "音乐发行", price: 200000, desc: "发行到全球150多个平台" },
    lpOption: { name: "LP唱片制作", price: 300000, desc: "制作您自己的LP唱片（4-6周）" },
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
  const [drinkOrders, setDrinkOrders] = useState<DrinkOrder[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMixing, setSelectedMixing] = useState<string>("raw");
  const [selectedVideo, setSelectedVideo] = useState<string>("self");
  const [wantsDistribution, setWantsDistribution] = useState(false);
  const [wantsLP, setWantsLP] = useState(false);
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

  const calculateTotal = () => {
    let total = 0;
    const mixingOption = t.mixingOptions.find(o => o.id === selectedMixing);
    const videoOption = t.videoOptions.find(o => o.id === selectedVideo);
    if (mixingOption) total += mixingOption.price;
    if (videoOption) total += videoOption.price;
    if (wantsDistribution) total += t.distributionOption.price;
    if (wantsLP) total += t.lpOption.price;
    return total;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "FREE";
    return `₩${price.toLocaleString()}`;
  };

  const getDrinkOrder = (drinkId: string) => drinkOrders.find(o => o.id === drinkId);

  const updateDrinkQuantity = (drinkId: string, delta: number, drink: typeof drinkCatalog[0]) => {
    setDrinkOrders(prev => {
      const existing = prev.find(o => o.id === drinkId);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) return prev.filter(o => o.id !== drinkId);
        return prev.map(o => o.id === drinkId ? { ...o, quantity: newQty } : o);
      } else if (delta > 0) {
        const defaultTemp = drink.hotOnly ? "hot" : (drink.hasTemp ? "iced" : "none");
        return [...prev, { id: drinkId, quantity: 1, temperature: defaultTemp as any }];
      }
      return prev;
    });
  };

  const updateDrinkTemp = (drinkId: string, temp: "hot" | "iced") => {
    setDrinkOrders(prev => prev.map(o => o.id === drinkId ? { ...o, temperature: temp } : o));
  };

  const handleSubmit = () => {
    if (!name || !phone || !email) {
      toast({ title: t.required, description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const drinkSummary = drinkOrders.map(o => {
      const drinkName = t.drinks[o.id] || o.id;
      return `${drinkName} x${o.quantity}${o.temperature !== "none" ? ` (${o.temperature})` : ""}`;
    }).join(", ") || "none";

    const selectedAddons: number[] = [];
    if (selectedMixing === "ai") selectedAddons.push(1);
    if (selectedMixing === "engineer") selectedAddons.push(2);
    if (selectedVideo === "cameraman") selectedAddons.push(3);
    if (selectedVideo === "full") selectedAddons.push(4);
    if (wantsDistribution) selectedAddons.push(5);
    if (wantsLP) selectedAddons.push(6);

    bookingMutation.mutate({
      bookingType: "direct",
      name,
      email,
      phone,
      selectedDrink: drinkSummary,
      drinkTemperature: "mixed",
      youtubeTrackUrl: youtubeUrl || "https://youtube.com",
      selectedAddons,
      totalPrice: calculateTotal(),
    });
  };

  const [direction, setDirection] = useState(0);
  const paginate = (d: number) => {
    setDirection(d);
    setStep(step + d);
  };

  const canProceed = () => {
    if (step === 2) return name !== "" && phone !== "" && email !== "";
    return true;
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 })
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t.success}</h1>
          <p className="text-xl text-gray-400 mb-8">{t.successMessage}</p>
          <Button onClick={() => { setIsComplete(false); setStep(0); setLanguage(null); setDrinkOrders([]); setYoutubeUrl(""); setName(""); setPhone(""); setEmail(""); setSelectedMixing("raw"); setSelectedVideo("self"); setWantsDistribution(false); setWantsLP(false); }} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 text-xl">
            {t.back}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-28 relative z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {step === 0 && (
            <motion.div key="lang" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-2xl">
              <div className="text-center mb-10">
                <img src={logoImage} alt="Logo" className="h-16 mx-auto mb-6 brightness-0 invert" />
                <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                  <Globe className="w-8 h-8 text-cyan-400" />
                  {translations.en.selectLanguage}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {languageOptions.map((lang) => (
                  <Card key={lang.code} className="cursor-pointer bg-gray-900/50 border-gray-800 hover:border-pink-500/50 hover:bg-gray-800/50 transition-all" onClick={() => { setLanguage(lang.code); setTimeout(() => paginate(1), 200); }} data-testid={`button-language-${lang.code}`}>
                    <CardContent className="p-8 text-center">
                      <span className="text-6xl mb-4 block">{lang.flag}</span>
                      <span className="text-xl font-semibold text-white">{lang.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="drink" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-5xl">
              <div className="text-center mb-6">
                <Coffee className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{t.selectDrink}</h1>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[55vh] overflow-y-auto p-2">
                {drinkCatalog.map((drink) => {
                  const order = getDrinkOrder(drink.id);
                  const qty = order?.quantity || 0;
                  return (
                    <Card key={drink.id} className={`bg-gray-900/50 border-gray-800 transition-all ${qty > 0 ? "border-pink-500 bg-pink-500/10" : ""}`}>
                      <CardContent className="p-3">
                        <div className="text-center mb-2">
                          <span className="text-3xl block">{drink.icon}</span>
                          <span className="text-xs font-medium text-gray-300 block mt-1">{t.drinks[drink.id]}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700 text-white hover:bg-gray-800" onClick={() => updateDrinkQuantity(drink.id, -1, drink)} disabled={qty === 0}><Minus className="w-3 h-3" /></Button>
                          <span className="w-6 text-center font-bold">{qty}</span>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700 text-white hover:bg-gray-800" onClick={() => updateDrinkQuantity(drink.id, 1, drink)}><Plus className="w-3 h-3" /></Button>
                        </div>
                        {qty > 0 && drink.hasTemp && !drink.hotOnly && (
                          <div className="flex gap-1 justify-center">
                            <Button variant={order?.temperature === "hot" ? "default" : "outline"} size="sm" onClick={() => updateDrinkTemp(drink.id, "hot")} className={`text-xs h-6 px-2 ${order?.temperature === "hot" ? "bg-red-500 hover:bg-red-600 border-red-500" : "border-gray-700 text-gray-300"}`}>{t.hot}</Button>
                            <Button variant={order?.temperature === "iced" ? "default" : "outline"} size="sm" onClick={() => updateDrinkTemp(drink.id, "iced")} className={`text-xs h-6 px-2 ${order?.temperature === "iced" ? "bg-blue-500 hover:bg-blue-600 border-blue-500" : "border-gray-700 text-gray-300"}`}>{t.iced}</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="info" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-xl">
              <div className="text-center mb-6">
                <User className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{t.customerInfo}</h1>
              </div>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Music className="w-4 h-4 text-pink-400" />{t.backingTrack}</label>
                    <Input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder={t.backingTrackPlaceholder} className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12" data-testid="input-youtube" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">{t.name} *</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12" data-testid="input-name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">{t.phone} *</label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12" data-testid="input-phone" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">{t.email} *</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12" data-testid="input-email" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="mixing" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-4xl">
              <div className="text-center mb-6">
                <Headphones className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{t.mixingService}</h1>
                <p className="text-gray-400 mt-2">{t.mixingDesc}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.mixingOptions.map((opt) => (
                  <Card key={opt.id} className={`cursor-pointer transition-all ${selectedMixing === opt.id ? "border-cyan-500 bg-cyan-500/10" : "bg-gray-900/50 border-gray-800 hover:border-gray-600"}`} onClick={() => setSelectedMixing(opt.id)}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${selectedMixing === opt.id ? "bg-cyan-500" : "bg-gray-800"}`}>
                        <Headphones className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{opt.name}</h3>
                      <p className={`text-xl font-bold mb-2 ${opt.price === 0 ? "text-green-400" : "text-pink-400"}`}>{formatPrice(opt.price)}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                      <Button variant="outline" size="sm" className="mt-3 border-gray-700 text-gray-300 hover:bg-gray-800" onClick={(e) => { e.stopPropagation(); setPlayingAudio(playingAudio === opt.id ? null : opt.id); }}>
                        {playingAudio === opt.id ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                        {t.listenSample}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="video" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-3xl">
              <div className="text-center mb-6">
                <Video className="w-10 h-10 text-rose-400 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{t.videoService}</h1>
                <p className="text-gray-400 mt-2">{t.videoDesc}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {t.videoOptions.map((opt) => (
                  <Card key={opt.id} className={`cursor-pointer transition-all ${selectedVideo === opt.id ? "border-rose-500 bg-rose-500/10" : "bg-gray-900/50 border-gray-800 hover:border-gray-600"}`} onClick={() => setSelectedVideo(opt.id)}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${selectedVideo === opt.id ? "bg-rose-500" : "bg-gray-800"}`}>
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{opt.name}</h3>
                      <p className={`text-xl font-bold mb-2 ${opt.price === 0 ? "text-green-400" : "text-pink-400"}`}>{formatPrice(opt.price)}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                      <Button variant="outline" size="sm" className="mt-3 border-gray-700 text-gray-300 hover:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                        <Play className="w-3 h-3 mr-1" />{t.watchSample}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="extra" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-2xl">
              <div className="text-center mb-6">
                <Share2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{t.distributionService} & {t.lpService}</h1>
              </div>
              <div className="space-y-4">
                <Card className={`cursor-pointer transition-all ${wantsDistribution ? "border-emerald-500 bg-emerald-500/10" : "bg-gray-900/50 border-gray-800 hover:border-gray-600"}`} onClick={() => setWantsDistribution(!wantsDistribution)}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${wantsDistribution ? "bg-emerald-500" : "bg-gray-800"}`}>
                      <Share2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl">{t.distributionOption.name}</h3>
                      <p className="text-sm text-gray-400">{t.distributionOption.desc}</p>
                    </div>
                    <p className="text-2xl font-bold text-pink-400">{formatPrice(t.distributionOption.price)}</p>
                  </CardContent>
                </Card>
                <Card className={`cursor-pointer transition-all ${wantsLP ? "border-amber-500 bg-amber-500/10" : "bg-gray-900/50 border-gray-800 hover:border-gray-600"}`} onClick={() => setWantsLP(!wantsLP)}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${wantsLP ? "bg-amber-500" : "bg-gray-800"}`}>
                      <Disc className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl">{t.lpOption.name}</h3>
                      <p className="text-sm text-gray-400">{t.lpOption.desc}</p>
                    </div>
                    <p className="text-2xl font-bold text-pink-400">{formatPrice(t.lpOption.price)}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="confirm" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-xl">
              <div className="text-center mb-6">
                <Check className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{t.confirm}</h1>
              </div>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-5 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.name}</span><span>{name}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.phone}</span><span>{phone}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.email}</span><span>{email}</span></div>
                  <div className="py-2 border-b border-gray-800">
                    <span className="text-gray-400 block mb-1">{t.selectDrink}</span>
                    <span className="text-xs">{drinkOrders.length > 0 ? drinkOrders.map(o => `${t.drinks[o.id]} x${o.quantity}`).join(", ") : "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.mixingService}</span><span>{t.mixingOptions.find(o => o.id === selectedMixing)?.name}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.videoService}</span><span>{t.videoOptions.find(o => o.id === selectedVideo)?.name}</span></div>
                  {wantsDistribution && <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.distributionOption.name}</span><span className="text-pink-400">{formatPrice(t.distributionOption.price)}</span></div>}
                  {wantsLP && <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{t.lpOption.name}</span><span className="text-pink-400">{formatPrice(t.lpOption.price)}</span></div>}
                  <div className="flex justify-between py-4 text-2xl font-bold">
                    <span className="text-cyan-400">{t.total}</span>
                    <span className="text-pink-400">{formatPrice(calculateTotal())}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => paginate(-1)} className="border-gray-700 text-white hover:bg-gray-800 px-6 py-5" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 mr-2" />{t.back}
            </Button>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-pink-500 w-6" : i < step ? "bg-green-500" : "bg-gray-700"}`} />
              ))}
            </div>
            {step < 6 ? (
              <Button size="lg" onClick={() => paginate(1)} disabled={!canProceed()} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-5" data-testid="button-next">
                {t.next}<ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleSubmit} disabled={bookingMutation.isPending} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-5" data-testid="button-submit">
                {bookingMutation.isPending ? "Loading..." : <><Check className="w-5 h-5 mr-2" />{t.selectComplete}</>}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

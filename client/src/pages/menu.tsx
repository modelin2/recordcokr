import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, Coffee, Music, User, Check, ArrowRight, ArrowLeft,
  Headphones, Video, Disc, Share2, Play, Minus, Plus, Pause, Info, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";

type Language = "ko" | "en" | "ja" | "zh";

interface DrinkOrder {
  id: string;
  temperature: "hot" | "iced" | "none";
  quantity: number;
}

const getDrinkKey = (id: string, temp: "hot" | "iced" | "none") => `${id}-${temp}`;

const drinkCatalog = [
  { id: "coffee", hasTemp: true, hotOnly: false },
  { id: "coffee-decaf", hasTemp: true, hotOnly: false },
  { id: "lemonade", hasTemp: false, hotOnly: false },
  { id: "strawberry-ade", hasTemp: false, hotOnly: false },
  { id: "orange-ade", hasTemp: false, hotOnly: false },
  { id: "grapefruit-ade", hasTemp: false, hotOnly: false },
  { id: "iced-tea", hasTemp: false, hotOnly: false },
  { id: "green-tea", hasTemp: true, hotOnly: false },
  { id: "hibiscus", hasTemp: true, hotOnly: false },
  { id: "earl-grey", hasTemp: true, hotOnly: false },
  { id: "peppermint", hasTemp: true, hotOnly: false },
  { id: "chamomile", hasTemp: true, hotOnly: false },
  { id: "hot-chocolate", hasTemp: false, hotOnly: true },
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
  albumService: string;
  albumDesc: string;
  lpService: string;
  listenSample: string;
  watchSample: string;
  viewDetails: string;
  next: string;
  back: string;
  confirm: string;
  total: string;
  selectComplete: string;
  success: string;
  successMessage: string;
  required: string;
  close: string;
  mixingOptions: { id: string; name: string; price: number; desc: string }[];
  videoOptions: { id: string; name: string; price: number; desc: string }[];
  albumOption: { name: string; price: number; desc: string; features: { title: string; desc: string }[] };
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
    albumService: "앨범 발매",
    albumDesc: "전 세계 스트리밍 플랫폼에 정식 발매",
    lpService: "LP 레코드 제작",
    listenSample: "샘플 듣기",
    watchSample: "샘플 보기",
    viewDetails: "자세히 보기",
    next: "다음",
    back: "이전",
    confirm: "선택 확인",
    total: "총 금액",
    selectComplete: "선택완료",
    success: "선택완료!",
    successMessage: "선택이 완료되었습니다. 즐거운 레코딩 되세요!",
    required: "필수 입력",
    close: "닫기",
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
    albumOption: { 
      name: "앨범 발매", 
      price: 200000, 
      desc: "Spotify, Apple Music 등 전 세계 150개 플랫폼 배포",
      features: [
        { title: "반주 새롭게 제작", desc: "AI 기반으로 원곡의 반주를 새롭게 제작하여 저작권 걱정 없이 사용할 수 있습니다. 원곡과 유사하지만 완전히 새로운 반주로 안전하게 음원을 발매하세요." },
        { title: "앨범표지 디자인", desc: "전문 디자이너가 고객님만의 앨범 커버를 제작해 드립니다. K-POP 스타일의 세련된 디자인으로 스트리밍 플랫폼에서 돋보이는 앨범을 만들어 보세요." },
        { title: "평생 저작권료 라이센스", desc: "발매된 음원에서 발생하는 스트리밍 수익을 평생 받으실 수 있습니다. Spotify, Apple Music 등에서 재생될 때마다 저작권료가 적립됩니다." },
      ]
    },
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
    albumService: "Album Release",
    albumDesc: "Official release on streaming platforms worldwide",
    lpService: "LP Record Production",
    listenSample: "Listen Sample",
    watchSample: "Watch Sample",
    viewDetails: "View Details",
    next: "Next",
    back: "Back",
    confirm: "Confirm",
    total: "Total",
    selectComplete: "Complete",
    success: "Complete!",
    successMessage: "Your selection is complete. Enjoy your recording!",
    required: "Required",
    close: "Close",
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
    albumOption: { 
      name: "Album Release", 
      price: 200000, 
      desc: "Distribute to 150+ platforms worldwide",
      features: [
        { title: "New Backing Track Production", desc: "AI-based recreation of original backing tracks for copyright-free use. Release your music safely with a new instrumental similar to the original." },
        { title: "Album Cover Design", desc: "Professional designers create your unique album cover. Stand out on streaming platforms with K-POP style sophisticated design." },
        { title: "Lifetime Royalty License", desc: "Receive streaming revenue for life from your released music. Earn royalties every time your song plays on Spotify, Apple Music, etc." },
      ]
    },
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
    albumService: "アルバムリリース",
    albumDesc: "世界中のストリーミングプラットフォームで正式リリース",
    lpService: "LPレコード制作",
    listenSample: "サンプルを聴く",
    watchSample: "サンプルを見る",
    viewDetails: "詳細を見る",
    next: "次へ",
    back: "戻る",
    confirm: "確認",
    total: "合計",
    selectComplete: "選択完了",
    success: "選択完了！",
    successMessage: "選択が完了しました。レコーディングをお楽しみください！",
    required: "必須",
    close: "閉じる",
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
    albumOption: { 
      name: "アルバムリリース", 
      price: 200000, 
      desc: "世界150以上のプラットフォームに配信",
      features: [
        { title: "新規バッキングトラック制作", desc: "AIベースで原曲のバッキングトラックを新規制作し、著作権の心配なく使用できます。" },
        { title: "アルバムカバーデザイン", desc: "プロのデザイナーがあなただけのアルバムカバーを制作します。" },
        { title: "生涯ロイヤリティライセンス", desc: "リリースした音源からのストリーミング収益を一生受け取れます。" },
      ]
    },
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
    albumService: "专辑发行",
    albumDesc: "在全球流媒体平台正式发行",
    lpService: "LP唱片制作",
    listenSample: "试听样本",
    watchSample: "观看样本",
    viewDetails: "查看详情",
    next: "下一步",
    back: "上一步",
    confirm: "确认",
    total: "总计",
    selectComplete: "选择完成",
    success: "选择完成！",
    successMessage: "选择已完成。祝您录音愉快！",
    required: "必填",
    close: "关闭",
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
    albumOption: { 
      name: "专辑发行", 
      price: 200000, 
      desc: "发行到全球150多个平台",
      features: [
        { title: "全新伴奏制作", desc: "基于AI重新制作原曲伴奏，无版权顾虑。" },
        { title: "专辑封面设计", desc: "专业设计师为您制作独特的专辑封面。" },
        { title: "终身版税许可", desc: "终身获得发行音乐的流媒体收入。" },
      ]
    },
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
  const [wantsAlbum, setWantsAlbum] = useState(false);
  const [wantsLP, setWantsLP] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [detailModal, setDetailModal] = useState<{ title: string; desc: string } | null>(null);
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
    if (wantsAlbum) total += t.albumOption.price;
    if (wantsLP) total += t.lpOption.price;
    return total;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "FREE";
    return `₩${price.toLocaleString()}`;
  };

  const getDrinkQty = (drinkId: string, temp: "hot" | "iced" | "none") => {
    const order = drinkOrders.find(o => o.id === drinkId && o.temperature === temp);
    return order?.quantity || 0;
  };

  const updateDrinkQuantity = (drinkId: string, temp: "hot" | "iced" | "none", delta: number) => {
    setDrinkOrders(prev => {
      const existing = prev.find(o => o.id === drinkId && o.temperature === temp);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) return prev.filter(o => !(o.id === drinkId && o.temperature === temp));
        return prev.map(o => (o.id === drinkId && o.temperature === temp) ? { ...o, quantity: newQty } : o);
      } else if (delta > 0) {
        return [...prev, { id: drinkId, temperature: temp, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (!name || !phone || !email) {
      toast({ title: t.required, description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const drinkSummary = drinkOrders.map(o => {
      const drinkName = t.drinks[o.id] || o.id;
      const tempLabel = o.temperature === "hot" ? " (hot)" : o.temperature === "iced" ? " (iced)" : "";
      return `${drinkName} x${o.quantity}${tempLabel}`;
    }).join(", ") || "none";

    const selectedAddons: number[] = [];
    if (selectedMixing === "ai") selectedAddons.push(1);
    if (selectedMixing === "engineer") selectedAddons.push(2);
    if (selectedVideo === "cameraman") selectedAddons.push(3);
    if (selectedVideo === "full") selectedAddons.push(4);
    if (wantsAlbum) selectedAddons.push(5);
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
      <div className="min-h-screen bg-gradient-to-br from-rose-200 via-purple-200 to-indigo-200 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.success}</h1>
          <p className="text-xl text-gray-600 mb-8">{t.successMessage}</p>
          <Button onClick={() => { setIsComplete(false); setStep(0); setLanguage(null); setDrinkOrders([]); setYoutubeUrl(""); setName(""); setPhone(""); setEmail(""); setSelectedMixing("raw"); setSelectedVideo("self"); setWantsAlbum(false); setWantsLP(false); }} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 text-xl">
            {t.back}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-purple-200 to-indigo-200 text-gray-800 flex flex-col">
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{detailModal?.title}</DialogTitle>
            <DialogDescription className="text-base pt-4 leading-relaxed">
              {detailModal?.desc}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setDetailModal(null)} className="mt-4">{t.close}</Button>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-28 relative z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {step === 0 && (
            <motion.div key="lang" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-2xl">
              <div className="text-center mb-10">
                <img src={logoImage} alt="Logo" className="h-16 mx-auto mb-6" />
                <h1 className="text-3xl font-bold flex items-center justify-center gap-3 text-gray-800">
                  <Globe className="w-8 h-8 text-purple-500" />
                  {translations.en.selectLanguage}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {languageOptions.map((lang) => (
                  <Card key={lang.code} className="cursor-pointer bg-white/80 border-gray-200 hover:border-pink-400 hover:bg-white hover:shadow-lg transition-all" onClick={() => { setLanguage(lang.code); setTimeout(() => paginate(1), 200); }} data-testid={`button-language-${lang.code}`}>
                    <CardContent className="p-8 text-center">
                      <span className="text-6xl mb-4 block">{lang.flag}</span>
                      <span className="text-xl font-semibold text-gray-800">{lang.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="drink" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-5xl">
              <div className="text-center mb-6">
                <Coffee className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.selectDrink}</h1>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[55vh] overflow-y-auto p-2">
                {drinkCatalog.map((drink) => {
                  const hotQty = getDrinkQty(drink.id, "hot");
                  const icedQty = getDrinkQty(drink.id, "iced");
                  const noneQty = getDrinkQty(drink.id, "none");
                  const totalQty = hotQty + icedQty + noneQty;
                  
                  return (
                    <Card key={drink.id} className={`bg-white/80 border-gray-200 transition-all ${totalQty > 0 ? "border-pink-500 bg-pink-50 shadow-md" : "hover:shadow-md"}`}>
                      <CardContent className="p-3">
                        <div className="text-center mb-3">
                          <span className="text-sm font-medium text-gray-700 block">{t.drinks[drink.id]}</span>
                        </div>
                        {drink.hasTemp && !drink.hotOnly ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-red-50 rounded-lg px-2 py-1">
                              <span className="text-xs font-medium text-red-600">{t.hot}</span>
                              <div className="flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-300 text-red-600 hover:bg-red-100" onClick={() => updateDrinkQuantity(drink.id, "hot", -1)} disabled={hotQty === 0}><Minus className="w-3 h-3" /></Button>
                                <span className="w-6 text-center font-bold text-sm">{hotQty}</span>
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-300 text-red-600 hover:bg-red-100" onClick={() => updateDrinkQuantity(drink.id, "hot", 1)}><Plus className="w-3 h-3" /></Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-blue-50 rounded-lg px-2 py-1">
                              <span className="text-xs font-medium text-blue-600">{t.iced}</span>
                              <div className="flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-blue-300 text-blue-600 hover:bg-blue-100" onClick={() => updateDrinkQuantity(drink.id, "iced", -1)} disabled={icedQty === 0}><Minus className="w-3 h-3" /></Button>
                                <span className="w-6 text-center font-bold text-sm">{icedQty}</span>
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-blue-300 text-blue-600 hover:bg-blue-100" onClick={() => updateDrinkQuantity(drink.id, "iced", 1)}><Plus className="w-3 h-3" /></Button>
                              </div>
                            </div>
                          </div>
                        ) : drink.hotOnly ? (
                          <div className="flex items-center justify-between bg-red-50 rounded-lg px-2 py-1">
                            <span className="text-xs font-medium text-red-600">{t.hot}</span>
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-300 text-red-600 hover:bg-red-100" onClick={() => updateDrinkQuantity(drink.id, "hot", -1)} disabled={hotQty === 0}><Minus className="w-3 h-3" /></Button>
                              <span className="w-6 text-center font-bold text-sm">{hotQty}</span>
                              <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-300 text-red-600 hover:bg-red-100" onClick={() => updateDrinkQuantity(drink.id, "hot", 1)}><Plus className="w-3 h-3" /></Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => updateDrinkQuantity(drink.id, "none", -1)} disabled={noneQty === 0}><Minus className="w-4 h-4" /></Button>
                            <span className="w-8 text-center font-bold text-lg">{noneQty}</span>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => updateDrinkQuantity(drink.id, "none", 1)}><Plus className="w-4 h-4" /></Button>
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
                <User className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.customerInfo}</h1>
              </div>
              <Card className="bg-white/80 border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><Music className="w-4 h-4 text-pink-500" />{t.backingTrack}</label>
                    <Input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder={t.backingTrackPlaceholder} className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 h-12" data-testid="input-youtube" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t.name} *</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 h-12" data-testid="input-name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t.phone} *</label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 h-12" data-testid="input-phone" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t.email} *</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 h-12" data-testid="input-email" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="mixing" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-4xl">
              <div className="text-center mb-6">
                <Headphones className="w-10 h-10 text-cyan-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.mixingService}</h1>
                <p className="text-gray-600 mt-2">{t.mixingDesc}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.mixingOptions.map((opt) => (
                  <Card key={opt.id} className={`cursor-pointer transition-all relative ${selectedMixing === opt.id ? "border-2 border-cyan-500 bg-cyan-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-gray-300"}`} onClick={() => setSelectedMixing(opt.id)}>
                    {selectedMixing === opt.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${selectedMixing === opt.id ? "bg-cyan-500" : "bg-gray-200"}`}>
                        <Headphones className={`w-6 h-6 ${selectedMixing === opt.id ? "text-white" : "text-gray-600"}`} />
                      </div>
                      <h3 className="font-bold text-base mb-1 text-gray-800">{opt.name}</h3>
                      <p className={`text-xl font-bold mb-2 ${opt.price === 0 ? "text-green-600" : "text-pink-600"}`}>{formatPrice(opt.price)}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                      <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-gray-600 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setPlayingAudio(playingAudio === opt.id ? null : opt.id); }}>
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
                <Video className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.videoService}</h1>
                <p className="text-gray-600 mt-2">{t.videoDesc}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {t.videoOptions.map((opt) => (
                  <Card key={opt.id} className={`cursor-pointer transition-all relative ${selectedVideo === opt.id ? "border-2 border-rose-500 bg-rose-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-gray-300"}`} onClick={() => setSelectedVideo(opt.id)}>
                    {selectedVideo === opt.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${selectedVideo === opt.id ? "bg-rose-500" : "bg-gray-200"}`}>
                        <Video className={`w-6 h-6 ${selectedVideo === opt.id ? "text-white" : "text-gray-600"}`} />
                      </div>
                      <h3 className="font-bold text-base mb-1 text-gray-800">{opt.name}</h3>
                      <p className={`text-xl font-bold mb-2 ${opt.price === 0 ? "text-green-600" : "text-pink-600"}`}>{formatPrice(opt.price)}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                      <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-gray-600 hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
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
                <Share2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.albumService} & {t.lpService}</h1>
              </div>
              <div className="space-y-4">
                <Card className={`cursor-pointer transition-all relative ${wantsAlbum ? "border-2 border-emerald-500 bg-emerald-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-gray-300"}`} onClick={() => setWantsAlbum(!wantsAlbum)}>
                  {wantsAlbum && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${wantsAlbum ? "bg-emerald-500" : "bg-gray-200"}`}>
                        <Share2 className={`w-7 h-7 ${wantsAlbum ? "text-white" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800">{t.albumOption.name}</h3>
                        <p className="text-sm text-gray-500">{t.albumOption.desc}</p>
                      </div>
                      <p className="text-2xl font-bold text-pink-600">{formatPrice(t.albumOption.price)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {t.albumOption.features.map((feature, idx) => (
                        <Button 
                          key={idx} 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-auto py-2 px-3"
                          onClick={(e) => { e.stopPropagation(); setDetailModal(feature); }}
                        >
                          <Info className="w-3 h-3 mr-1" />
                          {feature.title}
                        </Button>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs h-auto py-2 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {t.listenSample}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className={`cursor-pointer transition-all relative ${wantsLP ? "border-2 border-amber-500 bg-amber-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-gray-300"}`} onClick={() => setWantsLP(!wantsLP)}>
                  {wantsLP && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${wantsLP ? "bg-amber-500" : "bg-gray-200"}`}>
                        <Disc className={`w-7 h-7 ${wantsLP ? "text-white" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800">{t.lpOption.name}</h3>
                        <p className="text-sm text-gray-500">{t.lpOption.desc}</p>
                      </div>
                      <p className="text-2xl font-bold text-pink-600">{formatPrice(t.lpOption.price)}</p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-amber-300 text-amber-600 hover:bg-amber-50 text-xs h-auto py-2 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {t.watchSample}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="confirm" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-xl">
              <div className="text-center mb-6">
                <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.confirm}</h1>
              </div>
              <Card className="bg-white/80 border-gray-200">
                <CardContent className="p-5 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.name}</span><span className="text-gray-800">{name}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.phone}</span><span className="text-gray-800">{phone}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.email}</span><span className="text-gray-800">{email}</span></div>
                  <div className="py-2 border-b border-gray-200">
                    <span className="text-gray-500 block mb-1">{t.selectDrink}</span>
                    <span className="text-xs text-gray-800">
                      {drinkOrders.length > 0 ? drinkOrders.map(o => {
                        const tempLabel = o.temperature === "hot" ? ` (${t.hot})` : o.temperature === "iced" ? ` (${t.iced})` : "";
                        return `${t.drinks[o.id]} x${o.quantity}${tempLabel}`;
                      }).join(", ") : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">{t.mixingService}</span>
                    <div className="text-right">
                      <span className="text-gray-800">{t.mixingOptions.find(o => o.id === selectedMixing)?.name}</span>
                      <span className="ml-2 text-pink-600 font-medium">{formatPrice(t.mixingOptions.find(o => o.id === selectedMixing)?.price || 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">{t.videoService}</span>
                    <div className="text-right">
                      <span className="text-gray-800">{t.videoOptions.find(o => o.id === selectedVideo)?.name}</span>
                      <span className="ml-2 text-pink-600 font-medium">{formatPrice(t.videoOptions.find(o => o.id === selectedVideo)?.price || 0)}</span>
                    </div>
                  </div>
                  {wantsAlbum && <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.albumOption.name}</span><span className="text-pink-600 font-medium">{formatPrice(t.albumOption.price)}</span></div>}
                  {wantsLP && <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.lpOption.name}</span><span className="text-pink-600 font-medium">{formatPrice(t.lpOption.price)}</span></div>}
                  <div className="flex justify-between py-4 text-2xl font-bold bg-gradient-to-r from-purple-50 to-pink-50 -mx-5 px-5 rounded-b-lg">
                    <span className="text-purple-600">{t.total}</span>
                    <span className="text-pink-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-purple-300 p-4 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => paginate(-1)} className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold" data-testid="button-back">
              <ArrowLeft className="w-6 h-6 mr-2" />{t.back}
            </Button>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`h-3 rounded-full transition-all ${i === step ? "bg-pink-500 w-8" : i < step ? "bg-green-500 w-3" : "bg-gray-400 w-3"}`} />
              ))}
            </div>
            {step < 6 ? (
              <Button size="lg" onClick={() => paginate(1)} disabled={!canProceed()} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg" data-testid="button-next">
                {t.next}<ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleSubmit} disabled={bookingMutation.isPending} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold shadow-lg" data-testid="button-submit">
                {bookingMutation.isPending ? "Loading..." : <><Check className="w-6 h-6 mr-2" />{t.selectComplete}</>}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

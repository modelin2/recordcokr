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
  Headphones, Video, Disc, Share2, Volume2, Play, Minus, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";

type Language = "ko" | "en" | "ja" | "zh";

interface DrinkOrder {
  id: string;
  quantity: number;
  temperature: "hot" | "iced" | "none";
}

const translations: Record<Language, {
  selectLanguage: string;
  welcome: string;
  selectDrink: string;
  drinkOptions: { id: string; name: string; icon: string; hasTemp: boolean }[];
  temperature: string;
  hot: string;
  iced: string;
  quantity: string;
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
  skip: string;
  addService: string;
  confirm: string;
  total: string;
  submit: string;
  success: string;
  successMessage: string;
  required: string;
  optional: string;
  selectComplete: string;
  services: { id: number; name: string; price: number; description: string; longDescription: string; type: "audio" | "video" | "none" }[];
}> = {
  ko: {
    selectLanguage: "언어를 선택하세요",
    welcome: "레코딩 카페에 오신 것을 환영합니다",
    selectDrink: "음료를 선택하세요",
    drinkOptions: [
      { id: "americano", name: "아메리카노", icon: "☕", hasTemp: true },
      { id: "latte", name: "카페라떼", icon: "🥛", hasTemp: true },
      { id: "vanilla_latte", name: "바닐라라떼", icon: "🍦", hasTemp: true },
      { id: "caramel_macchiato", name: "카라멜마끼아또", icon: "🍮", hasTemp: true },
      { id: "mocha", name: "카페모카", icon: "🍫", hasTemp: true },
      { id: "green_tea_latte", name: "녹차라떼", icon: "🍵", hasTemp: true },
      { id: "chai_latte", name: "차이라떼", icon: "🫖", hasTemp: true },
      { id: "orange_juice", name: "오렌지주스", icon: "🍊", hasTemp: false },
      { id: "grapefruit_ade", name: "자몽에이드", icon: "🍹", hasTemp: false },
      { id: "lemon_ade", name: "레몬에이드", icon: "🍋", hasTemp: false },
      { id: "water", name: "물", icon: "💧", hasTemp: false },
    ],
    temperature: "온도 선택",
    hot: "핫",
    iced: "아이스",
    quantity: "수량",
    backingTrack: "백킹트랙 URL",
    backingTrackPlaceholder: "YouTube URL을 입력하세요",
    customerInfo: "고객 정보",
    name: "이름",
    namePlaceholder: "이름을 입력하세요",
    phone: "전화번호",
    phonePlaceholder: "전화번호를 입력하세요",
    email: "이메일",
    emailPlaceholder: "이메일을 입력하세요 (선택)",
    additionalServices: "추가 서비스",
    listenSample: "샘플 듣기",
    watchSample: "샘플 보기",
    before: "보정 전",
    after: "보정 후",
    next: "다음",
    back: "이전",
    skip: "건너뛰기",
    addService: "추가하기",
    confirm: "확인",
    total: "총 금액",
    submit: "선택완료",
    success: "선택완료!",
    successMessage: "선택이 성공적으로 완료되었습니다. 즐거운 레코딩 되세요!",
    required: "필수 입력",
    optional: "선택",
    selectComplete: "선택완료",
    services: [
      { id: 1, name: "간단한 믹싱", price: 20000, description: "기본적인 음량 조절과 EQ 보정", longDescription: "녹음된 보컬의 음량을 조절하고 기본적인 EQ(이퀄라이저)를 적용하여 더 깨끗한 사운드를 만들어 드립니다. 간단한 리버브와 딜레이 효과도 추가됩니다.", type: "audio" },
      { id: 2, name: "풀트랙 믹싱", price: 100000, description: "전문적인 믹싱과 마스터링", longDescription: "전문 엔지니어가 세밀한 EQ, 컴프레서, 리버브, 딜레이 등을 적용하여 방송 품질의 사운드를 완성합니다. 보컬 피치 보정과 타이밍 조절도 포함됩니다.", type: "audio" },
      { id: 3, name: "레코딩 비디오", price: 20000, description: "녹음 현장 영상 촬영", longDescription: "레코딩 세션 전체를 고화질 영상으로 촬영합니다. 마이크 앞에서 노래하는 모습을 그대로 담아 특별한 추억으로 남겨드립니다.", type: "video" },
      { id: 4, name: "비디오 편집", price: 100000, description: "전문 편집과 자막 추가", longDescription: "촬영된 영상을 전문적으로 편집하여 인트로, 아웃트로, 자막, 효과를 추가합니다. SNS나 유튜브에 바로 업로드할 수 있는 완성된 영상을 제공합니다.", type: "video" },
      { id: 6, name: "음원 유통", price: 200000, description: "전 세계 스트리밍 플랫폼 배포", longDescription: "Spotify, Apple Music, YouTube Music, Melon 등 전 세계 150개 이상의 스트리밍 플랫폼에 여러분의 음원을 배포합니다. 정식 아티스트로 데뷔하세요!", type: "none" },
      { id: 5, name: "LP 제작", price: 300000, description: "나만의 LP 레코드 제작", longDescription: "여러분의 녹음을 실제 LP 레코드로 제작합니다. 커스텀 재킷 디자인과 함께 세상에 하나뿐인 LP를 소장하세요. 제작 기간은 약 4-6주입니다.", type: "none" },
    ],
  },
  en: {
    selectLanguage: "Select Language",
    welcome: "Welcome to Recording Cafe",
    selectDrink: "Select Your Drinks",
    drinkOptions: [
      { id: "americano", name: "Americano", icon: "☕", hasTemp: true },
      { id: "latte", name: "Cafe Latte", icon: "🥛", hasTemp: true },
      { id: "vanilla_latte", name: "Vanilla Latte", icon: "🍦", hasTemp: true },
      { id: "caramel_macchiato", name: "Caramel Macchiato", icon: "🍮", hasTemp: true },
      { id: "mocha", name: "Cafe Mocha", icon: "🍫", hasTemp: true },
      { id: "green_tea_latte", name: "Green Tea Latte", icon: "🍵", hasTemp: true },
      { id: "chai_latte", name: "Chai Latte", icon: "🫖", hasTemp: true },
      { id: "orange_juice", name: "Orange Juice", icon: "🍊", hasTemp: false },
      { id: "grapefruit_ade", name: "Grapefruit Ade", icon: "🍹", hasTemp: false },
      { id: "lemon_ade", name: "Lemon Ade", icon: "🍋", hasTemp: false },
      { id: "water", name: "Water", icon: "💧", hasTemp: false },
    ],
    temperature: "Temperature",
    hot: "Hot",
    iced: "Iced",
    quantity: "Qty",
    backingTrack: "Backing Track URL",
    backingTrackPlaceholder: "Enter YouTube URL",
    customerInfo: "Customer Information",
    name: "Name",
    namePlaceholder: "Enter your name",
    phone: "Phone",
    phonePlaceholder: "Enter your phone number",
    email: "Email",
    emailPlaceholder: "Enter your email (optional)",
    additionalServices: "Additional Services",
    listenSample: "Listen Sample",
    watchSample: "Watch Sample",
    before: "Before",
    after: "After",
    next: "Next",
    back: "Back",
    skip: "Skip",
    addService: "Add",
    confirm: "Confirm",
    total: "Total",
    submit: "Complete",
    success: "Complete!",
    successMessage: "Your selection has been completed. Enjoy your recording!",
    required: "Required",
    optional: "Optional",
    selectComplete: "Complete",
    services: [
      { id: 1, name: "Simple Mixing", price: 20000, description: "Basic volume and EQ adjustment", longDescription: "We adjust the volume of your recorded vocals and apply basic EQ to create a cleaner sound. Simple reverb and delay effects are also included.", type: "audio" },
      { id: 2, name: "Full Track Mixing", price: 100000, description: "Professional mixing and mastering", longDescription: "Professional engineers apply detailed EQ, compressor, reverb, delay, etc. to complete broadcast-quality sound. Vocal pitch correction and timing adjustments are included.", type: "audio" },
      { id: 3, name: "Recording Video", price: 20000, description: "Recording session video capture", longDescription: "We capture your entire recording session in high-quality video. Keep the special memory of singing in front of the microphone.", type: "video" },
      { id: 4, name: "Video Editing", price: 100000, description: "Professional editing with subtitles", longDescription: "Professionally edit the recorded video with intro, outro, subtitles, and effects. We provide a finished video ready to upload to SNS or YouTube.", type: "video" },
      { id: 6, name: "Music Distribution", price: 200000, description: "Global streaming platform distribution", longDescription: "Distribute your music to over 150 streaming platforms worldwide including Spotify, Apple Music, YouTube Music, and Melon. Debut as an official artist!", type: "none" },
      { id: 5, name: "LP Production", price: 300000, description: "Create your own LP record", longDescription: "We produce your recording as an actual LP record. Own a one-of-a-kind LP with custom jacket design. Production takes about 4-6 weeks.", type: "none" },
    ],
  },
  ja: {
    selectLanguage: "言語を選択",
    welcome: "レコーディングカフェへようこそ",
    selectDrink: "ドリンクを選択",
    drinkOptions: [
      { id: "americano", name: "アメリカーノ", icon: "☕", hasTemp: true },
      { id: "latte", name: "カフェラテ", icon: "🥛", hasTemp: true },
      { id: "vanilla_latte", name: "バニララテ", icon: "🍦", hasTemp: true },
      { id: "caramel_macchiato", name: "キャラメルマキアート", icon: "🍮", hasTemp: true },
      { id: "mocha", name: "カフェモカ", icon: "🍫", hasTemp: true },
      { id: "green_tea_latte", name: "抹茶ラテ", icon: "🍵", hasTemp: true },
      { id: "chai_latte", name: "チャイラテ", icon: "🫖", hasTemp: true },
      { id: "orange_juice", name: "オレンジジュース", icon: "🍊", hasTemp: false },
      { id: "grapefruit_ade", name: "グレープフルーツエイド", icon: "🍹", hasTemp: false },
      { id: "lemon_ade", name: "レモンエイド", icon: "🍋", hasTemp: false },
      { id: "water", name: "お水", icon: "💧", hasTemp: false },
    ],
    temperature: "温度選択",
    hot: "ホット",
    iced: "アイス",
    quantity: "数量",
    backingTrack: "バッキングトラックURL",
    backingTrackPlaceholder: "YouTube URLを入力",
    customerInfo: "お客様情報",
    name: "お名前",
    namePlaceholder: "お名前を入力",
    phone: "電話番号",
    phonePlaceholder: "電話番号を入力",
    email: "メール",
    emailPlaceholder: "メールアドレスを入力（任意）",
    additionalServices: "追加サービス",
    listenSample: "サンプルを聴く",
    watchSample: "サンプルを見る",
    before: "補正前",
    after: "補正後",
    next: "次へ",
    back: "戻る",
    skip: "スキップ",
    addService: "追加する",
    confirm: "確認",
    total: "合計金額",
    submit: "選択完了",
    success: "選択完了！",
    successMessage: "選択が完了しました。レコーディングをお楽しみください！",
    required: "必須入力",
    optional: "任意",
    selectComplete: "選択完了",
    services: [
      { id: 1, name: "シンプルミキシング", price: 20000, description: "基本的な音量とEQ調整", longDescription: "録音されたボーカルの音量を調整し、基本的なEQを適用してよりクリアなサウンドを作ります。シンプルなリバーブとディレイ効果も含まれます。", type: "audio" },
      { id: 2, name: "フルトラックミキシング", price: 100000, description: "プロフェッショナルなミキシングとマスタリング", longDescription: "プロのエンジニアが詳細なEQ、コンプレッサー、リバーブ、ディレイなどを適用して放送品質のサウンドを完成させます。ボーカルピッチ補正とタイミング調整も含まれます。", type: "audio" },
      { id: 3, name: "レコーディング動画", price: 20000, description: "録音現場の映像撮影", longDescription: "レコーディングセッション全体を高画質映像で撮影します。マイクの前で歌う姿を特別な思い出として残します。", type: "video" },
      { id: 4, name: "動画編集", price: 100000, description: "プロ編集と字幕追加", longDescription: "撮影された映像をプロフェッショナルに編集し、イントロ、アウトロ、字幕、エフェクトを追加します。SNSやYouTubeにすぐアップロードできる完成された映像を提供します。", type: "video" },
      { id: 6, name: "音源配信", price: 200000, description: "世界中のストリーミングプラットフォームへ配信", longDescription: "Spotify、Apple Music、YouTube Music、Melonなど世界150以上のストリーミングプラットフォームにあなたの音源を配信します。正式アーティストとしてデビューしましょう！", type: "none" },
      { id: 5, name: "LP制作", price: 300000, description: "オリジナルLPレコード制作", longDescription: "あなたの録音を実際のLPレコードとして制作します。カスタムジャケットデザインと共に世界に一つだけのLPを所有しましょう。制作期間は約4〜6週間です。", type: "none" },
    ],
  },
  zh: {
    selectLanguage: "选择语言",
    welcome: "欢迎来到录音咖啡厅",
    selectDrink: "选择饮料",
    drinkOptions: [
      { id: "americano", name: "美式咖啡", icon: "☕", hasTemp: true },
      { id: "latte", name: "拿铁", icon: "🥛", hasTemp: true },
      { id: "vanilla_latte", name: "香草拿铁", icon: "🍦", hasTemp: true },
      { id: "caramel_macchiato", name: "焦糖玛奇朵", icon: "🍮", hasTemp: true },
      { id: "mocha", name: "摩卡", icon: "🍫", hasTemp: true },
      { id: "green_tea_latte", name: "抹茶拿铁", icon: "🍵", hasTemp: true },
      { id: "chai_latte", name: "印度奶茶", icon: "🫖", hasTemp: true },
      { id: "orange_juice", name: "橙汁", icon: "🍊", hasTemp: false },
      { id: "grapefruit_ade", name: "西柚汽水", icon: "🍹", hasTemp: false },
      { id: "lemon_ade", name: "柠檬汽水", icon: "🍋", hasTemp: false },
      { id: "water", name: "水", icon: "💧", hasTemp: false },
    ],
    temperature: "温度选择",
    hot: "热",
    iced: "冰",
    quantity: "数量",
    backingTrack: "伴奏URL",
    backingTrackPlaceholder: "请输入YouTube URL",
    customerInfo: "顾客信息",
    name: "姓名",
    namePlaceholder: "请输入姓名",
    phone: "电话号码",
    phonePlaceholder: "请输入电话号码",
    email: "邮箱",
    emailPlaceholder: "请输入邮箱（选填）",
    additionalServices: "附加服务",
    listenSample: "试听样本",
    watchSample: "观看样本",
    before: "修正前",
    after: "修正后",
    next: "下一步",
    back: "上一步",
    skip: "跳过",
    addService: "添加",
    confirm: "确认",
    total: "总金额",
    submit: "选择完成",
    success: "选择完成！",
    successMessage: "您的选择已完成。祝您录音愉快！",
    required: "必填",
    optional: "选填",
    selectComplete: "选择完成",
    services: [
      { id: 1, name: "简单混音", price: 20000, description: "基本音量和EQ调整", longDescription: "我们调整录制人声的音量并应用基本EQ以创建更清晰的声音。还包括简单的混响和延迟效果。", type: "audio" },
      { id: 2, name: "全曲混音", price: 100000, description: "专业混音和母带处理", longDescription: "专业工程师应用详细的EQ、压缩器、混响、延迟等来完成广播品质的声音。包括人声音高校正和时间调整。", type: "audio" },
      { id: 3, name: "录音视频", price: 20000, description: "录音现场视频拍摄", longDescription: "我们以高清视频捕捉您的整个录音过程。保留在麦克风前唱歌的特别回忆。", type: "video" },
      { id: 4, name: "视频编辑", price: 100000, description: "专业编辑和字幕添加", longDescription: "专业编辑录制的视频，添加片头、片尾、字幕和效果。我们提供可以直接上传到社交媒体或YouTube的完成视频。", type: "video" },
      { id: 6, name: "音乐发行", price: 200000, description: "全球流媒体平台发行", longDescription: "将您的音乐发行到全球150多个流媒体平台，包括Spotify、Apple Music、YouTube Music和Melon。成为正式艺人出道！", type: "none" },
      { id: 5, name: "LP制作", price: 300000, description: "制作您自己的LP唱片", longDescription: "我们将您的录音制作成实际的LP唱片。拥有带有定制封套设计的独一无二的LP。制作时间约4-6周。", type: "none" },
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
  const [drinkOrders, setDrinkOrders] = useState<DrinkOrder[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [showingSample, setShowingSample] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const t = language ? translations[language] : translations.ko;
  const totalSteps = 3 + t.services.length + 1;

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

  const getDrinkOrder = (drinkId: string) => {
    return drinkOrders.find(o => o.id === drinkId);
  };

  const updateDrinkQuantity = (drinkId: string, delta: number, hasTemp: boolean) => {
    setDrinkOrders(prev => {
      const existing = prev.find(o => o.id === drinkId);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) {
          return prev.filter(o => o.id !== drinkId);
        }
        return prev.map(o => o.id === drinkId ? { ...o, quantity: newQty } : o);
      } else if (delta > 0) {
        return [...prev, { id: drinkId, quantity: 1, temperature: hasTemp ? "iced" : "none" }];
      }
      return prev;
    });
  };

  const updateDrinkTemperature = (drinkId: string, temp: "hot" | "iced") => {
    setDrinkOrders(prev => 
      prev.map(o => o.id === drinkId ? { ...o, temperature: temp } : o)
    );
  };

  const handleSubmit = () => {
    if (!name || !phone) {
      toast({
        title: t.required,
        description: "Please fill in name and phone number",
        variant: "destructive",
      });
      return;
    }

    const drinkSummary = drinkOrders.map(o => {
      const drink = t.drinkOptions.find(d => d.id === o.id);
      return `${drink?.name} x${o.quantity}${o.temperature !== "none" ? ` (${o.temperature})` : ""}`;
    }).join(", ") || "none";

    bookingMutation.mutate({
      bookingType: "direct",
      name,
      email: email || "guest@recordingcafe.com",
      phone,
      selectedDrink: drinkSummary,
      drinkTemperature: "mixed",
      youtubeTrackUrl: youtubeUrl || "https://youtube.com",
      selectedAddons: selectedServices,
      totalPrice,
    });
  };

  const canProceed = () => {
    if (step === 2) return name !== "" && phone !== "";
    return true;
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
    setShowingSample(false);
  };

  const getCurrentService = () => {
    if (step >= 3 && step < 3 + t.services.length) {
      return t.services[step - 3];
    }
    return null;
  };

  const isConfirmStep = step === 3 + t.services.length;

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
              setDrinkOrders([]);
              setYoutubeUrl("");
              setName("");
              setPhone("");
              setEmail("");
              setSelectedServices([]);
              setCurrentServiceIndex(0);
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
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-24">
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
              <div className="text-center mb-8">
                <img src={logoImage} alt="Recording Cafe" className="h-20 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
                  <Globe className="w-7 h-7 text-pink-500" />
                  {translations.en.selectLanguage}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    <CardContent className="p-6 text-center">
                      <span className="text-5xl mb-3 block">{lang.flag}</span>
                      <span className="text-xl font-semibold text-gray-700">{lang.name}</span>
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
              className="w-full max-w-4xl"
            >
              <div className="text-center mb-4">
                <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.selectDrink}</h1>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto p-2">
                {t.drinkOptions.map((drink) => {
                  const order = getDrinkOrder(drink.id);
                  const quantity = order?.quantity || 0;
                  
                  return (
                    <Card
                      key={drink.id}
                      className={`transition-all ${quantity > 0 ? "ring-2 ring-pink-500 bg-pink-50" : ""}`}
                    >
                      <CardContent className="p-3">
                        <div className="text-center mb-2">
                          <span className="text-3xl block mb-1">{drink.icon}</span>
                          <span className="text-sm font-medium text-gray-700 block">{drink.name}</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateDrinkQuantity(drink.id, -1, drink.hasTemp)}
                            disabled={quantity === 0}
                            data-testid={`button-minus-${drink.id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-6 text-center font-bold text-lg">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateDrinkQuantity(drink.id, 1, drink.hasTemp)}
                            data-testid={`button-plus-${drink.id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {quantity > 0 && drink.hasTemp && (
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant={order?.temperature === "hot" ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateDrinkTemperature(drink.id, "hot")}
                              className={`text-xs h-7 px-2 ${order?.temperature === "hot" ? "bg-red-500 hover:bg-red-600" : ""}`}
                              data-testid={`button-hot-${drink.id}`}
                            >
                              🔥{t.hot}
                            </Button>
                            <Button
                              variant={order?.temperature === "iced" ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateDrinkTemperature(drink.id, "iced")}
                              className={`text-xs h-7 px-2 ${order?.temperature === "iced" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                              data-testid={`button-iced-${drink.id}`}
                            >
                              ❄️{t.iced}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {drinkOrders.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {drinkOrders.map(o => {
                        const drink = t.drinkOptions.find(d => d.id === o.id);
                        return `${drink?.icon} ${drink?.name} x${o.quantity}`;
                      }).join(", ")}
                    </span>
                  </div>
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
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.customerInfo}</h1>
              </div>
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                      <Music className="w-4 h-4 text-pink-500" />
                      {t.backingTrack}
                    </label>
                    <Input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder={t.backingTrackPlaceholder}
                      className="text-base p-4 h-12"
                      data-testid="input-youtube-url"
                    />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 mb-2 block">{t.name} *</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="text-base p-4 h-12"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 mb-2 block">{t.phone} *</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="text-base p-4 h-12"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 mb-2 block">{t.email} ({t.optional})</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="text-base p-4 h-12"
                      data-testid="input-email"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {getCurrentService() && (
            <motion.div
              key={`service-${getCurrentService()?.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl"
            >
              {(() => {
                const service = getCurrentService()!;
                const isSelected = selectedServices.includes(service.id);
                const IconComponent = service.type === "audio" ? Headphones : service.type === "video" ? Video : service.id === 5 ? Disc : Share2;
                
                return (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isSelected ? "bg-green-500" : "bg-gray-200"}`}>
                        <IconComponent className={`w-10 h-10 ${isSelected ? "text-white" : "text-gray-600"}`} />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.name}</h1>
                      <p className="text-3xl font-bold text-pink-600 mb-4">{formatPrice(service.price)}</p>
                    </div>
                    
                    <Card className="mb-6">
                      <CardContent className="p-6">
                        <p className="text-lg text-gray-700 leading-relaxed">{service.longDescription}</p>
                      </CardContent>
                    </Card>

                    {service.type !== "none" && (
                      <Card className="mb-6 bg-gray-50">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                            {service.type === "audio" ? <Volume2 className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            {service.type === "audio" ? t.listenSample : t.watchSample}
                          </h3>
                          {service.type === "audio" ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-4">
                                <Button variant="outline" size="lg" className="flex-1 h-14">
                                  <Volume2 className="w-5 h-5 mr-2" />
                                  {t.before}
                                </Button>
                                <ArrowRight className="w-6 h-6 text-gray-400" />
                                <Button variant="outline" size="lg" className="flex-1 h-14 border-green-500 text-green-600">
                                  <Volume2 className="w-5 h-5 mr-2" />
                                  {t.after}
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500">🎧 휴대폰을 연결하여 샘플을 청취하세요</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Button variant="outline" size="lg" className="w-full h-14">
                                <Play className="w-5 h-5 mr-2" />
                                {t.watchSample}
                              </Button>
                              <p className="text-sm text-gray-500">📱 휴대폰을 연결하여 샘플을 시청하세요</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <Button
                      size="lg"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedServices(prev => prev.filter(id => id !== service.id));
                        } else {
                          setSelectedServices(prev => [...prev, service.id]);
                        }
                      }}
                      className={`w-full h-16 text-xl ${
                        isSelected 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      }`}
                      data-testid={`button-toggle-service-${service.id}`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-6 h-6 mr-2" />
                          추가됨
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 mr-2" />
                          {t.addService}
                        </>
                      )}
                    </Button>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {isConfirmStep && (
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
              <div className="text-center mb-6">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.confirm}</h1>
              </div>
              <Card>
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t.name}</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t.phone}</span>
                    <span className="font-medium">{phone}</span>
                  </div>
                  {email && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{t.email}</span>
                      <span className="font-medium">{email}</span>
                    </div>
                  )}
                  <div className="py-2 border-b">
                    <span className="text-gray-600 block mb-1">{t.selectDrink}</span>
                    <span className="font-medium text-sm">
                      {drinkOrders.length > 0 
                        ? drinkOrders.map(o => {
                            const drink = t.drinkOptions.find(d => d.id === o.id);
                            return `${drink?.icon} ${drink?.name} x${o.quantity}${o.temperature !== "none" ? ` (${o.temperature === "hot" ? t.hot : t.iced})` : ""}`;
                          }).join(", ")
                        : "-"
                      }
                    </span>
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="py-2 border-b">
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
                  <div className="flex justify-between py-3 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
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
              className="flex items-center gap-2 px-6 py-5 text-base"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.back}
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalSteps, 10) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step ? "bg-pink-500 w-6" : i < step ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {!isConfirmStep ? (
              <Button
                size="lg"
                onClick={() => paginate(1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-5 text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                data-testid="button-next"
              >
                {step >= 3 && step < 3 + t.services.length ? t.skip : t.next}
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={bookingMutation.isPending}
                className="flex items-center gap-2 px-6 py-5 text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                data-testid="button-submit"
              >
                {bookingMutation.isPending ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {t.selectComplete}
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

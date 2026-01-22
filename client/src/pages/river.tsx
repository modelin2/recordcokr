import { useState } from "react";
import { MapPin, Star, Loader2, Clock, Coffee, Mic, Sparkles, Music, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type Language = "ko" | "ja" | "zh" | "en";

const translations = {
  ja: {
    langLabel: "日本語",
    langFlag: "🇯🇵",
    hotelSubtitle: "リバーサイドホテルから徒歩30秒",
    heroTitle1: "K-POPアイドルと同じ",
    heroTitle2: "レコーディングスタジオ",
    heroTitle3: "で主人公になる",
    heroDesc: "歌が苦手でも大丈夫。最先端AIがプロ歌手のように仕上げます。",
    realExperience: "実際の",
    realExperienceHighlight: "レコーディング体験",
    realExperienceDesc: "お客様のレコーディング風景をご覧ください",
    feature1Title: "夢のような体験",
    feature1Desc: "リバーサイドホテルから徒歩30秒。K-POPアイドルと同じレコーディングスタジオで主人公になってみませんか？",
    feature2Title: "AIが完璧に補正",
    feature2Desc: "歌が苦手でも大丈夫です。最先端のAI技術がプロの歌手のように仕上げます。",
    feature3Title: "一生の資産に",
    feature3Desc: "ただの体験で終わりません。全世界で音源が配信され、著作権収入が入る一生の資産を作りましょう。",
    spaceTitle: "空間を",
    spaceTitleHighlight: "見る",
    reviewTitle: "お客様の",
    reviewTitleHighlight: "レビュー",
    klookRating: "Klook評価",
    klookDesc: "世界中の旅行者からの実際のレビューをご覧ください",
    featuresTitle: "Recording Caféの",
    featuresTitleHighlight: "特徴",
    cafeStudio: "カフェ & スタジオ",
    cafeStudioDesc: "カフェのようにリラックスしてドリンクを楽しみながらレコーディング体験",
    proStudio: "プロ仕様のスタジオ",
    proStudioDesc: "K-POPアーティストも使用する本格的なレコーディング機材",
    aiVoice: "AI音声補正技術",
    aiVoiceDesc: "歌に自信がなくてもプロ級の仕上がりを保証",
    worldDistribution: "世界配信&著作権",
    worldDistributionDesc: "Spotify、Apple Musicなど全世界で音源配信",
    accessTitle: "アクセス",
    accessTitleHighlight: "マップ",
    shinsaStation: "新沙駅",
    shinsaLine: "3号線(新盆唐線)",
    walk4min: "徒歩4分",
    riversideHotel: "リバーサイドホテル",
    mainGate: "正門",
    walk30sec: "徒歩30秒",
    recordingCafe: "Recording Café",
    hanriverTitle: "漢江まで",
    hanriverTitleHighlight: "徒歩10分",
    hanriverDesc: "Recording Caféから漢江高水敷までの道順をご確認ください",
    visitTitle: "訪問",
    visitTitleHighlight: "方法",
    visitDesc: "リバーサイドホテル正門から下方向に30秒歩いてください。左側に大能ビルが見えたら2階へお上がりください。",
    address: "2F, 21, Gangnam-daero 107-gil, Seocho-gu, Seoul",
    fromShinsa: "新沙駅3号線(新盆唐線)から徒歩4分",
    hours: "毎日 12:00 - 21:00",
    instantVisit: "即時訪問",
    instantVisitDesc: "予約なしでそのまま訪問可能です。待ち時間が発生する場合があります。",
    pricingTitle: "ご利用",
    pricingTitleHighlight: "料金",
    package: "パッケージ",
    person1: "1名",
    person2: "2名",
    person3: "3名",
    person4: "4名",
    drinkRecording: "ドリンク + レコーディング体験10分",
    hotDrinks: "ホットドリンク",
    coldDrinks: "コールドドリンク",
    coffee: "コーヒー",
    decaf: "デカフェコーヒー",
    greenTea: "緑茶",
    hibiscus: "ハイビスカス",
    earlGrey: "アールグレイ",
    peppermint: "ペパーミント",
    chamomile: "カモミール",
    hotChocolate: "ホットチョコレート",
    lemonade: "レモネード",
    strawberryAde: "いちごエード",
    orangeAde: "オレンジエード",
    grapefruitAde: "グレープフルーツエード",
    icedTea: "アイスティー",
    ctaTitle: "今日、",
    ctaTitleHighlight: "スターになる",
    ctaDesc: "リバーサイドホテルから徒歩30秒\nご滞在中にぜひお立ち寄りください",
    formTitle: "リバーサイドホテル",
    formTitleHighlight: "宿泊客専用予約",
    formDesc: "ホテル宿泊客は下のフォームにご記入いただくと、特別なボーナスをご提供します。",
    roomNumber: "お部屋番号",
    nickname: "ニックネーム",
    numPeople: "人数",
    visitDate: "訪問日",
    visitTime: "訪問時間",
    submitBtn: "訪問予約する",
    selectTime: "--:--",
    submitting: "予約中...",
    successTitle: "予約完了！",
    successDesc: "ご予約が正常に送信されました。",
    errorTitle: "エラー",
    formError: "入力エラー",
    formErrorDesc: "必須項目をすべて入力してください",
  },
  ko: {
    langLabel: "한국어",
    langFlag: "🇰🇷",
    hotelSubtitle: "리버사이드호텔에서 도보 30초",
    heroTitle1: "K-POP 아이돌과 같은",
    heroTitle2: "레코딩 스튜디오",
    heroTitle3: "에서 주인공이 되다",
    heroDesc: "노래를 못해도 괜찮아요. 최첨단 AI가 프로 가수처럼 만들어드려요.",
    realExperience: "실제",
    realExperienceHighlight: "레코딩 체험",
    realExperienceDesc: "고객님의 레코딩 현장을 확인하세요",
    feature1Title: "꿈같은 체험",
    feature1Desc: "리버사이드호텔에서 도보 30초. K-POP 아이돌과 같은 레코딩 스튜디오에서 주인공이 되어보세요.",
    feature2Title: "AI가 완벽하게 보정",
    feature2Desc: "노래를 못해도 괜찮습니다. 최첨단 AI 기술이 프로 가수처럼 만들어 드립니다.",
    feature3Title: "평생의 자산으로",
    feature3Desc: "단순한 체험으로 끝나지 않습니다. 전 세계에서 음원이 배포되고, 저작권 수입이 들어오는 평생의 자산을 만드세요.",
    spaceTitle: "공간을",
    spaceTitleHighlight: "보다",
    reviewTitle: "고객",
    reviewTitleHighlight: "리뷰",
    klookRating: "Klook 평점",
    klookDesc: "전 세계 여행자들의 실제 리뷰를 확인하세요",
    featuresTitle: "Recording Café의",
    featuresTitleHighlight: "특징",
    cafeStudio: "카페 & 스튜디오",
    cafeStudioDesc: "카페처럼 편하게 음료를 즐기며 레코딩 체험",
    proStudio: "프로 사양 스튜디오",
    proStudioDesc: "K-POP 아티스트도 사용하는 본격 레코딩 장비",
    aiVoice: "AI 음성 보정 기술",
    aiVoiceDesc: "노래에 자신이 없어도 프로급 완성도 보장",
    worldDistribution: "전 세계 배포 & 저작권",
    worldDistributionDesc: "Spotify, Apple Music 등 전 세계에서 음원 배포",
    accessTitle: "오시는",
    accessTitleHighlight: "길",
    shinsaStation: "신사역",
    shinsaLine: "3호선(신분당선)",
    walk4min: "도보 4분",
    riversideHotel: "리버사이드호텔",
    mainGate: "정문",
    walk30sec: "도보 30초",
    recordingCafe: "Recording Café",
    hanriverTitle: "한강까지",
    hanriverTitleHighlight: "도보 10분",
    hanriverDesc: "Recording Café에서 한강 고수부지까지 가는 길을 확인하세요",
    visitTitle: "방문",
    visitTitleHighlight: "방법",
    visitDesc: "리버사이드호텔 정문에서 아래 방향으로 30초 걸어주세요. 왼쪽에 대능빌딩이 보이면 2층으로 올라오세요.",
    address: "서울 서초구 강남대로107길 21, 2층",
    fromShinsa: "신사역 3호선(신분당선)에서 도보 4분",
    hours: "매일 12:00 - 21:00",
    instantVisit: "즉시 방문",
    instantVisitDesc: "예약 없이 바로 방문 가능합니다. 대기 시간이 발생할 수 있습니다.",
    pricingTitle: "이용",
    pricingTitleHighlight: "요금",
    package: "패키지",
    person1: "1명",
    person2: "2명",
    person3: "3명",
    person4: "4명",
    drinkRecording: "음료 + 레코딩 체험 10분",
    hotDrinks: "핫 드링크",
    coldDrinks: "콜드 드링크",
    coffee: "커피",
    decaf: "디카페인 커피",
    greenTea: "녹차",
    hibiscus: "히비스커스",
    earlGrey: "얼그레이",
    peppermint: "페퍼민트",
    chamomile: "카모마일",
    hotChocolate: "핫초코",
    lemonade: "레모네이드",
    strawberryAde: "딸기에이드",
    orangeAde: "오렌지에이드",
    grapefruitAde: "자몽에이드",
    icedTea: "아이스티",
    ctaTitle: "오늘,",
    ctaTitleHighlight: "스타가 되다",
    ctaDesc: "리버사이드호텔에서 도보 30초\n체류 중에 꼭 들러주세요",
    formTitle: "리버사이드호텔",
    formTitleHighlight: "투숙객 전용 예약",
    formDesc: "호텔 투숙객은 아래 양식을 작성하시면 특별 보너스를 제공해 드립니다.",
    roomNumber: "객실 번호",
    nickname: "닉네임",
    numPeople: "인원",
    visitDate: "방문 날짜",
    visitTime: "방문 시간",
    submitBtn: "방문 예약하기",
    selectTime: "--:--",
    submitting: "예약 중...",
    successTitle: "예약 완료!",
    successDesc: "예약이 성공적으로 접수되었습니다.",
    errorTitle: "오류",
    formError: "입력 오류",
    formErrorDesc: "필수 항목을 모두 입력해주세요",
  },
  zh: {
    langLabel: "中文",
    langFlag: "🇨🇳",
    hotelSubtitle: "距离Riverside酒店步行30秒",
    heroTitle1: "与K-POP偶像相同的",
    heroTitle2: "录音室",
    heroTitle3: "成为主角",
    heroDesc: "不擅长唱歌也没关系。最先进的AI会像专业歌手一样完成。",
    realExperience: "实际",
    realExperienceHighlight: "录音体验",
    realExperienceDesc: "请观看客户的录音场景",
    feature1Title: "梦幻般的体验",
    feature1Desc: "距离Riverside酒店步行30秒。在与K-POP偶像相同的录音室成为主角吧！",
    feature2Title: "AI完美修正",
    feature2Desc: "不擅长唱歌也没关系。最先进的AI技术会让您像专业歌手一样。",
    feature3Title: "成为终身资产",
    feature3Desc: "不仅仅是体验。在全球发布音源，获得终身版权收入。",
    spaceTitle: "查看",
    spaceTitleHighlight: "空间",
    reviewTitle: "客户",
    reviewTitleHighlight: "评价",
    klookRating: "Klook评分",
    klookDesc: "查看来自世界各地旅行者的真实评价",
    featuresTitle: "Recording Café的",
    featuresTitleHighlight: "特色",
    cafeStudio: "咖啡厅 & 录音室",
    cafeStudioDesc: "像在咖啡厅一样轻松享受饮品的同时进行录音体验",
    proStudio: "专业录音室",
    proStudioDesc: "K-POP艺人也使用的专业录音设备",
    aiVoice: "AI声音修正技术",
    aiVoiceDesc: "即使对唱歌没有信心也能保证专业水准",
    worldDistribution: "全球发布&版权",
    worldDistributionDesc: "Spotify、Apple Music等全球音源发布",
    accessTitle: "交通",
    accessTitleHighlight: "指南",
    shinsaStation: "新沙站",
    shinsaLine: "3号线(新盆唐线)",
    walk4min: "步行4分钟",
    riversideHotel: "Riverside酒店",
    mainGate: "正门",
    walk30sec: "步行30秒",
    recordingCafe: "Recording Café",
    hanriverTitle: "到汉江",
    hanriverTitleHighlight: "步行10分钟",
    hanriverDesc: "查看从Recording Café到汉江河滩的路线",
    visitTitle: "访问",
    visitTitleHighlight: "方法",
    visitDesc: "从Riverside酒店正门向下走30秒。看到左侧的大能大厦后上2楼。",
    address: "首尔瑞草区江南大路107街21号2楼",
    fromShinsa: "从新沙站3号线(新盆唐线)步行4分钟",
    hours: "每天 12:00 - 21:00",
    instantVisit: "即时访问",
    instantVisitDesc: "无需预约即可直接访问。可能会有等待时间。",
    pricingTitle: "使用",
    pricingTitleHighlight: "费用",
    package: "套餐",
    person1: "1人",
    person2: "2人",
    person3: "3人",
    person4: "4人",
    drinkRecording: "饮品 + 10分钟录音体验",
    hotDrinks: "热饮",
    coldDrinks: "冷饮",
    coffee: "咖啡",
    decaf: "低因咖啡",
    greenTea: "绿茶",
    hibiscus: "洛神花茶",
    earlGrey: "伯爵茶",
    peppermint: "薄荷茶",
    chamomile: "洋甘菊",
    hotChocolate: "热巧克力",
    lemonade: "柠檬水",
    strawberryAde: "草莓气泡水",
    orangeAde: "橙子气泡水",
    grapefruitAde: "西柚气泡水",
    icedTea: "冰茶",
    ctaTitle: "今天，",
    ctaTitleHighlight: "成为明星",
    ctaDesc: "距离Riverside酒店步行30秒\n入住期间一定要来看看",
    formTitle: "Riverside酒店",
    formTitleHighlight: "住客专用预约",
    formDesc: "酒店住客填写以下表格将获得特别奖励。",
    roomNumber: "房间号",
    nickname: "昵称",
    numPeople: "人数",
    visitDate: "访问日期",
    visitTime: "访问时间",
    submitBtn: "预约访问",
    selectTime: "--:--",
    submitting: "预约中...",
    successTitle: "预约完成！",
    successDesc: "您的预约已成功提交。",
    errorTitle: "错误",
    formError: "输入错误",
    formErrorDesc: "请填写所有必填项",
  },
  en: {
    langLabel: "English",
    langFlag: "🇺🇸",
    hotelSubtitle: "30 seconds walk from Riverside Hotel",
    heroTitle1: "Same as K-POP idols",
    heroTitle2: "Recording Studio",
    heroTitle3: "Become the star",
    heroDesc: "Even if you can't sing well, AI will make you sound like a pro.",
    realExperience: "Real",
    realExperienceHighlight: "Recording Experience",
    realExperienceDesc: "Watch our customers' recording sessions",
    feature1Title: "Dream-like Experience",
    feature1Desc: "30 seconds from Riverside Hotel. Become the star in the same recording studio as K-POP idols!",
    feature2Title: "AI Perfects Everything",
    feature2Desc: "Even if you can't sing well, cutting-edge AI technology will make you sound like a pro.",
    feature3Title: "Lifetime Asset",
    feature3Desc: "More than just an experience. Create a lifetime asset with worldwide music distribution and royalty income.",
    spaceTitle: "View",
    spaceTitleHighlight: "Space",
    reviewTitle: "Customer",
    reviewTitleHighlight: "Reviews",
    klookRating: "Klook Rating",
    klookDesc: "See real reviews from travelers around the world",
    featuresTitle: "Recording Café",
    featuresTitleHighlight: "Features",
    cafeStudio: "Cafe & Studio",
    cafeStudioDesc: "Enjoy drinks while recording in a relaxing cafe atmosphere",
    proStudio: "Pro Studio",
    proStudioDesc: "Professional recording equipment used by K-POP artists",
    aiVoice: "AI Voice Correction",
    aiVoiceDesc: "Professional quality guaranteed even if you're not confident in singing",
    worldDistribution: "Global Distribution & Copyright",
    worldDistributionDesc: "Music distributed worldwide on Spotify, Apple Music, etc.",
    accessTitle: "Access",
    accessTitleHighlight: "Map",
    shinsaStation: "Sinsa Station",
    shinsaLine: "Line 3 (Shinbundang)",
    walk4min: "4 min walk",
    riversideHotel: "Riverside Hotel",
    mainGate: "Main Gate",
    walk30sec: "30 sec walk",
    recordingCafe: "Recording Café",
    hanriverTitle: "To Han River",
    hanriverTitleHighlight: "10 min walk",
    hanriverDesc: "Check the route from Recording Café to Han River Park",
    visitTitle: "How to",
    visitTitleHighlight: "Visit",
    visitDesc: "Walk down 30 seconds from Riverside Hotel main gate. Go up to 2nd floor when you see Daeneung Building on your left.",
    address: "2F, 21, Gangnam-daero 107-gil, Seocho-gu, Seoul",
    fromShinsa: "4 min walk from Sinsa Station Line 3",
    hours: "Daily 12:00 - 21:00",
    instantVisit: "Walk-in Welcome",
    instantVisitDesc: "No reservation needed. Wait times may apply.",
    pricingTitle: "Pricing",
    pricingTitleHighlight: "Info",
    package: "Package",
    person1: "1 Person",
    person2: "2 People",
    person3: "3 People",
    person4: "4 People",
    drinkRecording: "Drink + 10 min Recording",
    hotDrinks: "Hot Drinks",
    coldDrinks: "Cold Drinks",
    coffee: "Coffee",
    decaf: "Decaf Coffee",
    greenTea: "Green Tea",
    hibiscus: "Hibiscus",
    earlGrey: "Earl Grey",
    peppermint: "Peppermint",
    chamomile: "Chamomile",
    hotChocolate: "Hot Chocolate",
    lemonade: "Lemonade",
    strawberryAde: "Strawberry Ade",
    orangeAde: "Orange Ade",
    grapefruitAde: "Grapefruit Ade",
    icedTea: "Iced Tea",
    ctaTitle: "Today,",
    ctaTitleHighlight: "Become a Star",
    ctaDesc: "30 seconds from Riverside Hotel\nDon't miss it during your stay",
    formTitle: "Riverside Hotel",
    formTitleHighlight: "Guest Reservation",
    formDesc: "Hotel guests who fill out this form will receive special bonuses.",
    roomNumber: "Room Number",
    nickname: "Nickname",
    numPeople: "Number of People",
    visitDate: "Visit Date",
    visitTime: "Visit Time",
    submitBtn: "Book Visit",
    selectTime: "--:--",
    submitting: "Booking...",
    successTitle: "Reservation Complete!",
    successDesc: "Your reservation has been successfully submitted.",
    errorTitle: "Error",
    formError: "Input Error",
    formErrorDesc: "Please fill in all required fields",
  },
};

const GALLERY_IMAGES = [
  "https://recordingcafe.com/assets/recordingcafe_(2)_1768193796781-CiKs2y1L.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%9D%BC%EC%9A%B4%EC%A7%80_1768188070631-DX_IqNec.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%9D%BC%EC%9A%B4%EC%A7%805_1768188070631-mIqEzshk.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98%20%EB%9D%BC%EC%9A%B4%EC%A7%806_1763518051360-BVo-dmns.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%B6%80%EC%8A%A4_(2)_1768188070632-BDJX9ePe.png",
];

const REVIEW_IMAGES = [
  "https://recordingcafe.com/assets/Screenshot_20251111_171617_Chrome_1768192361919-Q6z0Q411.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171635_Chrome_1768192361919-4WSvcGbK.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171655_Chrome_1768192361920-DTKNsWi7.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171715_Chrome_1768192361920-Ddvd8h6h.jpg",
];

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

export default function RiverPage() {
  const [language, setLanguage] = useState<Language>("ja");
  const [roomNumber, setRoomNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [numPeople, setNumPeople] = useState("1");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const t = translations[language];

  const handleSubmit = async () => {
    if (!nickname || !visitDate || !visitTime) {
      toast({
        title: t.formError || "Error",
        description: t.formErrorDesc || "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/hotel-bookings", {
        hotelSource: "riverside",
        roomNumber: roomNumber || undefined,
        guestName: nickname,
        numberOfPeople: parseInt(numPeople),
        visitDate,
        visitTime,
      });

      toast({
        title: t.successTitle || "Reservation Complete!",
        description: t.successDesc || "Your reservation has been submitted successfully.",
      });

      setRoomNumber("");
      setNickname("");
      setNumPeople("1");
      setVisitDate("");
      setVisitTime("");
    } catch (error: any) {
      toast({
        title: t.errorTitle || "Error",
        description: error.message || "Failed to submit reservation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Language Selector */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm py-3 px-4 overflow-x-auto">
        <div className="flex gap-2 justify-center min-w-max">
          {(["ko", "ja", "zh", "en"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                language === lang
                  ? "bg-[#d4a853] text-black"
                  : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
              }`}
            >
              <span>{translations[lang].langFlag}</span>
              <span>{translations[lang].langLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative w-full aspect-[4/5] md:aspect-video overflow-hidden">
          <img
            src="https://recordingcafe.com/assets/recordingcafe_(2)_1768193796781-CiKs2y1L.png"
            alt="Recording Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-300 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{t.hotelSubtitle}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
            {t.heroTitle1}<br />
            <span className="text-[#d4a853]">{t.heroTitle2}</span><br />
            {t.heroTitle3}
          </h1>
          <p className="text-gray-300 text-sm md:text-base">{t.heroDesc}</p>
        </div>
      </section>

      {/* Real Experience Section */}
      <section className="py-12 px-4 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t.realExperience} <span className="text-[#d4a853]">{t.realExperienceHighlight}</span>
          </h2>
          <p className="text-gray-600 mb-6 text-sm">{t.realExperienceDesc}</p>
          <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/sGMcHrmCmDU"
              title="Recording Experience"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Feature Cards - Dark Style with Gold Icons */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#3d3d2a] rounded-full flex items-center justify-center">
              <Star className="w-7 h-7 text-[#d4a853]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.feature1Title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.feature1Desc}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#3d3d2a] rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#d4a853]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.feature2Title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.feature2Desc}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#3d3d2a] rounded-full flex items-center justify-center">
              <Music className="w-7 h-7 text-[#d4a853]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.feature3Title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.feature3Desc}</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 px-4 bg-black">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t.spaceTitle} <span className="text-[#d4a853]">{t.spaceTitleHighlight}</span>
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2">
            <img src={GALLERY_IMAGES[0]} alt="Gallery main" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GALLERY_IMAGES.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                <img src={img} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t.reviewTitle} <span className="text-[#d4a853]">{t.reviewTitleHighlight}</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-[#d4a853] text-[#d4a853]" />
            ))}
            <span className="text-2xl font-bold ml-2">5.0</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">{t.klookRating}</p>
          <p className="text-gray-500 text-sm mb-8">{t.klookDesc}</p>
          <div className="grid grid-cols-2 gap-2">
            {REVIEW_IMAGES.map((img, idx) => (
              <div key={idx} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                <img src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-black">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t.featuresTitle} <span className="text-[#d4a853]">{t.featuresTitleHighlight}</span>
        </h2>
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-[#1a1a1a] rounded-xl p-5 flex items-start gap-4">
            <Coffee className="w-8 h-8 text-[#d4a853] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-1">{t.cafeStudio}</h3>
              <p className="text-gray-400 text-sm">{t.cafeStudioDesc}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-5 flex items-start gap-4">
            <Mic className="w-8 h-8 text-[#d4a853] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-1">{t.proStudio}</h3>
              <p className="text-gray-400 text-sm">{t.proStudioDesc}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-5 flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-[#d4a853] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-1">{t.aiVoice}</h3>
              <p className="text-gray-400 text-sm">{t.aiVoiceDesc}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-5 flex items-start gap-4">
            <Music className="w-8 h-8 text-[#d4a853] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-1">{t.worldDistribution}</h3>
              <p className="text-gray-400 text-sm">{t.worldDistributionDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Map Section */}
      <section className="py-12 px-4 bg-black">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t.accessTitle} <span className="text-[#d4a853]">{t.accessTitleHighlight}</span>
        </h2>
        <div className="max-w-sm mx-auto bg-[#1a1a1a] rounded-2xl p-8">
          <div className="flex flex-col items-center">
            {/* Sinsa Station */}
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold mt-3 text-white">{t.shinsaStation}</h3>
            <p className="text-gray-400 text-sm">{t.shinsaLine}</p>
            
            <div className="w-0.5 h-8 bg-gradient-to-b from-orange-500 to-blue-500 my-2" />
            <p className="text-gray-400 text-sm mb-2">{t.walk4min}</p>
            
            {/* Riverside Hotel */}
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM19 7h-8v7H3V5H1v15h2v-3h18v3h2V11c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z"/>
              </svg>
            </div>
            <h3 className="font-bold mt-3 text-white">{t.riversideHotel}</h3>
            <p className="text-gray-400 text-sm">{t.mainGate}</p>
            
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-[#d4a853] my-2" />
            <p className="text-gray-400 text-sm mb-2">{t.walk30sec}</p>
            
            {/* Recording Cafe */}
            <div className="w-14 h-14 bg-[#d4a853] rounded-full flex items-center justify-center">
              <Mic className="w-7 h-7 text-black" />
            </div>
            <h3 className="font-bold mt-3 text-[#d4a853]">{t.recordingCafe}</h3>
          </div>
        </div>
      </section>

      {/* Han River Section */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t.hanriverTitle} <span className="text-[#d4a853]">{t.hanriverTitleHighlight}</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">{t.hanriverDesc}</p>
          <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/IQPfZJLXm8k"
              title="Han River Walking Route"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Visit Method Section */}
      <section className="py-12 px-4 bg-[#d4a853]">
        <div className="max-w-4xl mx-auto text-center text-black">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t.visitTitle} <span className="text-black/70">{t.visitTitleHighlight}</span>
          </h2>
          <p className="text-black/80 text-sm mb-6 max-w-md mx-auto">{t.visitDesc}</p>
          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6">
            <img
              src="https://recordingcafe.com/assets/%EC%B6%9C%EC%9E%85%EA%B5%AC%EC%97%AC%EC%84%B1%EB%AA%A8%EB%8D%B8_1768188070634-DhXiV-jT.png"
              alt="Recording Cafe Entrance"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-black/80">
            <MapPin className="w-5 h-5" />
            <p className="text-sm">{t.address}</p>
          </div>
        </div>
      </section>

      {/* Hours & Instant Visit */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Navigation className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300 text-sm">{t.fromShinsa}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300 text-sm">{t.hours}</p>
          </div>
          <div className="bg-gradient-to-br from-[#4a3a1a] to-[#2a2010] rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#d4a853]/20 rounded-full flex items-center justify-center">
              <Navigation className="w-6 h-6 text-[#d4a853]" />
            </div>
            <h3 className="font-bold text-white mb-2">{t.instantVisit}</h3>
            <p className="text-gray-400 text-sm">{t.instantVisitDesc}</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-4 bg-black">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          {t.pricingTitle} <span className="text-[#d4a853]">{t.pricingTitleHighlight}</span>
        </h2>
        <p className="text-[#d4a853] text-center mb-8">{t.package}</p>
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          {[
            { label: t.person1, price: "₩30,000" },
            { label: t.person2, price: "₩40,000" },
            { label: t.person3, price: "₩50,000" },
            { label: t.person4, price: "₩60,000" },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1a1a1a] rounded-xl p-5 text-center">
              <p className="text-2xl font-bold text-[#d4a853] mb-2">{item.label}</p>
              <p className="text-gray-400 text-xs mb-3">{t.drinkRecording}</p>
              <p className="text-xl font-bold text-white">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Drink Menu */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-5 h-5 text-[#d4a853]" />
              <h3 className="font-bold text-[#d4a853]">{t.hotDrinks}</h3>
            </div>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>{t.coffee}</p>
              <p>{t.decaf}</p>
              <p>{t.greenTea}</p>
              <p>{t.hibiscus}</p>
              <p>{t.earlGrey}</p>
              <p>{t.peppermint}</p>
              <p>{t.chamomile}</p>
              <p>{t.hotChocolate}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-5 h-5 text-[#d4a853]" />
              <h3 className="font-bold text-[#d4a853]">{t.coldDrinks}</h3>
            </div>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>{t.coffee}</p>
              <p>{t.decaf}</p>
              <p>{t.lemonade}</p>
              <p>{t.strawberryAde}</p>
              <p>{t.orangeAde}</p>
              <p>{t.grapefruitAde}</p>
              <p>{t.icedTea}</p>
              <p>{t.greenTea}</p>
              <p>{t.hibiscus}</p>
              <p>{t.earlGrey}</p>
              <p>{t.peppermint}</p>
              <p>{t.chamomile}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-[#4a3a1a] to-[#2a2010] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t.ctaTitle} <span className="text-[#d4a853]">{t.ctaTitleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm whitespace-pre-line">{t.ctaDesc}</p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">
            {t.formTitle} <span className="text-[#d4a853]">{t.formTitleHighlight}</span>
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">{t.formDesc}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t.roomNumber}</label>
              <Input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="301"
                className="bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t.nickname} *</label>
              <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your name"
                className="bg-[#2a2a2a] border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t.numPeople}</label>
              <Select value={numPeople} onValueChange={setNumPeople}>
                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t.visitDate} *</label>
              <Input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="bg-[#2a2a2a] border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t.visitTime} *</label>
              <Select value={visitTime} onValueChange={setVisitTime}>
                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                  <SelectValue placeholder={t.selectTime} />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#d4a853] hover:bg-[#c49943] text-black font-bold py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submitBtn
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#0a0a0a] text-center">
        <p className="text-gray-500 text-sm">© 2026 Recording Café. All rights reserved.</p>
      </footer>
    </div>
  );
}

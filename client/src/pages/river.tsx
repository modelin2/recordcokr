import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Train, Building, Coffee, Mic, Sparkles, Globe, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type Language = "ko" | "ja" | "zh" | "en";

const translations = {
  ja: {
    langLabel: "🇯🇵 日本語",
    hotelSubtitle: "リバーサイドホテルから徒歩30秒",
    heroTitle: "K-POPのレコーディングスタジオで",
    heroTitle2: "アイドル体験",
    heroTitle3: "",
    heroDesc: "歌が苦手でもAIがプロのように補正！",
    heroDesc2: "全世界で音源発売 ＋ 一生の著作権収益",
    realExperience: "実際のレコーディング体験",
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
    daeneungBldg: "大能ビル 2F",
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
    ctaTitle: "今日、スターになる",
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
    langLabel: "🇰🇷 한국어",
    hotelSubtitle: "리버사이드호텔에서 도보 30초",
    heroTitle: "K-POP 레코딩 스튜디오에서",
    heroTitle2: "아이돌 체험",
    heroTitle3: "",
    heroDesc: "노래를 못해도 AI가 프로처럼 보정!",
    heroDesc2: "전 세계 음원 발매 + 평생 저작권 수익",
    realExperience: "실제 레코딩 체험",
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
    daeneungBldg: "대능빌딩 2F",
    hanriverTitle: "한강까지",
    hanriverTitleHighlight: "도보 10분",
    hanriverDesc: "Recording Café에서 한강 고수부지까지 가는 길을 확인하세요",
    visitTitle: "방문",
    visitTitleHighlight: "방법",
    visitDesc: "리버사이드호텔 정문에서 아래 방향으로 30초 걸어오세요. 왼쪽에 대능빌딩이 보이면 2층으로 올라오세요.",
    address: "서울 서초구 강남대로107길 21, 2F",
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
    hotDrinks: "핫 음료",
    coldDrinks: "콜드 음료",
    coffee: "커피",
    decaf: "디카페인 커피",
    greenTea: "녹차",
    hibiscus: "히비스커스",
    earlGrey: "얼그레이",
    peppermint: "페퍼민트",
    chamomile: "캐모마일",
    hotChocolate: "핫초코",
    lemonade: "레몬에이드",
    strawberryAde: "딸기에이드",
    orangeAde: "오렌지에이드",
    grapefruitAde: "자몽에이드",
    icedTea: "아이스티",
    ctaTitle: "오늘, 스타가 되다",
    ctaDesc: "리버사이드호텔에서 도보 30초\n숙박 중 꼭 들러보세요",
    formTitle: "리버사이드호텔",
    formTitleHighlight: "숙박객 전용 예약",
    formDesc: "호텔 숙박객은 아래 폼을 작성하시면 특별 보너스를 제공해 드립니다.",
    roomNumber: "객실 번호",
    nickname: "닉네임",
    numPeople: "인원",
    visitDate: "방문일",
    visitTime: "방문 시간",
    submitBtn: "방문 예약하기",
    selectTime: "--:--",
    submitting: "예약 중...",
    successTitle: "예약 완료!",
    successDesc: "예약이 성공적으로 제출되었습니다.",
    errorTitle: "오류",
    formError: "입력 오류",
    formErrorDesc: "필수 항목을 모두 입력해주세요",
  },
  zh: {
    langLabel: "🇨🇳 中文",
    hotelSubtitle: "从江畔酒店步行30秒",
    heroTitle: "在K-POP录音棚",
    heroTitle2: "偶像体验",
    heroTitle3: "",
    heroDesc: "即使唱歌不好，AI也能像专业歌手一样修音！",
    heroDesc2: "全球音源发行 + 终身版权收益",
    realExperience: "实际录音体验",
    realExperienceDesc: "请观看顾客的录音现场",
    feature1Title: "梦幻般的体验",
    feature1Desc: "从江畔酒店步行30秒。在与K-POP偶像相同的录音棚里成为主角吧？",
    feature2Title: "AI完美修音",
    feature2Desc: "即使唱歌不好也没关系。最先进的AI技术会让您像专业歌手一样。",
    feature3Title: "成为终身资产",
    feature3Desc: "不仅仅是一次体验。在全世界发行音源，获得版权收入，创造终身资产。",
    spaceTitle: "查看",
    spaceTitleHighlight: "空间",
    reviewTitle: "顾客",
    reviewTitleHighlight: "评价",
    klookRating: "Klook评分",
    klookDesc: "查看来自世界各地旅行者的真实评价",
    featuresTitle: "Recording Café的",
    featuresTitleHighlight: "特点",
    cafeStudio: "咖啡厅 & 录音棚",
    cafeStudioDesc: "像在咖啡厅一样放松地享用饮料，同时体验录音",
    proStudio: "专业级录音棚",
    proStudioDesc: "K-POP艺人也使用的专业录音设备",
    aiVoice: "AI语音修正技术",
    aiVoiceDesc: "即使对唱歌没有自信也能保证专业级的完成度",
    worldDistribution: "全球发行&版权",
    worldDistributionDesc: "在Spotify、Apple Music等全球平台发行音源",
    accessTitle: "交通",
    accessTitleHighlight: "地图",
    shinsaStation: "新沙站",
    shinsaLine: "3号线(新盆唐线)",
    walk4min: "步行4分钟",
    riversideHotel: "江畔酒店",
    mainGate: "正门",
    walk30sec: "步行30秒",
    recordingCafe: "Recording Café",
    daeneungBldg: "大能大厦 2F",
    hanriverTitle: "到汉江",
    hanriverTitleHighlight: "步行10分钟",
    hanriverDesc: "请确认从Recording Café到汉江高水敷的路线",
    visitTitle: "访问",
    visitTitleHighlight: "方法",
    visitDesc: "从江畔酒店正门向下走30秒。看到左边的大能大厦后上2楼。",
    address: "首尔市瑞草区江南大路107街21号 2F",
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
    drinkRecording: "饮料 + 10分钟录音体验",
    hotDrinks: "热饮",
    coldDrinks: "冷饮",
    coffee: "咖啡",
    decaf: "低咖啡因咖啡",
    greenTea: "绿茶",
    hibiscus: "芙蓉花茶",
    earlGrey: "伯爵茶",
    peppermint: "薄荷茶",
    chamomile: "洋甘菊茶",
    hotChocolate: "热巧克力",
    lemonade: "柠檬水",
    strawberryAde: "草莓汽水",
    orangeAde: "橙子汽水",
    grapefruitAde: "葡萄柚汽水",
    icedTea: "冰茶",
    ctaTitle: "今天，成为明星",
    ctaDesc: "从江畔酒店步行30秒\n入住期间请务必光临",
    formTitle: "江畔酒店",
    formTitleHighlight: "住客专用预约",
    formDesc: "酒店住客填写下方表格后，将提供特别礼遇。",
    roomNumber: "房间号",
    nickname: "昵称",
    numPeople: "人数",
    visitDate: "访问日期",
    visitTime: "访问时间",
    submitBtn: "预约访问",
    selectTime: "--:--",
    submitting: "预约中...",
    successTitle: "预约成功！",
    successDesc: "您的预约已成功提交。",
    errorTitle: "错误",
    formError: "输入错误",
    formErrorDesc: "请填写所有必填项",
  },
  en: {
    langLabel: "🇺🇸 English",
    hotelSubtitle: "30 seconds walk from Riverside Hotel",
    heroTitle: "K-POP Recording Studio",
    heroTitle2: "Idol Experience",
    heroTitle3: "",
    heroDesc: "Even if you can't sing, AI corrects like a pro!",
    heroDesc2: "Global music release + Lifetime royalties",
    realExperience: "Actual Recording Experience",
    realExperienceDesc: "Watch our customers' recording sessions",
    feature1Title: "A Dream Experience",
    feature1Desc: "30 seconds from Riverside Hotel. Become the star in the same recording studio as K-POP idols.",
    feature2Title: "AI Perfects Your Voice",
    feature2Desc: "Even if you can't sing well, it's okay. Advanced AI technology will make you sound like a pro.",
    feature3Title: "A Lifetime Asset",
    feature3Desc: "It doesn't end with just an experience. Create a lifetime asset with worldwide music distribution and royalty income.",
    spaceTitle: "View the",
    spaceTitleHighlight: "Space",
    reviewTitle: "Customer",
    reviewTitleHighlight: "Reviews",
    klookRating: "Klook Rating",
    klookDesc: "See real reviews from travelers around the world",
    featuresTitle: "Recording Café",
    featuresTitleHighlight: "Features",
    cafeStudio: "Café & Studio",
    cafeStudioDesc: "Relax and enjoy drinks while experiencing recording like at a café",
    proStudio: "Professional Studio",
    proStudioDesc: "Professional recording equipment also used by K-POP artists",
    aiVoice: "AI Voice Correction",
    aiVoiceDesc: "Guaranteed professional quality even if you're not confident in singing",
    worldDistribution: "Global Distribution & Royalties",
    worldDistributionDesc: "Music distributed worldwide on Spotify, Apple Music, etc.",
    accessTitle: "Access",
    accessTitleHighlight: "Map",
    shinsaStation: "Sinsa Station",
    shinsaLine: "Line 3 (Shinbundang Line)",
    walk4min: "4 min walk",
    riversideHotel: "Riverside Hotel",
    mainGate: "Main Gate",
    walk30sec: "30 sec walk",
    recordingCafe: "Recording Café",
    daeneungBldg: "Daeneung Bldg 2F",
    hanriverTitle: "To Han River",
    hanriverTitleHighlight: "10 min walk",
    hanriverDesc: "Check the route from Recording Café to Han River",
    visitTitle: "How to",
    visitTitleHighlight: "Visit",
    visitDesc: "Walk 30 seconds downward from Riverside Hotel main gate. When you see Daeneung Building on the left, go up to the 2nd floor.",
    address: "2F, 21, Gangnam-daero 107-gil, Seocho-gu, Seoul",
    fromShinsa: "4 min walk from Sinsa Station Line 3 (Shinbundang Line)",
    hours: "Daily 12:00 - 21:00",
    instantVisit: "Walk-in Welcome",
    instantVisitDesc: "You can visit without reservation. Wait time may occur.",
    pricingTitle: "Pricing",
    pricingTitleHighlight: "Plan",
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
    ctaTitle: "Become a Star Today",
    ctaDesc: "30 seconds from Riverside Hotel\nDon't miss it during your stay",
    formTitle: "Riverside Hotel",
    formTitleHighlight: "Guest Exclusive Booking",
    formDesc: "Hotel guests who fill out the form below will receive a special bonus.",
    roomNumber: "Room Number",
    nickname: "Nickname",
    numPeople: "Number of People",
    visitDate: "Visit Date",
    visitTime: "Visit Time",
    submitBtn: "Book Visit",
    selectTime: "--:--",
    submitting: "Submitting...",
    successTitle: "Reservation Complete!",
    successDesc: "Your reservation has been submitted successfully.",
    errorTitle: "Error",
    formError: "Input Error",
    formErrorDesc: "Please fill in all required fields",
  },
};

const GALLERY_IMAGES = [
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98%EC%BB%A4%ED%94%8C_1763517988473-RT2IBYdJ.jpg",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%85%B9%EC%9D%8C%EB%B6%80%EC%8A%A4_1768188070630-BjcyLYYV.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9_1763518051359-B7IW5riZ.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%9D%BC%EC%9A%B4%EC%A7%80_1768188070631-DX_IqNec.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%9D%BC%EC%9A%B4%EC%A7%805_1768188070631-mIqEzshk.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98%20%EB%9D%BC%EC%9A%B4%EC%A7%806_1763518051360-BVo-dmns.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%B6%80%EC%8A%A4_(2)_1768188070632-BDJX9ePe.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%B6%80%EC%8A%A4_(3)_1768188070632-BH_mLgrW.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%B6%80%EC%8A%A4_(4)_1768188070633-C_7e-l-W.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EB%B6%80%EC%8A%A4_1768188070633-BgjB4HnG.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EC%97%AC%ED%96%89%EA%B0%80%EB%B0%A9%EB%B3%B4%EA%B4%80%EC%9E%A5%EC%86%8C_1768188070633-eEbv22Qg.png",
  "https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EC%BB%A8%ED%8A%B8%EB%A1%A4%EB%A3%B8_1768188070634-CLECM5p7.png",
];

const REVIEW_IMAGES = [
  "https://recordingcafe.com/assets/Screenshot_20251111_171617_Chrome_1768192361919-Q6z0Q411.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171635_Chrome_1768192361919-4WSvcGbK.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171655_Chrome_1768192361920-DTKNsWi7.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171715_Chrome_1768192361920-Ddvd8h6h.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171728_Chrome_1768192361921-CRy6KRUH.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171738_Chrome_1768192361921-M9x3jaBD.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171748_Chrome_1768192361922-CkWQr_Av.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171756_Chrome_1768192361922-D8nR0EVv.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171805_Chrome_1768192361923-BkT2tB3a.jpg",
  "https://recordingcafe.com/assets/Screenshot_20251111_171818_Chrome_1768192361924-B-KXp1tp.jpg",
];

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

export default function RiverPage() {
  const [language, setLanguage] = useState<Language>("ja");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [roomNumber, setRoomNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [numPeople, setNumPeople] = useState("1");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const t = translations[language];

  const nextGallery = () => setGalleryIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  const prevGallery = () => setGalleryIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const nextReview = () => setReviewIndex((prev) => (prev + 1) % REVIEW_IMAGES.length);
  const prevReview = () => setReviewIndex((prev) => (prev - 1 + REVIEW_IMAGES.length) % REVIEW_IMAGES.length);

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

      // Reset form
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
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {(["ko", "ja", "zh", "en"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              language === lang
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {translations[lang].langLabel}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 py-8 bg-[#1a1a2e]">
        {/* Hero Image Placeholder - will be replaced with actual image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e]/90 to-[#1a1a2e]" />
        </div>
        
        {/* Top Content */}
        <div className="relative z-10 text-center pt-16">
          <p className="text-pink-400 text-base mb-4">{t.hotelSubtitle}</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            {t.heroTitle}<br />
            <span className="text-white">{t.heroTitle2}</span>
          </h1>
        </div>

        {/* Center - Hero Image */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-8">
          <img
            src="https://recordingcafe.com/assets/recordingcafe_(2)_1768193796781-CiKs2y1L.png"
            alt="Recording Studio"
            className="w-full max-w-2xl object-contain"
          />
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 text-center pb-8">
          <p className="text-white text-lg md:text-xl font-medium mb-2">{t.heroDesc}</p>
          <p className="text-pink-400 text-base md:text-lg">{t.heroDesc2}</p>
        </div>
      </section>

      {/* Real Experience Video Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.realExperience}</h2>
          <p className="text-gray-400 mb-8">{t.realExperienceDesc}</p>
          <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden">
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

      {/* 3 Features */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <h3 className="text-xl font-bold mb-3 text-white">{t.feature1Title}</h3>
              <p className="text-gray-400">{t.feature1Desc}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Mic className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-3 text-white">{t.feature2Title}</h3>
              <p className="text-gray-400">{t.feature2Desc}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-3 text-white">{t.feature3Title}</h3>
              <p className="text-gray-400">{t.feature3Desc}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.spaceTitle} <span className="text-pink-400">{t.spaceTitleHighlight}</span>
          </h2>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl aspect-video">
              <img
                src={GALLERY_IMAGES[galleryIndex]}
                alt={`Gallery ${galleryIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={prevGallery}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextGallery}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="flex justify-center mt-4 gap-2">
              {GALLERY_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setGalleryIndex(idx)}
                  className={`w-2 h-2 rounded-full ${idx === galleryIndex ? "bg-pink-400" : "bg-gray-600"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t.reviewTitle} <span className="text-pink-400">{t.reviewTitleHighlight}</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <span className="text-3xl font-bold">5.0</span>
            </div>
            <span className="text-gray-400">{t.klookRating}</span>
          </div>
          <p className="text-center text-gray-400 mb-8">{t.klookDesc}</p>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={REVIEW_IMAGES[reviewIndex]}
                alt={`Review ${reviewIndex + 1}`}
                className="w-full object-contain max-h-[500px] mx-auto"
              />
            </div>
            <button
              onClick={prevReview}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.featuresTitle} <span className="text-pink-400">{t.featuresTitleHighlight}</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <Coffee className="w-10 h-10 text-pink-400 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white">{t.cafeStudio}</h3>
                <p className="text-gray-400 text-sm">{t.cafeStudioDesc}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <Mic className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white">{t.proStudio}</h3>
                <p className="text-gray-400 text-sm">{t.proStudioDesc}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <Sparkles className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white">{t.aiVoice}</h3>
                <p className="text-gray-400 text-sm">{t.aiVoiceDesc}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <Globe className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white">{t.worldDistribution}</h3>
                <p className="text-gray-400 text-sm">{t.worldDistributionDesc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Map */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.accessTitle} <span className="text-pink-400">{t.accessTitleHighlight}</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg">{t.shinsaStation}</h3>
              <p className="text-gray-400 text-sm">{t.shinsaLine}</p>
              <p className="text-pink-400 mt-2">{t.walk4min}</p>
            </div>
            <div className="hidden md:block text-4xl text-gray-600">→</div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg">{t.riversideHotel}</h3>
              <p className="text-gray-400 text-sm">{t.mainGate}</p>
              <p className="text-pink-400 mt-2">{t.walk30sec}</p>
            </div>
            <div className="hidden md:block text-4xl text-gray-600">→</div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="font-bold text-lg">{t.recordingCafe}</h3>
              <p className="text-gray-400 text-sm">{t.daeneungBldg}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recording Studio Video */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/YzdkeQidBbo"
              title="Recording Studio Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Han River Video */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.hanriverTitle} <span className="text-pink-400">{t.hanriverTitleHighlight}</span>
          </h2>
          <p className="text-gray-400 mb-8">{t.hanriverDesc}</p>
          <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/FzBqrwM5nvk"
              title="Han River Walk"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Visit Method */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.visitTitle} <span className="text-pink-400">{t.visitTitleHighlight}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center">
              <img
                src="https://recordingcafe.com/assets/%EB%A0%88%EC%BD%94%EB%94%A9%EC%B9%B4%ED%8E%98_%EA%B1%B4%EB%AC%BC%EC%9E%85%EA%B5%AC4_1768190998588-f6UJ9S7H.png"
                alt="Building Entrance"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg">{t.visitDesc}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-gray-300">{t.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Train className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-gray-300">{t.fromShinsa}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-gray-300">{t.hours}</span>
                </div>
              </div>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <h4 className="font-bold text-blue-400 mb-2">{t.instantVisit}</h4>
                  <p className="text-gray-400 text-sm">{t.instantVisitDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.pricingTitle} <span className="text-pink-400">{t.pricingTitleHighlight}</span>
          </h2>
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center">{t.package}</h3>
              <div className="space-y-4">
                {[
                  { label: t.person1, price: "₩30,000" },
                  { label: t.person2, price: "₩40,000" },
                  { label: t.person3, price: "₩50,000" },
                  { label: t.person4, price: "₩60,000" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
                    <div>
                      <span className="font-bold text-lg">{item.label}</span>
                      <p className="text-gray-400 text-sm">{t.drinkRecording}</p>
                    </div>
                    <span className="text-pink-400 font-bold text-xl">{item.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-pink-400">{t.hotDrinks}</h4>
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
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-blue-400">{t.coldDrinks}</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>{t.coffee}</p>
                  <p>{t.decaf}</p>
                  <p>{t.lemonade}</p>
                  <p>{t.strawberryAde}</p>
                  <p>{t.orangeAde}</p>
                  <p>{t.grapefruitAde}</p>
                  <p>{t.icedTea}</p>
                  <p>{t.greenTea}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-gray-300 whitespace-pre-line">{t.ctaDesc}</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t.formTitle} <span className="text-pink-400">{t.formTitleHighlight}</span>
          </h2>
          <p className="text-center text-gray-400 mb-8">{t.formDesc}</p>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.roomNumber}</label>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nickname}</label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.numPeople}</label>
                <Select value={numPeople} onValueChange={setNumPeople}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t.person1}</SelectItem>
                    <SelectItem value="2">{t.person2}</SelectItem>
                    <SelectItem value="3">{t.person3}</SelectItem>
                    <SelectItem value="4">{t.person4}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.visitDate}</label>
                <Input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.visitTime}</label>
                <Select value={visitTime} onValueChange={setVisitTime}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6 text-lg font-bold disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isSubmitting ? (t.submitting || "Submitting...") : t.submitBtn}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, Coffee, Music, User, Check, ArrowRight, ArrowLeft,
  Headphones, Video, Disc, Share2, Play, Minus, Plus, Pause, Info, X,
  Calendar as CalendarIcon, Clock, Users, Home, Sparkles, Star, CreditCard, Loader2
} from "lucide-react";
import { SiSpotify, SiApplemusic, SiTiktok, SiInstagram, SiYoutube, SiPaypal } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/레코딩카페-한글로고_1764752892828.png";
import streamingRevenueTable from "@assets/_-1767492866237_1767492884700.png";

declare global {
  interface Window {
    paypal?: any;
  }
}

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
  { id: "green-tea", hasTemp: true, hotOnly: false },
  { id: "hibiscus", hasTemp: true, hotOnly: false },
  { id: "earl-grey", hasTemp: true, hotOnly: false },
  { id: "peppermint", hasTemp: true, hotOnly: false },
  { id: "chamomile", hasTemp: true, hotOnly: false },
  { id: "hot-chocolate", hasTemp: false, hotOnly: true },
  { id: "lemonade", hasTemp: false, hotOnly: false },
  { id: "strawberry-ade", hasTemp: false, hotOnly: false },
  { id: "orange-ade", hasTemp: false, hotOnly: false },
  { id: "grapefruit-ade", hasTemp: false, hotOnly: false },
  { id: "iced-tea", hasTemp: false, hotOnly: false },
];

const platformSources = [
  { id: "naver", ko: "Naver", en: "Naver", ja: "Naver", zh: "Naver" },
  { id: "klook", ko: "Klook", en: "Klook", ja: "Klook", zh: "Klook" },
  { id: "kkday", ko: "KKday", en: "KKday", ja: "KKday", zh: "KKday" },
  { id: "creatrip", ko: "Creatrip", en: "Creatrip", ja: "Creatrip", zh: "Creatrip" },
  { id: "trip", ko: "Trip.com", en: "Trip.com", ja: "Trip.com", zh: "Trip.com" },
  { id: "datepop", ko: "데이트팝", en: "DatePop", ja: "DatePop", zh: "DatePop" },
];

const timeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

const translations: Record<Language, {
  selectLanguage: string;
  welcome: string;
  selectBookingPath: string;
  existingReservation: string;
  existingReservationDesc: string;
  newReservation: string;
  newReservationDesc: string;
  selectPlatform: string;
  selectPlatformDesc: string;
  selectDateTime: string;
  selectDateTimeDesc: string;
  selectDate: string;
  selectTime: string;
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
  selectOne: string;
  optionalMultiple: string;
  payment: string;
  paymentDesc: string;
  paymentProcessing: string;
  paymentSuccess: string;
  paymentError: string;
  selectPaymentMethod: string;
  onlinePayment: string;
  onlinePaymentDesc: string;
  offlinePayment: string;
  offlinePaymentDesc: string;
  saveWithoutPayment: string;
  confirmBooking: string;
  mixingOptions: { id: string; name: string; price: number; desc: string }[];
  videoOptions: { id: string; name: string; price: number; desc: string }[];
  albumOption: { name: string; price: number; desc: string; features: { title: string; desc: string }[] };
  proAlbumOption: { name: string; price: number; desc: string; features: { title: string; desc: string }[] };
  lpOption: { name: string; price: number; desc: string };
}> = {
  ko: {
    selectLanguage: "언어를 선택하세요",
    welcome: "레코딩 카페",
    selectBookingPath: "예약 유형을 선택하세요",
    existingReservation: "기존 예약자",
    existingReservationDesc: "다른 플랫폼(클룩, 네이버 등)에서 이미 예약하셨나요?",
    newReservation: "처음 예약자",
    newReservationDesc: "지금 바로 예약하시겠어요? (홈페이지로 처음 접속)",
    selectPlatform: "예약하신 플랫폼을 선택하세요",
    selectPlatformDesc: "어디에서 예약하셨나요?",
    selectDateTime: "날짜와 시간 선택",
    selectDateTimeDesc: "원하시는 녹음 일정을 선택하세요",
    selectDate: "날짜 선택",
    selectTime: "시간 선택",
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
    mixingService: "사운드 보정 서비스",
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
    selectOne: "하나를 선택해주세요",
    optionalMultiple: "선택 사항입니다 (복수 선택 가능)",
    payment: "결제",
    paymentDesc: "결제를 진행해주세요",
    paymentProcessing: "결제 처리 중...",
    paymentSuccess: "결제가 완료되었습니다!",
    paymentError: "결제에 실패했습니다. 다시 시도해주세요.",
    selectPaymentMethod: "결제 방법 선택",
    onlinePayment: "온라인 결제",
    onlinePaymentDesc: "PayPal로 결제",
    offlinePayment: "현장 결제",
    offlinePaymentDesc: "매장에서 카드로 결제",
    saveWithoutPayment: "예약 완료하기",
    confirmBooking: "확인",
    mixingOptions: [
      { id: "basic", name: "기본", price: 0, desc: "베스트 구간 편집 + 음량 조절 + 에코 효과 추가" },
      { id: "ai", name: "기본 + AI 보정", price: 20000, desc: "틀린 음정, 박자를 AI로 자동 수정" },
      { id: "engineer", name: "기본 + 전문가 보정", price: 100000, desc: "틀린 음정, 박자를 전문가가 하나하나 수작업으로 수정" },
    ],
    videoOptions: [
      { id: "self", name: "셀프 촬영", price: 0, desc: "셀피용 스탠드 제공, 자신의 휴대폰으로 직접 촬영" },
      { id: "cameraman", name: "셀프 + 촬영기사 촬영", price: 20000, desc: "촬영기사가 당신이 노래하는 모습을 DSLR카메라로 촬영\n(원본 파일 제공)" },
      { id: "full", name: "셀프 + 촬영기사 + 편집", price: 100000, desc: "촬영기사 촬영 후 편집까지 완료하여 뮤직비디오를 완성\n(원본파일 + 완성파일 제공)" },
    ],
    albumOption: { 
      name: "앨범 발매", 
      price: 200000, 
      desc: "K-POP 가수처럼 전세계 음원 사이트(유튜브, 스포티파이, 틱톡, 인스타그램 등)에 발매\n(새롭게 반주 제작 + 앨범 자켓 이미지 제작 + 저작권료 수익 발생)",
      features: [
        { title: "리메이크 라이선스 취득", desc: "원곡을 리메이크하여 합법적으로 음원을 발매할 수 있는 라이선스를 취득해 드립니다. 저작권 걱정 없이 안전하게 음원을 배포하세요." },
        { title: "반주 새롭게 제작", desc: "AI 기반으로 원곡의 반주를 새롭게 제작하여 저작권 걱정 없이 사용할 수 있습니다. 원곡과 유사하지만 완전히 새로운 반주로 안전하게 음원을 발매하세요." },
        { title: "앨범표지 디자인", desc: "전문 디자이너가 고객님만의 앨범 커버를 제작해 드립니다. K-POP 스타일의 세련된 디자인으로 스트리밍 플랫폼에서 돋보이는 앨범을 만들어 보세요." },
        { title: "평생 저작권료 라이센스", desc: "발매된 음원에서 발생하는 스트리밍 수익을 평생 받으실 수 있습니다. Spotify, Apple Music 등에서 재생될 때마다 저작권료가 적립됩니다." },
      ]
    },
    proAlbumOption: { name: "전문가 앨범 발매", price: 500000, desc: "음악 전공자 or 프로들을 위한 전문 발매 서비스\n(원하는 스타일의 반주 제작 + 앨범 자켓 이미지 제작 + 저작권료 수익 발생 + 수정 2회)", features: [
      { title: "리메이크 라이선스 취득", desc: "원곡 저작권자의 공식 허가를 받아 합법적으로 음원을 발매합니다" },
      { title: "반주 새롭게 제작", desc: "전문 작곡가가 원곡의 느낌을 살린 새로운 MR을 제작합니다" },
      { title: "앨범표지 디자인", desc: "전문 디자이너가 세련된 앨범 커버를 디자인합니다" },
      { title: "평생 저작권료 라이센스", desc: "발매 후 발생하는 모든 저작권료를 평생 받을 수 있습니다" },
      { title: "레퍼런스 기반 맞춤 제작", desc: "고객이 제공하는 레퍼런스를 바탕으로 원하는 스타일의 반주를 정교하게 제작합니다" },
      { title: "전문 커뮤니케이션", desc: "음악 전문가와 1:1 상담을 통해 디테일한 요구사항을 반영합니다" },
    ] },
    lpOption: { name: "LP 레코드 제작", price: 300000, desc: "물리적 레코드판을 만들어 집주소로 배송해드립니다." },
  },
  en: {
    selectLanguage: "Select Language",
    welcome: "Recording Cafe",
    selectBookingPath: "Select Booking Type",
    existingReservation: "Existing Reservation",
    existingReservationDesc: "Already booked on another platform (Klook, Naver, etc.)?",
    newReservation: "New Reservation",
    newReservationDesc: "Book now for the first time? (First visit to our website)",
    selectPlatform: "Select your booking platform",
    selectPlatformDesc: "Where did you book?",
    selectDateTime: "Select Date & Time",
    selectDateTimeDesc: "Choose your preferred recording schedule",
    selectDate: "Select Date",
    selectTime: "Select Time",
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
    mixingService: "Sound Correction Service",
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
    selectOne: "Please select one",
    optionalMultiple: "Optional (multiple selection allowed)",
    payment: "Payment",
    paymentDesc: "Please complete your payment",
    paymentProcessing: "Processing payment...",
    paymentSuccess: "Payment completed!",
    paymentError: "Payment failed. Please try again.",
    selectPaymentMethod: "Select Payment Method",
    onlinePayment: "Online Payment",
    onlinePaymentDesc: "Pay with PayPal",
    offlinePayment: "Pay at Store",
    offlinePaymentDesc: "Pay by card at the store",
    saveWithoutPayment: "Complete Reservation",
    confirmBooking: "Confirm",
    mixingOptions: [
      { id: "basic", name: "Basic", price: 0, desc: "Best part editing + Volume adjustment + Echo effect added" },
      { id: "ai", name: "Basic + AI Correction", price: 20000, desc: "AI automatically corrects wrong pitch and timing" },
      { id: "engineer", name: "Basic + Expert Correction", price: 100000, desc: "Expert manually corrects each wrong pitch and timing one by one" },
    ],
    videoOptions: [
      { id: "self", name: "Self Recording", price: 0, desc: "Selfie stand provided, record with your own phone" },
      { id: "cameraman", name: "Self + Cameraman", price: 20000, desc: "Cameraman films you singing with DSLR camera\n(Original files provided)" },
      { id: "full", name: "Self + Cameraman + Editing", price: 100000, desc: "Cameraman filming + editing to complete your music video\n(Original + Finished files provided)" },
    ],
    albumOption: { 
      name: "Album Release", 
      price: 200000, 
      desc: "Release on global music sites (YouTube, Spotify, TikTok, Instagram, etc.) like K-POP artists\n(New backing track + Album cover design + Royalty income)",
      features: [
        { title: "Remake License Acquisition", desc: "We acquire the license for you to legally release a remake of the original song. Distribute your music safely without copyright concerns." },
        { title: "New Backing Track Production", desc: "AI-based recreation of original backing tracks for copyright-free use. Release your music safely with a new instrumental similar to the original." },
        { title: "Album Cover Design", desc: "Professional designers create your unique album cover. Stand out on streaming platforms with K-POP style sophisticated design." },
        { title: "Lifetime Royalty License", desc: "Receive streaming revenue for life from your released music. Earn royalties every time your song plays on Spotify, Apple Music, etc." },
      ]
    },
    proAlbumOption: { name: "Pro Album Release", price: 500000, desc: "Professional release service for music majors or pros\n(Custom style backing track + Album cover design + Royalty income + 2 revisions)", features: [
      { title: "Remake License", desc: "Obtain official permission from the original copyright holder for legal music release" },
      { title: "New Backing Track", desc: "Professional composer creates new MR that captures the original feel" },
      { title: "Album Cover Design", desc: "Professional designer creates stylish album cover" },
      { title: "Lifetime Royalty License", desc: "Receive all royalties generated from the released music for life" },
      { title: "Reference-Based Production", desc: "Create precisely styled backing tracks based on references you provide" },
      { title: "Expert Communication", desc: "1:1 consultation with music experts to reflect detailed requirements" },
    ] },
    lpOption: { name: "LP Record Production", price: 300000, desc: "Physical record delivered to your address." },
  },
  ja: {
    selectLanguage: "言語を選択",
    welcome: "レコーディングカフェ",
    selectBookingPath: "予約タイプを選択",
    existingReservation: "既存予約者",
    existingReservationDesc: "他のプラットフォーム（Klook、Naver等）で既に予約済みですか？",
    newReservation: "新規予約",
    newReservationDesc: "今すぐ予約しますか？（ホームページに初めてアクセス）",
    selectPlatform: "予約したプラットフォームを選択",
    selectPlatformDesc: "どこで予約しましたか？",
    selectDateTime: "日時選択",
    selectDateTimeDesc: "ご希望の録音スケジュールをお選びください",
    selectDate: "日付選択",
    selectTime: "時間選択",
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
    mixingService: "サウンド補正サービス",
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
    selectOne: "1つを選択してください",
    optionalMultiple: "任意（複数選択可能）",
    payment: "お支払い",
    paymentDesc: "お支払いを完了してください",
    paymentProcessing: "決済処理中...",
    paymentSuccess: "お支払いが完了しました！",
    paymentError: "お支払いに失敗しました。もう一度お試しください。",
    selectPaymentMethod: "お支払い方法を選択",
    onlinePayment: "オンライン決済",
    onlinePaymentDesc: "PayPalでお支払い",
    offlinePayment: "店舗でお支払い",
    offlinePaymentDesc: "店舗でカード決済",
    saveWithoutPayment: "予約を完了する",
    confirmBooking: "確認",
    mixingOptions: [
      { id: "basic", name: "基本", price: 0, desc: "ベスト部分編集 + 音量調整 + エコー効果追加" },
      { id: "ai", name: "基本 + AI補正", price: 20000, desc: "間違った音程・リズムをAIが自動修正" },
      { id: "engineer", name: "基本 + 専門家補正", price: 100000, desc: "間違った音程・リズムを専門家が一つ一つ手作業で修正" },
    ],
    videoOptions: [
      { id: "self", name: "セルフ撮影", price: 0, desc: "セルフィースタンド提供、ご自身のスマホで撮影" },
      { id: "cameraman", name: "セルフ + カメラマン撮影", price: 20000, desc: "カメラマンがあなたの歌う姿をDSLRカメラで撮影\n(オリジナルファイル提供)" },
      { id: "full", name: "セルフ + カメラマン + 編集", price: 100000, desc: "カメラマン撮影後、編集まで完了してミュージックビデオを制作\n(オリジナル + 完成ファイル提供)" },
    ],
    albumOption: { 
      name: "アルバムリリース", 
      price: 200000, 
      desc: "K-POPアーティストのように世界中の音楽サイト（YouTube、Spotify、TikTok、Instagram等）にリリース\n(新規バッキングトラック + アルバムカバー制作 + 印税収益発生)",
      features: [
        { title: "リメイクライセンス取得", desc: "オリジナル曲をリメイクして合法的に音源をリリースできるライセンスを取得します。著作権の心配なく安全に配信できます。" },
        { title: "新規バッキングトラック制作", desc: "AIベースで原曲のバッキングトラックを新規制作し、著作権の心配なく使用できます。" },
        { title: "アルバムカバーデザイン", desc: "プロのデザイナーがあなただけのアルバムカバーを制作します。" },
        { title: "生涯ロイヤリティライセンス", desc: "リリースした音源からのストリーミング収益を一生受け取れます。" },
      ]
    },
    proAlbumOption: { name: "プロアルバムリリース", price: 500000, desc: "音楽専攻者・プロ向けの専門リリースサービス\n(お好みスタイルのバッキングトラック + アルバムカバー制作 + 印税収益発生 + 修正2回)", features: [
      { title: "リメイクライセンス取得", desc: "原曲著作権者の公式許可を得て合法的に音源をリリース" },
      { title: "新規バッキングトラック制作", desc: "プロの作曲家が原曲の雰囲気を活かした新しいMRを制作" },
      { title: "アルバムカバーデザイン", desc: "プロのデザイナーが洗練されたアルバムカバーをデザイン" },
      { title: "永久ロイヤリティライセンス", desc: "リリース後に発生する全ての著作権料を永久に受け取れます" },
      { title: "リファレンス基盤カスタム制作", desc: "お客様提供のリファレンスを基にご希望スタイルのバッキングトラックを精密制作" },
      { title: "専門コミュニケーション", desc: "音楽専門家との1:1相談で細かい要望を反映" },
    ] },
    lpOption: { name: "LPレコード制作", price: 300000, desc: "物理レコードを作成し、ご自宅に配送します。" },
  },
  zh: {
    selectLanguage: "选择语言",
    welcome: "录音咖啡厅",
    selectBookingPath: "选择预约类型",
    existingReservation: "已有预约",
    existingReservationDesc: "已在其他平台（Klook、Naver等）预约？",
    newReservation: "新预约",
    newReservationDesc: "现在预约？（首次访问官网）",
    selectPlatform: "选择预约平台",
    selectPlatformDesc: "您在哪里预约的？",
    selectDateTime: "选择日期和时间",
    selectDateTimeDesc: "请选择您想要的录音时间",
    selectDate: "选择日期",
    selectTime: "选择时间",
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
    mixingService: "声音校正服务",
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
    selectOne: "请选择一项",
    optionalMultiple: "可选（可多选）",
    payment: "支付",
    paymentDesc: "请完成支付",
    paymentProcessing: "正在处理支付...",
    paymentSuccess: "支付成功！",
    paymentError: "支付失败，请重试。",
    selectPaymentMethod: "选择支付方式",
    onlinePayment: "在线支付",
    onlinePaymentDesc: "使用PayPal支付",
    offlinePayment: "到店支付",
    offlinePaymentDesc: "到店刷卡支付",
    saveWithoutPayment: "完成预约",
    confirmBooking: "确认",
    mixingOptions: [
      { id: "basic", name: "基础", price: 0, desc: "最佳部分剪辑 + 音量调整 + 回声效果添加" },
      { id: "ai", name: "基础 + AI校正", price: 20000, desc: "AI自动修正错误的音高和节拍" },
      { id: "engineer", name: "基础 + 专家校正", price: 100000, desc: "专家逐一手工修正错误的音高和节拍" },
    ],
    videoOptions: [
      { id: "self", name: "自拍", price: 0, desc: "提供自拍支架，用自己的手机拍摄" },
      { id: "cameraman", name: "自拍 + 摄影师", price: 20000, desc: "摄影师用DSLR相机拍摄您唱歌的样子\n(提供原始文件)" },
      { id: "full", name: "自拍 + 摄影师 + 剪辑", price: 100000, desc: "摄影师拍摄后完成剪辑，制作您的音乐视频\n(提供原始文件 + 完成文件)" },
    ],
    albumOption: { 
      name: "专辑发行", 
      price: 200000, 
      desc: "像K-POP艺人一样在全球音乐网站（YouTube、Spotify、TikTok、Instagram等）发行\n(全新伴奏制作 + 专辑封面设计 + 版税收入)",
      features: [
        { title: "翻唱许可证取得", desc: "为您取得合法翻唱发行原曲的许可证。无版权顾虑，安全发行。" },
        { title: "全新伴奏制作", desc: "基于AI重新制作原曲伴奏，无版权顾虑。" },
        { title: "专辑封面设计", desc: "专业设计师为您制作独特的专辑封面。" },
        { title: "终身版税许可", desc: "终身获得发行音乐的流媒体收入。" },
      ]
    },
    proAlbumOption: { name: "专业专辑发行", price: 500000, desc: "音乐专业人士或专业人员的专业发行服务\n(定制风格伴奏制作 + 专辑封面设计 + 版税收入 + 2次修改)", features: [
      { title: "翻唱授权获取", desc: "获得原曲版权所有者的官方许可，合法发行音源" },
      { title: "新编伴奏制作", desc: "专业作曲家制作保留原曲感觉的全新MR" },
      { title: "专辑封面设计", desc: "专业设计师设计精美的专辑封面" },
      { title: "终身版税授权", desc: "发行后产生的所有版税终身归您所有" },
      { title: "参考定制制作", desc: "根据您提供的参考资料精确制作所需风格的伴奏" },
      { title: "专业沟通", desc: "与音乐专家一对一咨询，反映详细需求" },
    ] },
    lpOption: { name: "LP唱片制作", price: 300000, desc: "制作物理唱片并邮寄到您的地址。" },
  },
};

const languageOptions = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
  { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
];

export default function MenuPage() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<Language | null>(null);
  const [bookingPath, setBookingPath] = useState<"existing" | "homepage" | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [drinkOrders, setDrinkOrders] = useState<DrinkOrder[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMixing, setSelectedMixing] = useState<string>("basic");
  const [selectedVideo, setSelectedVideo] = useState<string>("self");
  const [wantsAlbum, setWantsAlbum] = useState(false);
  const [wantsProAlbum, setWantsProAlbum] = useState(false);
  const [wantsLP, setWantsLP] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [detailModal, setDetailModal] = useState<{ title: string; desc: string } | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline" | null>(null);
  const [showKoreanConfirm, setShowKoreanConfirm] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch PayPal Client ID
  const { data: paypalConfig } = useQuery<{ clientId: string }>({
    queryKey: ['/api/paypal/client-id'],
    enabled: language !== null && language !== "ko",
  });

  // Load PayPal SDK when on step 8 and not Korean
  useEffect(() => {
    if (step === 8 && language && language !== "ko" && paypalConfig?.clientId && !paypalLoaded) {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        setPaypalLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=USD`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    }
  }, [step, language, paypalConfig, paypalLoaded]);

  // Render PayPal buttons when SDK is loaded
  useEffect(() => {
    const totalKRW = calculateTotal();
    if (paypalLoaded && paypalButtonRef.current && window.paypal && step === 8 && language !== "ko" && totalKRW > 0) {
      paypalButtonRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 50
        },
        createOrder: async () => {
          setPaymentProcessing(true);
          try {
            // Send booking data to server for secure price calculation
            const response = await apiRequest('POST', '/api/paypal/create-order', {
              bookingData: {
                selectedMixing,
                selectedVideo,
                wantsAlbum,
                wantsProAlbum,
                wantsLP
              },
              description: 'Recording Cafe Services'
            });
            const data = await response.json() as { id?: string; error?: string };
            if (data.error) throw new Error(data.error);
            if (!data.id) throw new Error('No order ID returned');
            return data.id;
          } catch (error: any) {
            setPaymentProcessing(false);
            toast({ title: t.paymentError, variant: "destructive" });
            throw error;
          }
        },
        onApprove: async (data: any) => {
          try {
            const response = await apiRequest('POST', '/api/paypal/capture-order', { orderId: data.orderID });
            const captureData = await response.json() as { success?: boolean; error?: string };
            if (captureData.success) {
              const paidAmountKRW = calculateTotal(); // Amount paid in KRW
              handleSubmit({ paymentStatus: "paid", paypalOrderId: data.orderID, paidAmount: paidAmountKRW });
              toast({ title: t.paymentSuccess });
            } else {
              throw new Error('Capture failed');
            }
          } catch (error) {
            toast({ title: t.paymentError, variant: "destructive" });
          } finally {
            setPaymentProcessing(false);
          }
        },
        onError: () => {
          setPaymentProcessing(false);
          toast({ title: t.paymentError, variant: "destructive" });
        },
        onCancel: () => {
          setPaymentProcessing(false);
        }
      }).render(paypalButtonRef.current);
    }
  }, [paypalLoaded, step, language, selectedMixing, selectedVideo, wantsAlbum, wantsProAlbum, wantsLP]);

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
    if (wantsProAlbum) total += t.proAlbumOption.price;
    if (wantsLP) total += t.lpOption.price;
    return total;
  };

  // Convert KRW to USD (approximate rate: 1 USD = 1400 KRW)
  const calculateTotalUSD = () => {
    const krwTotal = calculateTotal();
    return Math.ceil(krwTotal / 1400 * 100) / 100; // Round up to 2 decimal places
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

  const handleSubmit = (paymentInfo?: { paymentStatus: "paid" | "pending" | "unpaid"; paypalOrderId?: string; paidAmount?: number }) => {
    if (!name || !phone || !email) {
      toast({ title: t.required, description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const drinkSummary = drinkOrders.map(o => {
      const drinkName = t.drinks[o.id] || o.id;
      const tempLabel = o.temperature === "hot" ? " (hot)" : o.temperature === "iced" ? " (iced)" : "";
      return `${drinkName} x${o.quantity}${tempLabel}`;
    }).join(", ") || "none";

    // Build selected services JSON with actual names and prices
    const services: { name: string; price: number }[] = [];
    if (selectedMixing === "basic") {
      services.push({ name: "Sound Correction (Basic)", price: 20000 });
    } else if (selectedMixing === "ai") {
      services.push({ name: "AI Mixing", price: 90000 });
    } else if (selectedMixing === "engineer") {
      services.push({ name: "Full Track Mixing (Engineer)", price: 100000 });
    }
    if (selectedVideo === "cameraman") {
      services.push({ name: "Cameraman Recording", price: 50000 });
    } else if (selectedVideo === "full") {
      services.push({ name: "Full Video Editing", price: 100000 });
    }
    if (wantsAlbum) {
      services.push({ name: "Pro Album Release (Global Distribution)", price: 1300000 });
    }
    if (wantsLP) {
      services.push({ name: "LP Record Production", price: 300000 });
    }

    let namePrefix = "";
    if (bookingPath === "existing" && selectedPlatform) {
      const platform = platformSources.find(s => s.id === selectedPlatform);
      namePrefix = platform ? `[${platform[language || "ko"]}] ` : "";
    } else if (bookingPath === "homepage" && selectedDate && selectedTime) {
      const dateStr = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}`;
      namePrefix = `[Homepage ${dateStr} ${selectedTime}] `;
    }

    // Determine payment status and method
    let finalPaymentStatus = paymentInfo?.paymentStatus;
    if (!finalPaymentStatus) {
      finalPaymentStatus = "unpaid";
    }

    // Determine payment method
    let finalPaymentMethod: "online" | "offline" | undefined;
    if (language === "ko") {
      finalPaymentMethod = "offline"; // Korean users always pay at store
    } else if (paymentMethod) {
      finalPaymentMethod = paymentMethod;
    }

    bookingMutation.mutate({
      bookingType: "direct",
      name: `${namePrefix}${name}`,
      email: email || "no-email@example.com",
      phone,
      selectedDrink: drinkSummary,
      drinkTemperature: "mixed",
      youtubeTrackUrl: youtubeUrl || "https://youtube.com",
      selectedAddons: [],
      selectedServices: JSON.stringify(services),
      totalPrice: calculateTotal(),
      paymentStatus: finalPaymentStatus,
      paymentMethod: finalPaymentMethod,
      paidAmount: paymentInfo?.paidAmount,
      paypalOrderId: paymentInfo?.paypalOrderId,
    });
  };

  const [direction, setDirection] = useState(0);
  const paginate = (d: number) => {
    setDirection(d);
    setStep(step + d);
  };

  const canProceed = () => {
    if (step === 1) return bookingPath !== null;
    if (step === 2) {
      if (bookingPath === "existing") return selectedPlatform !== "";
      if (bookingPath === "homepage") return selectedDate !== undefined && selectedTime !== "";
    }
    if (step === 4) return name !== "" && phone !== "" && email !== "";
    if (step === 5) return selectedMixing !== "";
    if (step === 6) return selectedVideo !== "";
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
          <Button onClick={() => { setIsComplete(false); setStep(0); setLanguage(null); setBookingPath(null); setSelectedPlatform(""); setSelectedDate(undefined); setSelectedTime(""); setDrinkOrders([]); setYoutubeUrl(""); setName(""); setPhone(""); setEmail(""); setSelectedMixing("raw"); setSelectedVideo("self"); setWantsAlbum(false); setWantsLP(false); }} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 text-xl">
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
            <motion.div key="booking-path" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-2xl px-4">
              <div className="text-center mb-6 md:mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{t.selectBookingPath}</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-xl ${bookingPath === "existing" ? "border-2 border-purple-500 bg-purple-50 shadow-lg" : "bg-white/80 border-gray-200 hover:border-purple-300"}`} 
                  onClick={() => { setBookingPath("existing"); setTimeout(() => paginate(1), 200); }}
                  data-testid="button-existing-reservation"
                >
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                      <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">{t.existingReservation}</h2>
                    <p className="text-sm md:text-base text-gray-600">{t.existingReservationDesc}</p>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-xl ${bookingPath === "homepage" ? "border-2 border-pink-500 bg-pink-50 shadow-lg" : "bg-white/80 border-gray-200 hover:border-pink-300"}`} 
                  onClick={() => { setBookingPath("homepage"); setTimeout(() => paginate(1), 200); }}
                  data-testid="button-new-reservation"
                >
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                      <Home className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">{t.newReservation}</h2>
                    <p className="text-sm md:text-base text-gray-600">{t.newReservationDesc}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 2 && bookingPath === "existing" && (
            <motion.div key="platform" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-2xl">
              <div className="text-center mb-8">
                <Users className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.selectPlatform}</h1>
                <p className="text-gray-600 mt-2">{t.selectPlatformDesc}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {platformSources.map(source => (
                  <Card 
                    key={source.id}
                    className={`cursor-pointer transition-all ${selectedPlatform === source.id ? "border-2 border-purple-500 bg-purple-50 shadow-lg" : "bg-white/80 border-gray-200 hover:border-purple-300 hover:shadow-md"}`}
                    onClick={() => setSelectedPlatform(source.id)}
                    data-testid={`button-platform-${source.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      {selectedPlatform === source.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-lg font-semibold text-gray-800">{source[language || "ko"]}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && bookingPath === "homepage" && (
            <motion.div key="datetime" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-4xl">
              <div className="text-center mb-6">
                <CalendarIcon className="w-10 h-10 text-pink-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.selectDateTime}</h1>
                <p className="text-gray-600 mt-2">{t.selectDateTimeDesc}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/80 border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-pink-500" />
                      {t.selectDate}
                    </h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border mx-auto"
                    />
                  </CardContent>
                </Card>
                <Card className="bg-white/80 border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-pink-500" />
                      {t.selectTime}
                    </h3>
                    <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                      {timeSlots.map(time => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          className={`${selectedTime === time ? "bg-pink-500 hover:bg-pink-600 text-white" : "border-gray-300 hover:border-pink-400"}`}
                          onClick={() => setSelectedTime(time)}
                          data-testid={`button-time-${time.replace(":", "")}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 3 && (
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

          {step === 4 && (
            <motion.div key="info" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-xl">
              <div className="text-center mb-6">
                <User className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t.customerInfo}</h1>
              </div>
              <Card className="bg-white/80 border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Music className="w-4 h-4 text-pink-500" />
                      {t.backingTrack}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-left bg-white text-gray-700 border border-gray-200 shadow-lg p-3">
                            <p className="text-xs leading-relaxed">
                              The easiest way is to search on YouTube using the song title plus keywords like "karaoke" or "MR." When you arrive at the café, just share the link with us.
                              <br /><br />
                              If the track isn't on YouTube or you already have a file, no problem! Simply upload it to your own YouTube account and send us the link.
                              <br /><br />
                              Please note: We're unable to accept files directly.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
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

          {step === 5 && (
            <motion.div key="mixing" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-md px-4">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-gray-800">{t.mixingService}</h1>
                <p className="text-xs text-gray-500 mt-1">{t.selectOne}</p>
              </div>
              <div className="space-y-3">
                {t.mixingOptions.map((opt) => (
                  <Card key={opt.id} className={`cursor-pointer transition-all ${selectedMixing === opt.id ? "border-2 border-cyan-500 bg-cyan-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-cyan-300"}`} onClick={() => setSelectedMixing(opt.id)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${selectedMixing === opt.id ? "border-cyan-500 bg-cyan-500" : "border-gray-300 bg-white"}`}>
                        {selectedMixing === opt.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base text-gray-800">{opt.name}</h3>
                          <p className={`text-lg font-bold flex-shrink-0 ${opt.price === 0 ? "text-green-600" : "text-pink-600"}`}>{formatPrice(opt.price)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="video" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-md px-4">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-gray-800">{t.videoService}</h1>
                <p className="text-xs text-gray-500 mt-1">{t.selectOne}</p>
              </div>
              <div className="space-y-3">
                {t.videoOptions.map((opt) => (
                  <Card key={opt.id} className={`cursor-pointer transition-all ${selectedVideo === opt.id ? "border-2 border-rose-500 bg-rose-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-rose-300"}`} onClick={() => setSelectedVideo(opt.id)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${selectedVideo === opt.id ? "border-rose-500 bg-rose-500" : "border-gray-300 bg-white"}`}>
                        {selectedVideo === opt.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base text-gray-800">{opt.name}</h3>
                          <p className={`text-lg font-bold flex-shrink-0 ${opt.price === 0 ? "text-green-600" : "text-pink-600"}`}>{formatPrice(opt.price)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="extra" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full max-w-md px-4">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-gray-800">{t.albumService}</h1>
                <p className="text-xs text-gray-500 mt-1">{t.optionalMultiple}</p>
              </div>
              <div className="space-y-3">
                <Card 
                  className={`cursor-pointer transition-all ${wantsAlbum ? "border-2 border-emerald-500 bg-emerald-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-emerald-300"}`} 
                  onClick={() => setWantsAlbum(!wantsAlbum)}
                  data-testid="card-album"
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${wantsAlbum ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"}`}>
                      {wantsAlbum && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-gray-800">{t.albumOption.name}</h3>
                        <p className="text-lg font-bold text-pink-600 flex-shrink-0">{formatPrice(t.albumOption.price)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{t.albumOption.desc}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${wantsProAlbum ? "border-2 border-violet-500 bg-violet-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-violet-300"}`} 
                  onClick={() => setWantsProAlbum(!wantsProAlbum)}
                  data-testid="card-pro-album"
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${wantsProAlbum ? "border-violet-500 bg-violet-500" : "border-gray-300 bg-white"}`}>
                      {wantsProAlbum && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-gray-800">{t.proAlbumOption.name}</h3>
                          <span className="px-1.5 py-0.5 bg-violet-500 text-white rounded text-[10px] font-bold">PRO</span>
                        </div>
                        <p className="text-lg font-bold text-pink-600 flex-shrink-0">{formatPrice(t.proAlbumOption.price)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{t.proAlbumOption.desc}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Streaming Revenue Table Image */}
                <div className="my-4">
                  <img 
                    src={streamingRevenueTable} 
                    alt="Music Streaming Revenue Per Stream Table" 
                    className="w-full rounded-xl shadow-md border border-gray-200"
                  />
                </div>

                <Card 
                  className={`cursor-pointer transition-all ${wantsLP ? "border-2 border-amber-500 bg-amber-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-amber-300"}`} 
                  onClick={() => setWantsLP(!wantsLP)}
                  data-testid="card-lp"
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${wantsLP ? "border-amber-500 bg-amber-500" : "border-gray-300 bg-white"}`}>
                      {wantsLP && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-gray-800">{t.lpOption.name}</h3>
                        <p className="text-lg font-bold text-pink-600 flex-shrink-0">{formatPrice(t.lpOption.price)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.lpOption.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 8 && (
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
                  {wantsProAlbum && <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.proAlbumOption.name}</span><span className="text-pink-600 font-medium">{formatPrice(t.proAlbumOption.price)}</span></div>}
                  {wantsLP && <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">{t.lpOption.name}</span><span className="text-pink-600 font-medium">{formatPrice(t.lpOption.price)}</span></div>}
                  <div className="flex justify-between py-4 text-2xl font-bold bg-gradient-to-r from-purple-50 to-pink-50 -mx-5 px-5 rounded-b-lg">
                    <span className="text-purple-600">{t.total}</span>
                    <div className="text-right">
                      <span className="text-pink-600">{formatPrice(calculateTotal())}</span>
                      {language !== "ko" && calculateTotal() > 0 && (
                        <span className="text-sm text-gray-500 block">≈ ${calculateTotalUSD().toFixed(2)} USD</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment method selection for non-Korean users */}
              {language !== "ko" && calculateTotal() > 0 && (
                <div className="mt-6">
                  <div className="text-center mb-4">
                    <span className="font-semibold text-gray-700">{t.selectPaymentMethod}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Online Payment Option */}
                    <Card 
                      className={`cursor-pointer transition-all ${paymentMethod === "online" ? "border-2 border-blue-500 bg-blue-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-blue-300"}`}
                      onClick={() => setPaymentMethod("online")}
                      data-testid="card-online-payment"
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "online" ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}`}>
                          {paymentMethod === "online" && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <SiPaypal className="w-5 h-5 text-[#003087]" />
                            <h3 className="font-bold text-base text-gray-800">{t.onlinePayment}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{t.onlinePaymentDesc}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Offline Payment Option */}
                    <Card 
                      className={`cursor-pointer transition-all ${paymentMethod === "offline" ? "border-2 border-emerald-500 bg-emerald-50 shadow-lg" : "bg-white/80 border-2 border-gray-200 hover:shadow-md hover:border-emerald-300"}`}
                      onClick={() => setPaymentMethod("offline")}
                      data-testid="card-offline-payment"
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "offline" ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"}`}>
                          {paymentMethod === "offline" && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-base text-gray-800">{t.offlinePayment}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{t.offlinePaymentDesc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* PayPal buttons when online payment selected */}
                  {paymentMethod === "online" && (
                    <div className="mt-4">
                      {paymentProcessing && (
                        <div className="flex items-center justify-center gap-2 py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-gray-600">{t.paymentProcessing}</span>
                        </div>
                      )}
                      
                      <div ref={paypalButtonRef} className={paymentProcessing ? "opacity-50 pointer-events-none" : ""} />
                      
                      {!paypalLoaded && !paymentProcessing && (
                        <div className="flex items-center justify-center gap-2 py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                          <span className="text-gray-500">Loading PayPal...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-purple-300 p-3 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" onClick={() => paginate(-1)} className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm font-semibold flex-shrink-0" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" />{t.back}
            </Button>
            <div className="flex items-center gap-1 flex-shrink overflow-hidden">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "bg-pink-500 w-4" : i < step ? "bg-green-500 w-1.5" : "bg-gray-400 w-1.5"}`} />
              ))}
            </div>
            {step < 8 ? (
              <Button size="sm" onClick={() => paginate(1)} disabled={!canProceed()} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 text-sm font-semibold shadow-lg flex-shrink-0" data-testid="button-next">
                {t.next}<ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : language === "ko" ? (
              <Button size="sm" onClick={() => handleSubmit()} disabled={bookingMutation.isPending} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 text-sm font-semibold shadow-lg flex-shrink-0" data-testid="button-submit">
                {bookingMutation.isPending ? "..." : <><Check className="w-4 h-4 mr-1" />{t.confirmBooking}</>}
              </Button>
            ) : calculateTotal() === 0 ? (
              <Button size="sm" onClick={() => handleSubmit()} disabled={bookingMutation.isPending} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 text-sm font-semibold shadow-lg flex-shrink-0" data-testid="button-submit">
                {bookingMutation.isPending ? "..." : <><Check className="w-4 h-4 mr-1" />{t.saveWithoutPayment}</>}
              </Button>
            ) : paymentMethod === "offline" ? (
              <Button size="sm" onClick={() => handleSubmit()} disabled={bookingMutation.isPending} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 text-sm font-semibold shadow-lg flex-shrink-0" data-testid="button-offline-submit">
                {bookingMutation.isPending ? "..." : <><CreditCard className="w-4 h-4 mr-1" />{t.saveWithoutPayment}</>}
              </Button>
            ) : paymentMethod === "online" ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                <SiPaypal className="w-4 h-4 text-[#003087]" />
                <span>{t.payment} ↑</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400 flex-shrink-0">
                {t.selectPaymentMethod} ↑
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

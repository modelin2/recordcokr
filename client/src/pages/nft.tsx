import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, Music, Video, Disc3, Headphones, Loader2, Check, AlertCircle, CheckCircle2, Play, X, Gift, Send, Star, ExternalLink, Sparkles, Camera, Link, ArrowRight } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiNaver, SiPinterest, SiThreads, SiWechat } from "react-icons/si";
import { FaBlog, FaGlobe } from "react-icons/fa";

type Language = "ko" | "en" | "ja" | "zh";

const languageOptions = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
  { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
];

const translations = {
  ko: {
    privatePage: "이 페이지는",
    private: "비공개",
    privateDesc: "입니다. 이 링크를 가진 분만 접속할 수 있습니다.",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "녹음 파일 다운로드",
    postProduction: "후반 작업 중입니다",
    postProductionSub: "약 3일 후 다운로드 가능합니다",
    fileReady: "파일 준비 완료",
    download: "다운로드",
    downloadWarning: "⚠ 다운로드 후 파일은 서버에서 삭제됩니다",
    downloadComplete: "다운로드 완료",
    downloadCompleteSub: "파일이 서버에서 삭제되었습니다",
    additionalServices: "추가 서비스 신청",
    soundCorrection: "음향 보정",
    videoService: "영상 서비스",
    albumRelease: "음원 발매",
    selected: "선택된 서비스",
    couponAvailable: "사용 가능한 쿠폰",
    couponDiscount: "쿠폰 할인",
    finalTotal: "최종 금액",
    couponUsed: "쿠폰 사용",
    deliveredFiles: "전달된 파일",
    paypalRequired: "해외 결제는 PayPal로 진행됩니다",
    paypalPayAndRequest: "PayPal 결제 후 신청",
    paypalProcessing: "결제 처리 중...",
    paymentCompleted: "결제 완료",
    requestServices: "서비스 신청하기",
    requestSubmitted: "신청이 접수되었습니다!",
    requestSubmittedSub: "확인 후 연락드리겠습니다.",
    requestHistory: "신청 내역",
    pending: "대기중",
    completed: "완료",
    booked: "예약 시 선택",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "페이지를 찾을 수 없습니다",
    pageNotFoundSub: "유효하지 않은 링크입니다",
    alreadyProvided: "기본 제공됨",
    downloadToastTitle: "다운로드 완료",
    downloadToastDesc: "파일이 서버에서 삭제되었습니다.",
    errorToast: "오류가 발생했습니다.",
    requestToastTitle: "신청 완료",
    requestToastDesc: "추가 서비스 신청이 접수되었습니다.",
    viewSample: "샘플 보기",
    promoTitle: "SNS 후기 이벤트",
    promoDesc: "레코딩 카페 체험 후기를 SNS에 올려주세요!",
    promoAnyPlatform: "전 세계 어떤 SNS 플랫폼이든 OK!",
    promoReward: "최대 ₩500,000 쿠폰",
    promoRewardRange: "₩10,000 ~ ₩500,000",
    promoRewardDetail: "후기와 영향력에 따라 쿠폰 금액이 결정됩니다",
    promoUseDetail: "추가 서비스(옵션) 결제 시 사용 가능",
    promoSnsUrl: "게시물 URL을 붙여넣기 해주세요",
    promoSnsUrlPlaceholder: "https://...",
    promoSelectPlatform: "플랫폼 선택 (기타도 가능)",
    promoSubmit: "후기 제출하기",
    promoSubmitted: "제출 완료! 확인 후 쿠폰을 지급해 드립니다.",
    promoHistory: "제출 내역",
    promoStatusPending: "검토 중",
    promoStatusApproved: "쿠폰 지급 완료",
    promoStatusRejected: "반려",
    promoCouponAmount: "지급 쿠폰",
    promoStep1: "SNS에 후기 게시",
    promoStep1Desc: "사진/영상과 함께 체험 후기를 올려주세요",
    promoStep2: "URL 제출",
    promoStep2Desc: "아래에 게시물 링크를 붙여넣기",
    promoStep3: "검토 후 쿠폰 지급",
    promoStep3Desc: "1~2일 내 확인 후 쿠폰 발급",
  },
  en: {
    privatePage: "This is a",
    private: "private",
    privateDesc: "page. Only accessible with this link.",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "Download Recording",
    postProduction: "Post-production in progress",
    postProductionSub: "Available in approx. 3 days",
    fileReady: "File Ready",
    download: "Download",
    downloadWarning: "⚠ File will be deleted from server after download",
    downloadComplete: "Download Complete",
    downloadCompleteSub: "File has been removed from server",
    additionalServices: "Additional Services",
    soundCorrection: "Sound Correction",
    videoService: "Video Service",
    albumRelease: "Album Release",
    selected: "Selected",
    couponAvailable: "Available Coupon",
    couponDiscount: "Coupon Discount",
    finalTotal: "Final Total",
    couponUsed: "Coupon Used",
    deliveredFiles: "Delivered Files",
    paypalRequired: "International payment via PayPal",
    paypalPayAndRequest: "Pay with PayPal & Request",
    paypalProcessing: "Processing payment...",
    paymentCompleted: "Payment Complete",
    requestServices: "Request Services",
    requestSubmitted: "Request Submitted!",
    requestSubmittedSub: "We will contact you after review.",
    requestHistory: "Request History",
    pending: "Pending",
    completed: "Completed",
    booked: "Booked",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "Page not found",
    pageNotFoundSub: "Invalid link",
    alreadyProvided: "Included",
    downloadToastTitle: "Download Complete",
    downloadToastDesc: "File has been removed from server.",
    errorToast: "An error occurred.",
    requestToastTitle: "Request Submitted",
    requestToastDesc: "Your service request has been submitted.",
    viewSample: "View Sample",
    promoTitle: "SNS Review Event",
    promoDesc: "Share your Recording Café experience on social media!",
    promoAnyPlatform: "Any social media platform worldwide is OK!",
    promoReward: "Up to ₩500,000 Coupon",
    promoRewardRange: "₩10,000 ~ ₩500,000",
    promoRewardDetail: "Coupon value depends on review quality and influence",
    promoUseDetail: "Usable for additional services (options) only",
    promoSnsUrl: "Paste your post URL here",
    promoSnsUrlPlaceholder: "https://...",
    promoSelectPlatform: "Select platform (others OK too)",
    promoSubmit: "Submit Review",
    promoSubmitted: "Submitted! We'll review and issue your coupon.",
    promoHistory: "Submission History",
    promoStatusPending: "Under Review",
    promoStatusApproved: "Coupon Issued",
    promoStatusRejected: "Declined",
    promoCouponAmount: "Coupon Value",
    promoStep1: "Post Your Review",
    promoStep1Desc: "Share photos/videos of your experience on SNS",
    promoStep2: "Submit URL",
    promoStep2Desc: "Paste your post link below",
    promoStep3: "Get Your Coupon",
    promoStep3Desc: "Reviewed & issued within 1-2 days",
  },
  ja: {
    privatePage: "このページは",
    private: "非公開",
    privateDesc: "です。このリンクをお持ちの方のみアクセスできます。",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "録音ファイルダウンロード",
    postProduction: "後処理中です",
    postProductionSub: "約3日後にダウンロード可能です",
    fileReady: "ファイル準備完了",
    download: "ダウンロード",
    downloadWarning: "⚠ ダウンロード後、ファイルはサーバーから削除されます",
    downloadComplete: "ダウンロード完了",
    downloadCompleteSub: "ファイルはサーバーから削除されました",
    additionalServices: "追加サービス申請",
    soundCorrection: "サウンド補正",
    videoService: "映像サービス",
    albumRelease: "アルバムリリース",
    selected: "選択済み",
    couponAvailable: "利用可能なクーポン",
    couponDiscount: "クーポン割引",
    finalTotal: "最終金額",
    couponUsed: "クーポン使用",
    deliveredFiles: "納品ファイル",
    paypalRequired: "海外決済はPayPalで行います",
    paypalPayAndRequest: "PayPal決済して申請",
    paypalProcessing: "決済処理中...",
    paymentCompleted: "決済完了",
    requestServices: "サービスを申請する",
    requestSubmitted: "申請が受け付けられました！",
    requestSubmittedSub: "確認後ご連絡いたします。",
    requestHistory: "申請履歴",
    pending: "待機中",
    completed: "完了",
    booked: "予約時選択",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "ページが見つかりません",
    pageNotFoundSub: "無効なリンクです",
    alreadyProvided: "基本提供",
    downloadToastTitle: "ダウンロード完了",
    downloadToastDesc: "ファイルはサーバーから削除されました。",
    errorToast: "エラーが発生しました。",
    requestToastTitle: "申請完了",
    requestToastDesc: "追加サービスの申請が受け付けられました。",
    viewSample: "サンプル視聴",
    promoTitle: "SNSレビューイベント",
    promoDesc: "レコーディングカフェの体験をSNSでシェアしてください！",
    promoAnyPlatform: "世界中のどのSNSでもOK！",
    promoReward: "最大₩500,000クーポン",
    promoRewardRange: "₩10,000 ~ ₩500,000",
    promoRewardDetail: "レビューのクオリティと影響力によりクーポン金額が決まります",
    promoUseDetail: "追加サービス（オプション）にのみ使用可能",
    promoSnsUrl: "投稿URLを貼り付けてください",
    promoSnsUrlPlaceholder: "https://...",
    promoSelectPlatform: "プラットフォーム選択（その他もOK）",
    promoSubmit: "レビューを提出する",
    promoSubmitted: "提出完了！確認後クーポンをお届けします。",
    promoHistory: "提出履歴",
    promoStatusPending: "審査中",
    promoStatusApproved: "クーポン発行完了",
    promoStatusRejected: "却下",
    promoCouponAmount: "発行クーポン",
    promoStep1: "SNSにレビュー投稿",
    promoStep1Desc: "写真/動画と一緒に体験レビューを投稿",
    promoStep2: "URLを提出",
    promoStep2Desc: "下記に投稿リンクを貼り付け",
    promoStep3: "クーポン発行",
    promoStep3Desc: "1〜2日以内に確認後発行",
  },
  zh: {
    privatePage: "此页面是",
    private: "私密",
    privateDesc: "的。只有拥有此链接的人才能访问。",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "下载录音文件",
    postProduction: "后期制作中",
    postProductionSub: "约3天后可下载",
    fileReady: "文件准备完成",
    download: "下载",
    downloadWarning: "⚠ 下载后文件将从服务器删除",
    downloadComplete: "下载完成",
    downloadCompleteSub: "文件已从服务器删除",
    additionalServices: "附加服务申请",
    soundCorrection: "音频修正",
    videoService: "视频服务",
    albumRelease: "专辑发行",
    selected: "已选择",
    couponAvailable: "可用优惠券",
    couponDiscount: "优惠券折扣",
    finalTotal: "最终金额",
    couponUsed: "优惠券已使用",
    deliveredFiles: "交付文件",
    paypalRequired: "海外支付通过PayPal进行",
    paypalPayAndRequest: "PayPal支付后申请",
    paypalProcessing: "支付处理中...",
    paymentCompleted: "支付完成",
    requestServices: "申请服务",
    requestSubmitted: "申请已提交！",
    requestSubmittedSub: "审核后我们会联系您。",
    requestHistory: "申请记录",
    pending: "待处理",
    completed: "已完成",
    booked: "预约时选择",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "未找到页面",
    pageNotFoundSub: "无效链接",
    alreadyProvided: "已包含",
    downloadToastTitle: "下载完成",
    downloadToastDesc: "文件已从服务器删除。",
    errorToast: "发生错误。",
    requestToastTitle: "申请完成",
    requestToastDesc: "附加服务申请已提交。",
    viewSample: "查看样品",
    promoTitle: "SNS评价活动",
    promoDesc: "请在社交媒体上分享您的录音咖啡体验！",
    promoAnyPlatform: "全球任何社交平台均可！",
    promoReward: "最高₩500,000优惠券",
    promoRewardRange: "₩10,000 ~ ₩500,000",
    promoRewardDetail: "优惠券金额根据评价质量和影响力确定",
    promoUseDetail: "仅可用于附加服务（选项）",
    promoSnsUrl: "请粘贴帖子链接",
    promoSnsUrlPlaceholder: "https://...",
    promoSelectPlatform: "选择平台（其他也可以）",
    promoSubmit: "提交评价",
    promoSubmitted: "已提交！审核后将发放优惠券。",
    promoHistory: "提交记录",
    promoStatusPending: "审核中",
    promoStatusApproved: "优惠券已发放",
    promoStatusRejected: "未通过",
    promoCouponAmount: "优惠券金额",
    promoStep1: "在SNS发布评价",
    promoStep1Desc: "上传照片/视频分享您的体验",
    promoStep2: "提交链接",
    promoStep2Desc: "在下方粘贴帖子链接",
    promoStep3: "获取优惠券",
    promoStep3Desc: "1-2天内审核后发放",
  },
};

interface ServiceItem {
  id: string;
  name: Record<Language, string>;
  price: number;
  desc: Record<Language, string>;
  isFree?: boolean;
  sampleVideoUrl?: string;
}

const services: Record<string, ServiceItem[]> = {
  mixing: [
    { id: "basic", name: { ko: "기본 (Basic)", en: "Basic Mixing", ja: "基本ミキシング", zh: "基本混音" }, price: 0, desc: { ko: "베스트 구간 편집 + 음량 조절 + 에코 효과 추가", en: "Best section editing + volume control + echo effects", ja: "ベスト区間編集 + 音量調整 + エコー効果追加", zh: "最佳片段编辑 + 音量调节 + 回声效果" }, isFree: true },
    { id: "ai", name: { ko: "기본 + AI 보정", en: "Basic + AI Correction", ja: "基本 + AI補正", zh: "基本 + AI修正" }, price: 20000, desc: { ko: "틀린 음정을 AI로 자동 수정", en: "Auto-correct pitch with AI", ja: "音程をAIで自動修正", zh: "AI自动修正音准" } },
    { id: "engineer", name: { ko: "기본 + 전문가 보정", en: "Basic + Expert Correction", ja: "基本 + 専門家補正", zh: "基本 + 专家修正" }, price: 100000, desc: { ko: "틀린 음정을 전문가가 수작업으로 수정", en: "Expert manual pitch correction", ja: "専門家が手作業で音程を修正", zh: "专家手动修正音准" } },
  ],
  video: [
    { id: "self", name: { ko: "셀프 촬영", en: "Self Recording", ja: "セルフ撮影", zh: "自拍录制" }, price: 0, desc: { ko: "셀피용 스탠드 제공", en: "Selfie stand provided", ja: "セルフィースタンド提供", zh: "提供自拍支架" }, isFree: true },
    { id: "cameraman", name: { ko: "셀프 + 촬영기사", en: "Self + Cameraman", ja: "セルフ + カメラマン", zh: "自拍 + 摄影师" }, price: 20000, desc: { ko: "DSLR카메라로 촬영 (원본 파일 제공)", en: "DSLR filming (raw files provided)", ja: "DSLRカメラで撮影（原本ファイル提供）", zh: "DSLR拍摄（提供原始文件）" } },
    { id: "full", name: { ko: "AI 숏폼 뮤직비디오", en: "AI Short-form Music Video", ja: "AIショートMV", zh: "AI短视频MV" }, price: 100000, desc: { ko: "1분 이내의 인공지능으로 생성한 숏폼 뮤직비디오", en: "AI-generated short-form music video under 1 minute", ja: "1分以内のAI生成ショートミュージックビデオ", zh: "1分钟以内AI生成的短视频音乐MV" }, sampleVideoUrl: "https://youtube.com/shorts/1ahalbJaGFk" },
  ],
  release: [
    { id: "standard", name: { ko: "앨범 발매", en: "Album Release", ja: "アルバムリリース", zh: "专辑发行" }, price: 200000, desc: { ko: "전세계 음원 사이트에 발매 (반주 제작 + 앨범 자켓 + 저작권료)", en: "Release on all streaming platforms worldwide", ja: "全世界の音楽サイトでリリース", zh: "在全球音乐平台发行" } },
    { id: "pro", name: { ko: "전문가 앨범 발매", en: "Pro Album Release", ja: "プロアルバムリリース", zh: "专业专辑发行" }, price: 500000, desc: { ko: "전문 발매 서비스 (맞춤 반주 + 앨범 자켓 + 수정 2회)", en: "Professional release with custom production", ja: "プロリリースサービス（カスタム伴奏 + アルバムジャケット + 修正2回）", zh: "专业发行服务（定制伴奏 + 封面 + 2次修改）" } },
  ],
  lp: [
    { id: "lp", name: { ko: "LP 레코드 제작", en: "LP Record Production", ja: "LPレコード制作", zh: "LP唱片制作" }, price: 300000, desc: { ko: "물리적 레코드판 제작 후 배송", en: "Physical vinyl record, delivered to your address", ja: "フィジカルレコード制作後配送", zh: "制作实体唱片并邮寄" } },
  ],
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString()}`;
}

export default function NftPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [promoUrl, setPromoUrl] = useState("");
  const [promoPlatform, setPromoPlatform] = useState("");
  const [promoSubmitted, setPromoSubmitted] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const tx = translations[lang];

  const { data: paypalConfig } = useQuery<{ clientId: string }>({
    queryKey: ['/api/paypal/client-id'],
    enabled: lang !== "ko",
  });

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["/api/nft", token],
    queryFn: () => fetch(`/api/nft/${token}`).then(r => {
      if (!r.ok) throw new Error("Page not found");
      return r.json();
    }),
    enabled: !!token,
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nft/${token}/download`);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = page?.audioFileName || "recording.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nft", token] });
      toast({ title: tx.downloadToastTitle, description: tx.downloadToastDesc });
    },
    onError: () => {
      toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (serviceIds: string[]) => {
      const serviceDetails = serviceIds.map(id => {
        for (const category of Object.values(services)) {
          const found = category.find(s => s.id === id);
          if (found) return { id: found.id, name: found.name.ko, nameEn: found.name.en, price: found.price };
        }
        return null;
      }).filter(Boolean);

      const totalPrice = serviceDetails.reduce((sum, s: any) => sum + (s?.price || 0), 0);
      const appliedCoupon = Math.min(availableCoupon, totalPrice);

      const res = await apiRequest("POST", `/api/nft/${token}/request-service`, {
        services: serviceDetails,
        couponApplied: appliedCoupon > 0 ? appliedCoupon : undefined,
        language: lang,
      });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setSelectedServices([]);
      queryClient.invalidateQueries({ queryKey: ["/api/nft", token] });
      toast({ title: tx.requestToastTitle, description: tx.requestToastDesc });
    },
    onError: () => {
      toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
    },
  });

  const promoMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/nft/${token}/submit-promo`, {
        snsUrl: promoUrl,
        snsPlatform: promoPlatform,
      });
      return res.json();
    },
    onSuccess: () => {
      setPromoSubmitted(true);
      setPromoUrl("");
      setPromoPlatform("");
      queryClient.invalidateQueries({ queryKey: ["/api/nft", token] });
      toast({ title: tx.promoSubmitted });
    },
    onError: () => {
      toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
    },
  });

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (lang !== "ko" && paypalConfig?.clientId && !paypalLoaded) {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        setPaypalLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=USD&disable-funding=card,credit`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    }
  }, [lang, paypalConfig, paypalLoaded]);

  const getServiceDetails = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      for (const category of Object.values(services)) {
        const found = category.find(s => s.id === id);
        if (found) return { id: found.id, name: found.name.ko, nameEn: found.name.en, price: found.price };
      }
      return null;
    }).filter(Boolean);
  };

  const existingRequests = page?.serviceRequests ? JSON.parse(page.serviceRequests) : [];
  const approvedCoupons = (page?.promoCoupons || []).filter((c: any) => c.status === "approved" && c.couponAmount > 0);
  const totalCouponAmount = approvedCoupons.reduce((sum: number, c: any) => sum + (c.couponAmount || 0), 0);
  const usedCouponAmount = existingRequests.reduce((sum: number, r: any) => sum + (r.couponApplied || 0), 0);
  const availableCoupon = Math.max(0, totalCouponAmount - usedCouponAmount);

  const totalSelected = selectedServices.reduce((sum, id) => {
    for (const category of Object.values(services)) {
      const found = category.find(s => s.id === id);
      if (found) return sum + found.price;
    }
    return sum;
  }, 0);
  const couponToApply = Math.min(availableCoupon, totalSelected);
  const finalTotal = totalSelected - couponToApply;

  useEffect(() => {
    if (lang === "ko" || !paypalLoaded || !paypalButtonRef.current || !(window as any).paypal || selectedServices.length === 0 || finalTotal <= 0) {
      if (paypalButtonRef.current) paypalButtonRef.current.innerHTML = '';
      return;
    }

    paypalButtonRef.current.innerHTML = '';
    const serviceDetails = getServiceDetails(selectedServices);
    const appliedCoupon = Math.min(availableCoupon, totalSelected);

    (window as any).paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 45 },
      createOrder: async () => {
        setPaypalProcessing(true);
        try {
          const res = await fetch(`/api/nft/${token}/create-paypal-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ services: serviceDetails, couponApplied: appliedCoupon > 0 ? appliedCoupon : undefined }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          return data.id;
        } catch (err) {
          setPaypalProcessing(false);
          toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
          throw err;
        }
      },
      onApprove: async (data: any) => {
        try {
          const captureRes = await fetch(`/api/nft/${token}/capture-paypal-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID }),
          });
          if (!captureRes.ok) throw new Error("Capture failed");

          await apiRequest("POST", `/api/nft/${token}/request-service`, {
            services: serviceDetails,
            couponApplied: appliedCoupon > 0 ? appliedCoupon : undefined,
            paypalOrderId: data.orderID,
            language: lang,
          });

          setSubmitted(true);
          setSelectedServices([]);
          queryClient.invalidateQueries({ queryKey: ["/api/nft", token] });
          toast({ title: tx.paymentCompleted, description: tx.requestToastDesc });
        } catch (err) {
          toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
        } finally {
          setPaypalProcessing(false);
        }
      },
      onError: () => {
        setPaypalProcessing(false);
        toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
      },
      onCancel: () => {
        setPaypalProcessing(false);
      },
    }).render(paypalButtonRef.current);
  }, [lang, paypalLoaded, selectedServices, finalTotal, totalSelected, availableCoupon]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">{tx.pageNotFound}</h1>
          <p className="text-gray-400">{tx.pageNotFoundSub}</p>
        </div>
      </div>
    );
  }

  const renderServiceItem = (s: ServiceItem) => {
    if (s.isFree) {
      return (
        <div
          key={s.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-green-800/40 bg-green-900/10"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{s.name[lang]}</span>
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">{tx.alreadyProvided}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{s.desc[lang]}</p>
          </div>
        </div>
      );
    }

    return (
      <label
        key={s.id}
        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
          selectedServices.includes(s.id)
            ? "border-yellow-500/50 bg-yellow-500/5"
            : "border-gray-800 hover:border-gray-700"
        }`}
      >
        <input
          type="checkbox"
          checked={selectedServices.includes(s.id)}
          onChange={() => toggleService(s.id)}
          className="mt-1 accent-yellow-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{s.name[lang]}</span>
            <span className="text-yellow-500 text-sm font-bold">{formatPrice(s.price)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{s.desc[lang]}</p>
          {s.sampleVideoUrl && (() => {
            let embedId = "";
            try {
              const url = s.sampleVideoUrl!;
              if (url.includes("shorts/")) embedId = url.split("shorts/")[1].split(/[?&]/)[0];
              else if (url.includes("youtu.be/")) embedId = url.split("youtu.be/")[1].split(/[?&]/)[0];
              else if (url.includes("v=")) embedId = url.split("v=")[1].split(/[?&]/)[0];
              else if (url.includes("embed/")) embedId = url.split("embed/")[1].split(/[?&]/)[0];
            } catch {}
            if (!embedId) return null;
            const isShort = s.sampleVideoUrl!.includes("shorts/");
            return (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full" style={{ paddingBottom: isShort ? "177.78%" : "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${embedId}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-2 mb-6">
          {languageOptions.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === l.code
                  ? "bg-yellow-600 text-black"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 bg-gray-900/80 border border-gray-800 rounded-lg px-4 py-3">
          <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            {tx.privatePage} <span className="text-yellow-500 font-semibold">{tx.private}</span> {tx.privateDesc}
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-700/30 rounded-full px-4 py-1 mb-4">
            <span className="text-yellow-500 text-xs font-bold tracking-widest uppercase">{tx.nftKeyring}</span>
          </div>
          <h1 className="text-3xl font-black mb-1">
            {page.customerName}
            {page.koreanName && <span className="text-gray-400 text-xl ml-2">({page.koreanName})</span>}
          </h1>
          <p className="text-gray-500 text-sm">{page.recordingDate}</p>
        </div>

        {page.albumCoverImage && (
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/10 border border-gray-800">
              <img
                src={page.albumCoverImage}
                alt="Album Cover"
                className="w-full"
              />
            </div>
          </div>
        )}

        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Download className="w-5 h-5 text-yellow-500" />
              {tx.downloadTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {page.audioStatus === "pending" && (
              <div className="text-center py-6">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-5 h-5 text-yellow-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-400 font-medium">{tx.postProduction}</p>
                <p className="text-gray-600 text-xs mt-2">{tx.postProductionSub}</p>
              </div>
            )}
            {page.audioStatus === "ready" && page.hasAudioFile && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-sm font-medium">{tx.fileReady}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{page.audioFileName}</p>
                <Button
                  onClick={() => downloadMutation.mutate()}
                  disabled={downloadMutation.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-8"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {tx.download}
                </Button>
                <p className="text-red-400/60 text-xs mt-3">{tx.downloadWarning}</p>
              </div>
            )}
            {page.audioStatus === "downloaded" && (
              <div className="text-center py-6">
                <Check className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">{tx.downloadComplete}</p>
                <p className="text-gray-600 text-sm mt-1">{tx.downloadCompleteSub}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Music className="w-5 h-5 text-yellow-500" />
              {tx.additionalServices}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Headphones className="w-4 h-4" /> {tx.soundCorrection}
              </h3>
              <div className="space-y-2">
                {services.mixing.map(s => renderServiceItem(s))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Video className="w-4 h-4" /> {tx.videoService}
              </h3>
              <div className="space-y-2">
                {services.video.map(s => renderServiceItem(s))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Disc3 className="w-4 h-4" /> {tx.albumRelease}
              </h3>
              <div className="space-y-2">
                {services.release.map(s => renderServiceItem(s))}
                {services.lp.map(s => renderServiceItem(s))}
              </div>
            </div>

            {availableCoupon > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/20 border border-green-700/30">
                <Gift className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-green-400 text-xs font-bold">{tx.couponAvailable}</span>
                  <span className="text-green-300 text-sm font-black ml-2">{formatPrice(availableCoupon)}</span>
                </div>
              </div>
            )}

            {selectedServices.length > 0 && (
              <div className="border-t border-gray-800 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{tx.selected}</span>
                  <span className={`text-sm font-bold ${couponToApply > 0 ? "text-gray-500 line-through" : "text-yellow-500 text-lg font-black"}`}>{formatPrice(totalSelected)}</span>
                </div>
                {couponToApply > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400 flex items-center gap-1"><Gift className="w-3 h-3" /> {tx.couponDiscount}</span>
                      <span className="text-green-400 text-sm font-bold">-{formatPrice(couponToApply)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-700 pt-2">
                      <span className="text-sm text-white font-bold">{tx.finalTotal}</span>
                      <span className="text-lg font-black text-yellow-500">{formatPrice(finalTotal)}</span>
                    </div>
                  </>
                )}
                {lang !== "ko" && finalTotal > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-center text-gray-400">{tx.paypalRequired}</p>
                    {paypalProcessing && (
                      <div className="flex items-center justify-center gap-2 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                        <span className="text-sm text-gray-400">{tx.paypalProcessing}</span>
                      </div>
                    )}
                    <div ref={paypalButtonRef} className="w-full" />
                    {!paypalLoaded && (
                      <div className="flex items-center justify-center py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500 mr-2" />
                        <span className="text-xs text-gray-500">Loading PayPal...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => requestMutation.mutate(selectedServices)}
                    disabled={requestMutation.isPending}
                    className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black font-bold py-3"
                  >
                    {requestMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Music className="w-4 h-4 mr-2" />
                    )}
                    {tx.requestServices}
                  </Button>
                )}
              </div>
            )}

            {submitted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <Check className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-green-400 text-sm font-medium">{tx.requestSubmitted}</p>
                <p className="text-gray-500 text-xs mt-1">{tx.requestSubmittedSub}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {existingRequests.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">{tx.requestHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {existingRequests.map((req: any, i: number) => (
                  <div key={i} className="border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(req.requestedAt).toLocaleDateString("ko-KR")}
                      </span>
                      <Badge variant={req.status === "booked" ? "default" : req.status === "pending" ? "secondary" : req.status === "completed" ? "default" : "outline"}
                        className={req.status === "booked" ? "bg-blue-600/20 text-blue-400 border-blue-600/30" : ""}
                      >
                        {req.status === "booked" ? tx.booked : req.status === "pending" ? tx.pending : req.status === "completed" ? tx.completed : req.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {req.services?.map((s: any, j: number) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{s.name || s.nameEn}</span>
                          <span className="text-yellow-500 text-xs">{formatPrice(s.price || 0)}</span>
                        </div>
                      ))}
                      {req.couponApplied > 0 && (
                        <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-1 mt-1">
                          <span className="text-green-400 text-xs flex items-center gap-1"><Gift className="w-3 h-3" /> {tx.couponUsed}</span>
                          <span className="text-green-400 text-xs font-bold">-{formatPrice(req.couponApplied)}</span>
                        </div>
                      )}
                    </div>
                    {req.deliveryFiles && req.deliveryFiles.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-800">
                        <p className="text-xs text-blue-400 font-bold mb-1.5 flex items-center gap-1">
                          <Download className="w-3 h-3" /> {tx.deliveredFiles}
                        </p>
                        <div className="space-y-1">
                          {req.deliveryFiles.map((f: any, fi: number) => (
                            <a
                              key={fi}
                              href={`/api/nft/${token}/service-file/${req.id}/${fi}`}
                              download={f.name}
                              className="flex items-center gap-2 p-2 rounded bg-blue-900/20 border border-blue-800/30 hover:bg-blue-900/40 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              <span className="text-blue-300 text-xs truncate">{f.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 rounded-2xl overflow-hidden border-2 border-dashed border-yellow-500/60 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent">
          <div className="bg-yellow-500 text-black text-center py-3 px-4">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-black text-lg tracking-wide">{tx.promoTitle}</span>
              <Gift className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="text-center space-y-2">
              <p className="text-white text-sm font-medium">{tx.promoDesc}</p>
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/40 rounded-full px-5 py-2">
                <span className="text-yellow-400 font-black text-xl">{tx.promoReward}</span>
              </div>
              <p className="text-yellow-500/70 text-xs font-medium">{tx.promoRewardRange}</p>
              <p className="text-gray-500 text-xs">{tx.promoRewardDetail}</p>
              <p className="text-gray-600 text-[11px]">* {tx.promoUseDetail}</p>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-400 text-xs font-semibold">{tx.promoAnyPlatform}</p>
              <div className="flex items-center justify-center gap-3 flex-wrap px-2">
                <SiInstagram className="w-5 h-5 text-pink-400" />
                <SiTiktok className="w-5 h-5 text-white" />
                <SiYoutube className="w-5 h-5 text-red-500" />
                <SiX className="w-4 h-4 text-white" />
                <SiFacebook className="w-5 h-5 text-blue-500" />
                <SiThreads className="w-5 h-5 text-white" />
                <SiNaver className="w-5 h-5 text-green-500" />
                <SiWechat className="w-5 h-5 text-green-400" />
                <span className="text-red-500 font-black text-[10px] leading-none border border-red-500/40 rounded px-1 py-0.5">RED</span>
                <SiPinterest className="w-5 h-5 text-red-600" />
                <FaBlog className="w-4 h-4 text-orange-400" />
                <span className="text-gray-500 text-xs font-medium">etc.</span>
              </div>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-gray-800/60">
              <div className="flex items-stretch gap-1">
                {[
                  { step: "1", icon: <Camera className="w-4 h-4" />, title: tx.promoStep1, desc: tx.promoStep1Desc },
                  { step: "2", icon: <Link className="w-4 h-4" />, title: tx.promoStep2, desc: tx.promoStep2Desc },
                  { step: "3", icon: <Gift className="w-4 h-4" />, title: tx.promoStep3, desc: tx.promoStep3Desc },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-stretch flex-1">
                    <div className="text-center flex-1">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center mx-auto mb-1.5 text-sm font-black">
                        {s.icon}
                      </div>
                      <p className="text-white text-[11px] font-bold leading-tight">{s.title}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5 leading-tight">{s.desc}</p>
                    </div>
                    {i < 2 && (
                      <div className="flex items-center px-0.5">
                        <ArrowRight className="w-3 h-3 text-yellow-600/60" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-gray-900/60 rounded-xl p-4 border border-gray-800/40">
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium">{tx.promoSelectPlatform}</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { name: "Instagram", icon: <SiInstagram className="w-3.5 h-3.5" /> },
                    { name: "TikTok", icon: <SiTiktok className="w-3.5 h-3.5" /> },
                    { name: "YouTube", icon: <SiYoutube className="w-3.5 h-3.5" /> },
                    { name: "X", icon: <SiX className="w-3 h-3" /> },
                    { name: "Facebook", icon: <SiFacebook className="w-3.5 h-3.5" /> },
                    { name: "小红书", icon: <span className="text-[10px] font-bold">RED</span> },
                    { name: "抖音(Douyin)", icon: <span className="text-[10px] font-bold">DY</span> },
                    { name: "LINE", icon: <span className="text-[10px] font-bold">L</span> },
                    { name: "Ameba", icon: <span className="text-[10px] font-bold">A</span> },
                    { name: "Naver", icon: <SiNaver className="w-3 h-3" /> },
                    { name: "Blog", icon: <FaBlog className="w-3 h-3" /> },
                    { name: "Other", icon: <FaGlobe className="w-3 h-3" /> },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setPromoPlatform(p.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        promoPlatform === p.name
                          ? "bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20"
                          : "bg-gray-800/80 text-gray-400 border-gray-700/50 hover:border-gray-600 hover:bg-gray-700/80"
                      }`}
                    >
                      {p.icon}
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">{tx.promoSnsUrl}</label>
                <input
                  type="url"
                  value={promoUrl}
                  onChange={(e) => setPromoUrl(e.target.value)}
                  placeholder={tx.promoSnsUrlPlaceholder}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all"
                />
              </div>

              <Button
                onClick={() => promoMutation.mutate()}
                disabled={!promoUrl || !promoPlatform || promoMutation.isPending}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 text-base rounded-xl disabled:opacity-30 shadow-lg shadow-yellow-500/20 transition-all"
              >
                {promoMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {tx.promoSubmit}
              </Button>
            </div>

            {promoSubmitted && (
              <div className="bg-green-500/15 border border-green-500/40 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-green-400 text-sm font-semibold">{tx.promoSubmitted}</p>
              </div>
            )}

            {page?.promoCoupons && page.promoCoupons.length > 0 && (
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-xs text-gray-400 mb-3 font-semibold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  {tx.promoHistory}
                </h4>
                <div className="space-y-2">
                  {page.promoCoupons.map((c: any) => (
                    <div key={c.id} className="bg-black/40 border border-gray-800/60 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs bg-gray-800 border-gray-700" variant="outline">{c.snsPlatform}</Badge>
                          <a
                            href={c.snsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <Badge className={`text-xs ${
                          c.status === "approved"
                            ? "bg-green-600/20 text-green-400 border-green-600/30"
                            : c.status === "rejected"
                            ? "bg-red-600/20 text-red-400 border-red-600/30"
                            : "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                        }`}>
                          {c.status === "approved" ? tx.promoStatusApproved
                            : c.status === "rejected" ? tx.promoStatusRejected
                            : tx.promoStatusPending}
                        </Badge>
                      </div>
                      {c.status === "approved" && c.couponAmount && (
                        <div className="flex items-center gap-1.5 mt-2 bg-yellow-500/10 rounded-lg px-3 py-1.5">
                          <Gift className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-400 font-black text-sm">
                            {tx.promoCouponAmount}: {formatPrice(c.couponAmount)}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-600 text-xs mt-1.5">
                        {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-gray-700 text-xs mt-12 pb-8">
          <p>{tx.copyright}</p>
        </div>
      </div>
    </div>
  );
}

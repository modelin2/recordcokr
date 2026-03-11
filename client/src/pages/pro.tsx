import { useState } from "react";
import { Link } from "wouter";
import { Clock, CheckCircle, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/K-RecordingCafe_1751778566542.png";
import controlRoom from "@assets/레코딩카페_컨트롤룸_1768188070634-CLECM5p7_1769069179476.png";
import recordingBooth from "@assets/레코딩카페_녹음부스_1768188070630-BjcyLYYV_1769069179482.png";
import heroImage from "@assets/recordingcafe_(2)_1768193796781-CiKs2y1L_1769070144968.png";

type Language = "ko" | "en" | "ja" | "zh";

const translations = {
  ko: {
    nav: { experience: "체험 에디션", pro: "프로 에디션", faq: "FAQ", reserve: "예약하기", home: "홈" },
    hero: {
      badge: "프로 에디션",
      title: "당신의 음악, K-POP 아티스트와",
      titleHighlight: "동일한 방식으로 세상에 내보내세요",
      subtitle: "KOMCA(한국음악저작권협회) 소속 최고의 작곡가와 함께 당신만의 K-POP 음반을 제작합니다",
    },
    services: {
      title: "포함 서비스",
      titleHighlight: "7가지",
      items: [
        { icon: "🎼", title: "KOMCA 전속 작곡가 1:1 매칭", desc: "한국음악저작권협회 소속 검증된 전문 작곡가와 1:1 매칭" },
        { icon: "🎸", title: "레퍼런스 기반 완전 맞춤 편곡·작사", desc: "원하는 아티스트 스타일을 레퍼런스로 제시하면 맞춤 편곡과 작사 제공" },
        { icon: "🎙️", title: "전문 스튜디오 레코딩 (최대 5회 수정)", desc: "전문 레코딩 부스에서 진행되는 고품질 레코딩, 최대 5회 수정 가능" },
        { icon: "🎛️", title: "전문 믹싱 & 마스터링", desc: "상업용 음원 수준의 믹싱과 마스터링으로 완성도 있는 사운드 구현" },
        { icon: "🎨", title: "앨범 커버 디자인", desc: "전문 디자이너가 제작하는 상업용 앨범 커버 아트워크" },
        { icon: "🌍", title: "전 세계 음원 스트리밍 정식 발매", desc: "Spotify, Apple Music, YouTube Music, Melon, Genie 등 전 세계 주요 플랫폼 정식 발매" },
        { icon: "💰", title: "영구 저작권료 수익 등록", desc: "저작권 사후 70년까지 유효한 영구적 저작권료 수익 구조 등록" },
      ],
    },
    timeline: {
      title: "12주 제작",
      titleHighlight: "타임라인",
      weeks: [
        { week: "1~2주", title: "기획 & 작곡가 매칭", desc: "레퍼런스 분석 및 KOMCA 작곡가 1:1 매칭" },
        { week: "3~4주", title: "작곡 & 편곡", desc: "맞춤 작곡 및 편곡 진행, 중간 피드백" },
        { week: "5~6주", title: "작사 & 보컬 준비", desc: "가사 작성 및 보컬 트레이닝 지원" },
        { week: "7~8주", title: "레코딩", desc: "전문 스튜디오 레코딩 (최대 5회 수정)" },
        { week: "9~10주", title: "믹싱 & 마스터링", desc: "전문 엔지니어의 믹싱 및 마스터링" },
        { week: "11주", title: "앨범 커버 & 유통 준비", desc: "앨범 아트워크 제작 및 유통 신청" },
        { week: "12주", title: "전 세계 정식 발매", desc: "Spotify 등 전 세계 플랫폼 동시 발매" },
      ],
    },
    pricing: {
      title: "가격",
      titleHighlight: "안내",
      tiers: [
        {
          name: "스탠다드",
          price: "₩15,000,000~",
          desc: "K-POP 음반 제작의 시작",
          features: ["KOMCA 작곡가 매칭", "맞춤 편곡·작사", "스튜디오 레코딩 (3회 수정)", "믹싱 & 마스터링", "전 세계 발매"],
          highlight: false,
          cta: "문의하기",
        },
        {
          name: "프리미엄",
          price: "₩25,000,000~",
          desc: "최고 수준의 K-POP 음반",
          features: ["KOMCA 톱클래스 작곡가 매칭", "맞춤 편곡·작사", "스튜디오 레코딩 (5회 수정)", "전문 믹싱 & 마스터링", "앨범 커버 디자인", "전 세계 발매", "저작권 수익 등록", "AI 뮤직비디오"],
          highlight: true,
          cta: "프리미엄 문의",
        },
        {
          name: "엔터프라이즈",
          price: "별도 협의",
          desc: "기업·기관 맞춤 대형 프로젝트",
          features: ["모든 프리미엄 기능", "전담 PM 배정", "무제한 수정", "LP 제작", "콘서트 기획", "브랜드 IP 구축"],
          highlight: false,
          cta: "협의 요청",
        },
      ],
    },
    contact: {
      title: "지금 바로",
      titleHighlight: "문의하세요",
      whatsapp: "WhatsApp으로 문의",
      kakao: "카카오톡으로 문의",
      formTitle: "온라인 문의 양식",
      name: "이름",
      email: "이메일",
      phone: "전화번호",
      budget: "예산",
      message: "메시지",
      messagePlaceholder: "원하시는 음악 스타일, 레퍼런스 아티스트, 프로젝트 목표 등을 자유롭게 적어주세요",
      submit: "문의 보내기",
      submitting: "전송 중...",
      budgetOptions: ["₩15,000,000 ~ ₩25,000,000", "₩25,000,000 ~ ₩50,000,000", "₩50,000,000 이상", "별도 협의"],
      successTitle: "문의가 접수되었습니다",
      successDesc: "빠른 시일 내에 연락드리겠습니다.",
    },
  },
  en: {
    nav: { experience: "Experience Edition", pro: "Pro Edition", faq: "FAQ", reserve: "Reserve", home: "Home" },
    hero: {
      badge: "Pro Edition",
      title: "Your Music, Released to the World",
      titleHighlight: "the Same Way K-POP Artists Do",
      subtitle: "Create your own K-POP album with the best KOMCA (Korea Music Copyright Association) affiliated composers",
    },
    services: {
      title: "7 Included",
      titleHighlight: "Services",
      items: [
        { icon: "🎼", title: "1:1 KOMCA Exclusive Composer Matching", desc: "Matched with a verified professional composer affiliated with the Korea Music Copyright Association" },
        { icon: "🎸", title: "Fully Custom Arrangement & Lyrics Based on Reference", desc: "Provide your reference artist style and receive custom arrangement and lyrics" },
        { icon: "🎙️", title: "Professional Studio Recording (Up to 5 Revisions)", desc: "High-quality recording in a professional recording booth with up to 5 revisions" },
        { icon: "🎛️", title: "Professional Mixing & Mastering", desc: "Commercial-grade mixing and mastering for a polished sound" },
        { icon: "🎨", title: "Album Cover Design", desc: "Commercial album cover artwork created by professional designers" },
        { icon: "🌍", title: "Official Global Streaming Release", desc: "Official release on Spotify, Apple Music, YouTube Music, Melon, Genie and all major platforms worldwide" },
        { icon: "💰", title: "Permanent Royalty Income Registration", desc: "Permanent royalty structure valid for 70 years after copyright" },
      ],
    },
    timeline: {
      title: "12-Week Production",
      titleHighlight: "Timeline",
      weeks: [
        { week: "Week 1~2", title: "Planning & Composer Matching", desc: "Reference analysis and 1:1 KOMCA composer matching" },
        { week: "Week 3~4", title: "Composition & Arrangement", desc: "Custom composition and arrangement with interim feedback" },
        { week: "Week 5~6", title: "Lyrics & Vocal Prep", desc: "Lyric writing and vocal training support" },
        { week: "Week 7~8", title: "Recording", desc: "Professional studio recording (up to 5 revisions)" },
        { week: "Week 9~10", title: "Mixing & Mastering", desc: "Mixing and mastering by professional engineers" },
        { week: "Week 11", title: "Album Cover & Distribution Prep", desc: "Album artwork production and distribution application" },
        { week: "Week 12", title: "Global Official Release", desc: "Simultaneous release on Spotify and all global platforms" },
      ],
    },
    pricing: {
      title: "Pricing",
      titleHighlight: "Guide",
      tiers: [
        {
          name: "Standard",
          price: "₩15,000,000~",
          desc: "Your first K-POP album production",
          features: ["KOMCA composer matching", "Custom arrangement & lyrics", "Studio recording (3 revisions)", "Mixing & mastering", "Global release"],
          highlight: false,
          cta: "Inquire",
        },
        {
          name: "Premium",
          price: "₩25,000,000~",
          desc: "Top-tier K-POP album production",
          features: ["KOMCA top-class composer", "Custom arrangement & lyrics", "Studio recording (5 revisions)", "Pro mixing & mastering", "Album cover design", "Global release", "Royalty income registration", "AI music video"],
          highlight: true,
          cta: "Inquire Premium",
        },
        {
          name: "Enterprise",
          price: "Contact Us",
          desc: "Custom large-scale project for companies",
          features: ["All Premium features", "Dedicated PM", "Unlimited revisions", "LP production", "Concert planning", "Brand IP development"],
          highlight: false,
          cta: "Request Consultation",
        },
      ],
    },
    contact: {
      title: "Contact Us",
      titleHighlight: "Now",
      whatsapp: "Contact via WhatsApp",
      kakao: "Contact via KakaoTalk",
      formTitle: "Online Inquiry Form",
      name: "Name",
      email: "Email",
      phone: "Phone",
      budget: "Budget",
      message: "Message",
      messagePlaceholder: "Feel free to write about your desired music style, reference artists, project goals, etc.",
      submit: "Send Inquiry",
      submitting: "Sending...",
      budgetOptions: ["₩15,000,000 ~ ₩25,000,000", "₩25,000,000 ~ ₩50,000,000", "₩50,000,000+", "To be discussed"],
      successTitle: "Inquiry Received",
      successDesc: "We will contact you as soon as possible.",
    },
  },
  ja: {
    nav: { experience: "体験エディション", pro: "プロエディション", faq: "FAQ", reserve: "予約する", home: "ホーム" },
    hero: {
      badge: "プロエディション",
      title: "あなたの音楽を、K-POPアーティストと",
      titleHighlight: "同じ方法で世界に届けましょう",
      subtitle: "KOMCA（韓国音楽著作権協会）所属の最高の作曲家と共に、あなただけのK-POPアルバムを制作します",
    },
    services: {
      title: "含まれる",
      titleHighlight: "7つのサービス",
      items: [
        { icon: "🎼", title: "KOMCA専属作曲家 1:1マッチング", desc: "韓国音楽著作権協会所属の検証済み専門作曲家と1:1マッチング" },
        { icon: "🎸", title: "リファレンス基づく完全カスタム編曲・作詞", desc: "希望のアーティストスタイルをリファレンスとして提示すると、カスタム編曲と作詞を提供" },
        { icon: "🎙️", title: "プロスタジオレコーディング（最大5回修正）", desc: "プロのレコーディングブースでの高品質レコーディング、最大5回の修正が可能" },
        { icon: "🎛️", title: "プロミキシング & マスタリング", desc: "商業用音源レベルのミキシングとマスタリングで完成度の高いサウンドを実現" },
        { icon: "🎨", title: "アルバムカバーデザイン", desc: "プロデザイナーが制作する商業用アルバムカバーアートワーク" },
        { icon: "🌍", title: "全世界音源ストリーミング正式発売", desc: "Spotify、Apple Music、YouTube Music、Melon、Genieなど全世界の主要プラットフォームで正式発売" },
        { icon: "💰", title: "永続著作権収益登録", desc: "著作権死後70年まで有効な永続的な著作権収益構造の登録" },
      ],
    },
    timeline: {
      title: "12週間制作",
      titleHighlight: "タイムライン",
      weeks: [
        { week: "1〜2週目", title: "企画 & 作曲家マッチング", desc: "リファレンス分析とKOMCA作曲家1:1マッチング" },
        { week: "3〜4週目", title: "作曲 & 編曲", desc: "カスタム作曲と編曲、中間フィードバック" },
        { week: "5〜6週目", title: "作詞 & ボーカル準備", desc: "歌詞作成とボーカルトレーニングサポート" },
        { week: "7〜8週目", title: "レコーディング", desc: "プロスタジオレコーディング（最大5回修正）" },
        { week: "9〜10週目", title: "ミキシング & マスタリング", desc: "専門エンジニアによるミキシングとマスタリング" },
        { week: "11週目", title: "アルバムカバー & 流通準備", desc: "アルバムアートワーク制作と流通申請" },
        { week: "12週目", title: "全世界正式発売", desc: "Spotifyなど全世界プラットフォームで同時発売" },
      ],
    },
    pricing: {
      title: "料金",
      titleHighlight: "案内",
      tiers: [
        {
          name: "スタンダード",
          price: "₩15,000,000~",
          desc: "K-POPアルバム制作のスタート",
          features: ["KOMCA作曲家マッチング", "カスタム編曲・作詞", "スタジオレコーディング（3回修正）", "ミキシング & マスタリング", "全世界発売"],
          highlight: false,
          cta: "お問い合わせ",
        },
        {
          name: "プレミアム",
          price: "₩25,000,000~",
          desc: "最高水準のK-POPアルバム",
          features: ["KOMCAトップクラス作曲家", "カスタム編曲・作詞", "スタジオレコーディング（5回修正）", "プロミキシング & マスタリング", "アルバムカバーデザイン", "全世界発売", "著作権収益登録", "AIミュージックビデオ"],
          highlight: true,
          cta: "プレミアムお問い合わせ",
        },
        {
          name: "エンタープライズ",
          price: "別途協議",
          desc: "企業・機関向けカスタム大型プロジェクト",
          features: ["全プレミアム機能", "専任PM配置", "無制限修正", "LP制作", "コンサート企画", "ブランドIP構築"],
          highlight: false,
          cta: "協議依頼",
        },
      ],
    },
    contact: {
      title: "今すぐ",
      titleHighlight: "お問い合わせ",
      whatsapp: "WhatsAppでお問い合わせ",
      kakao: "KakaoTalkでお問い合わせ",
      formTitle: "オンラインお問い合わせフォーム",
      name: "お名前",
      email: "メールアドレス",
      phone: "電話番号",
      budget: "予算",
      message: "メッセージ",
      messagePlaceholder: "ご希望の音楽スタイル、リファレンスアーティスト、プロジェクト目標などをご自由にお書きください",
      submit: "お問い合わせを送る",
      submitting: "送信中...",
      budgetOptions: ["₩15,000,000 ~ ₩25,000,000", "₩25,000,000 ~ ₩50,000,000", "₩50,000,000以上", "別途協議"],
      successTitle: "お問い合わせを受け付けました",
      successDesc: "できるだけ早くご連絡いたします。",
    },
  },
  zh: {
    nav: { experience: "体验版", pro: "专业版", faq: "常见问题", reserve: "预约", home: "首页" },
    hero: {
      badge: "专业版",
      title: "您的音乐，以K-POP艺人",
      titleHighlight: "相同的方式向世界发布",
      subtitle: "与KOMCA（韩国音乐著作权协会）顶级作曲家共同制作属于您的K-POP专辑",
    },
    services: {
      title: "包含",
      titleHighlight: "7项服务",
      items: [
        { icon: "🎼", title: "KOMCA专属作曲家1:1匹配", desc: "与韩国音乐著作权协会认证的专业作曲家进行1:1匹配" },
        { icon: "🎸", title: "基于参考的完全定制编曲·作词", desc: "提供您想要的艺人风格作为参考，获得定制编曲和作词" },
        { icon: "🎙️", title: "专业录音棚录音（最多5次修改）", desc: "在专业录音棚进行高品质录音，最多可修改5次" },
        { icon: "🎛️", title: "专业混音 & 母带制作", desc: "商业级混音和母带制作，呈现完美音效" },
        { icon: "🎨", title: "专辑封面设计", desc: "专业设计师制作的商业级专辑封面艺术" },
        { icon: "🌍", title: "全球流媒体平台正式发行", desc: "在Spotify、Apple Music、YouTube Music、Melon等全球主要平台正式发行" },
        { icon: "💰", title: "永久版权收益注册", desc: "注册版权死后70年有效的永久版权收益结构" },
      ],
    },
    timeline: {
      title: "12周制作",
      titleHighlight: "时间表",
      weeks: [
        { week: "第1~2周", title: "策划 & 作曲家匹配", desc: "参考分析和KOMCA作曲家1:1匹配" },
        { week: "第3~4周", title: "作曲 & 编曲", desc: "定制作曲与编曲，中间反馈" },
        { week: "第5~6周", title: "作词 & 声乐准备", desc: "歌词创作与声乐训练支持" },
        { week: "第7~8周", title: "录音", desc: "专业录音棚录音（最多5次修改）" },
        { week: "第9~10周", title: "混音 & 母带制作", desc: "专业工程师的混音与母带制作" },
        { week: "第11周", title: "专辑封面 & 发行准备", desc: "专辑艺术制作和发行申请" },
        { week: "第12周", title: "全球正式发行", desc: "在Spotify等全球平台同步发行" },
      ],
    },
    pricing: {
      title: "价格",
      titleHighlight: "指南",
      tiers: [
        {
          name: "标准版",
          price: "₩15,000,000~",
          desc: "K-POP专辑制作的起点",
          features: ["KOMCA作曲家匹配", "定制编曲·作词", "录音棚录音（3次修改）", "混音 & 母带制作", "全球发行"],
          highlight: false,
          cta: "咨询",
        },
        {
          name: "高级版",
          price: "₩25,000,000~",
          desc: "最高水准的K-POP专辑",
          features: ["KOMCA顶级作曲家", "定制编曲·作词", "录音棚录音（5次修改）", "专业混音 & 母带", "专辑封面设计", "全球发行", "版权收益注册", "AI音乐视频"],
          highlight: true,
          cta: "高级版咨询",
        },
        {
          name: "企业版",
          price: "另行协商",
          desc: "企业·机构定制大型项目",
          features: ["所有高级版功能", "专属项目经理", "无限修改", "LP制作", "演唱会策划", "品牌IP构建"],
          highlight: false,
          cta: "协商请求",
        },
      ],
    },
    contact: {
      title: "立即",
      titleHighlight: "联系我们",
      whatsapp: "通过WhatsApp联系",
      kakao: "通过KakaoTalk联系",
      formTitle: "在线咨询表单",
      name: "姓名",
      email: "电子邮件",
      phone: "电话",
      budget: "预算",
      message: "留言",
      messagePlaceholder: "请随意填写您想要的音乐风格、参考艺人、项目目标等",
      submit: "发送咨询",
      submitting: "发送中...",
      budgetOptions: ["₩15,000,000 ~ ₩25,000,000", "₩25,000,000 ~ ₩50,000,000", "₩50,000,000以上", "另行协商"],
      successTitle: "咨询已收到",
      successDesc: "我们将尽快与您联系。",
    },
  },
};

export default function ProPage() {
  const [lang, setLang] = useState<Language>("ko");
  const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "입력 오류", description: "이름, 이메일, 메시지는 필수입니다", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "pro_inquiry", lang }),
      });
      toast({ title: t.contact.successTitle, description: t.contact.successDesc });
      setForm({ name: "", email: "", phone: "", budget: "", message: "" });
    } catch {
      toast({ title: "오류", description: "전송 중 오류가 발생했습니다", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/">
            <img src={logoImage} alt="K Recording Café" className="h-9 object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">{t.nav.home}</Link>
            <Link href="/experience" className="text-purple-300 hover:text-white transition-colors">{t.nav.experience}</Link>
            <Link href="/pro" className="text-yellow-400 font-bold">{t.nav.pro}</Link>
            <Link href="/menu" className="bg-gradient-to-r from-yellow-600 to-amber-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90">
              {t.nav.reserve}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {(["ko", "en", "ja", "zh"] as Language[]).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs rounded font-bold transition-all ${lang === l ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-16 min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={controlRoom} alt="Pro Studio" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-yellow-900/50 to-gray-950" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <div className="inline-block bg-yellow-500/30 border border-yellow-400/50 rounded-full px-4 py-1 text-sm font-bold text-yellow-200 mb-6">
            {t.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">
            {t.hero.title}
          </h1>
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-6">
            {t.hero.titleHighlight}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t.hero.subtitle}</p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">{t.services.title} </span>
            <span className="text-white">{t.services.titleHighlight}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.services.items.map((item, i) => (
              <div key={i} className={`flex items-start gap-4 bg-gray-900 rounded-2xl p-6 border transition-all hover:border-yellow-500/40 ${i === 0 ? "md:col-span-2 border-yellow-500/30" : "border-gray-800"}`}>
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-black text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            <span className="text-white">{t.timeline.title} </span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">{t.timeline.titleHighlight}</span>
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-amber-700 hidden md:block" />
            <div className="space-y-4">
              {t.timeline.weeks.map((w, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center font-black text-xs text-black z-10">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50 hover:border-yellow-500/30 transition-colors">
                    <div className="text-yellow-400 text-xs font-bold mb-1">{w.week}</div>
                    <h3 className="font-black text-white mb-1">{w.title}</h3>
                    <p className="text-gray-400 text-sm">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            <span className="text-white">{t.pricing.title} </span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">{t.pricing.titleHighlight}</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.pricing.tiers.map((tier, i) => (
              <div key={i} className={`relative rounded-3xl p-8 border transition-all ${tier.highlight
                ? "bg-gradient-to-b from-yellow-900/50 to-amber-900/50 border-yellow-400/60 shadow-2xl shadow-yellow-500/20 scale-[1.02]"
                : "bg-gray-900 border-gray-700/50"
              }`}>
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black text-xs px-4 py-1.5 rounded-full">
                    BEST
                  </div>
                )}
                <h3 className="font-black text-xl text-white mb-2">{tier.name}</h3>
                <div className="text-2xl font-black text-yellow-400 mb-2">{tier.price}</div>
                <p className="text-gray-400 text-sm mb-6">{tier.desc}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-full py-3 rounded-xl font-black transition-all hover:opacity-90 hover:scale-105 ${tier.highlight
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
                    : "bg-gray-800 text-white border border-gray-600"
                  }`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact-form" className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            <span className="text-white">{t.contact.title} </span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">{t.contact.titleHighlight}</span>
          </h2>

          {/* Quick Contact Buttons */}
          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            <a href="https://wa.me/821012345678" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              <span>💬</span> {t.contact.whatsapp}
            </a>
            <a href="https://open.kakao.com/o/recordingcafe" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl transition-colors">
              <span>💛</span> {t.contact.kakao}
            </a>
          </div>

          {/* Form */}
          <div className="bg-gray-800/60 rounded-3xl p-8 border border-gray-700/50">
            <h3 className="font-black text-xl text-white mb-6">{t.contact.formTitle}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">{t.contact.name} *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
                    required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">{t.contact.email} *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
                    required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">{t.contact.phone}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">{t.contact.budget}</label>
                  <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none">
                    <option value="">-</option>
                    {t.contact.budgetOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">{t.contact.message} *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5} placeholder={t.contact.messagePlaceholder}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-500 focus:outline-none resize-none"
                  required />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black py-4 rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {submitting ? t.contact.submitting : t.contact.submit}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Gallery snippet */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
          <img src={controlRoom} alt="Control Room" className="rounded-2xl w-full h-48 object-cover" />
          <img src={recordingBooth} alt="Recording Booth" className="rounded-2xl w-full h-48 object-cover" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/"><img src={logoImage} alt="K Recording Café" className="h-8 object-contain mx-auto mb-3" /></Link>
          <p className="text-gray-500 text-sm mb-1">2F, 21, Gangnam-daero 107-gil, Seocho-gu, Seoul</p>
          <p className="text-gray-600 text-xs">© 2025 K Recording Café. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

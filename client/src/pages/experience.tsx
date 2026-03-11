import { useState } from "react";
import { Link } from "wouter";
import { Clock, Users, Globe, Mic, Star, X, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/K-RecordingCafe_1751778566542.png";
import heroImage from "@assets/recordingcafe_(2)_1768193796781-CiKs2y1L_1769070144968.png";
import controlRoom from "@assets/레코딩카페_컨트롤룸_1768188070634-CLECM5p7_1769069179476.png";
import recordingBooth from "@assets/레코딩카페_녹음부스_1768188070630-BjcyLYYV_1769069179482.png";
import booth1 from "@assets/레코딩카페_부스_1768188070633-BgjB4HnG_1769069179478.png";
import lounge1 from "@assets/레코딩카페_라운지6_1763518051360-BVo-dmns_1769069179480.png";
import couplePhoto from "@assets/레코딩카페커플_1763517988473-RT2IBYdJ_1769069179483.jpg";

type Language = "ko" | "en" | "ja" | "zh";

const translations = {
  ko: {
    nav: { experience: "체험 에디션", pro: "프로 에디션", faq: "FAQ", reserve: "예약하기", home: "홈" },
    hero: {
      badge: "체험 에디션",
      title: "K-POP 아티스트처럼",
      subtitle: "두 가지 체험 프로그램으로 K-POP의 세계를 직접 경험하세요",
    },
    product1: {
      badge: "DOCENT TOUR",
      title: "K-POP 레전드 릴테이프 도슨트 투어",
      price: "₩35,000",
      duration: "50분",
      language: "영어 · 중국어 · 일본어",
      desc: "한국 K-POP 30년의 역사를 만든 레전드들의 실제 녹음 릴테이프 전시 관람",
      details: [
        "BTS, 서태지, HOT, 빅뱅, 소녀시대 등 레전드들의 실제 녹음 릴테이프 원본 전시",
        "히트곡 탄생 비화, 녹음실 에피소드, K-POP 제작의 비밀",
        "세계 음악 산업에서의 K-POP 위상과 영향력 해설",
        "일부 릴테이프 재생 시연 – 실제 아날로그 사운드 체험",
      ],
      highlights: [
        { icon: "🎵", title: "원 테이크의 기적", desc: "한번에 녹음된 레전드 명곡들의 뒷이야기" },
        { icon: "🎛️", title: "스튜디오 마법사", desc: "프로듀서와 사운드 엔지니어의 숨은 역할" },
        { icon: "📼", title: "릴테이프가 디지털로", desc: "아날로그에서 디지털로 K-POP이 진화한 과정" },
        { icon: "🔊", title: "지금도 들을 수 있는", desc: "일부 릴테이프 재생 시연으로 아날로그 사운드 체험" },
      ],
      cta: "도슨트 예약하기",
    },
    product2: {
      badge: "RECORDING",
      title: "K-POP 녹음 체험",
      price: "₩40,000~",
      duration: "60분",
      language: "한국어 · 영어",
      desc: "전문 레코딩 부스에서 K-POP 가수처럼 녹음하세요",
      details: [
        "유튜브 반주로 원하는 노래 녹음",
        "기본 믹싱 및 에코 효과 포함",
        "녹음 파일 이메일 발송 (다음날)",
        "추가 옵션: AI 보정, 촬영기사, AI 뮤직비디오, 앨범 발매, LP 제작",
      ],
      options: [
        { icon: "🤖", title: "AI 음성 보정", price: "별도 문의" },
        { icon: "🎬", title: "촬영기사 동반", price: "별도 문의" },
        { icon: "🎥", title: "AI 뮤직비디오", price: "별도 문의" },
        { icon: "💿", title: "앨범 발매", price: "별도 문의" },
        { icon: "🎶", title: "LP 제작", price: "별도 문의" },
      ],
      cta: "녹음 예약하기",
      ctaDesc: "예약 시스템으로 이동합니다",
    },
    features: {
      title: "체험 에디션",
      titleHighlight: "특장점",
      items: [
        { icon: "🌍", title: "다국어 도슨트", desc: "영어·중국어·일본어 전문 도슨트와 함께하는 투어" },
        { icon: "🎤", title: "프로 장비 체험", desc: "K-POP 아티스트와 동일한 녹음 환경" },
        { icon: "📧", title: "파일 전송", desc: "녹음 파일을 이메일로 다음날 수령" },
        { icon: "⭐", title: "평생 기억", desc: "나만의 K-POP 녹음 파일로 특별한 추억" },
      ],
    },
    modal: {
      title: "도슨트 투어 예약",
      name: "이름",
      email: "이메일",
      date: "날짜",
      time: "시간",
      language: "언어 선택",
      people: "인원",
      submit: "예약하기",
      submitting: "예약 중...",
      selectLang: "언어를 선택하세요",
      langEn: "영어",
      langZh: "중국어",
      langJa: "일본어",
      successTitle: "예약 완료!",
      successDesc: "예약이 성공적으로 접수되었습니다.",
    },
    gallery: { title: "공간을", titleHighlight: "보세요" },
  },
  en: {
    nav: { experience: "Experience Edition", pro: "Pro Edition", faq: "FAQ", reserve: "Reserve", home: "Home" },
    hero: {
      badge: "Experience Edition",
      title: "Like a K-POP Artist",
      subtitle: "Experience the world of K-POP through two experience programs",
    },
    product1: {
      badge: "DOCENT TOUR",
      title: "K-POP Legend Reel Tape Docent Tour",
      price: "₩35,000",
      duration: "50 min",
      language: "English · Chinese · Japanese",
      desc: "View the actual recording reel tapes of the legends who made 30 years of K-POP history",
      details: [
        "Original reel tapes from BTS, Seo Taiji, HOT, Big Bang, Girls' Generation recordings",
        "Behind-the-scenes of hit songs, recording studio episodes, secrets of K-POP production",
        "K-POP's status and influence in the global music industry",
        "Reel tape playback demonstration – experience real analog sound",
      ],
      highlights: [
        { icon: "🎵", title: "The One-Take Miracle", desc: "Stories behind legendary songs recorded in one take" },
        { icon: "🎛️", title: "Studio Wizards", desc: "The hidden roles of producers and sound engineers" },
        { icon: "📼", title: "From Reel to Digital", desc: "How K-POP evolved from analog to digital" },
        { icon: "🔊", title: "Still Audible Today", desc: "Experience analog sound through reel tape playback" },
      ],
      cta: "Book Docent Tour",
    },
    product2: {
      badge: "RECORDING",
      title: "K-POP Recording Experience",
      price: "₩40,000~",
      duration: "60 min",
      language: "Korean · English",
      desc: "Record like a K-POP singer in a professional recording booth",
      details: [
        "Record any song with YouTube backing track",
        "Basic mixing and echo effects included",
        "Recording file sent by email (next day)",
        "Add-ons: AI correction, cameraman, AI music video, album release, LP production",
      ],
      options: [
        { icon: "🤖", title: "AI Voice Correction", price: "Inquire" },
        { icon: "🎬", title: "Cameraman", price: "Inquire" },
        { icon: "🎥", title: "AI Music Video", price: "Inquire" },
        { icon: "💿", title: "Album Release", price: "Inquire" },
        { icon: "🎶", title: "LP Production", price: "Inquire" },
      ],
      cta: "Book Recording",
      ctaDesc: "Redirects to reservation system",
    },
    features: {
      title: "Experience Edition",
      titleHighlight: "Highlights",
      items: [
        { icon: "🌍", title: "Multilingual Docent", desc: "Tour with English, Chinese, Japanese professional docents" },
        { icon: "🎤", title: "Pro Equipment", desc: "Same recording environment as K-POP artists" },
        { icon: "📧", title: "File Delivery", desc: "Receive recording file by email the next day" },
        { icon: "⭐", title: "Lifetime Memory", desc: "A special memory with your own K-POP recording" },
      ],
    },
    modal: {
      title: "Book Docent Tour",
      name: "Name",
      email: "Email",
      date: "Date",
      time: "Time",
      language: "Language",
      people: "People",
      submit: "Book Now",
      submitting: "Booking...",
      selectLang: "Select language",
      langEn: "English",
      langZh: "Chinese",
      langJa: "Japanese",
      successTitle: "Booking Complete!",
      successDesc: "Your booking has been successfully submitted.",
    },
    gallery: { title: "Explore", titleHighlight: "the Space" },
  },
  ja: {
    nav: { experience: "体験エディション", pro: "プロエディション", faq: "FAQ", reserve: "予約する", home: "ホーム" },
    hero: {
      badge: "体験エディション",
      title: "K-POPアーティストのように",
      subtitle: "二つの体験プログラムでK-POPの世界を直接体験してください",
    },
    product1: {
      badge: "DOCENT TOUR",
      title: "K-POPレジェンド リールテープ ドーセントツアー",
      price: "₩35,000",
      duration: "50分",
      language: "英語 · 中国語 · 日本語",
      desc: "韓国K-POP30年の歴史を作ったレジェンドたちの実際の録音リールテープ展示を鑑賞",
      details: [
        "BTS、ソテジ、HOT、ビッグバン、少女時代などのレジェンドたちの実際の録音リールテープ原本展示",
        "ヒット曲誕生秘話、レコーディングスタジオのエピソード、K-POP制作の秘密",
        "世界音楽産業におけるK-POPの地位と影響力の解説",
        "一部リールテープ再生デモ – 実際のアナログサウンドを体験",
      ],
      highlights: [
        { icon: "🎵", title: "ワンテイクの奇跡", desc: "一発録りで生まれたレジェンド名曲の裏話" },
        { icon: "🎛️", title: "スタジオの魔術師", desc: "プロデューサーとサウンドエンジニアの隠れた役割" },
        { icon: "📼", title: "リールからデジタルへ", desc: "K-POPがアナログからデジタルへ進化した過程" },
        { icon: "🔊", title: "今でも聴ける", desc: "リールテープ再生デモでアナログサウンドを体験" },
      ],
      cta: "ドーセントツアーを予約",
    },
    product2: {
      badge: "RECORDING",
      title: "K-POPレコーディング体験",
      price: "₩40,000~",
      duration: "60分",
      language: "韓国語 · 英語",
      desc: "プロのレコーディングブースでK-POP歌手のように録音しましょう",
      details: [
        "YouTubeの伴奏で好きな曲を録音",
        "基本ミキシングとエコーエフェクト込み",
        "録音ファイルをメールで送信（翌日）",
        "追加オプション：AI補正、撮影スタッフ、AIミュージックビデオ、アルバム発売、LP制作",
      ],
      options: [
        { icon: "🤖", title: "AI音声補正", price: "要問い合わせ" },
        { icon: "🎬", title: "撮影スタッフ同行", price: "要問い合わせ" },
        { icon: "🎥", title: "AIミュージックビデオ", price: "要問い合わせ" },
        { icon: "💿", title: "アルバム発売", price: "要問い合わせ" },
        { icon: "🎶", title: "LP制作", price: "要問い合わせ" },
      ],
      cta: "レコーディングを予約",
      ctaDesc: "予約システムへ移動します",
    },
    features: {
      title: "体験エディション",
      titleHighlight: "の特徴",
      items: [
        { icon: "🌍", title: "多言語ドーセント", desc: "英語・中国語・日本語の専門ドーセントとのツアー" },
        { icon: "🎤", title: "プロ機材体験", desc: "K-POPアーティストと同じ録音環境" },
        { icon: "📧", title: "ファイル転送", desc: "録音ファイルを翌日メールで受け取り" },
        { icon: "⭐", title: "生涯の思い出", desc: "自分だけのK-POP録音ファイルで特別な記念に" },
      ],
    },
    modal: {
      title: "ドーセントツアー予約",
      name: "お名前",
      email: "メール",
      date: "日付",
      time: "時間",
      language: "言語を選択",
      people: "人数",
      submit: "予約する",
      submitting: "予約中...",
      selectLang: "言語を選択してください",
      langEn: "英語",
      langZh: "中国語",
      langJa: "日本語",
      successTitle: "予約完了！",
      successDesc: "予約が正常に受け付けられました。",
    },
    gallery: { title: "スペースを", titleHighlight: "見てみよう" },
  },
  zh: {
    nav: { experience: "体验版", pro: "专业版", faq: "常见问题", reserve: "预约", home: "首页" },
    hero: {
      badge: "体验版",
      title: "像K-POP艺人一样",
      subtitle: "通过两个体验项目直接感受K-POP的世界",
    },
    product1: {
      badge: "DOCENT TOUR",
      title: "K-POP传奇录音卷轴导览",
      price: "₩35,000",
      duration: "50分钟",
      language: "英语 · 中文 · 日语",
      desc: "欣赏创造韩国K-POP 30年历史的传奇艺人实际录音卷轴展览",
      details: [
        "BTS、徐太志、HOT、BIGBANG、少女时代等传奇艺人实际录音卷轴原件展示",
        "热门歌曲诞生秘闻、录音室轶事、K-POP制作的秘密",
        "K-POP在全球音乐产业中的地位与影响力解说",
        "部分卷轴播放演示——体验真实的模拟音效",
      ],
      highlights: [
        { icon: "🎵", title: "一次录制的奇迹", desc: "一次录制完成的传奇名曲背后的故事" },
        { icon: "🎛️", title: "录音室魔法师", desc: "制作人和音效工程师的隐藏角色" },
        { icon: "📼", title: "从卷轴到数字", desc: "K-POP从模拟到数字的进化过程" },
        { icon: "🔊", title: "现在仍能聆听", desc: "通过卷轴播放演示体验模拟音效" },
      ],
      cta: "预约导览",
    },
    product2: {
      badge: "RECORDING",
      title: "K-POP录音体验",
      price: "₩40,000~",
      duration: "60分钟",
      language: "韩语 · 英语",
      desc: "在专业录音棚里像K-POP歌手一样录音",
      details: [
        "用YouTube伴奏录制您喜欢的歌曲",
        "包含基本混音和回声效果",
        "录音文件次日通过电子邮件发送",
        "附加选项：AI修音、摄影师、AI音乐视频、专辑发行、LP制作",
      ],
      options: [
        { icon: "🤖", title: "AI声音修正", price: "另行询问" },
        { icon: "🎬", title: "摄影师随行", price: "另行询问" },
        { icon: "🎥", title: "AI音乐视频", price: "另行询问" },
        { icon: "💿", title: "专辑发行", price: "另行询问" },
        { icon: "🎶", title: "LP制作", price: "另行询问" },
      ],
      cta: "预约录音",
      ctaDesc: "跳转到预约系统",
    },
    features: {
      title: "体验版",
      titleHighlight: "特点",
      items: [
        { icon: "🌍", title: "多语言导览", desc: "英语、中文、日语专业导览员陪同参观" },
        { icon: "🎤", title: "专业设备体验", desc: "与K-POP艺人相同的录音环境" },
        { icon: "📧", title: "文件传送", desc: "次日通过电子邮件接收录音文件" },
        { icon: "⭐", title: "终身记忆", desc: "用属于自己的K-POP录音文件留下特别记念" },
      ],
    },
    modal: {
      title: "预约导览",
      name: "姓名",
      email: "电子邮件",
      date: "日期",
      time: "时间",
      language: "选择语言",
      people: "人数",
      submit: "立即预约",
      submitting: "预约中...",
      selectLang: "请选择语言",
      langEn: "英语",
      langZh: "中文",
      langJa: "日语",
      successTitle: "预约完成！",
      successDesc: "您的预约已成功提交。",
    },
    gallery: { title: "探索", titleHighlight: "空间" },
  },
};

export default function ExperiencePage() {
  const [lang, setLang] = useState<Language>("ko");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", language: "", people: "1" });
  const { toast } = useToast();
  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.date || !form.time || !form.language) {
      toast({ title: "입력 오류", description: "모든 필수 항목을 입력해주세요", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "docent_tour", lang }),
      });
      toast({ title: t.modal.successTitle, description: t.modal.successDesc });
      setShowModal(false);
      setForm({ name: "", email: "", date: "", time: "", language: "", people: "1" });
    } catch {
      toast({ title: "오류", description: "예약 중 오류가 발생했습니다. 다시 시도해주세요.", variant: "destructive" });
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
            <Link href="/experience" className="text-purple-300 font-bold">{t.nav.experience}</Link>
            <Link href="/pro" className="text-yellow-400 hover:text-white transition-colors">{t.nav.pro}</Link>
            <Link href="/menu" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90">
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
      <section className="relative pt-16 h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Experience" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/60 to-gray-950" />
        <div className="relative z-10 text-center px-4">
          <div className="inline-block bg-purple-500/30 border border-purple-400/50 rounded-full px-4 py-1 text-sm font-bold text-purple-200 mb-4">
            {t.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t.hero.title}</h1>
          <p className="text-gray-300 text-lg max-w-2xl">{t.hero.subtitle}</p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Product 1: Docent Tour */}
          <div className="bg-gray-900 rounded-3xl overflow-hidden border border-purple-500/30">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="inline-block bg-purple-600 rounded-full px-3 py-1 text-xs font-black text-white mb-4">
                  {t.product1.badge}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{t.product1.title}</h2>
                <p className="text-gray-300 mb-6">{t.product1.desc}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 text-sm">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>{t.product1.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 text-sm">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>{t.product1.language}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {t.product1.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div className="text-3xl font-black text-white">{t.product1.price}</div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 transition-opacity hover:scale-105 transform duration-200">
                    {t.product1.cta}
                  </button>
                </div>
              </div>
              <div className="relative">
                <img src={lounge1} alt="Docent Tour" className="w-full h-full object-cover min-h-64" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent md:block hidden" />
              </div>
            </div>

            {/* Highlights */}
            <div className="border-t border-gray-800 p-8 md:p-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {t.product1.highlights.map((h, i) => (
                  <div key={i} className="bg-gray-800/60 rounded-2xl p-4 hover:bg-gray-800 transition-colors">
                    <div className="text-2xl mb-2">{h.icon}</div>
                    <h4 className="font-black text-white text-sm mb-1">{h.title}</h4>
                    <p className="text-gray-400 text-xs">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product 2: Recording */}
          <div className="bg-gray-900 rounded-3xl overflow-hidden border border-pink-500/30">
            <div className="grid md:grid-cols-2">
              <div className="relative order-2 md:order-1">
                <img src={recordingBooth} alt="Recording" className="w-full h-full object-cover min-h-64" />
                <div className="absolute inset-0 bg-gradient-to-l from-gray-900/50 to-transparent md:block hidden" />
              </div>
              <div className="p-8 md:p-10 order-1 md:order-2">
                <div className="inline-block bg-pink-600 rounded-full px-3 py-1 text-xs font-black text-white mb-4">
                  {t.product2.badge}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{t.product2.title}</h2>
                <p className="text-gray-300 mb-6">{t.product2.desc}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 text-sm">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span>{t.product2.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 text-sm">
                    <Mic className="w-4 h-4 text-pink-400" />
                    <span>{t.product2.language}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {t.product2.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <ChevronRight className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div className="text-3xl font-black text-white">{t.product2.price}</div>
                  <Link href="/menu">
                    <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 transition-opacity hover:scale-105 transform duration-200">
                      {t.product2.cta}
                    </button>
                  </Link>
                </div>
                <p className="text-gray-500 text-xs mt-2 text-right">{t.product2.ctaDesc}</p>
              </div>
            </div>

            {/* Options */}
            <div className="border-t border-gray-800 p-8 md:p-10">
              <div className="flex flex-wrap gap-3">
                {t.product2.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3">
                    <span className="text-lg">{o.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{o.title}</div>
                      <div className="text-xs text-gray-400">{o.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            <span className="text-white">{t.features.title} </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.features.titleHighlight}</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.features.items.map((item, i) => (
              <div key={i} className="bg-gray-800/60 rounded-2xl p-6 text-center hover:bg-gray-800 transition-colors border border-gray-700/50">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            <span className="text-white">{t.gallery.title} </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.gallery.titleHighlight}</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[controlRoom, recordingBooth, booth1, lounge1, couplePhoto, heroImage].map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl group">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-purple-700 font-black px-8 py-4 rounded-xl text-lg hover:bg-purple-50 transition-colors">
              {t.product1.cta}
            </button>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-pink-600 to-purple-600 font-black px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity">
                {t.product2.cta}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/"><img src={logoImage} alt="K Recording Café" className="h-8 object-contain mx-auto mb-3" /></Link>
          <p className="text-gray-600 text-xs">© 2025 K Recording Café. All rights reserved.</p>
        </div>
      </footer>

      {/* DOCENT BOOKING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-purple-500/30 rounded-3xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-black text-white mb-6">{t.modal.title}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">{t.modal.name}</label>
                <input
                  type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">{t.modal.email}</label>
                <input
                  type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">{t.modal.date}</label>
                  <input
                    type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">{t.modal.time}</label>
                  <input
                    type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">{t.modal.language}</label>
                <select
                  value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  required>
                  <option value="">{t.modal.selectLang}</option>
                  <option value="en">{t.modal.langEn}</option>
                  <option value="zh">{t.modal.langZh}</option>
                  <option value="ja">{t.modal.langJa}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">{t.modal.people}</label>
                <select
                  value={form.people} onChange={e => setForm({ ...form, people: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                {submitting ? t.modal.submitting : t.modal.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

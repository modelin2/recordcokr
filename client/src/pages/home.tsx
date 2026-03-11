import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import logoImage from "@assets/K-RecordingCafe_1751778566542.png";
import heroImage from "@assets/recordingcafe_(2)_1768193796781-CiKs2y1L_1769070144968.png";
import controlRoom from "@assets/레코딩카페_컨트롤룸_1768188070634-CLECM5p7_1769069179476.png";
import recordingBooth from "@assets/레코딩카페_녹음부스_1768188070630-BjcyLYYV_1769069179482.png";
import booth1 from "@assets/레코딩카페_부스_1768188070633-BgjB4HnG_1769069179478.png";
import lounge1 from "@assets/레코딩카페_라운지6_1763518051360-BVo-dmns_1769069179480.png";
import couplePhoto from "@assets/레코딩카페커플_1763517988473-RT2IBYdJ_1769069179483.jpg";
import buildingEntrance from "@assets/레코딩카페_건물입구4_1768190998588-f6UJ9S7H_1769069793000.png";
import gallery1 from "@assets/Recordingcafe1_1751872328127.png";
import gallery2 from "@assets/Recordingcafe2_1751872328127.png";
import gallery3 from "@assets/Recordingcafe3_1751872328127.png";
import gallery4 from "@assets/Recordingcafe4_1751872328128.png";
import gallery5 from "@assets/Recordingcafe5_1751872328128.png";
import gallery6 from "@assets/Recordingcafe6_1751872328128.png";

type Language = "ko" | "en" | "ja" | "zh";

const translations = {
  ko: {
    nav: {
      experience: "체험 에디션",
      pro: "프로 에디션",
      faq: "FAQ",
      reserve: "예약하기",
    },
    hero: {
      badge: "서울 신사역 도보 4분",
      title1: "K-POP의 문이",
      title2: "열립니다",
      subtitle: "두 가지 여정 중 하나를 선택하세요",
      scroll: "아래로 스크롤",
    },
    zones: {
      sectionTitle: "당신의 여정을 선택하세요",
      experience: {
        badge: "체험 에디션",
        title: "누구나 K-POP 아티스트처럼",
        desc: "도슨트 투어 + 녹음 체험",
        sub: "K-POP 30년의 레전드들을 만나고, 당신의 목소리를 녹음하세요",
        cta: "체험 입장",
        price: "₩35,000~",
        duration: "50~60분",
      },
      pro: {
        badge: "프로 에디션",
        title: "진짜 K-POP 음반 제작",
        desc: "KOMCA 작곡가 매칭 서비스",
        sub: "한국음악저작권협회 소속 전문 작곡가와 함께 정식 음반을 제작하세요",
        cta: "프로 입장",
        price: "₩15,000,000~",
        duration: "12주 제작",
      },
    },
    story: {
      title: "10년간의 연예기획사 노하우를",
      titleHighlight: "처음으로 공개합니다",
      p1: "이 공간을 운영한 지 벌써 10년이 넘었습니다. 처음에는 전속 아티스트 50여 명의 트레이닝과 음원 제작을 위한 완전한 내부 전용 시스템으로 구축되었습니다.",
      p2: "하지만 최근 K-pop과 한국 문화에 대한 세계적 관심이 폭발적으로 커지고, 단순한 콘텐츠 소비를 넘어 직접 경험하고 창작하고자 하는 수요가 빠르게 증가하고 있음을 체감했습니다.",
      p3: "K 레코딩 카페는 콘텐츠 실무, 체험형 교육, 글로벌 확장성이라는 세 가지 측면에서 단기 성과뿐 아니라 장기적 브랜드 자산이 될 수 있는 공간입니다.",
      globalTitle: "글로벌 프랜차이즈가 가능한 모델",
      globalDesc: "모듈화된 시스템으로 설계된 체험형 콘텐츠 플랫폼. 중국 장춘·염성 대리점 계약 체결, 전 세계 확장 중.",
      komcaTitle: "미국 저작권 관리 단체 공식 파트너",
      komcaDesc: "제작된 음원을 국제 표준에 따라 저작권 등록 및 관리. Spotify, Apple Music, YouTube Music 전 세계 배포.",
    },
    gallery: {
      title: "공간을",
      titleHighlight: "둘러보세요",
    },
    access: {
      title: "오시는",
      titleHighlight: "길",
      address: "서울 서초구 강남대로107길 21, 2층",
      subway: "신사역 3호선 도보 4분",
      hours: "영업시간: 오전 10시 ~ 밤 10시",
      mapDesc: "신사역 3번 출구에서 강남대로107길 방향으로 4분 도보",
    },
  },
  en: {
    nav: {
      experience: "Experience Edition",
      pro: "Pro Edition",
      faq: "FAQ",
      reserve: "Reserve",
    },
    hero: {
      badge: "4 min walk from Sinsa Station, Seoul",
      title1: "The Door to K-POP",
      title2: "is Open",
      subtitle: "Choose one of two journeys",
      scroll: "Scroll Down",
    },
    zones: {
      sectionTitle: "Choose Your Journey",
      experience: {
        badge: "Experience Edition",
        title: "Be a K-POP Artist, Anyone Can",
        desc: "Docent Tour + Recording Experience",
        sub: "Meet the legends of 30 years of K-POP and record your voice",
        cta: "Enter Experience",
        price: "₩35,000~",
        duration: "50~60 min",
      },
      pro: {
        badge: "Pro Edition",
        title: "Real K-POP Album Production",
        desc: "KOMCA Composer Matching",
        sub: "Create an official album with a professional KOMCA-affiliated composer",
        cta: "Enter Pro",
        price: "₩15,000,000~",
        duration: "12-week production",
      },
    },
    story: {
      title: "10 Years of Entertainment Agency Know-How",
      titleHighlight: "Revealed for the First Time",
      p1: "We have been operating this space for over 10 years. It was originally built as a fully internal system for training and music production for over 50 exclusive artists.",
      p2: "Recently, the global interest in K-pop and Korean culture has exploded, and we have felt the rapidly growing demand to directly experience and create beyond simply consuming content.",
      p3: "K Recording Café is a space that can be a long-term brand asset as well as a short-term performance in three aspects: content practice, experiential education, and global scalability.",
      globalTitle: "A Globally Franchisable Model",
      globalDesc: "An experiential content platform designed as a modular system. Franchise contracts signed in Changchun and Yancheng, China, expanding worldwide.",
      komcaTitle: "Official Partner of US Copyright Management Organization",
      komcaDesc: "Register and manage music rights internationally. Worldwide distribution on Spotify, Apple Music, YouTube Music.",
    },
    gallery: {
      title: "Explore",
      titleHighlight: "the Space",
    },
    access: {
      title: "Getting",
      titleHighlight: "Here",
      address: "2F, 21, Gangnam-daero 107-gil, Seocho-gu, Seoul",
      subway: "4-min walk from Sinsa Station (Line 3)",
      hours: "Hours: 10:00 AM ~ 10:00 PM",
      mapDesc: "4-min walk from Exit 3 of Sinsa Station toward Gangnam-daero 107-gil",
    },
  },
  ja: {
    nav: {
      experience: "体験エディション",
      pro: "プロエディション",
      faq: "FAQ",
      reserve: "予約する",
    },
    hero: {
      badge: "新沙駅から徒歩4分",
      title1: "K-POPへの扉が",
      title2: "開きます",
      subtitle: "二つの旅のうち一つを選んでください",
      scroll: "スクロール",
    },
    zones: {
      sectionTitle: "あなたの旅を選んでください",
      experience: {
        badge: "体験エディション",
        title: "誰でもK-POPアーティストのように",
        desc: "ドーセントツアー + レコーディング体験",
        sub: "K-POP30年のレジェンドたちに会い、あなたの声を録音しましょう",
        cta: "体験へ入場",
        price: "₩35,000~",
        duration: "50~60分",
      },
      pro: {
        badge: "プロエディション",
        title: "本物のK-POPアルバム制作",
        desc: "KOMCA作曲家マッチングサービス",
        sub: "韓国音楽著作権協会所属の専門作曲家と正式アルバムを制作",
        cta: "プロへ入場",
        price: "₩15,000,000~",
        duration: "12週間制作",
      },
    },
    story: {
      title: "10年間の芸能事務所ノウハウを",
      titleHighlight: "初めて公開します",
      p1: "このスペースを運営して10年以上が経ちました。最初は専属アーティスト50名以上のトレーニングと音源制作のための完全な内部専用システムとして構築されました。",
      p2: "しかし最近、K-popと韓国文化への世界的な関心が爆発的に高まり、単純なコンテンツ消費を超えて直接体験・創作したいという需要が急速に増加していることを実感しました。",
      p3: "Kレコーディングカフェは、コンテンツ実務、体験型教育、グローバル拡張性という三つの側面で、長期的なブランド資産になれる空間です。",
      globalTitle: "グローバルフランチャイズが可能なモデル",
      globalDesc: "モジュール化されたシステムで設計された体験型コンテンツプラットフォーム。中国吉林省・塩城でフランチャイズ契約締結済み。",
      komcaTitle: "米国著作権管理団体の公式パートナー",
      komcaDesc: "制作された音源を国際標準に従って著作権登録・管理。Spotify、Apple Music、YouTube Musicで全世界配信。",
    },
    gallery: {
      title: "スペースを",
      titleHighlight: "見てみよう",
    },
    access: {
      title: "アクセス",
      titleHighlight: "マップ",
      address: "ソウル特別市瑞草区江南大路107街21号2階",
      subway: "新沙駅3号線から徒歩4分",
      hours: "営業時間: 午前10時 ~ 午後10時",
      mapDesc: "新沙駅3番出口から江南大路107街方面へ徒歩4分",
    },
  },
  zh: {
    nav: {
      experience: "体验版",
      pro: "专业版",
      faq: "常见问题",
      reserve: "预约",
    },
    hero: {
      badge: "距新沙站步行4分钟",
      title1: "K-POP的大门",
      title2: "正式开启",
      subtitle: "选择两种旅程之一",
      scroll: "向下滚动",
    },
    zones: {
      sectionTitle: "选择您的旅程",
      experience: {
        badge: "体验版",
        title: "任何人都能像K-POP艺人一样",
        desc: "导览参观 + 录音体验",
        sub: "与K-POP 30年的传奇相遇，录制属于您的声音",
        cta: "进入体验",
        price: "₩35,000~",
        duration: "50~60分钟",
      },
      pro: {
        badge: "专业版",
        title: "真正的K-POP专辑制作",
        desc: "KOMCA作曲家匹配服务",
        sub: "与韩国音乐著作权协会专属专业作曲家一起制作正式专辑",
        cta: "进入专业版",
        price: "₩15,000,000~",
        duration: "12周制作",
      },
    },
    story: {
      title: "10年娱乐公司专业经验",
      titleHighlight: "首次对外公开",
      p1: "这个空间已经运营了10年以上。最初是作为为50多名专属艺人培训和音乐制作的完全内部专用系统而建立的。",
      p2: "然而，近年来全球对K-pop和韩国文化的兴趣爆炸性增长，我们深刻感受到超越单纯内容消费、希望直接体验和创作的需求正在迅速增加。",
      p3: "K录音咖啡厅是一个在内容实务、体验型教育、全球扩张性三个方面都能成为长期品牌资产的空间。",
      globalTitle: "可全球特许经营的模式",
      globalDesc: "以模块化系统设计的体验型内容平台。已在中国长春、盐城签署特许经营合同，正在全球扩张。",
      komcaTitle: "美国版权管理机构官方合作伙伴",
      komcaDesc: "按照国际标准注册和管理制作的音源版权。在Spotify、Apple Music、YouTube Music全球发行。",
    },
    gallery: {
      title: "探索",
      titleHighlight: "空间",
    },
    access: {
      title: "交通",
      titleHighlight: "指南",
      address: "首尔瑞草区江南大路107街21号2楼",
      subway: "新沙站3号线步行4分钟",
      hours: "营业时间: 上午10时 ~ 晚上10时",
      mapDesc: "从新沙站3号出口沿江南大路107街方向步行4分钟",
    },
  },
};

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, controlRoom, recordingBooth, booth1, lounge1, couplePhoto, buildingEntrance];

export default function Home() {
  const [lang, setLang] = useState<Language>("ko");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/">
            <img src={logoImage} alt="K Recording Café" className="h-9 object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/experience" className="text-purple-300 hover:text-white transition-colors">{t.nav.experience}</Link>
            <Link href="/pro" className="text-yellow-400 hover:text-white transition-colors">{t.nav.pro}</Link>
            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">{t.nav.faq}</Link>
            <Link href="/menu" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              {t.nav.reserve}
            </Link>
          </div>
          {/* Language selector */}
          <div className="flex items-center gap-1">
            {(["ko", "en", "ja", "zh"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs rounded font-bold transition-all ${lang === l ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="K Recording Café" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-950" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-sm">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-gray-200">{t.hero.badge}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
            <span className="block text-white">{t.hero.title1}</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">{t.hero.title2}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experience">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                <span className="mr-2">🎤</span> {t.zones.experience.badge}
              </button>
            </Link>
            <Link href="/pro">
              <button className="group px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-700 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105">
                <span className="mr-2">🏆</span> {t.zones.pro.badge}
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
          <span className="text-xs">{t.hero.scroll}</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ZONE CARDS */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-white">{t.zones.sectionTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Experience Zone */}
            <Link href="/experience">
              <div className="group relative overflow-hidden rounded-3xl border border-purple-500/30 cursor-pointer hover:border-purple-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-900/90" />
                <img src={recordingBooth} alt="Experience" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10 p-8 md:p-10">
                  <div className="inline-block bg-purple-500/30 border border-purple-400/40 rounded-full px-3 py-1 text-xs font-bold text-purple-200 mb-4">
                    {t.zones.experience.badge}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{t.zones.experience.title}</h3>
                  <p className="text-purple-200 font-semibold mb-2">{t.zones.experience.desc}</p>
                  <p className="text-gray-300 text-sm mb-8">{t.zones.experience.sub}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">{t.zones.experience.price}</div>
                      <div className="text-sm text-purple-300 flex items-center gap-1"><Clock className="w-3 h-3" /> {t.zones.experience.duration}</div>
                    </div>
                    <div className="bg-white text-purple-700 font-black px-6 py-3 rounded-xl group-hover:bg-purple-100 transition-colors">
                      {t.zones.experience.cta} →
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Pro Zone */}
            <Link href="/pro">
              <div className="group relative overflow-hidden rounded-3xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/90 via-amber-800/80 to-stone-900/90" />
                <img src={controlRoom} alt="Pro" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10 p-8 md:p-10">
                  <div className="inline-block bg-yellow-500/30 border border-yellow-400/40 rounded-full px-3 py-1 text-xs font-bold text-yellow-200 mb-4">
                    {t.zones.pro.badge}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{t.zones.pro.title}</h3>
                  <p className="text-yellow-200 font-semibold mb-2">{t.zones.pro.desc}</p>
                  <p className="text-gray-300 text-sm mb-8">{t.zones.pro.sub}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">{t.zones.pro.price}</div>
                      <div className="text-sm text-yellow-300 flex items-center gap-1"><Clock className="w-3 h-3" /> {t.zones.pro.duration}</div>
                    </div>
                    <div className="bg-white text-amber-700 font-black px-6 py-3 rounded-xl group-hover:bg-yellow-100 transition-colors">
                      {t.zones.pro.cta} →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            <span className="text-white">{t.story.title}</span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t.story.titleHighlight}
          </h3>
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>{t.story.p1}</p>
            <p>{t.story.p2}</p>
            <p>{t.story.p3}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6">
              <div className="text-2xl mb-3">🌏</div>
              <h4 className="font-black text-lg text-white mb-2">{t.story.globalTitle}</h4>
              <p className="text-gray-300 text-sm">{t.story.globalDesc}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 border border-yellow-500/30 rounded-2xl p-6">
              <div className="text-2xl mb-3">🎵</div>
              <h4 className="font-black text-lg text-white mb-2">{t.story.komcaTitle}</h4>
              <p className="text-gray-300 text-sm">{t.story.komcaDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            <span className="text-white">{t.gallery.title} </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.gallery.titleHighlight}</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl group">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCESS */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            <span className="text-white">{t.access.title} </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.access.titleHighlight}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50">
                <MapPin className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-black text-white mb-1">{t.access.address}</div>
                  <div className="text-gray-400 text-sm">{t.access.subway}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50">
                <Clock className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
                <div className="font-bold text-white">{t.access.hours}</div>
              </div>
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50">
                <p className="text-gray-300 text-sm">{t.access.mapDesc}</p>
              </div>
              <Link href="/menu">
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black text-lg hover:opacity-90 transition-opacity">
                  {t.nav.reserve} →
                </button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={buildingEntrance} alt="Building Entrance" className="w-full h-64 object-cover rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src={logoImage} alt="K Recording Café" className="h-10 object-contain mx-auto mb-4" />
          <p className="text-gray-500 text-sm mb-2">2F, 21, Gangnam-daero 107-gil, Seocho-gu, Seoul</p>
          <p className="text-gray-600 text-xs">© 2025 K Recording Café. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

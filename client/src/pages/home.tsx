import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Clock, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import controlRoom from "@assets/레코딩카페_컨트롤룸_1768188070634-CLECM5p7_1769069179476.png";
import booth1 from "@assets/레코딩카페_부스_1768188070633-BgjB4HnG_1769069179478.png";
import booth2 from "@assets/레코딩카페_부스_(4)_1768188070633-C_7e-l-W_1769069179478.png";
import lounge1 from "@assets/레코딩카페_라운지6_1763518051360-BVo-dmns_1769069179480.png";
import recordingBooth from "@assets/레코딩카페_녹음부스_1768188070630-BjcyLYYV_1769069179482.png";
import couplePhoto from "@assets/레코딩카페커플_1763517988473-RT2IBYdJ_1769069179483.jpg";
import buildingEntrance from "@assets/레코딩카페_건물입구4_1768190998588-f6UJ9S7H_1769069793000.png";
import heroImage from "@assets/recordingcafe_(2)_1768193796781-CiKs2y1L_1769070144968.png";

import rc1 from "@assets/Recordingcafe1_1751872328127.png";
import rc2 from "@assets/Recordingcafe2_1751872328127.png";
import rc4 from "@assets/Recordingcafe4_1751872328128.png";
import rc7 from "@assets/Recordingcafe7_1751872328128.png";
import rc10 from "@assets/Recordingcafe10_1751877203471.png";
import rc30 from "@assets/Recordingcafe30_1751879234412.png";
import rc36 from "@assets/Recordingcafe36_1751879234413.png";

type Language = "en" | "ko" | "ja" | "zh";

const navTranslations: Record<Language, { experience: string; pro: string; about: string; contact: string; bookNow: string }> = {
  en: { experience: "Experience", pro: "Pro Edition", about: "About", contact: "Contact", bookNow: "Book Now" },
  ko: { experience: "체험 에디션", pro: "프로 에디션", about: "소개", contact: "문의", bookNow: "예약하기" },
  ja: { experience: "体験", pro: "プロ版", about: "概要", contact: "お問い合わせ", bookNow: "予約" },
  zh: { experience: "体验版", pro: "专业版", about: "关于", contact: "联系", bookNow: "立即预订" },
};

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [langOpen, setLangOpen] = useState(false);
  const nav = navTranslations[lang];

  const langLabels: Record<Language, string> = { en: "EN", ko: "KO", ja: "JA", zh: "ZH" };
  const langFull: Record<Language, string> = { en: "English", ko: "한국어", ja: "日本語", zh: "中文" };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-black tracking-tight cursor-pointer">
              <span className="gradient-text">K</span>
              <span className="text-white"> Recording Café</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/experience">
              <span className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">{nav.experience}</span>
            </Link>
            <Link href="/pro">
              <span className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">{nav.pro}</span>
            </Link>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">{nav.about}</a>
            <a href="#address" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">{nav.contact}</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white border border-white/20 rounded-full px-3 py-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {langLabels[lang]}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#1a1a2e] border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                  {(Object.keys(langLabels) as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors ${lang === l ? "text-pink-400" : "text-gray-300"}`}
                    >
                      {langFull[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/experience">
              <Button className="k-gradient-pink-purple text-white text-sm font-semibold px-5 py-2 rounded-full">
                {nav.bookNow}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="K Recording Café" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/60 via-[#0a0a1a]/40 to-[#0a0a1a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/80 via-transparent to-[#0a0a1a]/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Seoul's Premier K-pop Experience</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="text-white">Where </span>
            <span className="gradient-text">K-pop</span>
            <br />
            <span className="text-white">Dreams Come True</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Seoul's first K-pop recording experience destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experience">
              <Button className="k-gradient-pink-purple text-white text-lg font-bold px-10 py-6 rounded-2xl hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl shadow-pink-500/30">
                Experience Edition
                <span className="ml-2 text-sm opacity-80">체험 에디션</span>
              </Button>
            </Link>
            <Link href="/pro">
              <Button className="bg-[#D4AF37] hover:bg-[#B8972E] text-black text-lg font-bold px-10 py-6 rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/30">
                Pro Edition
                <span className="ml-2 text-sm opacity-70">프로 에디션</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* Zone Selection */}
      <section className="py-20 px-6 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              Choose Your <span className="gradient-text">Zone</span>
            </h2>
            <p className="text-gray-400 text-xl">두 가지 특별한 K-pop 경험 / Two Unique K-pop Experiences</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Zone 1: Experience Edition */}
            <Link href="/experience">
              <div className="group relative overflow-hidden rounded-3xl cursor-pointer h-[560px] transform hover:scale-[1.02] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B21A8] via-[#9D174D] to-[#EC4899]" />
                <div className="absolute inset-0 opacity-30">
                  <img src={recordingBooth} alt="Experience Zone" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Zone Badge */}
                <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
                  <span className="text-white text-sm font-bold tracking-widest">ZONE 1</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-2">Experience</h3>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-1">Edition</h3>
                  <p className="text-pink-300 text-lg font-semibold mb-4">K-pop 체험 · K-pop Experience</p>
                  <p className="text-gray-300 text-base mb-6">
                    누구나 K-pop 아티스트가 되는 체험<br />
                    <span className="text-gray-400">Anyone can be a K-pop artist</span>
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                      <span className="text-white font-medium">🎙 도슨트 투어</span>
                      <span className="text-pink-300 font-bold">₩35,000~</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                      <span className="text-white font-medium">🎵 녹음 체험</span>
                      <span className="text-pink-300 font-bold">₩40,000~</span>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-purple-900 font-black text-lg py-4 rounded-2xl group-hover:bg-pink-100 transition-colors">
                    체험 입장하기 / Enter Zone →
                  </Button>
                </div>
              </div>
            </Link>

            {/* Zone 2: Pro Edition */}
            <Link href="/pro">
              <div className="group relative overflow-hidden rounded-3xl cursor-pointer h-[560px] transform hover:scale-[1.02] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a0a] via-[#2d2000] to-[#4a3800]" />
                <div className="absolute inset-0 opacity-40">
                  <img src={rc30} alt="Pro Zone" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                {/* Zone Badge */}
                <div className="absolute top-6 left-6 bg-[#D4AF37]/30 backdrop-blur-sm border border-[#D4AF37]/50 rounded-full px-4 py-2">
                  <span className="text-[#D4AF37] text-sm font-bold tracking-widest">ZONE 2</span>
                </div>

                {/* Premium badge */}
                <div className="absolute top-6 right-6 bg-[#D4AF37] rounded-full px-4 py-2">
                  <span className="text-black text-sm font-black">PREMIUM</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-6xl mb-4">👑</div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-2">Professional</h3>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-1">Edition</h3>
                  <p className="text-[#D4AF37] text-lg font-semibold mb-4">프로 아티스트 데뷔 패키지</p>
                  <p className="text-gray-300 text-base mb-6">
                    한국 최고 작곡가와 함께 실제 K-pop 음반 제작 및 발매
                  </p>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 mb-6 border border-[#D4AF37]/30">
                    <span className="text-gray-400 text-sm">Starting from</span>
                    <div className="text-[#D4AF37] font-black text-3xl">₩15,000,000~</div>
                  </div>

                  <Button className="w-full font-black text-lg py-4 rounded-2xl transition-colors" style={{ backgroundColor: "#D4AF37", color: "#000" }}>
                    프로 입장하기 / Enter Pro →
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#0d0d20] to-[#0a0a1a] border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10+", label: "Years", sublabel: "10년 이상" },
              { number: "50+", label: "Artists", sublabel: "50명 이상 아티스트" },
              { number: "3", label: "Countries", sublabel: "3개국 투어객" },
              { number: "Global", label: "Distribution", sublabel: "전 세계 유통" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">{stat.number}</div>
                <div className="text-white font-bold text-lg">{stat.label}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="about" className="py-20 px-6 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Real <span className="gradient-text">Moments</span>
            </h2>
            <p className="text-gray-400 text-lg">실제 방문객들의 K-pop 레코딩 체험 / Real visitors' K-pop recording experience</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { img: rc1, alt: "Foreign visitor recording" },
              { img: rc2, alt: "Korean visitor at mic" },
              { img: controlRoom, alt: "Control room" },
              { img: rc4, alt: "Curly hair visitor" },
              { img: rc7, alt: "Colorful hair visitor" },
              { img: rc10, alt: "Japanese visitor at mic" },
              { img: rc30, alt: "International visitor in control room" },
              { img: rc36, alt: "South Asian visitor in studio" },
              { img: booth1, alt: "Recording booth 1" },
              { img: booth2, alt: "Recording booth 2" },
              { img: recordingBooth, alt: "Recording booth" },
              { img: couplePhoto, alt: "Couple recording" },
            ].map((item, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl aspect-square group">
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section id="address" className="py-20 px-6 bg-[#0d0d20]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Find <span className="gradient-text">Us</span>
            </h2>
            <p className="text-gray-400 text-lg">오시는 길 / Access</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">Address</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    서울특별시 서초구 강남대로107길 21, 2층<br />
                    <span className="text-gray-400">2F, 21, Gangnam-daero 107-gil,<br />Seocho-gu, Seoul</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🚇</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Subway</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    신사역 3호선 5번 출구 도보 4분<br />
                    <span className="text-gray-400">Sinsa Station (Line 3) Exit 5, 4 min walk</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🏨</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Landmark</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    리버사이드호텔 정문에서 30초<br />
                    <span className="text-gray-400">30 sec from Riverside Hotel main entrance</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Hours</h3>
                  <p className="text-gray-300 text-sm">
                    매일 12:00 - 21:00<br />
                    <span className="text-gray-400">Daily 12:00 - 21:00</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Map Image */}
            <div className="relative overflow-hidden rounded-3xl">
              <img src={buildingEntrance} alt="Building entrance" className="w-full h-full object-cover min-h-[300px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4">
                  <p className="text-white text-sm font-semibold">대능빌딩 2층 / Daeneung Building 2F</p>
                  <p className="text-gray-400 text-xs mt-1">리버사이드호텔 정문에서 30초</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-[#0a0a1a]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Become a<br />
            <span className="gradient-text">K-pop Star?</span>
          </h2>
          <p className="text-gray-400 text-xl mb-10">
            Choose your experience and start your K-pop journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experience">
              <Button className="k-gradient-pink-purple text-white text-lg font-bold px-12 py-6 rounded-2xl hover:opacity-90 transition-all transform hover:scale-105">
                🎤 체험 예약 / Book Experience
              </Button>
            </Link>
            <Link href="/pro">
              <Button className="font-bold text-lg px-12 py-6 rounded-2xl transition-all transform hover:scale-105 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                👑 프로 문의 / Pro Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 bg-[#050510]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xl font-black"><span className="gradient-text">K</span> Recording Café</span>
            <p className="text-gray-500 text-sm mt-1">서울특별시 서초구 강남대로107길 21, 2층</p>
          </div>
          <div className="flex gap-6">
            <Link href="/experience"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Experience</span></Link>
            <Link href="/pro"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Pro Edition</span></Link>
            <Link href="/river"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Hotel Guests</span></Link>
          </div>
          <p className="text-gray-600 text-sm">© 2025 K Recording Café. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

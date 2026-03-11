import { useState } from "react";
import { Link } from "wouter";
import { Clock, Users, Globe, ChevronLeft, X, Star, Music2, Mic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import EnhancedBookingSection from "@/components/enhanced-booking-section";

import controlRoom from "@assets/레코딩카페_컨트롤룸_1768188070634-CLECM5p7_1769069179476.png";
import recordingBooth from "@assets/레코딩카페_녹음부스_1768188070630-BjcyLYYV_1769069179482.png";
import booth1 from "@assets/레코딩카페_부스_1768188070633-BgjB4HnG_1769069179478.png";
import booth2 from "@assets/레코딩카페_부스_(4)_1768188070633-C_7e-l-W_1769069179478.png";
import heroImage from "@assets/recordingcafe_(2)_1768193796781-CiKs2y1L_1769070144968.png";

import rc1 from "@assets/Recordingcafe1_1751872328127.png";
import rc2 from "@assets/Recordingcafe2_1751872328127.png";
import rc4 from "@assets/Recordingcafe4_1751872328128.png";
import rc7 from "@assets/Recordingcafe7_1751872328128.png";
import rc10 from "@assets/Recordingcafe10_1751877203471.png";

interface DocentBookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  language: string;
  people: string;
}

export default function ExperiencePage() {
  const [docentModalOpen, setDocentModalOpen] = useState(false);
  const [docentForm, setDocentForm] = useState<DocentBookingForm>({
    name: "", email: "", phone: "", date: "", time: "", language: "en", people: "1",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDocentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docentForm.name || !docentForm.email || !docentForm.phone || !docentForm.date || !docentForm.time) {
      toast({ title: "Required fields missing", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...docentForm,
          bookingType: "docent",
          type: "docent",
          name: docentForm.name,
          email: docentForm.email,
          phone: docentForm.phone,
          bookingDate: docentForm.date,
          bookingTime: docentForm.time,
          selectedDrink: "none",
          youtubeTrackUrl: "N/A - Docent Tour",
          selectedAddons: [],
          totalPrice: parseInt(docentForm.people) * 35000,
        }),
      });
      if (res.ok) {
        toast({ title: "도슨트 투어 예약 완료!", description: "We will contact you shortly to confirm your booking.", duration: 6000 });
        setDocentModalOpen(false);
        setDocentForm({ name: "", email: "", phone: "", date: "", time: "", language: "en", people: "1" });
      } else {
        throw new Error("Booking failed");
      }
    } catch {
      toast({ title: "Booking failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
          </Link>
          <div className="flex-1 text-center">
            <span className="text-lg font-black">
              <span className="gradient-text">Experience</span>
              <span className="text-white"> Zone</span>
            </span>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            ZONE 1
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Experience Zone" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/30 via-[#0a0a1a]/20 to-[#0a0a1a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-4">
            <span className="text-pink-300 text-sm font-bold">🎤 EXPERIENCE EDITION</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="text-white">K-pop</span>
            <br />
            <span className="gradient-text">Experience Zone</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            누구나 K-pop 아티스트가 되는 특별한 체험<br />
            <span className="text-gray-400">Anyone can become a K-pop artist</span>
          </p>
        </div>
      </section>

      {/* Two Products Overview */}
      <section className="py-12 px-6 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4">
          <a href="#docent" className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 transition-all flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎙</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg">도슨트 투어</div>
              <div className="text-gray-400 text-sm">K-pop 레전드 녹음실 / Docent Tour</div>
              <div className="text-pink-400 font-bold mt-1">₩35,000~</div>
            </div>
          </a>
          <a href="#recording" className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-2xl p-5 transition-all flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg">녹음 체험</div>
              <div className="text-gray-400 text-sm">K-pop Recording Experience</div>
              <div className="text-pink-400 font-bold mt-1">₩40,000~</div>
            </div>
          </a>
        </div>
      </section>

      {/* Product 1: Docent Tour */}
      <section id="docent" className="py-20 px-6 bg-[#0d0d20]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full">NEW</span>
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-full">도슨트 투어</span>
                <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">50분</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                K-pop 레전드<br />
                <span className="gradient-text">녹음실 도슨트 투어</span>
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                30년 한국 대중음악 역사의 현장을 직접 체험하세요.<br />
                실제 레전드 가수들의 릴테이프와 함께하는 특별한 역사 여행.
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">50분</div>
                  <div className="text-gray-400 text-xs">50 minutes</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Globe className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm">🇺🇸 🇨🇳 🇯🇵</div>
                  <div className="text-gray-400 text-xs">3 Languages</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-pink-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">1인~</div>
                  <div className="text-gray-400 text-xs">Group OK</div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">1인 / Per person</div>
                    <div className="text-white font-black text-4xl">₩35,000</div>
                    <div className="text-gray-400 text-sm mt-1">단체 할인 가능 / Group discount available</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <div className="text-gray-400 text-sm">Klook Rating</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setDocentModalOpen(true)}
                className="w-full k-gradient-pink-purple text-white font-black text-xl py-6 rounded-2xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-2xl shadow-pink-500/20"
              >
                도슨트 투어 예약 / Book Tour →
              </Button>
            </div>

            {/* Control Room Image */}
            <div className="lg:w-[45%] relative">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3]">
                <img src={controlRoom} alt="K-pop Legend Control Room" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                    <p className="text-white text-sm font-bold">실제 K-pop 레전드들이 사용한 녹음실</p>
                    <p className="text-gray-400 text-xs mt-1">The actual studio used by K-pop legends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Experience */}
          <div>
            <h3 className="text-3xl font-black text-white mb-8 text-center">
              What You'll <span className="gradient-text">Experience</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: "🎞",
                  title: "릴테이프 실물 관람",
                  subtitle: "Original Reel Tapes",
                  desc: "조용필, 서태지와 아이들, god, H.O.T., 이승환, 유재하 등 레전드 아티스트들의 원본 녹음 릴테이프 실물을 직접 관람",
                },
                {
                  icon: "📖",
                  title: "30년 비하인드 스토리",
                  subtitle: "Behind the Scenes",
                  desc: "30년 K-pop 역사의 비하인드 스토리와 에피소드. 히트곡이 탄생한 그 순간의 이야기들",
                },
                {
                  icon: "🌍",
                  title: "다국어 전문 해설",
                  subtitle: "Multilingual Guide",
                  desc: "영어·중국어·일본어 전문 해설사의 생생한 해설. 어느 나라에서 오셨든 완벽하게 이해할 수 있습니다",
                },
                {
                  icon: "🎵",
                  title: "명곡 탄생의 비밀",
                  subtitle: "How Hit Songs Are Born",
                  desc: "녹음실에서 어떻게 명곡이 만들어지는가. K-pop 히트곡 제작 과정의 모든 비밀",
                },
                {
                  icon: "⭐",
                  title: "레전드 아티스트 에피소드",
                  subtitle: "Legend Artist Stories",
                  desc: "레전드 아티스트들의 녹음 당시 실제 에피소드와 비하인드 스토리. 교과서에 없는 살아있는 K-pop 역사",
                },
                {
                  icon: "🎚",
                  title: "아날로그 장비 체험",
                  subtitle: "Analog Equipment",
                  desc: "실제 사용된 아날로그 녹음 장비를 직접 만져보고 체험. K-pop 역사를 만든 그 장비들",
                },
                {
                  icon: "🌟",
                  title: "K-pop 세계적 영향력",
                  subtitle: "K-pop Global Impact",
                  desc: "K-pop 유산과 세계적 영향력의 역사. 한국 음악이 어떻게 전 세계를 사로잡게 됐는지",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all hover:bg-white/8">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-purple-400 text-sm font-medium mb-3">{item.subtitle}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product 2: Recording Experience */}
      <section id="recording" className="py-20 px-6 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            {/* Recording Booth Image */}
            <div className="lg:w-[45%] relative order-last lg:order-first">
              <div className="relative overflow-hidden rounded-3xl">
                <div className="grid grid-cols-2 gap-2">
                  <img src={recordingBooth} alt="Recording booth" className="w-full aspect-square object-cover rounded-xl" />
                  <img src={rc1} alt="Visitor recording" className="w-full aspect-square object-cover rounded-xl" />
                  <img src={rc2} alt="Visitor at mic" className="w-full aspect-square object-cover rounded-xl" />
                  <img src={rc4} alt="Visitor recording session" className="w-full aspect-square object-cover rounded-xl" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold px-3 py-1.5 rounded-full">녹음 체험</span>
                <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">AI 음정 보정</span>
                <span className="bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full">글로벌 유통 가능</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                K-pop<br />
                <span className="gradient-text">녹음 체험</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                실제 K-pop 아티스트들이 사용하는 녹음 부스에서 직접 녹음해보세요.<br />
                AI 음정 보정으로 누구나 완벽한 목소리를 가질 수 있습니다.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {[
                  { icon: "🎤", title: "프로 녹음 부스", desc: "K-pop 아티스트와 동일한 방음 녹음 부스" },
                  { icon: "🤖", title: "AI 음정 보정", desc: "최첨단 AI로 음정을 완벽하게 보정" },
                  { icon: "📀", title: "음원 파일 제공", desc: "고품질 WAV/MP3 파일로 이메일 전송" },
                  { icon: "🌍", title: "글로벌 유통 가능", desc: "Spotify, Apple Music 등 전 세계 동시 발매 옵션" },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <div className="text-white font-bold">{f.title}</div>
                      <div className="text-gray-400 text-sm">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 border border-pink-500/30 rounded-2xl p-6 mb-8">
                <div className="text-gray-400 text-sm mb-1">Starting from</div>
                <div className="text-white font-black text-4xl">₩40,000~</div>
                <div className="text-gray-400 text-sm mt-1">시간대별 요금 상이 / Price varies by time</div>
              </div>

              <a href="#book-recording">
                <Button className="w-full k-gradient-pink-purple text-white font-black text-xl py-6 rounded-2xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-2xl shadow-pink-500/20">
                  녹음 체험 예약 / Book Now →
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Booking Section for Recording */}
      <div id="book-recording">
        <EnhancedBookingSection />
      </div>

      {/* Gallery Strip */}
      <section className="py-12 px-6 bg-[#0d0d20]">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {[rc7, rc10, booth1, booth2, controlRoom].map((img, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-48 overflow-hidden rounded-2xl">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Docent Booking Modal */}
      {docentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a2e] border border-white/20 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-white">도슨트 투어 예약</h3>
                <p className="text-gray-400 text-sm mt-1">K-pop Legend Docent Tour Booking</p>
              </div>
              <button
                onClick={() => setDocentModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleDocentSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">이름 / Name *</label>
                <Input
                  value={docentForm.name}
                  onChange={e => setDocentForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">이메일 / Email *</label>
                <Input
                  type="email"
                  value={docentForm.email}
                  onChange={e => setDocentForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">전화번호 / Phone *</label>
                <Input
                  value={docentForm.phone}
                  onChange={e => setDocentForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+82-10-0000-0000"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1.5 block">날짜 / Date *</label>
                  <Input
                    type="date"
                    value={docentForm.date}
                    onChange={e => setDocentForm(f => ({ ...f, date: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1.5 block">시간 / Time *</label>
                  <Input
                    type="time"
                    value={docentForm.time}
                    onChange={e => setDocentForm(f => ({ ...f, time: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1.5 block">언어 / Language</label>
                  <select
                    value={docentForm.language}
                    onChange={e => setDocentForm(f => ({ ...f, language: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm"
                  >
                    <option value="en" className="bg-gray-900">🇺🇸 English</option>
                    <option value="zh" className="bg-gray-900">🇨🇳 中文</option>
                    <option value="ja" className="bg-gray-900">🇯🇵 日本語</option>
                    <option value="ko" className="bg-gray-900">🇰🇷 한국어</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-1.5 block">인원수 / People</label>
                  <select
                    value={docentForm.people}
                    onChange={e => setDocentForm(f => ({ ...f, people: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm"
                  >
                    {["1","2","3","4","5","6","7","8","9","10"].map(n => (
                      <option key={n} value={n} className="bg-gray-900">{n}명 / {n} person{parseInt(n) > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">예상 금액 / Estimated Total</span>
                  <span className="text-yellow-400 font-black text-xl">
                    ₩{(parseInt(docentForm.people) * 35000).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-2">단체 할인은 별도 문의 / Group discounts available on inquiry</p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full k-gradient-pink-purple text-white font-black text-lg py-5 rounded-2xl"
              >
                {submitting ? "예약 중..." : "도슨트 투어 예약하기"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 bg-[#050510]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <span className="text-xl font-black cursor-pointer"><span className="gradient-text">K</span> Recording Café</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Home</span></Link>
            <Link href="/pro"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Pro Edition</span></Link>
          </div>
          <p className="text-gray-600 text-sm">서울특별시 서초구 강남대로107길 21, 2층</p>
        </div>
      </footer>
    </div>
  );
}

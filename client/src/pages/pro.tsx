import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, CheckCircle, Crown, Music, Globe, Video, Copyright, Megaphone, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import controlRoom from "@assets/레코딩카페_컨트롤룸_1768188070634-CLECM5p7_1769069179476.png";
import heroImage from "@assets/recordingcafe_(2)_1768193796781-CiKs2y1L_1769070144968.png";
import rc30 from "@assets/Recordingcafe30_1751879234412.png";
import rc36 from "@assets/Recordingcafe36_1751879234413.png";

interface ProInquiryForm {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  language: string;
  packageInterest: string;
  message: string;
}

export default function ProPage() {
  const [form, setForm] = useState<ProInquiryForm>({
    name: "", email: "", phone: "", nationality: "", language: "en", packageInterest: "standard", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast({ title: "Required fields missing", description: "Please fill in name, email and phone.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type: "pro",
          bookingType: "pro",
          bookingDate: new Date().toISOString().split("T")[0],
          bookingTime: "09:00",
          selectedDrink: "none",
          youtubeTrackUrl: "N/A - Pro Edition Inquiry",
          selectedAddons: [],
          totalPrice: form.packageInterest === "premium" ? 25000000 : form.packageInterest === "standard" ? 15000000 : 0,
        }),
      });
      if (res.ok) {
        toast({
          title: "프로 에디션 문의가 접수되었습니다!",
          description: "We will contact you within 24 hours to discuss your K-pop journey.",
          duration: 8000,
        });
        setForm({ name: "", email: "", phone: "", nationality: "", language: "en", packageInterest: "standard", message: "" });
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast({ title: "Submission failed", description: "Please try again or contact us directly.", variant: "destructive" });
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
              <span style={{ color: "#D4AF37" }}>Pro</span>
              <span className="text-white"> Edition</span>
            </span>
          </div>
          <div className="bg-[#D4AF37] text-black text-xs font-black px-3 py-1.5 rounded-full">
            ZONE 2
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Pro Edition" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/50 via-[#0a0a1a]/40 to-[#0a0a1a]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,5,0.85) 0%, rgba(60,40,0,0.5) 50%, rgba(10,10,5,0.7) 100%)" }} />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 mb-4" style={{ background: "rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.4)" }}>
            <Crown className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span className="text-sm font-bold" style={{ color: "#D4AF37" }}>PROFESSIONAL EDITION</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">K-pop</span>
            <br />
            <span style={{ color: "#D4AF37" }}>프로 에디션</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 font-bold mb-4">
            Become a Real K-pop Artist
          </p>
          <p className="text-gray-400 text-lg max-w-2xl">
            한국음악저작권협회(KOMCA) 등록 최정상 작곡가들과 함께<br />
            실제 K-pop 아티스트와 동일한 프로세스로 음반을 제작하고 전 세계에 발매합니다
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6 bg-[#0a0a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-2xl border" style={{ background: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.3)" }}>
            <span className="text-2xl">🏆</span>
            <p className="text-lg font-bold" style={{ color: "#D4AF37" }}>한국음악저작권협회(KOMCA) 등록 최정상 작곡가들과 함께</p>
          </div>
          <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto">
            실제 K-pop 아티스트와 동일한 프로세스로 음반을 제작하고 전 세계에 발매합니다.<br />
            당신의 꿈을 현실로 만들어드리겠습니다.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-6 bg-[#0d0d20]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              What's <span style={{ color: "#D4AF37" }}>Included</span>
            </h2>
            <p className="text-gray-400 text-lg">패키지 구성 / Package Contents</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Music className="w-6 h-6" />,
                num: "01",
                title: "작곡가 매칭",
                subtitle: "Composer Matching",
                desc: "KOMCA 등록 한국 최정상 작곡가 선택 가능. 원하는 장르와 스타일에 맞는 작곡가를 직접 선택하세요.",
              },
              {
                icon: <Mic className="w-6 h-6" />,
                num: "02",
                title: "전문 레코딩",
                subtitle: "Professional Recording",
                desc: "K-pop 아티스트와 동일한 최고급 스튜디오에서 녹음. 전문 보컬 디렉팅이 포함됩니다.",
              },
              {
                icon: <span className="text-xl">🎚</span>,
                num: "03",
                title: "프로 믹싱·마스터링",
                subtitle: "Mixing & Mastering",
                desc: "업계 최고 전문가의 음향 후반 작업. 완벽한 사운드를 위한 세심한 작업이 이루어집니다.",
              },
              {
                icon: <Video className="w-6 h-6" />,
                num: "04",
                title: "뮤직비디오 / 티저",
                subtitle: "Music Video (Optional)",
                desc: "SNS 최적화 MV 및 티저 콘텐츠 제작. 도우인, 인스타그램, 유튜브에 최적화된 영상.",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                num: "05",
                title: "글로벌 유통",
                subtitle: "Global Distribution",
                desc: "Melon, Genie, Spotify, Apple Music, YouTube Music 등 전 세계 동시 발매.",
              },
              {
                icon: <Copyright className="w-6 h-6" />,
                num: "06",
                title: "저작권 등록",
                subtitle: "Copyright Registration",
                desc: "미국 기반 저작권 등록 및 관리. 사후 70년 보호로 평생의 자산을 만들어드립니다.",
              },
              {
                icon: <Megaphone className="w-6 h-6" />,
                num: "07",
                title: "PR·마케팅 지원",
                subtitle: "PR & Marketing",
                desc: "도우인(抖音), 샤오홍슈, 인스타그램, 유튜브 홍보 지원. 글로벌 K-pop 팬들에게 닿을 수 있습니다.",
              },
            ].map((item, i) => (
              <div key={i} className="group relative bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-7 transition-all hover:bg-white/8">
                <div className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-[#D4AF37]/10 transition-colors">{item.num}</div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 text-black" style={{ background: "#D4AF37" }}>
                  {item.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-1">{item.title}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: "#D4AF37" }}>{item.subtitle}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 px-6 bg-[#0a0a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Production <span style={{ color: "#D4AF37" }}>Timeline</span>
            </h2>
            <p className="text-gray-400 text-lg">프로젝트 진행 일정 / Project Schedule</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />

            <div className="space-y-6">
              {[
                { weeks: "Week 1–2", title: "상담 및 작곡가 매칭", subtitle: "Consultation & Composer Matching", desc: "원하는 장르, 스타일, 이미지를 상담 후 최적의 KOMCA 등록 작곡가를 매칭합니다." },
                { weeks: "Week 3–4", title: "작곡 및 편곡", subtitle: "Songwriting & Arrangement", desc: "선택한 작곡가가 개인 맞춤형 K-pop 트랙을 작곡 및 편곡합니다." },
                { weeks: "Week 5–6", title: "레코딩", subtitle: "Studio Recording", desc: "프로 스튜디오에서 보컬 디렉터와 함께 완벽한 녹음을 진행합니다." },
                { weeks: "Week 7–8", title: "믹싱·마스터링", subtitle: "Mixing & Mastering", desc: "업계 최고 전문가가 완벽한 사운드로 완성합니다." },
                { weeks: "Week 9–10", title: "MV 제작", subtitle: "Music Video (Optional)", desc: "SNS와 스트리밍 플랫폼 최적화 뮤직비디오 및 티저를 제작합니다." },
                { weeks: "Week 11–12", title: "유통 및 발매", subtitle: "Distribution & Release", desc: "전 세계 주요 음원 플랫폼 동시 발매 및 저작권 등록을 완료합니다." },
              ].map((step, i) => (
                <div key={i} className="relative pl-20">
                  {/* Circle */}
                  <div className="absolute left-5 top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ background: "#0a0a1a", borderColor: "#D4AF37" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4AF37" }} />
                  </div>

                  <div className="bg-white/5 border border-white/10 hover:border-[#D4AF37]/30 rounded-2xl p-6 transition-all">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ color: "#D4AF37", borderColor: "rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.1)" }}>
                        {step.weeks}
                      </span>
                      <h3 className="text-white font-black text-lg">{step.title}</h3>
                      <span className="text-gray-500 text-sm">{step.subtitle}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[#0d0d20]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Pricing <span style={{ color: "#D4AF37" }}>Packages</span>
            </h2>
            <p className="text-gray-400 text-lg">가격 패키지 / Choose Your Package</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard */}
            <div className="bg-white/5 border border-white/15 rounded-3xl p-8 flex flex-col">
              <div className="text-center mb-8">
                <div className="text-3xl mb-3">🎵</div>
                <h3 className="text-white font-black text-2xl mb-2">스탠다드</h3>
                <p className="text-gray-400 text-sm mb-6">Standard Package</p>
                <div className="text-white font-black text-4xl">₩15M~</div>
                <div className="text-gray-500 text-sm mt-1">₩15,000,000~</div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["작곡 + 편곡", "전문 레코딩", "AI 보컬 보정", "믹싱 · 마스터링", "글로벌 유통", "저작권 등록"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setForm(f => ({ ...f, packageInterest: "standard" }))}
                className="w-full py-4 rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 transition-colors"
              >
                Select Standard
              </button>
            </div>

            {/* Premium */}
            <div className="relative rounded-3xl p-[2px]" style={{ background: "linear-gradient(135deg, #D4AF37, #8B6914)" }}>
              <div className="bg-[#1a1400] rounded-3xl p-8 flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-black text-sm text-black" style={{ background: "#D4AF37" }}>
                  MOST POPULAR
                </div>
                <div className="text-center mb-8">
                  <div className="text-3xl mb-3">👑</div>
                  <h3 className="text-white font-black text-2xl mb-2">프리미엄</h3>
                  <p className="text-gray-400 text-sm mb-6">Premium Package</p>
                  <div className="font-black text-4xl" style={{ color: "#D4AF37" }}>₩25M~</div>
                  <div className="text-gray-500 text-sm mt-1">₩25,000,000~</div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {["스탠다드 전부 포함", "뮤직비디오 제작", "SNS 티저 콘텐츠", "PR 마케팅 지원", "도우인 · 샤오홍슈 홍보", "인스타 · 유튜브 캠페인", "전담 프로젝트 매니저"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setForm(f => ({ ...f, packageInterest: "premium" }))}
                  className="w-full py-4 rounded-2xl font-black text-black transition-all hover:opacity-90"
                  style={{ background: "#D4AF37" }}
                >
                  Select Premium
                </button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="bg-white/5 border border-white/15 rounded-3xl p-8 flex flex-col">
              <div className="text-center mb-8">
                <div className="text-3xl mb-3">🌟</div>
                <h3 className="text-white font-black text-2xl mb-2">엔터프라이즈</h3>
                <p className="text-gray-400 text-sm mb-6">Enterprise</p>
                <div className="text-white font-black text-2xl">별도 상담</div>
                <div className="text-gray-500 text-sm mt-1">Custom Quote</div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["프리미엄 전부 포함", "완전 맞춤형 패키지", "전속 아티스트 지원", "음반 기획사 연결", "컴백 기획 지원", "글로벌 투어 컨설팅"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-white/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setForm(f => ({ ...f, packageInterest: "enterprise" }))}
                className="w-full py-4 rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="py-12 px-6 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="overflow-hidden rounded-3xl aspect-[4/3]">
              <img src={rc30} alt="International artist in studio" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-3xl aspect-[4/3]">
              <img src={controlRoom} alt="Professional control room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-3xl aspect-[4/3]">
              <img src={rc36} alt="South Asian artist in studio" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-20 px-6 bg-[#0d0d20]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Start Your <span style={{ color: "#D4AF37" }}>K-pop Journey</span>
            </h2>
            <p className="text-gray-400">프로 에디션 상담 신청 / Pro Edition Inquiry</p>
          </div>

          {/* Contact shortcuts */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <a
              href="https://wa.me/821012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-900/30 border border-green-500/30 hover:bg-green-900/50 rounded-2xl px-5 py-4 transition-all"
            >
              <span className="text-3xl">💬</span>
              <div>
                <div className="text-white font-bold text-sm">WhatsApp</div>
                <div className="text-gray-400 text-xs">즉시 연결</div>
              </div>
            </a>
            <a
              href="https://open.kakao.com/o/example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-500/30 hover:bg-yellow-900/50 rounded-2xl px-5 py-4 transition-all"
            >
              <span className="text-3xl">🗨</span>
              <div>
                <div className="text-white font-bold text-sm">KakaoTalk</div>
                <div className="text-gray-400 text-xs">카카오 상담</div>
              </div>
            </a>
          </div>

          <div className="text-center text-gray-500 text-sm mb-8">— or fill out the form below —</div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">이름 / Name *</label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">국적 / Nationality</label>
                <Input
                  value={form.nationality}
                  onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                  placeholder="e.g. Japan, China, USA"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">이메일 / Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">전화번호 / Phone *</label>
                <Input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+82-10-0000-0000"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">선호 언어 / Language</label>
                <select
                  value={form.language}
                  onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="en" className="bg-gray-900">English</option>
                  <option value="ko" className="bg-gray-900">한국어</option>
                  <option value="zh" className="bg-gray-900">中文</option>
                  <option value="ja" className="bg-gray-900">日本語</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">패키지 관심 / Package</label>
                <select
                  value={form.packageInterest}
                  onChange={e => setForm(f => ({ ...f, packageInterest: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="standard" className="bg-gray-900">스탠다드 (₩15M~)</option>
                  <option value="premium" className="bg-gray-900">프리미엄 (₩25M~)</option>
                  <option value="enterprise" className="bg-gray-900">엔터프라이즈 (상담)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-1.5 block">메시지 / Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="원하는 장르, 스타일, 질문 사항을 자유롭게 적어주세요 / Tell us about your goals, preferred genre, style, and any questions..."
                rows={5}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full font-black text-black text-lg py-6 rounded-2xl transition-all hover:opacity-90 transform hover:scale-[1.02]"
              style={{ background: "#D4AF37" }}
            >
              {submitting ? "전송 중..." : "👑 프로 에디션 상담 신청 / Submit Inquiry"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 bg-[#050510]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <span className="text-xl font-black cursor-pointer"><span className="gradient-text">K</span> Recording Café</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Home</span></Link>
            <Link href="/experience"><span className="text-gray-500 hover:text-white text-sm cursor-pointer transition-colors">Experience</span></Link>
          </div>
          <p className="text-gray-600 text-sm">서울특별시 서초구 강남대로107길 21, 2층</p>
        </div>
      </footer>
    </div>
  );
}

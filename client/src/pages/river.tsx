import { useState } from "react";
import { MapPin, Star, Loader2 } from "lucide-react";
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
      {/* Language Selector - Horizontal Scroll */}
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
          {/* Feature 1 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#3d3d2a] rounded-full flex items-center justify-center">
              <Star className="w-7 h-7 text-[#d4a853]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.feature1Title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.feature1Desc}</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#3d3d2a] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-[#d4a853]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z" />
                <circle cx="18" cy="6" r="3" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.feature2Title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.feature2Desc}</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#3d3d2a] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-[#d4a853]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.feature3Title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.feature3Desc}</p>
          </div>
        </div>
      </section>

      {/* Gallery Section - Grid Layout */}
      <section className="py-12 px-4 bg-black">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t.spaceTitle} <span className="text-[#d4a853]">{t.spaceTitleHighlight}</span>
        </h2>
        <div className="max-w-4xl mx-auto">
          {/* Main Image */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2">
            <img
              src={GALLERY_IMAGES[0]}
              alt="Gallery main"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Grid of smaller images */}
          <div className="grid grid-cols-2 gap-2">
            {GALLERY_IMAGES.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`Gallery ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
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
          
          {/* Review Images Grid */}
          <div className="grid grid-cols-2 gap-2">
            {REVIEW_IMAGES.map((img, idx) => (
              <div key={idx} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
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
        <p className="text-gray-500 text-sm">Recording Cafe</p>
        <p className="text-gray-600 text-xs mt-1">© 2025 Recording Cafe. All rights reserved.</p>
      </footer>
    </div>
  );
}

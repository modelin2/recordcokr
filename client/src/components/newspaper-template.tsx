interface NewspaperTemplateProps {
  customerName: string;
  photoData: string;
  headline?: string;
}

export default function NewspaperTemplate({ customerName, photoData, headline }: NewspaperTemplateProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const weekday = today.toLocaleDateString("ko-KR", { weekday: "long" });
  const volumeNumber = Math.floor((today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-white p-6 max-w-[700px] mx-auto text-black"
      style={{ 
        border: "2px solid #111",
        fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
      }}
    >
      {/* Billboard Parody Masthead */}
      <div className="border-b-4 border-black pb-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <span className="text-white font-black text-base">RC</span>
            </div>
            <span className="text-xs leading-tight text-black font-medium">
              SINCE<br/>2024
            </span>
          </div>
          
          {/* Billboard Style Title */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-0">
              <span 
                className="text-5xl font-black tracking-tighter"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                <span className="text-black">bill</span>
                <span className="relative inline-block">
                  <span className="text-black">b</span>
                  <span className="absolute top-[4px] left-[6px] w-3 h-3 rounded-full bg-cyan-500"></span>
                </span>
                <span className="relative inline-block">
                  <span className="text-gray-700">o</span>
                  <span className="absolute top-[10px] left-[5px] w-3 h-3 rounded-full bg-pink-500"></span>
                </span>
                <span className="text-gray-700">ard</span>
              </span>
            </div>
            <div 
              className="text-sm tracking-[0.3em] text-black font-bold -mt-1"
              style={{ fontFamily: "'Arial', sans-serif" }}
            >
              RECORDING CAFE EDITION
            </div>
          </div>

          <div className="text-right text-xs text-black leading-tight">
            <div className="border-2 border-black p-2">
              <div className="font-black text-sm">QR</div>
              <div className="font-bold">SCAN</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-black mt-2 border-t-2 border-black pt-2 font-medium">
          <span>Vol. {volumeNumber} | No. {Math.floor(Math.random() * 999) + 1}</span>
          <span className="font-bold">{dateStr} {weekday}</span>
          <span>www.recordingcafe.com</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-3">
        <h1 
          className="text-2xl font-black leading-tight tracking-tight text-center border-b-2 border-black pb-2"
          style={{ fontFamily: "'Arial Black', 'Nanum Gothic', sans-serif" }}
        >
          {headline || `"${customerName}" 레코딩 카페에서 특별한 순간 포착`}
        </h1>
        <p className="text-sm text-black text-center mt-2 italic font-medium">
          Recording Cafe Sinsa Branch Welcomes Distinguished Guest
        </p>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-3 text-sm leading-relaxed">
        {/* Column 1 - Main Photo */}
        <div className="col-span-2">
          <div className="border-2 border-black">
            <img 
              src={photoData} 
              alt={customerName}
              className="w-full aspect-[4/3] object-cover"
              style={{ 
                filter: "grayscale(100%) contrast(1.3)",
              }}
            />
          </div>
          <p className="text-xs text-center mt-1 border-b-2 border-black pb-2 font-bold">
            ▲ {customerName}님의 레코딩 현장 | Recording Cafe Sinsa
          </p>
          
          {/* Article under photo */}
          <div className="mt-2 columns-2 gap-3 text-justify text-xs leading-relaxed" style={{ columnRule: "2px solid #333" }}>
            <p className="mb-2">
              <span className="font-black text-base float-left mr-1 leading-none">오</span>
              늘 레코딩 카페를 방문해 주신 {customerName}님께서 K-pop 스타일의 전문 녹음을 성공적으로 마쳤다. 
              전문 엔지니어의 지도 아래 최고의 음질로 녹음된 이번 세션은 방문객에게 잊지 못할 추억이 될 것이다.
            </p>
            <p className="mb-2">
              레코딩 카페 신사점은 최신 녹음 장비와 아늑한 카페 분위기를 결합한 혁신적 공간으로, 
              전문가가 아니더라도 누구나 쉽게 자신만의 음악을 만들 수 있는 것이 특징이다.
            </p>
            <p>
              {customerName}님은 녹음을 마치고 "정말 특별한 경험이었다. 다음에도 꼭 다시 오고 싶다"며 
              만족스러운 소감을 전했다.
            </p>
          </div>
        </div>

        {/* Column 3 - Sidebar */}
        <div className="border-l-2 border-black pl-3">
          {/* Hot Chart Box */}
          <div className="bg-black text-white p-2 mb-3">
            <div className="text-xs font-black text-center tracking-wider">
              ★ HOT RECORDING ★
            </div>
          </div>

          {/* Info Box */}
          <div className="border-2 border-black p-2 mb-3">
            <div className="text-xs font-black border-b-2 border-black pb-1 mb-2">
              TODAY'S SESSION
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">Artist</span>
                <span className="font-black">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date</span>
                <span className="font-bold">{today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Studio</span>
                <span className="font-bold">Sinsa</span>
              </div>
            </div>
          </div>

          {/* Services Box */}
          <div className="border-2 border-black p-2 mb-3">
            <div className="text-xs font-black mb-2">SERVICES</div>
            <ul className="text-xs space-y-1 font-medium">
              <li>☑ 전문 녹음</li>
              <li>☑ 보이스 튜닝</li>
              <li>☑ 믹싱/마스터링</li>
              <li>☑ 뮤직비디오</li>
              <li>☑ 음원 발매</li>
            </ul>
          </div>

          {/* Quote Box */}
          <div className="bg-gray-200 p-2 mb-3 border-l-4 border-black">
            <p className="text-xs italic font-bold">
              "여기에 여러분의 꿈을 녹여 드려요!"
            </p>
            <p className="text-xs text-right font-medium mt-1">— Recording Cafe</p>
          </div>

          {/* Contact Info */}
          <div className="text-xs border-t-2 border-black pt-2">
            <div className="font-black mb-1">LOCATION</div>
            <div className="font-medium">서울 강남구 압구정로 2길 46</div>
            <div className="font-medium">파크리오빌딩 1413호</div>
            <div className="mt-2">
              <span className="font-black">HOURS</span><br/>
              <span className="font-bold">10:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-3 pt-2 border-t-4 border-black">
        <div className="grid grid-cols-3 gap-3 text-xs">
          {/* Left */}
          <div>
            <div className="font-black text-sm mb-1">UPCOMING</div>
            <div className="space-y-1 font-medium">
              <div>• 크리스마스 특별 할인</div>
              <div>• 그룹 녹음 패키지</div>
              <div>• 뮤직비디오 프로모션</div>
            </div>
          </div>
          
          {/* Center */}
          <div className="text-center border-x-2 border-black px-3">
            <div className="font-black text-sm">BOOK NOW</div>
            <div className="mt-1 font-bold">
              네이버 예약<br/>
              또는 현장 방문
            </div>
          </div>

          {/* Right */}
          <div className="text-right">
            <div className="font-black text-sm mb-1">FOLLOW US</div>
            <div className="font-bold">
              @recordingcafe<br/>
              #레코딩카페 #신사
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t-2 border-black text-center">
        <p className="text-xs text-black font-medium">
          © {today.getFullYear()} Recording Cafe. All Rights Reserved. | 이 신문은 기념용으로 제작되었습니다.
        </p>
      </div>
    </div>
  );
}

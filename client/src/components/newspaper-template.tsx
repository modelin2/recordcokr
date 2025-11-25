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
      className="bg-white p-4 max-w-[600px] mx-auto text-black"
      style={{ 
        border: "1px solid #222",
        fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
      }}
    >
      {/* Billboard Parody Masthead */}
      <div className="border-b-2 border-black pb-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white font-black text-xs">RC</span>
            </div>
            <span className="text-[8px] leading-tight text-gray-600">
              SINCE<br/>2024
            </span>
          </div>
          
          {/* Billboard Style Title */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-0">
              <span 
                className="text-3xl font-black tracking-tighter"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                <span className="text-black">bill</span>
                <span className="relative inline-block">
                  <span className="text-black">b</span>
                  <span className="absolute top-[2px] left-[4px] w-2 h-2 rounded-full bg-cyan-500"></span>
                </span>
                <span className="relative inline-block">
                  <span className="text-gray-500">o</span>
                  <span className="absolute top-[6px] left-[3px] w-2 h-2 rounded-full bg-pink-500"></span>
                </span>
                <span className="text-gray-500">ard</span>
              </span>
            </div>
            <div 
              className="text-[10px] tracking-[0.3em] text-gray-600 -mt-1"
              style={{ fontFamily: "'Arial', sans-serif" }}
            >
              RECORDING CAFE EDITION
            </div>
          </div>

          <div className="text-right text-[8px] text-gray-600 leading-tight">
            <div className="border border-black p-1">
              <div className="font-bold">QR</div>
              <div>SCAN</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[8px] text-gray-700 mt-1 border-t border-gray-300 pt-1">
          <span>Vol. {volumeNumber} | No. {Math.floor(Math.random() * 999) + 1}</span>
          <span>{dateStr} {weekday}</span>
          <span>www.recordingcafe.com</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-2">
        <h1 
          className="text-xl font-black leading-tight tracking-tight text-center border-b border-gray-400 pb-1"
          style={{ fontFamily: "'Arial Black', 'Nanum Gothic', sans-serif" }}
        >
          {headline || `"${customerName}" 레코딩 카페에서 특별한 순간 포착`}
        </h1>
        <p className="text-[9px] text-gray-600 text-center mt-1 italic">
          Recording Cafe Sinsa Branch Welcomes Distinguished Guest
        </p>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-2 text-[8px] leading-[1.3]">
        {/* Column 1 - Main Photo */}
        <div className="col-span-2">
          <div className="border border-black">
            <img 
              src={photoData} 
              alt={customerName}
              className="w-full aspect-[4/3] object-cover"
              style={{ 
                filter: "grayscale(100%) contrast(1.2)",
              }}
            />
          </div>
          <p className="text-[7px] text-center mt-0.5 border-b border-gray-300 pb-1">
            ▲ {customerName}님의 레코딩 현장 | Recording Cafe Sinsa
          </p>
          
          {/* Article under photo */}
          <div className="mt-1 columns-2 gap-2 text-justify" style={{ columnRule: "1px solid #ccc" }}>
            <p className="mb-1">
              <span className="font-bold text-[10px] float-left mr-0.5 leading-none">오</span>
              늘 레코딩 카페를 방문해 주신 {customerName}님께서 K-pop 스타일의 전문 녹음을 성공적으로 마쳤다. 
              전문 엔지니어의 지도 아래 최고의 음질로 녹음된 이번 세션은 방문객에게 잊지 못할 추억이 될 것이다.
            </p>
            <p className="mb-1">
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
        <div className="border-l border-gray-400 pl-2">
          {/* Hot Chart Box */}
          <div className="bg-black text-white p-1 mb-2">
            <div className="text-[7px] font-bold text-center tracking-wider">
              ★ HOT RECORDING ★
            </div>
          </div>

          {/* Info Box */}
          <div className="border border-black p-1 mb-2">
            <div className="text-[7px] font-bold border-b border-gray-400 pb-0.5 mb-1">
              TODAY'S SESSION
            </div>
            <div className="space-y-0.5 text-[7px]">
              <div className="flex justify-between">
                <span>Artist</span>
                <span className="font-bold">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span>{today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Studio</span>
                <span>Sinsa</span>
              </div>
            </div>
          </div>

          {/* Services Box */}
          <div className="border border-gray-400 p-1 mb-2">
            <div className="text-[7px] font-bold mb-1">SERVICES</div>
            <ul className="text-[6px] space-y-0.5">
              <li>☑ 전문 녹음</li>
              <li>☑ 보이스 튜닝</li>
              <li>☑ 믹싱/마스터링</li>
              <li>☑ 뮤직비디오</li>
              <li>☑ 음원 발매</li>
            </ul>
          </div>

          {/* Quote Box */}
          <div className="bg-gray-100 p-1 mb-2 border-l-2 border-black">
            <p className="text-[7px] italic">
              "여기에 여러분의 꿈을 녹여 드려요!"
            </p>
            <p className="text-[6px] text-right">— Recording Cafe</p>
          </div>

          {/* Contact Info */}
          <div className="text-[6px] border-t border-gray-400 pt-1">
            <div className="font-bold mb-0.5">LOCATION</div>
            <div>서울 강남구 압구정로 2길 46</div>
            <div>파크리오빌딩 1413호</div>
            <div className="mt-1">
              <span className="font-bold">HOURS</span><br/>
              10:00 AM - 10:00 PM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-2 pt-1 border-t-2 border-black">
        <div className="grid grid-cols-3 gap-2 text-[7px]">
          {/* Left */}
          <div>
            <div className="font-bold text-[8px] mb-0.5">UPCOMING</div>
            <div className="text-[6px] space-y-0.5">
              <div>• 크리스마스 특별 할인</div>
              <div>• 그룹 녹음 패키지</div>
              <div>• 뮤직비디오 프로모션</div>
            </div>
          </div>
          
          {/* Center */}
          <div className="text-center border-x border-gray-300 px-2">
            <div className="font-bold text-[8px]">BOOK NOW</div>
            <div className="text-[6px] mt-0.5">
              네이버 예약<br/>
              또는 현장 방문
            </div>
          </div>

          {/* Right */}
          <div className="text-right">
            <div className="font-bold text-[8px] mb-0.5">FOLLOW US</div>
            <div className="text-[6px]">
              @recordingcafe<br/>
              #레코딩카페 #신사
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-1 border-t border-gray-400 text-center">
        <p className="text-[6px] text-gray-500">
          © {today.getFullYear()} Recording Cafe. All Rights Reserved. | 이 신문은 기념용으로 제작되었습니다.
        </p>
      </div>
    </div>
  );
}

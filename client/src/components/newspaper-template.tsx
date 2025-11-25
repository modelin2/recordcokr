interface NewspaperTemplateProps {
  customerName: string;
  photoData: string;
  headline?: string;
}

export default function NewspaperTemplate({ customerName, photoData, headline }: NewspaperTemplateProps) {
  const today = new Date();
  const dateKr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateEn = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const volumeNumber = Math.floor((today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-white p-6 w-full text-black"
      style={{ 
        fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
      }}
    >
      {/* K-POP BOARD Masthead */}
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
          
          {/* K-POP BOARD Title */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-0">
              <span 
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                <span className="text-black">K-POP</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-black">BOARD</span>
              </span>
            </div>
            <div 
              className="text-sm tracking-[0.3em] text-black font-bold -mt-1"
              style={{ fontFamily: "'Arial', sans-serif" }}
            >
              SEOUL MUSIC TODAY
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
          <span>{dateKr} ({dateEn})</span>
          <span>No. {volumeNumber} (특별호)</span>
          <span className="font-bold">가격: 당신의 열정</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-3">
        <h1 
          className="text-2xl font-black leading-tight text-center mb-1"
          style={{ fontFamily: "'Arial Black', 'Nanum Gothic', sans-serif" }}
        >
          {headline || <>서울의 숨은 보석 발견! 오늘 K-POP 차기 스타 탄생?</>}
        </h1>
        <p className="text-sm text-center text-gray-700 italic mb-2">
          Hidden Gem of Seoul Discovered! Is the Next K-Pop Star Born Today?
        </p>
        <div className="text-center border-b-2 border-black pb-2">
          <p className="text-base font-bold">
            Recording Cafe 방문객, 압도적 가창력에 제작진 '경악'... 데뷔 임박설 솔솔
          </p>
          <p className="text-xs text-gray-600 italic mt-1">
            Visitor at Recording Cafe stuns staff with overwhelming vocals... Debut rumors swirling.
          </p>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-3 text-sm leading-relaxed">
        {/* Column 1-2: Main Photo + Article */}
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
          <p className="text-xs text-center mt-1 border-b-2 border-black pb-2 font-medium">
            ▲ 오늘 Recording Cafe 스튜디오를 뜨겁게 달군 주인공 <span className="font-bold">{customerName}</span>님이 녹음에 열중하고 있다. 
            관계자들은 "마이크를 잡는 순간 눈빛이 변했다"며 혀를 내둘렀다. / 사진 = SMT 특별취재팀
          </p>
          
          {/* Article under photo */}
          <div className="mt-2 columns-2 gap-3 text-justify text-xs leading-relaxed" style={{ columnRule: "2px solid #333" }}>
            <p className="mb-2">
              <span className="font-bold">서울=SMT뉴스</span> 대한민국 가요계가 긴장하고 있다. 오늘 오후, 서울 서초구에 위치한 'Recording Cafe'에서 믿을 수 없는 일이 벌어졌다. 우연히 스튜디오를 방문한 한 고객이 프로 가수 뺨치는 엄청난 실력을 선보였기 때문이다.
            </p>
            <p className="mb-2">
              현장에 있던 엔지니어 A씨는 "수많은 사람을 녹음해봤지만, 이런 재능은 처음"이라며, "첫 소절을 듣는 순간 소름이 돋아 페이더를 올리는 것도 잊었다"고 흥분을 감추지 못했다.
            </p>
            <p>
              이 정체불명의 '예비 스타'는 녹음 내내 완벽한 감정 처리와 폭발적인 고음으로 스튜디오를 장악했다는 후문이다. 과연 서울에서 탄생한 이 새로운 별이 앞으로 어떤 행보를 보일지 귀추가 주목된다.
            </p>
          </div>
        </div>

        {/* Column 3: Sidebar */}
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

          {/* English Summary */}
          <div className="bg-gray-100 p-2 mb-3 border border-black">
            <h3 className="font-black text-xs mb-1">[English Summary]</h3>
            <p className="text-[10px] leading-relaxed">
              A visitor at Recording Cafe today shocked everyone with an amazing singing performance. 
              The studio engineer said, "This is unbelievable talent."
            </p>
          </div>

          {/* Weather/Fortune box */}
          <div className="border-2 border-black p-2 mb-2">
            <div className="text-xs font-bold mb-1">[오늘의 날씨]</div>
            <div className="text-xs">맑음. 노래하기 딱 좋은 날씨.</div>
            <div className="text-[10px] text-gray-600 italic">(Sunny. Perfect day for singing.)</div>
          </div>
          <div className="border-2 border-black p-2">
            <div className="text-xs font-bold mb-1">[금주의 운세]</div>
            <div className="text-xs">마이크를 잡으면 대박 날 운명.</div>
            <div className="text-[10px] text-gray-600 italic">(Destined for success with a mic.)</div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <div className="mt-3 pt-2 border-t-4 border-black">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <span className="text-white font-black text-sm">RC</span>
            </div>
            <div>
              <p className="text-base font-black">Recording Cafe</p>
              <p className="text-xs text-gray-700">서울 서초구 강남대로 107길 21. 2층</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold mb-1">인스타그램에 인증샷 올리면 아메리카노 무료!</p>
            <p className="text-gray-600 italic text-[10px]">
              Share on Instagram and get a free Americano!
            </p>
            <p className="font-bold mt-1">#서울핫플 #RecordingCafe</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t-2 border-black flex justify-between items-center text-xs font-medium">
        <span>www.recordingcafe.com</span>
        <span>© {today.getFullYear()} Recording Cafe</span>
        <span>@recordingcafe</span>
      </div>
    </div>
  );
}

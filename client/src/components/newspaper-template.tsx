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
  const issueNo = Math.floor((today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-white text-black mx-auto"
      style={{ 
        width: "297mm",
        minHeight: "420mm",
        padding: "12mm",
        fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
        border: "1px solid #000",
      }}
    >
      {/* Section A: Masthead */}
      <div className="border-b-4 border-black pb-3 mb-4">
        {/* Top info line */}
        <div className="text-xs text-center mb-2 font-medium tracking-wide">
          [특종] 서울 한복판에서 들려온 '천상의 목소리'... 시민들 충격!
        </div>
        <div className="text-[10px] text-center text-gray-700 italic mb-4">
          [BREAKING NEWS] "Heavenly Voice" heard in the middle of Seoul... Citizens Shocked!
        </div>

        {/* Main Title - K-POP BOARD */}
        <div className="text-center mb-3">
          <div 
            className="text-6xl font-black tracking-tight inline-flex items-center justify-center"
            style={{ fontFamily: "'Arial Black', sans-serif" }}
          >
            <span className="text-black">K-POP</span>
            <span className="mx-3 text-gray-400">|</span>
            <span className="relative">
              <span className="text-black">B</span>
              <span className="absolute top-2 left-2 w-4 h-4 rounded-full bg-pink-500"></span>
            </span>
            <span className="relative">
              <span className="text-black">O</span>
              <span className="absolute top-3 left-2 w-4 h-4 rounded-full bg-cyan-500"></span>
            </span>
            <span className="text-black">ARD</span>
          </div>
          <div className="text-lg tracking-[0.5em] text-gray-600 font-bold mt-1" style={{ fontFamily: "'Arial', sans-serif" }}>
            SEOUL MUSIC TODAY
          </div>
        </div>

        {/* Info bar */}
        <div className="flex justify-between items-center text-xs border-t-2 border-black pt-2 font-medium">
          <span>{dateKr} ({dateEn})</span>
          <span>서울특별시 강남구 압구정로 2길 46</span>
          <span>No. {issueNo} (특별호)</span>
          <span className="font-bold">가격: 당신의 열정 (Price: Your Passion)</span>
        </div>
      </div>

      {/* Section B: Main Headline */}
      <div className="mb-4">
        <h1 
          className="text-4xl font-black leading-tight text-center mb-2"
          style={{ fontFamily: "'Nanum Gothic', 'Arial Black', sans-serif" }}
        >
          서울의 숨은 보석 발견! 오늘 <span className="text-red-600">K-POP 차기 스타</span> 탄생?
        </h1>
        <p className="text-xl text-center text-gray-700 italic mb-3">
          Hidden Gem of Seoul Discovered! Is the Next K-Pop Star Born Today?
        </p>
        <div className="text-center">
          <p className="text-lg font-bold">
            Recording Cafe 방문객, 압도적 가창력에 제작진 '<span className="text-red-600">경악</span>'... 데뷔 임박설 솔솔
          </p>
          <p className="text-sm text-gray-600 italic mt-1">
            Visitor at Recording Cafe stuns staff with overwhelming vocals... Debut rumors swirling.
          </p>
        </div>
      </div>

      {/* Section C: Main Photo */}
      <div className="mb-4">
        <div className="border-4 border-black">
          <img 
            src={photoData} 
            alt={customerName}
            className="w-full object-cover"
            style={{ 
              aspectRatio: "16/10",
              filter: "grayscale(100%) contrast(1.2)",
            }}
          />
        </div>
        <p className="text-sm text-center mt-2 border-b-2 border-gray-400 pb-2">
          ▲ 오늘 Recording Cafe 스튜디오를 뜨겁게 달군 주인공 <span className="font-bold">{customerName}</span>님이 녹음에 열중하고 있다. 
          관계자들은 "마이크를 잡는 순간 눈빛이 변했다"며 혀를 내둘렀다. / 사진 = SMT 특별취재팀
        </p>
      </div>

      {/* Section D: Main Article - 3 columns */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        {/* Column 1 */}
        <div className="text-sm leading-relaxed text-justify">
          <p className="mb-3">
            <span className="text-2xl font-black float-left mr-2 leading-none">(서</span>
            울=SMT뉴스) 대한민국 가요계가 긴장하고 있다.
          </p>
          <p className="mb-3">
            오늘 오후, 서울 강남구에 위치한 'Recording Cafe'에서 믿을 수 없는 일이 벌어졌다. 
            우연히 스튜디오를 방문한 한 고객이 프로 가수 뺨치는 엄청난 실력을 선보였기 때문이다.
          </p>
          <p>
            현장에 있던 엔지니어 A씨는 "수많은 사람을 녹음해봤지만, 이런 재능은 처음"이라며, 
            "첫 소절을 듣는 순간 소름이 돋아 페이더를 올리는 것도 잊었다"고 흥분을 감추지 못했다.
          </p>
        </div>

        {/* Column 2 */}
        <div className="text-sm leading-relaxed text-justify border-l-2 border-gray-300 pl-4">
          <p className="mb-3">
            이 정체불명의 '예비 스타'는 녹음 내내 완벽한 감정 처리와 폭발적인 고음으로 
            스튜디오를 장악했다는 후문이다.
          </p>
          <p className="mb-3">
            이 소식을 접한 네티즌들은 "당장 데뷔시켜라", "얼굴도 실력도 완벽하다", 
            "나도 저 카페 가면 스타 될 수 있나?" 등의 폭발적인 반응을 보이고 있다.
          </p>
          <p>
            과연 서울에서 탄생한 이 새로운 별이 앞으로 어떤 행보를 보일지 귀추가 주목된다.
          </p>
        </div>

        {/* Column 3 - English Summary */}
        <div className="border-l-2 border-gray-300 pl-4">
          <div className="bg-gray-100 p-3 mb-3">
            <h3 className="font-black text-base mb-2">[English Summary]</h3>
            <h4 className="font-bold text-sm mb-2">A New Star is Born in Seoul!</h4>
            <p className="text-xs leading-relaxed">
              A visitor at Recording Cafe today shocked everyone with an amazing singing performance. 
              The studio engineer said, "This is unbelievable talent." 
              Rumors are saying a new K-Pop star might have just been discovered right here today.
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
            <div className="text-[10px] text-gray-600 italic">(Destined to hit the jackpot if you grab a mic.)</div>
          </div>
        </div>
      </div>

      {/* Section E: Bottom Ad Banner */}
      <div className="border-4 border-black p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <span className="text-white font-black text-xl">RC</span>
            </div>
            <div>
              <p className="text-xl font-black">당신도 주인공이 될 수 있습니다!</p>
              <p className="text-lg font-bold text-gray-700">Recording Cafe</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold mb-1">
              인스타그램에 인증샷 올리면 다음 방문 시 아메리카노 무료!
            </p>
            <p className="text-xs text-gray-600 italic">
              Share this newspaper on Instagram and get a free Americano next time!
            </p>
            <p className="text-sm font-bold mt-2 text-pink-600">
              #서울핫플 #내가바로가수다 #RecordingCafe
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t-2 border-black flex justify-between items-center text-xs">
        <span>www.recordingcafe.com</span>
        <span>© {today.getFullYear()} Recording Cafe. All Rights Reserved.</span>
        <span>@recordingcafe</span>
      </div>
    </div>
  );
}

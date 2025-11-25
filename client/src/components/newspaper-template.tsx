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
  const volumeNumber = Math.floor((today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-[#d4c4a8] p-6 font-serif max-w-[600px] mx-auto"
      style={{ 
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noise)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="border-b-4 border-double border-amber-900 pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-amber-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-tight text-center">
                레코딩<br/>카페
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-amber-800">
            <div>QR 코드를 스캔하세요!</div>
            <div className="mt-1 w-16 h-16 bg-amber-900/10 border border-amber-800 flex items-center justify-center text-[8px]">
              QR CODE
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-amber-900 tracking-tighter text-center my-2"
            style={{ fontFamily: "'Nanum Myeongjo', serif" }}>
          레코딩카페 신문
        </h1>
        
        <div className="flex justify-between items-center text-xs text-amber-800 border-t border-amber-700 pt-2">
          <span>레코딩 카페 신사점 | Vol. {volumeNumber}</span>
          <span>{dateStr}</span>
          <span>www.recordingcafe.com</span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-800 pb-2 mb-3"
            style={{ fontFamily: "'Nanum Myeongjo', serif" }}>
          {headline || `${customerName}님의 특별한 레코딩 순간`}
        </h2>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <img 
                src={photoData} 
                alt={customerName}
                className="w-full aspect-[4/3] object-cover grayscale sepia"
                style={{ 
                  filter: "grayscale(100%) sepia(30%) contrast(1.1)",
                  border: "3px solid #5c4a32"
                }}
              />
              <div className="absolute bottom-2 right-2 bg-amber-900/80 text-white text-xs px-2 py-1">
                Recording Cafe
              </div>
            </div>
            <p className="text-xs text-amber-800 mt-1 text-center italic">
              ▲ {customerName}님의 레코딩 현장
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed text-amber-900 mb-4">
        <div className="column">
          <p className="text-justify mb-2">
            <span className="font-bold text-lg float-left mr-1 leading-none">오</span>
            늘 레코딩 카페를 방문해 주신 {customerName}님께서 특별한 녹음을 진행하셨습니다. 
            전문 엔지니어와 함께 최고의 음질로 녹음된 이번 세션은 잊지 못할 추억이 될 것입니다.
          </p>
          <p className="text-justify mb-2">
            레코딩 카페 신사점은 K-pop 스타일의 전문 녹음실과 
            아늑한 카페가 결합된 독특한 공간으로, 누구나 쉽게 자신만의 음악을 만들 수 있습니다.
          </p>
        </div>
        <div className="column">
          <p className="text-justify mb-2">
            {customerName}님은 오늘 녹음을 마치고 "정말 특별한 경험이었다"며 밝은 미소로 소감을 전했습니다.
          </p>
          <p className="text-justify mb-2">
            레코딩 카페에서는 목소리 보정, 믹싱, 마스터링은 물론 
            뮤직비디오 제작과 음원 발매 서비스까지 원스톱으로 제공하고 있습니다.
          </p>
          <p className="text-justify">
            다음 방문을 기대하며, {customerName}님의 앞날에 항상 좋은 일만 가득하길 바랍니다!
          </p>
        </div>
      </div>

      <div className="border-t-2 border-amber-800 pt-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 text-sm mb-1">📍 레코딩 카페 신사점</h3>
            <p className="text-[9px] text-amber-800">
              서울시 강남구 압구정로 2길 46 파크리오빌딩 1413호
            </p>
            <p className="text-[9px] text-amber-800">
              영업시간: 오전 10:00 ~ 오후 10:00
            </p>
          </div>
          <div className="text-right">
            <div className="bg-amber-800 text-white text-[10px] px-3 py-1 rounded inline-block">
              다음 예약은 네이버에서!
            </div>
            <p className="text-[8px] text-amber-700 mt-1">
              레코딩 카페 | 123-45-67890
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-dashed border-amber-700 pt-3 text-center">
        <p className="text-xs text-amber-700 italic">
          "여기에 여러분의 꿈을 녹여 드려요~!"
        </p>
        <p className="text-[10px] text-amber-600 mt-1">
          Recording Cafe - Where Your Voice Becomes a Song
        </p>
      </div>
    </div>
  );
}

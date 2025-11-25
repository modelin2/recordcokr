interface NewspaperTemplateProps {
  customerName: string;
  koreanName?: string;
  photoData: string;
  headline?: string;
  drinkName?: string;
  drinkTemperature?: string;
}

function convertToKorean(name: string): string {
  const koreanMap: Record<string, string> = {
    'john': '존', 'jane': '제인', 'mike': '마이크', 'michael': '마이클',
    'david': '데이비드', 'james': '제임스', 'robert': '로버트', 'william': '윌리엄',
    'richard': '리차드', 'joseph': '조셉', 'thomas': '토마스', 'charles': '찰스',
    'chris': '크리스', 'christopher': '크리스토퍼', 'daniel': '다니엘', 'matthew': '매튜',
    'anthony': '앤서니', 'mark': '마크', 'donald': '도널드', 'steven': '스티븐',
    'paul': '폴', 'andrew': '앤드류', 'joshua': '조슈아', 'kevin': '케빈',
    'brian': '브라이언', 'george': '조지', 'edward': '에드워드', 'ronald': '로널드',
    'timothy': '티모시', 'jason': '제이슨', 'jeffrey': '제프리', 'ryan': '라이언',
    'jacob': '제이콥', 'gary': '게리', 'nicholas': '니콜라스', 'eric': '에릭',
    'jonathan': '조나단', 'stephen': '스티븐', 'larry': '래리', 'justin': '저스틴',
    'scott': '스콧', 'brandon': '브랜든', 'benjamin': '벤자민', 'samuel': '사무엘',
    'raymond': '레이몬드', 'gregory': '그레고리', 'frank': '프랭크', 'alexander': '알렉산더',
    'alex': '알렉스', 'patrick': '패트릭', 'jack': '잭', 'dennis': '데니스',
    'jerry': '제리', 'tyler': '타일러', 'aaron': '아론', 'henry': '헨리',
    'mary': '메리', 'patricia': '패트리샤', 'jennifer': '제니퍼', 'linda': '린다',
    'elizabeth': '엘리자베스', 'barbara': '바바라', 'susan': '수잔', 'jessica': '제시카',
    'sarah': '사라', 'karen': '카렌', 'lisa': '리사', 'nancy': '낸시',
    'betty': '베티', 'margaret': '마가렛', 'sandra': '샌드라', 'ashley': '애슐리',
    'dorothy': '도로시', 'kimberly': '킴벌리', 'emily': '에밀리', 'donna': '도나',
    'michelle': '미셸', 'carol': '캐롤', 'amanda': '아만다', 'melissa': '멜리사',
    'deborah': '데보라', 'stephanie': '스테파니', 'rebecca': '레베카', 'sharon': '샤론',
    'laura': '로라', 'cynthia': '신시아', 'kathleen': '캐슬린', 'amy': '에이미',
    'angela': '안젤라', 'shirley': '셜리', 'anna': '안나', 'brenda': '브렌다',
    'emma': '엠마', 'olivia': '올리비아', 'ava': '에바', 'sophia': '소피아',
    'isabella': '이사벨라', 'mia': '미아', 'charlotte': '샬롯', 'amelia': '아멜리아',
    'harper': '하퍼', 'evelyn': '에블린', 'abigail': '애비게일', 'ella': '엘라',
    'peter': '피터', 'tom': '톰', 'tommy': '토미', 'bob': '밥', 'bobby': '바비',
    'sam': '샘', 'ben': '벤', 'max': '맥스', 'leo': '레오', 'luke': '루크',
    'noah': '노아', 'oliver': '올리버', 'elijah': '엘라이자', 'liam': '리암',
    'mason': '메이슨', 'logan': '로건', 'lucas': '루카스', 'ethan': '에단',
    'aiden': '에이든', 'jackson': '잭슨', 'sebastian': '세바스찬', 'mateo': '마테오',
    'owen': '오웬', 'theodore': '테오도어', 'theo': '테오', 'miles': '마일스',
    'kate': '케이트', 'katie': '케이티', 'grace': '그레이스', 'zoe': '조이',
    'natalie': '나탈리', 'hannah': '한나', 'lily': '릴리', 'chloe': '클로이',
    'victoria': '빅토리아', 'madison': '매디슨', 'lucy': '루시', 'aria': '아리아',
  };
  
  const lowerName = name.toLowerCase().trim();
  if (koreanMap[lowerName]) {
    return koreanMap[lowerName];
  }
  
  const nameParts = name.split(' ');
  const firstName = nameParts[0].toLowerCase();
  if (koreanMap[firstName]) {
    return koreanMap[firstName];
  }
  
  return '';
}

export default function NewspaperTemplate({ customerName, koreanName, photoData, headline, drinkName, drinkTemperature }: NewspaperTemplateProps) {
  const autoKoreanName = koreanName || convertToKorean(customerName);
  const displayName = autoKoreanName ? `${customerName} (${autoKoreanName})` : customerName;
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
      className="bg-white p-3 w-full text-black"
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
            <div className="flex items-baseline justify-center gap-0">
              <span 
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                K-POP
              </span>
              <span 
                className="mx-2 text-gray-400 text-3xl font-light"
                style={{ lineHeight: "1" }}
              >
                |
              </span>
              <span 
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                BOARD
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
      <div className="mb-3 border-b-2 border-black pb-2">
        <h1 
          className="text-3xl font-black leading-tight text-center"
          style={{ fontFamily: "'Arial Black', 'Nanum Gothic', sans-serif" }}
        >
          {headline || <>{displayName} 내한 녹음 현장!</>}
        </h1>
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
            ▲ 오늘 Recording Cafe 스튜디오를 뜨겁게 달군 주인공 <span className="font-bold">{displayName}</span>님이 녹음에 열중하고 있다. 
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
                <span className="font-black">{displayName}</span>
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
          <div className="p-2 mb-3 border border-black" style={{ backgroundColor: "#f0f0f0" }}>
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
          <div className="border-2 border-black p-2 mb-2">
            <div className="text-xs font-bold mb-1">[금주의 운세]</div>
            <div className="text-xs">마이크를 잡으면 대박 날 운명.</div>
            <div className="text-[10px] text-gray-600 italic">(Destined for success with a mic.)</div>
          </div>

          {/* Joke Drink Section */}
          <div className="border-2 border-black p-2" style={{ backgroundColor: "#f0f0f0" }}>
            <div className="text-xs font-black mb-1 text-center">[스타의 음료]</div>
            <div className="text-xs text-center mb-1">
              <span className="font-bold">{displayName}</span>님이
            </div>
            <div className="text-xs text-center">
              주문한 것으로 알려진
            </div>
            <div className="text-sm font-black text-center mt-1 border-t border-gray-300 pt-1">
              ☕ {drinkTemperature === "iced" ? "Iced " : drinkTemperature === "hot" ? "Hot " : ""}{drinkName || "아메리카노"}
            </div>
            <div className="text-[10px] text-gray-600 italic text-center mt-1">
              "성공한 아티스트의 시작은 항상 커피와 함께"
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <div className="mt-3 pt-2 border-t-4 border-black">
        <div className="flex items-center justify-between p-2 bg-gray-50 border-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white font-black text-xs">RC</span>
            </div>
            <div>
              <p className="text-sm font-black">Recording Cafe</p>
              <p className="text-[10px] text-gray-700">서울 서초구 강남대로 107길 21. 2층</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-[10px]">인스타그램에 인증샷 올리고 @recordingcafe 팔로우하면 1타임 무료!</p>
            <p className="text-gray-600 italic text-[9px]">
              Share on Instagram & follow @recordingcafe for 1 free session!
            </p>
            <p className="font-bold text-[10px] mt-1">#SeoulHotspot #SeoulItinerary #RecordingCafe</p>
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

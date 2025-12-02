interface LifeStageImage {
  lifeStage: string;
  stageName: string;
  stageNameKr: string;
  ageRange: string;
  imageData: string | null;
  prompt: string;
  success: boolean;
  error?: string;
}

interface NewspaperTemplateProps {
  customerName: string;
  koreanName?: string;
  photoData: string;
  headline?: string;
  drinkName?: string;
  drinkTemperature?: string;
  lifeStageImages?: LifeStageImage[];
}

function convertToKorean(name: string): string {
  if (!name || name.trim() === '') return '';
  
  const isKorean = /[가-힣]/.test(name);
  if (isKorean) return '';
  
  const phonemeMap: Record<string, string> = {
    'tion': '션', 'sion': '션', 'cian': '션', 'tian': '션',
    'ight': '아이트', 'ough': '오', 'ould': '울드', 'ound': '운드',
    'ther': '더', 'this': '디스', 'that': '댓',
    'chr': '크', 'sch': '스', 'tch': '치', 'dge': '지',
    'ph': '프', 'th': '스', 'ch': '치', 'sh': '쉬', 'wh': '와',
    'ck': '크', 'ng': '응', 'nk': '응크', 'qu': '쿼', 'wr': '르',
    'kn': '느', 'gn': '느', 'gh': '', 'mb': 'ㅁ', 'mn': 'ㅁ',
    'ee': '이', 'ea': '이', 'ie': '이', 'ey': '이', 'ay': '에이',
    'ai': '에이', 'oa': '오', 'oe': '오', 'oo': '우', 'ou': '아우',
    'ow': '오', 'ew': '유', 'ue': '유', 'au': '오', 'aw': '오',
    'oi': '오이', 'oy': '오이', 'ar': '아', 'er': '어', 'ir': '어',
    'or': '오', 'ur': '어', 'ce': '스', 'ci': '시', 'cy': '시',
    'ge': '지', 'gi': '지', 'gy': '지', 'sc': '스',
    'll': 'ㄹ', 'ss': '스', 'tt': 'ㅌ', 'ff': '프', 'pp': 'ㅍ',
    'bb': 'ㅂ', 'dd': 'ㄷ', 'gg': 'ㄱ', 'nn': 'ㄴ', 'mm': 'ㅁ', 'rr': 'ㄹ',
    'a': '아', 'e': '에', 'i': '이', 'o': '오', 'u': '우', 'y': '이',
    'b': '브', 'c': '크', 'd': '드', 'f': '프', 'g': '그', 'h': '흐',
    'j': '제이', 'k': '크', 'l': 'ㄹ', 'm': 'ㅁ', 'n': 'ㄴ', 'p': '프',
    'q': '크', 'r': '르', 's': '스', 't': '트', 'v': '브', 'w': '우',
    'x': '크스', 'z': '즈',
  };
  
  const syllableMap: Record<string, string> = {
    'la': '라', 'le': '레', 'li': '리', 'lo': '로', 'lu': '루', 'ly': '리',
    'ra': '라', 're': '레', 'ri': '리', 'ro': '로', 'ru': '루', 'ry': '리',
    'ma': '마', 'me': '메', 'mi': '미', 'mo': '모', 'mu': '무', 'my': '미',
    'na': '나', 'ne': '네', 'ni': '니', 'no': '노', 'nu': '누', 'ny': '니',
    'ba': '바', 'be': '베', 'bi': '비', 'bo': '보', 'bu': '부', 'by': '비',
    'pa': '파', 'pe': '페', 'pi': '피', 'po': '포', 'pu': '푸', 'py': '피',
    'da': '다', 'de': '데', 'di': '디', 'do': '도', 'du': '두', 'dy': '디',
    'ta': '타', 'te': '테', 'ti': '티', 'to': '토', 'tu': '투', 'ty': '티',
    'ga': '가', 'ge': '게', 'gi': '기', 'go': '고', 'gu': '구', 'gy': '지',
    'ka': '카', 'ke': '케', 'ki': '키', 'ko': '코', 'ku': '쿠', 'ky': '키',
    'sa': '사', 'se': '세', 'si': '시', 'so': '소', 'su': '수', 'sy': '시',
    'za': '자', 'ze': '제', 'zi': '지', 'zo': '조', 'zu': '주', 'zy': '지',
    'fa': '파', 'fe': '페', 'fi': '피', 'fo': '포', 'fu': '푸', 'fy': '피',
    'va': '바', 've': '베', 'vi': '비', 'vo': '보', 'vu': '부', 'vy': '비',
    'ha': '하', 'he': '헤', 'hi': '히', 'ho': '호', 'hu': '후', 'hy': '히',
    'ja': '자', 'je': '제', 'ji': '지', 'jo': '조', 'ju': '주', 'jy': '지',
    'wa': '와', 'we': '웨', 'wi': '위', 'wo': '워', 'wu': '우',
    'ya': '야', 'ye': '예', 'yi': '이', 'yo': '요', 'yu': '유',
    'ca': '카', 'co': '코', 'cu': '쿠',
    'cha': '차', 'che': '체', 'chi': '치', 'cho': '초', 'chu': '추',
    'sha': '샤', 'she': '쉬', 'shi': '시', 'sho': '쇼', 'shu': '슈',
    'tha': '타', 'the': '더', 'thi': '시', 'tho': '소', 'thu': '수',
    'tra': '트라', 'tre': '트레', 'tri': '트리', 'tro': '트로', 'tru': '트루',
    'pra': '프라', 'pre': '프레', 'pri': '프리', 'pro': '프로', 'pru': '프루',
    'bra': '브라', 'bre': '브레', 'bri': '브리', 'bro': '브로', 'bru': '브루',
    'cra': '크라', 'cre': '크레', 'cri': '크리', 'cro': '크로', 'cru': '크루',
    'gra': '그라', 'gre': '그레', 'gri': '그리', 'gro': '그로', 'gru': '그루',
    'dra': '드라', 'dre': '드레', 'dri': '드리', 'dro': '드로', 'dru': '드루',
    'fla': '플라', 'fle': '플레', 'fli': '플리', 'flo': '플로', 'flu': '플루',
    'cla': '클라', 'cle': '클레', 'cli': '클리', 'clo': '클로', 'clu': '클루',
    'sta': '스타', 'ste': '스테', 'sti': '스티', 'sto': '스토', 'stu': '스투',
    'sca': '스카', 'sce': '스케', 'sci': '사이', 'sco': '스코', 'scu': '스쿠',
    'lla': '야', 'lle': '예', 'lli': '이', 'llo': '요', 'llu': '유',
    'an': '안', 'en': '엔', 'in': '인', 'on': '온', 'un': '운',
    'al': '알', 'el': '엘', 'il': '일', 'ol': '올', 'ul': '울',
    'am': '암', 'em': '엠', 'im': '임', 'om': '옴', 'um': '움',
    'ar': '아', 'er': '어', 'ir': '어', 'or': '오', 'ur': '어',
    'as': '아스', 'es': '에스', 'is': '이스', 'os': '오스', 'us': '우스',
    'at': '앳', 'et': '엣', 'it': '잇', 'ot': '옷', 'ut': '웃',
    'ck': '크', 'sk': '스크', 'sp': '스프', 'st': '스트', 'str': '스트르',
  };
  
  let result = '';
  const lower = name.toLowerCase().trim();
  let i = 0;
  
  while (i < lower.length) {
    let matched = false;
    
    for (let len = 4; len >= 1; len--) {
      const substr = lower.substring(i, i + len);
      if (syllableMap[substr]) {
        result += syllableMap[substr];
        i += len;
        matched = true;
        break;
      }
      if (phonemeMap[substr]) {
        result += phonemeMap[substr];
        i += len;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      i++;
    }
  }
  
  result = result.replace(/ㄹㄹ/g, 'ㄹ').replace(/ㄴㄴ/g, 'ㄴ').replace(/ㅁㅁ/g, 'ㅁ');
  
  return result || '';
}

export default function NewspaperTemplate({ customerName, koreanName, photoData, headline, drinkName, drinkTemperature, lifeStageImages = [] }: NewspaperTemplateProps) {
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
            <div className="flex items-center justify-center gap-0">
              <span 
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                K-P
              </span>
              {/* Vinyl Record O */}
              <span className="inline-block relative mx-[-2px]" style={{ width: '32px', height: '32px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#000" />
                  <circle cx="16" cy="16" r="12" fill="none" stroke="#333" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="9" fill="none" stroke="#333" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="6" fill="none" stroke="#333" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="4" fill="#fff" />
                  <circle cx="16" cy="16" r="1.5" fill="#000" />
                </svg>
              </span>
              <span 
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                P
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
                B
              </span>
              {/* Vinyl Record O */}
              <span className="inline-block relative mx-[-2px]" style={{ width: '32px', height: '32px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#000" />
                  <circle cx="16" cy="16" r="12" fill="none" stroke="#333" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="9" fill="none" stroke="#333" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="6" fill="none" stroke="#333" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="4" fill="#fff" />
                  <circle cx="16" cy="16" r="1.5" fill="#000" />
                </svg>
              </span>
              <span 
                className="text-4xl font-black tracking-tight"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                ARD
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

      {/* AI Generated Life Stage Images Section - Childhood Album */}
      {lifeStageImages.length > 0 && lifeStageImages.some(img => img.imageData) && (
        <div className="mt-3 pt-3 border-t-4 border-black">
          <div className="text-center mb-3">
            <h2 className="text-lg font-black tracking-wider" style={{ fontFamily: "'Arial Black', sans-serif" }}>
              ★ CHILDHOOD ALBUM ★
            </h2>
            <p className="text-xs text-gray-600">음악과 함께한 어린 시절 성장 앨범</p>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {lifeStageImages
              .sort((a, b) => {
                const order = ["infancy", "kindergarten", "elementary", "middleschool"];
                return order.indexOf(a.lifeStage) - order.indexOf(b.lifeStage);
              })
              .map((img) => (
                <div key={img.lifeStage} className="border-4 border-white shadow-md" style={{ backgroundColor: "#f5f0e1" }}>
                  {img.imageData ? (
                    <div>
                      <img 
                        src={img.imageData} 
                        alt={img.stageNameKr}
                        className="w-full aspect-[3/4] object-cover"
                        style={{ 
                          filter: img.lifeStage === "infancy" ? "sepia(40%) contrast(0.95)" : 
                                  img.lifeStage === "kindergarten" ? "sepia(25%) saturate(0.9)" : 
                                  img.lifeStage === "elementary" ? "sepia(15%)" : "sepia(5%)"
                        }}
                      />
                      <div className="bg-amber-800 text-white p-1 text-center">
                        <p className="text-[9px] font-bold">{img.stageNameKr}</p>
                        <p className="text-[7px] opacity-80">{img.ageRange}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
                      <p className="text-[8px] text-gray-500 text-center p-1">{img.stageNameKr}<br/>생성 대기</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
          
          <div className="mt-2 text-center text-[9px] italic text-gray-600 border-t border-gray-300 pt-2">
            "음악을 사랑했던 어린 시절, 그 꿈이 오늘 이루어지다" - {displayName}님의 성장 앨범
          </div>
        </div>
      )}

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

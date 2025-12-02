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
  const futureDate = new Date(today.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
  const futureDateKr = futureDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const futureDateEn = futureDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const volumeNumber = Math.floor((futureDate.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  const sortedImages = lifeStageImages
    .filter(img => img.imageData)
    .sort((a, b) => {
      const order = ["infancy", "middleschool", "future"];
      return order.indexOf(a.lifeStage) - order.indexOf(b.lifeStage);
    });

  const infancyImage = sortedImages.find(img => img.lifeStage === "infancy");
  const middleschoolImage = sortedImages.find(img => img.lifeStage === "middleschool");
  const futureImage = sortedImages.find(img => img.lifeStage === "future");

  return (
    <div 
      className="bg-white p-2 w-full text-black print-container"
      style={{ 
        fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
      }}
    >
      {/* K-POP BOARD Masthead */}
      <div className="border-b-4 border-black pb-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white font-black text-sm">RC</span>
            </div>
            <span className="text-[9px] leading-tight text-black font-medium">
              SINCE<br/>2024
            </span>
          </div>
          
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-0">
              <span className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                K-P
              </span>
              <span className="inline-block relative mx-[-2px]" style={{ width: '26px', height: '26px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#000" />
                  <circle cx="16" cy="16" r="4" fill="#fff" />
                  <circle cx="16" cy="16" r="1.5" fill="#000" />
                </svg>
              </span>
              <span className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>P</span>
              <span className="mx-1 text-gray-400 text-2xl font-light">|</span>
              <span className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>B</span>
              <span className="inline-block relative mx-[-2px]" style={{ width: '26px', height: '26px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#000" />
                  <circle cx="16" cy="16" r="4" fill="#fff" />
                  <circle cx="16" cy="16" r="1.5" fill="#000" />
                </svg>
              </span>
              <span className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>ARD</span>
            </div>
            <div className="text-xs tracking-[0.2em] text-black font-bold -mt-1" style={{ fontFamily: "'Arial', sans-serif" }}>
              SEOUL MUSIC TODAY
            </div>
          </div>

          <div className="text-right text-[9px] text-black leading-tight">
            <div className="border-2 border-black p-1">
              <div className="font-black text-xs">QR</div>
              <div className="font-bold text-[8px]">SCAN</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[9px] text-black mt-1 border-t-2 border-black pt-1 font-medium">
          <span>{futureDateKr} ({futureDateEn})</span>
          <span>No. {volumeNumber} (특별호)</span>
          <span className="font-bold">가격: 당신의 열정</span>
        </div>
      </div>

      {/* Main Headline - Future Tense */}
      <div className="mb-2 border-b-2 border-black pb-1">
        <h1 className="text-xl font-black leading-tight text-center" style={{ fontFamily: "'Arial Black', 'Nanum Gothic', sans-serif" }}>
          {headline || <>"한복이 가장 잘 어울리는 스타" {displayName}, 10년 전 녹음 사진 발굴!</>}
        </h1>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-5 gap-2 text-[10px] leading-snug">
        {/* Left Column: Main Photo + Article (3 cols) */}
        <div className="col-span-3">
          {/* Main Photo - 10 Years Ago Recording */}
          <div className="border-2 border-black">
            <img 
              src={photoData} 
              alt={customerName}
              className="w-full object-contain bg-gray-100"
              style={{ 
                filter: "grayscale(100%) contrast(1.2)",
                maxHeight: "180px"
              }}
            />
          </div>
          <p className="text-[9px] text-center mt-1 border-b border-black pb-1 font-medium">
            ▲ 10년 전 우연히 'Recording Cafe'를 방문해 첫 녹음에 도전하던 <span className="font-bold">{displayName}</span>. 
            이 사진이 최근 스튜디오 자료실에서 발굴되어 화제다. / 사진 = SMT 자료실
          </p>
          
          {/* Article */}
          <div className="mt-1 columns-2 gap-2 text-justify text-[9px] leading-tight" style={{ columnRule: "1px solid #333" }}>
            <p className="mb-1">
              <span className="font-bold">[서울=SMT뉴스]</span> 최근 '한복이 가장 잘 어울리는 스타'로 선정되어 화제를 모으고 있는 {displayName}의 과거 녹음 사진이 발굴되어 팬들의 뜨거운 관심을 받고 있다.
            </p>
            <p className="mb-1">
              10년 전, 당시 무명이었던 {displayName}은 서울 서초구의 'Recording Cafe'를 우연히 방문해 생애 첫 녹음을 경험했다. 당시 엔지니어 A씨는 "처음부터 남다른 재능이 느껴졌다"며 회상했다.
            </p>
            <p>
              이후 음악의 꿈을 키워온 {displayName}은 현재 대한민국을 대표하는 아티스트로 성장, 최근 열린 '2035 한복문화대상'에서 영예의 대상을 수상했다.
            </p>
          </div>

          {/* Childhood Album Section - Integrated */}
          {(infancyImage || middleschoolImage) && (
            <div className="mt-2 pt-1 border-t border-black">
              <div className="grid grid-cols-2 gap-2">
                {infancyImage?.imageData && (
                  <div>
                    <div className="border border-black">
                      <img 
                        src={infancyImage.imageData} 
                        alt="유아 시절"
                        className="w-full object-contain bg-amber-50"
                        style={{ filter: "sepia(30%)", maxHeight: "100px" }}
                      />
                    </div>
                    <p className="text-[8px] mt-0.5 text-justify leading-tight">
                      ▲ 가족이 공개한 어린 시절 사진. 이미 어린 나이에 음악적 재능을 보였다고 한다. "아기 때부터 음악만 틀어주면 웃었다"는 부모님의 증언.
                    </p>
                  </div>
                )}
                {middleschoolImage?.imageData && (
                  <div>
                    <div className="border border-black">
                      <img 
                        src={middleschoolImage.imageData} 
                        alt="중학교 시절"
                        className="w-full object-contain bg-gray-50"
                        style={{ filter: "sepia(10%)", maxHeight: "100px" }}
                      />
                    </div>
                    <p className="text-[8px] mt-0.5 text-justify leading-tight">
                      ▲ 중학교 시절 밴드부에서 활동하던 모습. 당시 담임 교사는 "음악 시간마다 눈이 빛났다"며 숨겨진 재능을 일찍이 알아봤다고 전했다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar + Future Image (2 cols) */}
        <div className="col-span-2 border-l border-black pl-2">
          {/* Current Award Photo - Future Star in Hanbok */}
          {futureImage?.imageData && (
            <div className="mb-2">
              <div className="bg-black text-white p-1 mb-1">
                <div className="text-[9px] font-black text-center tracking-wider">
                  ★ 2035 한복문화대상 ★
                </div>
              </div>
              <div className="border-2 border-black">
                <img 
                  src={futureImage.imageData} 
                  alt="한복 시상식"
                  className="w-full object-contain bg-purple-50"
                  style={{ maxHeight: "130px" }}
                />
              </div>
              <p className="text-[8px] mt-0.5 text-justify leading-tight">
                ▲ 지난달 열린 '2035 한복문화대상'에서 대상을 수상한 {displayName}이 관객들에게 손을 흔들고 있다. 
                전통 한복의 아름다움을 전 세계에 알린 공로를 인정받았다.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="border border-black p-1 mb-1">
            <div className="text-[9px] font-black border-b border-black pb-0.5 mb-1">PROFILE</div>
            <div className="space-y-0.5 text-[8px]">
              <div className="flex justify-between">
                <span>Artist</span>
                <span className="font-bold">{displayName}</span>
              </div>
              <div className="flex justify-between">
                <span>데뷔</span>
                <span>{today.getFullYear()}년</span>
              </div>
              <div className="flex justify-between">
                <span>수상</span>
                <span className="font-bold">한복문화대상</span>
              </div>
            </div>
          </div>

          {/* Quote Box */}
          <div className="border border-black p-1 mb-1 bg-gray-50">
            <p className="text-[8px] italic text-center leading-tight">
              "10년 전 그 작은 카페에서 시작된 꿈이 오늘 이렇게 이루어졌습니다"
            </p>
            <p className="text-[7px] text-right mt-0.5">- {displayName} 수상 소감 중</p>
          </div>

          {/* Weather/Fortune - Compact */}
          <div className="border border-black p-1 mb-1">
            <div className="text-[8px] font-bold">[오늘의 날씨]</div>
            <div className="text-[8px]">맑음 ☀️ 축하하기 좋은 날</div>
          </div>

          {/* Drink Section */}
          <div className="border border-black p-1 bg-gray-50">
            <div className="text-[8px] font-black text-center">[10년 전 그날의 음료]</div>
            <div className="text-[9px] font-bold text-center mt-0.5">
              ☕ {drinkTemperature === "iced" ? "Iced " : drinkTemperature === "hot" ? "Hot " : ""}{drinkName || "아메리카노"}
            </div>
            <div className="text-[7px] text-gray-600 italic text-center">
              "성공의 첫 걸음은 이 한 잔과 함께"
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner - Compact */}
      <div className="mt-2 pt-1 border-t-2 border-black">
        <div className="flex items-center justify-between p-1 bg-gray-50 border border-black">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white font-black text-[9px]">RC</span>
            </div>
            <div>
              <p className="text-[9px] font-black">Recording Cafe</p>
              <p className="text-[7px] text-gray-700">서울 서초구 강남대로 107길 21. 2층</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-[8px]">@recordingcafe 팔로우하면 1타임 무료!</p>
            <p className="font-bold text-[8px]">#RecordingCafe #꿈의시작</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-1 pt-1 border-t border-black flex justify-between items-center text-[8px] font-medium">
        <span>www.recordingcafe.com</span>
        <span>© {futureDate.getFullYear()} Recording Cafe</span>
        <span>@recordingcafe</span>
      </div>
    </div>
  );
}

interface NewspaperTemplateProps {
  customerName: string;
  koreanName?: string;
  photoData: string;
  headline?: string;
  drinkName?: string;
  drinkTemperature?: string;
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

export default function NewspaperTemplate({ customerName, koreanName, photoData, headline, drinkName, drinkTemperature }: NewspaperTemplateProps) {
  const autoKoreanName = koreanName || convertToKorean(customerName);
  const displayName = autoKoreanName ? `${customerName} (${autoKoreanName})` : customerName;
  const today = new Date();
  const dateKr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const volumeNumber = Math.floor((today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-white p-4 w-full text-black"
      style={{ 
        fontFamily: "'Nanum Myeongjo', 'Batang', serif",
      }}
    >
      {/* 케이팝 늬우스 Masthead - Retro Style */}
      <div className="border-b-[6px] border-double border-black pb-2 mb-3">
        {/* Top decorative line */}
        <div className="border-b-2 border-black mb-2 pb-1">
          <div className="flex justify-between items-center text-[10px]">
            <span>제 {volumeNumber} 호</span>
            <span>◆ 서울特別市 瑞草區 ◆</span>
            <span>價格 無料</span>
          </div>
        </div>
        
        {/* Main Title */}
        <div className="text-center py-2">
          <h1 
            className="text-5xl font-black tracking-[0.2em] mb-1"
            style={{ 
              fontFamily: "'Nanum Myeongjo', serif",
              textShadow: "2px 2px 0px #ccc"
            }}
          >
            케이팝 늬우스
          </h1>
          <div className="text-xs tracking-[0.5em] text-gray-700">
            K-POP NEWS
          </div>
        </div>
        
        {/* Date and Info Bar */}
        <div className="border-t-2 border-black pt-1 mt-2">
          <div className="flex justify-between items-center text-xs">
            <span>西紀 {today.getFullYear()}年 {today.getMonth() + 1}月 {today.getDate()}日</span>
            <span className="font-bold">【 號 外 】</span>
            <span>{dateKr} 發行</span>
          </div>
        </div>
      </div>

      {/* Main Headline - Retro Style */}
      <div className="mb-3 border-2 border-black p-2 bg-gray-100">
        <div className="text-center text-xs mb-1 tracking-widest">◆ 緊 急 速 報 ◆</div>
        <h2 
          className="text-2xl font-black leading-tight text-center tracking-wide"
          style={{ fontFamily: "'Nanum Myeongjo', serif" }}
        >
          {headline || <>{displayName} 氏 來韓 錄音 現場!</>}
        </h2>
        <div className="text-center text-xs mt-1 tracking-widest">― 歌謠界 發 칵 뒤집어 ―</div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-5 gap-3 text-sm">
        {/* Left Column: Photo + Article */}
        <div className="col-span-3">
          <div className="border-4 border-double border-black p-1">
            <img 
              src={photoData} 
              alt={customerName}
              className="w-full aspect-[4/3] object-cover"
              style={{ 
                filter: "grayscale(100%) contrast(1.2) sepia(20%)",
              }}
            />
          </div>
          <p className="text-[10px] text-center mt-1 border-b border-black pb-1">
            ▲ 本紙 特派員이 捕捉한 {displayName} 氏의 錄音 現場. 關係者는 "마이크를 잡는 瞬間 눈빛이 變했다"고 傳했다.
          </p>
          
          {/* Article */}
          <div className="mt-2 text-justify text-xs leading-relaxed border-l-2 border-black pl-2">
            <p className="mb-2 indent-4">
              <span className="font-bold">【서울=本社】</span> 大韓民國 歌謠界가 緊張하고 있다. 今日 午後, 서울 瑞草區에 位置한 'Recording Cafe'에서 믿을 수 없는 일이 벌어졌다.
            </p>
            <p className="mb-2 indent-4">
              偶然히 스튜디오를 訪問한 한 顧客이 프로 歌手 뺨치는 엄청난 實力을 선보였기 때문이다. 現場에 있던 엔지니어 A氏는 "數많은 사람을 錄音해봤지만, 이런 才能은 처음"이라며 興奮을 감추지 못했다.
            </p>
            <p className="indent-4">
              이 正體不明의 '豫備 스타'는 錄音 내내 完璧한 感情 處理와 爆發的인 高音으로 스튜디오를 掌握했다는 後聞이다.
            </p>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="col-span-2 border-l-2 border-black pl-2">
          {/* Breaking News Box */}
          <div className="border-2 border-black mb-2">
            <div className="bg-black text-white text-center text-xs py-1 font-bold tracking-wider">
              ◆ 本 日 의 主 人 公 ◆
            </div>
            <div className="p-2 text-xs space-y-1">
              <div className="flex justify-between border-b border-dashed border-gray-400 pb-1">
                <span>姓 名</span>
                <span className="font-bold">{displayName}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-400 pb-1">
                <span>日 字</span>
                <span>{today.getMonth() + 1}月 {today.getDate()}日</span>
              </div>
              <div className="flex justify-between">
                <span>場 所</span>
                <span>新沙 스튜디오</span>
              </div>
            </div>
          </div>

          {/* Drink Section */}
          <div className="border-2 border-black mb-2">
            <div className="bg-black text-white text-center text-xs py-1">
              ◆ 스타의 飮料 ◆
            </div>
            <div className="p-2 text-center">
              <div className="text-xs mb-1">{displayName} 氏가</div>
              <div className="text-xs mb-1">注文한 것으로 알려진</div>
              <div className="text-lg font-black border-t border-black pt-1 mt-1">
                ☕ {drinkTemperature === "iced" ? "冷 " : drinkTemperature === "hot" ? "溫 " : ""}{drinkName || "아메리카노"}
              </div>
              <div className="text-[9px] text-gray-600 italic mt-1">
                "成功한 아티스트의 始作은 커피와 함께"
              </div>
            </div>
          </div>

          {/* Fortune Box */}
          <div className="border-2 border-black mb-2 p-2">
            <div className="text-xs font-bold text-center border-b border-black pb-1 mb-1">【今日의 運勢】</div>
            <div className="text-xs text-center">
              마이크를 잡으면<br/>
              <span className="font-bold text-sm">大 吉</span>
            </div>
          </div>

          {/* Weather */}
          <div className="border-2 border-black p-2">
            <div className="text-xs font-bold text-center border-b border-black pb-1 mb-1">【天 氣】</div>
            <div className="text-xs text-center">
              맑음 ☀<br/>
              <span className="text-[10px]">노래하기 딱 좋은 날씨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner - Retro Style */}
      <div className="mt-3 pt-2 border-t-4 border-double border-black">
        <div className="border-2 border-black p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="border-2 border-black w-12 h-12 flex items-center justify-center">
                <span className="font-black text-sm">RC</span>
              </div>
              <div>
                <p className="text-sm font-black">Recording Cafe</p>
                <p className="text-[10px]">서울 瑞草區 江南大路 107길 21. 2층</p>
              </div>
            </div>
            <div className="text-right text-[10px]">
              <p className="font-bold">인스타그램에 認證샷 게시 및</p>
              <p className="font-bold">@recordingcafe 팔로우時 1타임 無料!</p>
              <p className="mt-1">#SeoulHotspot #RecordingCafe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-1 border-t border-black flex justify-between items-center text-[10px]">
        <span>發行處: Recording Cafe</span>
        <span>© 西紀 {today.getFullYear()}年</span>
        <span>@recordingcafe</span>
      </div>
    </div>
  );
}

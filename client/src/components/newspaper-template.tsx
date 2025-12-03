import { useState, useRef, useCallback } from "react";

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

export interface ImagePosition {
  x: number;
  y: number;
  scale?: number;
}

export interface ImagePositions {
  main: ImagePosition;
  infancy: ImagePosition;
  middleschool: ImagePosition;
  future: ImagePosition;
}

interface NewspaperTemplateProps {
  customerName: string;
  koreanName?: string;
  photoData: string;
  headline?: string;
  drinkName?: string;
  drinkTemperature?: string;
  lifeStageImages?: LifeStageImage[];
  imagePositions?: ImagePositions;
  onPositionChange?: (positions: ImagePositions) => void;
  customerId?: number;
}

function convertToKorean(name: string): string {
  if (!name || name.trim() === '') return '';
  
  const isKorean = /[가-힣]/.test(name);
  if (isKorean) return '';
  
  const commonNames: Record<string, string> = {
    'patrick': '패트릭', 'patrix': '패트릭스', 'patricia': '패트리샤',
    'michael': '마이클', 'mike': '마이크', 'michelle': '미셸',
    'david': '데이비드', 'daniel': '다니엘', 'james': '제임스',
    'john': '존', 'johnny': '조니', 'jonathan': '조나단',
    'robert': '로버트', 'bob': '밥', 'bobby': '바비',
    'william': '윌리엄', 'will': '윌', 'bill': '빌', 'billy': '빌리',
    'richard': '리처드', 'rick': '릭', 'ricky': '리키', 'dick': '딕',
    'joseph': '조셉', 'joe': '조', 'joey': '조이',
    'thomas': '토마스', 'tom': '톰', 'tommy': '토미',
    'christopher': '크리스토퍼', 'chris': '크리스',
    'charles': '찰스', 'charlie': '찰리',
    'matthew': '매튜', 'matt': '맷',
    'anthony': '앤서니', 'tony': '토니',
    'andrew': '앤드류', 'andy': '앤디',
    'steven': '스티븐', 'steve': '스티브',
    'kevin': '케빈', 'brian': '브라이언', 'ryan': '라이언',
    'jason': '제이슨', 'justin': '저스틴', 'brandon': '브랜던',
    'benjamin': '벤자민', 'ben': '벤', 'samuel': '사무엘', 'sam': '샘',
    'alexander': '알렉산더', 'alex': '알렉스',
    'nicholas': '니콜라스', 'nick': '닉',
    'elizabeth': '엘리자베스', 'beth': '베스', 'lisa': '리사',
    'jennifer': '제니퍼', 'jenny': '제니', 'jessica': '제시카',
    'sarah': '사라', 'sara': '사라', 'emily': '에밀리', 'emma': '엠마',
    'ashley': '애슐리', 'amanda': '아만다', 'nicole': '니콜',
    'stephanie': '스테파니', 'lauren': '로렌', 'megan': '메건',
    'rachel': '레이첼', 'hannah': '한나', 'olivia': '올리비아',
    'sophia': '소피아', 'grace': '그레이스', 'victoria': '빅토리아',
    'jacob': '제이콥', 'jack': '잭', 'jackson': '잭슨',
    'ethan': '이든', 'noah': '노아', 'mason': '메이슨', 'lucas': '루카스',
    'oliver': '올리버', 'henry': '헨리', 'max': '맥스', 'leo': '레오',
  };
  
  const lowerName = name.toLowerCase().trim();
  if (commonNames[lowerName]) {
    return commonNames[lowerName];
  }
  
  const nameParts = lowerName.split(/[\s\-]+/);
  if (nameParts.length > 1) {
    const convertedParts = nameParts.map(part => commonNames[part] || convertSingleName(part));
    return convertedParts.join(' ');
  }
  
  return convertSingleName(lowerName);
}

function convertSingleName(name: string): string {
  const syllablePatterns: [RegExp, string][] = [
    [/^patri/i, '패트리'], [/^patric/i, '패트릭'], [/^patr/i, '패트르'],
    [/^pat/i, '패트'], [/^pet/i, '펫'], [/^pit/i, '핏'],
    [/rick$/i, '릭'], [/rix$/i, '릭스'], [/ric$/i, '릭'],
    [/tion$/i, '션'], [/sion$/i, '션'], [/cian$/i, '션'],
    [/ick$/i, '익'], [/ack$/i, '액'], [/eck$/i, '엑'],
    [/ine$/i, '인'], [/ene$/i, '엔'], [/ane$/i, '에인'],
    [/son$/i, '슨'], [/sen$/i, '센'], [/man$/i, '만'], [/men$/i, '맨'],
    [/ly$/i, '리'], [/ley$/i, '리'], [/lee$/i, '리'],
    [/er$/i, '어'], [/or$/i, '어'], [/ar$/i, '아'],
    [/ia$/i, '아'], [/ie$/i, '이'], [/y$/i, '이'],
  ];

  const consonantClusters: Record<string, string> = {
    'chr': '크르', 'sch': '슈', 'tch': '치', 'dge': '지',
    'str': '스트르', 'spr': '스프르', 'scr': '스크르',
    'thr': '스르', 'phr': '프르', 'shr': '쉬르',
    'bl': '블', 'br': '브르', 'cl': '클', 'cr': '크르',
    'dr': '드르', 'fl': '플', 'fr': '프르', 'gl': '글',
    'gr': '그르', 'pl': '플', 'pr': '프르', 'sl': '슬',
    'sm': '스므', 'sn': '스느', 'sp': '스프', 'st': '스트',
    'sw': '스웨', 'tr': '트르', 'tw': '트웨', 'wr': '르',
    'ph': '프', 'th': '스', 'ch': '치', 'sh': '쉬', 'wh': '와',
    'ck': '크', 'ng': '응', 'nk': '응크', 'qu': '쿠',
    'kn': '느', 'gn': '느', 'gh': '', 'mb': '므', 'mn': '므느',
  };

  const vowelPatterns: Record<string, string> = {
    'ough': '오', 'augh': '오', 'ould': '울드', 'ound': '운드',
    'ight': '아이트', 'eigh': '에이',
    'tion': '션', 'sion': '션', 'cian': '션',
    'ee': '이', 'ea': '이', 'ie': '이', 'ei': '아이',
    'oo': '우', 'ou': '아우', 'ow': '오', 'oi': '오이', 'oy': '오이',
    'au': '오', 'aw': '오', 'ew': '유', 'ue': '유',
    'ai': '에이', 'ay': '에이', 'ey': '이',
    'oa': '오', 'oe': '오',
  };

  const basicMap: Record<string, string> = {
    'a': '아', 'e': '에', 'i': '이', 'o': '오', 'u': '우',
    'b': '브', 'c': '크', 'd': '드', 'f': '프', 'g': '그',
    'h': '흐', 'j': '즈', 'k': '크', 'l': '을', 'm': '므',
    'n': '느', 'p': '프', 'q': '크', 'r': '르', 's': '스',
    't': '트', 'v': '브', 'w': '우', 'x': '크스', 'y': '이', 'z': '즈',
  };

  const syllableMap: Record<string, string> = {
    'la': '라', 'le': '레', 'li': '리', 'lo': '로', 'lu': '루',
    'ra': '라', 're': '레', 'ri': '리', 'ro': '로', 'ru': '루',
    'ma': '마', 'me': '메', 'mi': '미', 'mo': '모', 'mu': '무',
    'na': '나', 'ne': '네', 'ni': '니', 'no': '노', 'nu': '누',
    'ba': '바', 'be': '베', 'bi': '비', 'bo': '보', 'bu': '부',
    'pa': '파', 'pe': '페', 'pi': '피', 'po': '포', 'pu': '푸',
    'da': '다', 'de': '데', 'di': '디', 'do': '도', 'du': '두',
    'ta': '타', 'te': '테', 'ti': '티', 'to': '토', 'tu': '투',
    'ga': '가', 'ge': '게', 'gi': '기', 'go': '고', 'gu': '구',
    'ka': '카', 'ke': '케', 'ki': '키', 'ko': '코', 'ku': '쿠',
    'sa': '사', 'se': '세', 'si': '시', 'so': '소', 'su': '수',
    'za': '자', 'ze': '제', 'zi': '지', 'zo': '조', 'zu': '주',
    'fa': '파', 'fe': '페', 'fi': '피', 'fo': '포', 'fu': '푸',
    'va': '바', 've': '베', 'vi': '비', 'vo': '보', 'vu': '부',
    'ha': '하', 'he': '헤', 'hi': '히', 'ho': '호', 'hu': '후',
    'ja': '자', 'je': '제', 'ji': '지', 'jo': '조', 'ju': '주',
    'wa': '와', 'we': '웨', 'wi': '위', 'wo': '워',
    'ya': '야', 'ye': '예', 'yo': '요', 'yu': '유',
    'ca': '카', 'ce': '세', 'ci': '시', 'co': '코', 'cu': '쿠',
    'cha': '차', 'che': '체', 'chi': '치', 'cho': '초', 'chu': '추',
    'sha': '샤', 'she': '셰', 'shi': '시', 'sho': '쇼', 'shu': '슈',
    'tha': '타', 'the': '더', 'thi': '시', 'tho': '소', 'thu': '수',
    'an': '안', 'en': '엔', 'in': '인', 'on': '온', 'un': '운',
    'al': '알', 'el': '엘', 'il': '일', 'ol': '올', 'ul': '울',
  };

  let result = '';
  let remaining = name.toLowerCase();

  for (const [pattern, replacement] of syllablePatterns) {
    if (pattern.test(remaining)) {
      const match = remaining.match(pattern);
      if (match) {
        if (pattern.source.startsWith('^')) {
          result += replacement;
          remaining = remaining.slice(match[0].length);
        } else if (pattern.source.endsWith('$')) {
          const beforeMatch = remaining.slice(0, remaining.length - match[0].length);
          remaining = beforeMatch;
          result = processRemaining(remaining, consonantClusters, vowelPatterns, syllableMap, basicMap) + replacement;
          return cleanupResult(result);
        }
      }
    }
  }

  result += processRemaining(remaining, consonantClusters, vowelPatterns, syllableMap, basicMap);
  return cleanupResult(result);
}

function processRemaining(
  text: string,
  consonantClusters: Record<string, string>,
  vowelPatterns: Record<string, string>,
  syllableMap: Record<string, string>,
  basicMap: Record<string, string>
): string {
  let result = '';
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (let len = 4; len >= 2; len--) {
      const substr = text.substring(i, i + len);
      if (vowelPatterns[substr]) {
        result += vowelPatterns[substr];
        i += len;
        matched = true;
        break;
      }
      if (consonantClusters[substr]) {
        result += consonantClusters[substr];
        i += len;
        matched = true;
        break;
      }
      if (syllableMap[substr]) {
        result += syllableMap[substr];
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const char = text[i];
      if (basicMap[char]) {
        result += basicMap[char];
      }
      i++;
    }
  }

  return result;
}

function cleanupResult(result: string): string {
  return result
    .replace(/으으+/g, '으')
    .replace(/스스+/g, '스')
    .replace(/르르+/g, '르')
    .replace(/느느+/g, '느')
    .replace(/므므+/g, '므');
}

const defaultPositions: ImagePositions = {
  main: { x: 50, y: 0, scale: 1 },
  infancy: { x: 50, y: 0, scale: 1 },
  middleschool: { x: 50, y: 0, scale: 1 },
  future: { x: 50, y: 50, scale: 1 },
};

export default function NewspaperTemplate({ customerName, koreanName, photoData, headline, drinkName, drinkTemperature, lifeStageImages = [], imagePositions: externalPositions, onPositionChange, customerId }: NewspaperTemplateProps) {
  const autoKoreanName = koreanName || convertToKorean(customerName);
  const displayName = autoKoreanName ? `${autoKoreanName} (${customerName})` : customerName;
  
  const today = new Date();
  const futureYear = today.getFullYear() + 10;
  const futureDateKr = `${futureYear}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const futureDateEn = `${weekdays[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}, ${futureYear}`;
  const volumeNumber = Math.floor((new Date(futureYear, today.getMonth(), today.getDate()).getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24));

  const sortedImages = lifeStageImages
    .filter(img => img.imageData)
    .sort((a, b) => {
      const order = ["infancy", "middleschool", "future"];
      return order.indexOf(a.lifeStage) - order.indexOf(b.lifeStage);
    });

  const infancyImage = sortedImages.find(img => img.lifeStage === "infancy");
  const middleschoolImage = sortedImages.find(img => img.lifeStage === "middleschool");
  const futureImage = sortedImages.find(img => img.lifeStage === "future");

  const imagePositions = externalPositions || defaultPositions;

  const [dragging, setDragging] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const handleMouseDown = useCallback((imageKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(imageKey);
    const pos = imagePositions[imageKey as keyof ImagePositions] || { x: 50, y: 50 };
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
  }, [imagePositions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStartRef.current || !onPositionChange) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    const newX = Math.max(0, Math.min(100, dragStartRef.current.posX - deltaX * 0.3));
    const newY = Math.max(0, Math.min(100, dragStartRef.current.posY - deltaY * 0.3));
    
    onPositionChange({
      ...imagePositions,
      [dragging]: { x: newX, y: newY }
    });
  }, [dragging, imagePositions, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    dragStartRef.current = null;
  }, []);

  const handleWheel = useCallback((imageKey: string, e: React.WheelEvent) => {
    if (!onPositionChange) return;
    e.preventDefault();
    
    const currentScale = imagePositions[imageKey as keyof ImagePositions]?.scale || 1;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, currentScale + delta));
    
    onPositionChange({
      ...imagePositions,
      [imageKey]: { ...imagePositions[imageKey as keyof ImagePositions], scale: newScale }
    });
  }, [imagePositions, onPositionChange]);

  return (
    <div 
      className="bg-white w-full text-black print-container flex flex-col"
      style={{ 
        fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
        minHeight: "100vh",
        padding: "16px",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* K-POP BOARD Masthead */}
      <div className="border-b-4 border-black pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-black print-bg-black flex items-center justify-center">
              <span className="text-white print-text-white font-black text-xl">RC</span>
            </div>
            <span className="text-xs leading-tight text-black font-medium">
              SINCE<br/>2024
            </span>
          </div>
          
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-0">
              <span className="text-6xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                K-P
              </span>
              <span className="inline-block relative mx-[-4px]" style={{ width: '48px', height: '48px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#000" />
                  <circle cx="16" cy="16" r="4" fill="#fff" />
                  <circle cx="16" cy="16" r="1.5" fill="#000" />
                </svg>
              </span>
              <span className="text-6xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>P</span>
              <span className="mx-2 text-gray-400 text-5xl font-light">|</span>
              <span className="text-6xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>B</span>
              <span className="inline-block relative mx-[-4px]" style={{ width: '48px', height: '48px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#000" />
                  <circle cx="16" cy="16" r="4" fill="#fff" />
                  <circle cx="16" cy="16" r="1.5" fill="#000" />
                </svg>
              </span>
              <span className="text-6xl font-black tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>ARD</span>
            </div>
            <div className="text-base tracking-[0.4em] text-black font-bold -mt-1" style={{ fontFamily: "'Arial', sans-serif" }}>
              SEOUL MUSIC TODAY
            </div>
          </div>

          <div className="text-right">
            <img 
              src="/assets/레코딩카페-한글로고_1764752093894.png" 
              alt="Recording Cafe" 
              className="h-14 object-contain"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-black mt-3 border-t-2 border-black pt-2 font-medium">
          <span>{futureDateKr} ({futureDateEn})</span>
          <span>No. {customerId || 1} (특별호)</span>
          <span className="font-bold">가격 : 0.00011 BTC</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-4 border-b-2 border-black pb-3">
        <h1 className="text-3xl font-black leading-tight text-center" style={{ fontFamily: "'Arial Black', 'Nanum Gothic', sans-serif" }}>
          {headline || <>{displayName}, 10년 전 녹음 사진 발굴!</>}
        </h1>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-5 gap-5 text-xs leading-relaxed flex-1">
        {/* Left Column: Main Photo + Article (3 cols) */}
        <div className="col-span-3 flex flex-col">
          {/* Main Photo */}
          <div 
            className="border-2 border-black overflow-hidden relative cursor-move print:cursor-default" 
            style={{ height: "320px" }}
            onMouseDown={(e) => handleMouseDown("main", e)}
            title="드래그하여 사진 위치 조정"
          >
            <img 
              src={photoData} 
              alt={customerName}
              className="w-full h-full object-cover select-none"
              style={{ 
                filter: "grayscale(100%) contrast(1.2)",
                objectPosition: `${imagePositions.main.x}% ${imagePositions.main.y}%`,
              }}
              draggable={false}
            />
            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded print:hidden">
              ↔ 드래그
            </div>
          </div>
          <p className="text-[11px] text-center mt-2 border-b border-black pb-2 font-medium">
            ▲ 10년 전 우연히 '레코딩카페'를 방문해 첫 녹음에 도전하던 <span className="font-bold">{displayName}</span>. 
            이 사진이 최근 미러클부스 자료실에서 발굴되어 화제다. / 사진 = RCT 자료실
          </p>
          
          {/* Article - Expanded */}
          <div className="mt-3 columns-2 gap-5 text-xs leading-relaxed" style={{ columnRule: "1px solid #333" }}>
            <p className="mb-3">
              <span className="font-bold text-sm">[서울=SMT뉴스]</span> 최근 '한복이 가장 잘 어울리는 스타'로 선정되어 화제를 모으고 있는 {displayName}의 과거 녹음 사진이 발굴되어 팬들의 뜨거운 관심을 받고 있다.
            </p>
            <p className="mb-3">
              10년 전, 당시 무명이었던 {displayName}은 서울 서초구의 '레코딩카페'를 우연히 방문해 생애 첫 녹음을 경험했다. 당시 엔지니어 A씨는 "처음부터 남다른 재능이 느껴졌다"며 당시를 회상했다.
            </p>
            <p className="mb-3">
              레코딩카페 관계자는 "당시 녹음실에 들어오자마자 마이크 앞에서 자연스럽게 노래를 부르기 시작했다"며 "목소리에서 특별한 감성이 느껴졌다"고 전했다.
            </p>
            <p className="mb-3">
              이후 음악의 꿈을 키워온 {displayName}은 현재 대한민국을 대표하는 아티스트로 성장, 최근 열린 '{futureYear} 한복문화대상'에서 영예의 대상을 수상했다.
            </p>
            <p className="mb-3">
              수상 직후 인터뷰에서 {displayName}은 "10년 전 그 작은 카페에서 첫 녹음을 했던 순간이 제 인생의 터닝포인트였다"며 감격의 눈물을 흘렸다.
            </p>
            <p>
              한편, 레코딩카페는 이번 사진 발굴을 계기로 스튜디오 역사관 조성을 검토 중인 것으로 알려졌다.
            </p>
          </div>

          {/* Childhood Album Section */}
          {(infancyImage || middleschoolImage) && (
            <div className="mt-5 pt-4 border-t-2 border-black">
              <div className="grid grid-cols-2 gap-5">
                {infancyImage?.imageData && (
                  <div>
                    <div 
                      className="border-2 border-black overflow-hidden relative cursor-move print:cursor-default" 
                      style={{ height: "180px" }}
                      onMouseDown={(e) => handleMouseDown("infancy", e)}
                      title="드래그하여 사진 위치 조정"
                    >
                      <img 
                        src={infancyImage.imageData} 
                        alt="유아 시절"
                        className="w-full h-full object-cover select-none"
                        style={{ 
                          filter: "sepia(30%)",
                          objectPosition: `${imagePositions.infancy.x}% ${imagePositions.infancy.y}%`,
                        }}
                        draggable={false}
                      />
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded print:hidden">
                        ↔ 드래그
                      </div>
                    </div>
                    <p className="text-[11px] mt-2 leading-snug">
                      ▲ 가족이 공개해야 맞는 어린 시절 사진. 팬들의 열화와 같은 요청에 AI로 복원. 떡잎부터 알아본다는 한국 속담처럼 아기 때부터 음악을 가까이한 것이 틀림없다.
                    </p>
                  </div>
                )}
                {middleschoolImage?.imageData && (
                  <div>
                    <div 
                      className="border-2 border-black overflow-hidden relative cursor-move print:cursor-default" 
                      style={{ height: "180px" }}
                      onMouseDown={(e) => handleMouseDown("middleschool", e)}
                      title="드래그하여 사진 위치 조정"
                    >
                      <img 
                        src={middleschoolImage.imageData} 
                        alt="중학교 시절"
                        className="w-full h-full object-cover select-none"
                        style={{ 
                          filter: "sepia(10%)",
                          objectPosition: `${imagePositions.middleschool.x}% ${imagePositions.middleschool.y}%`,
                        }}
                        draggable={false}
                      />
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded print:hidden">
                        ↔ 드래그
                      </div>
                    </div>
                    <p className="text-[11px] mt-2 leading-snug">
                      ▲ 중학교 시절 음악에 본격적인 취미를 갖기 시작한 즈음. 이때부터 아우라가 남다르다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Article Continuation after photos */}
          <div className="mt-4 columns-2 gap-5 text-xs leading-relaxed" style={{ columnRule: "1px solid #333" }}>
            <p className="mb-3">
              가족들의 증언에 따르면 {displayName}은 어린 시절부터 남다른 음악적 감각을 보였다. 음악만 들으면 눈을 반짝이며 리듬에 맞춰 몸을 흔들었다고 한다.
            </p>
            <p className="mb-3">
              중학교 시절에는 교내 음악동아리에서 리더 역할을 맡으며 본격적으로 음악 활동을 시작했다. 당시 담임선생님은 "축제 때마다 무대에 올라 노래를 불렀는데, 항상 학생들의 큰 호응을 받았다"고 전했다.
            </p>
            <p className="mb-3">
              음악에 대한 열정은 고등학교 시절에도 이어졌다. 학업과 음악 활동을 병행하면서도 꾸준히 실력을 갈고닦았다. 주변의 우려에도 불구하고 음악의 길을 포기하지 않았다.
            </p>
            <p className="mb-3">
              레코딩카페에서의 첫 녹음 이후, {displayName}은 더욱 진지하게 가수의 꿈을 키워나갔다. 오디션과 연습생 생활을 거치며 실력을 쌓았고, 마침내 정식 데뷔의 기회를 얻었다.
            </p>
            <p className="mb-3">
              데뷔 이후 착실하게 커리어를 쌓아온 {displayName}은 이제 대한민국을 대표하는 아티스트로 자리매김했다. 특히 한국 전통문화에 대한 깊은 애정으로 한복을 즐겨 착용하며 전 세계에 한복의 아름다움을 알리고 있다.
            </p>
            <p>
              이번 한복문화대상 수상은 그동안의 노력에 대한 당연한 결실이라는 평가가 지배적이다. {displayName}은 "앞으로도 한국 문화를 세계에 알리는 데 앞장서겠다"는 포부를 밝혔다.
            </p>
          </div>
        </div>

        {/* Right Column: Sidebar + Future Image (2 cols) */}
        <div className="col-span-2 border-l-2 border-black pl-5 flex flex-col">
          {/* Award Photo */}
          {futureImage?.imageData && (
            <div className="mb-4">
              <div className="bg-black print-bg-black p-2 mb-2">
                <div className="text-xs font-black text-center tracking-wider text-white print-text-white">
                  ★ {futureYear} 한복문화대상 ★
                </div>
              </div>
              <div 
                className="border-2 border-black overflow-hidden flex items-center justify-center bg-purple-50 relative cursor-move print:cursor-default" 
                style={{ aspectRatio: "9/16", width: "100%" }}
                onMouseDown={(e) => handleMouseDown("future", e)}
                onWheel={(e) => handleWheel("future", e)}
                title="드래그: 위치 조정 / 휠: 확대/축소"
              >
                <img 
                  src={futureImage.imageData} 
                  alt="한복 시상식"
                  className="h-full object-contain select-none"
                  style={{
                    objectPosition: `${imagePositions.future.x}% ${imagePositions.future.y}%`,
                    transform: `scale(${imagePositions.future.scale || 1})`,
                  }}
                  draggable={false}
                />
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded print:hidden">
                  ↔ 드래그 / 🔍 휠
                </div>
              </div>
              <p className="text-[11px] mt-2 text-justify leading-snug">
                ▲ 지난달 열린 '{futureYear} 한복문화대상'에서 대상을 수상한 <span className="font-bold">{displayName}</span>이 관객들에게 손을 흔들고 있다. 
                전통 한복의 아름다움을 전 세계에 알린 공로를 인정받았다.
              </p>
            </div>
          )}

          {/* Advertisement Section */}
          <div className="border-2 border-black p-1.5 mb-1.5 bg-gray-50">
            <div className="text-[8px] font-black text-center border-b border-black pb-0.5 mb-1">ADVERTISEMENT</div>
            <div className="text-[9px] font-bold text-center">🎵 GLOBAL MUSIC DISTRIBUTION</div>
            <p className="text-[8px] text-center leading-tight">
              Let your music be heard around the world. Distribute your tracks to Spotify, Apple Music, YouTube Music, and more. Earn the same royalty rates as signed artists—deposited directly to your account, for life.
            </p>
            <div className="text-[9px] font-black text-center">record.co.kr</div>
          </div>

          <div className="border-2 border-black p-1.5 mb-1.5 bg-gray-50">
            <div className="text-[9px] font-bold text-center">🛍️ DUTY FREE VIP</div>
            <p className="text-[8px] text-center leading-tight">
              All Recording Cafe customers get instant VIP registration. Unlock VIP status and enjoy up to 15% extra discount at duty-free shops. Claim your benefits now.
            </p>
            <div className="text-[9px] font-black text-center">vip.sc.kr</div>
          </div>

          <div className="border-2 border-black p-1.5 mb-1.5 bg-gray-50">
            <div className="text-[9px] font-bold text-center">🏢 KOREA BUSINESS SETUP</div>
            <p className="text-[8px] text-center leading-tight">
              Create "Made in Korea" products. Start your company in Korea. From company incorporation to business address services—all in one place. Entering the Korean market has never been easier.
            </p>
            <div className="text-[9px] font-black text-center">korea.sc.kr</div>
          </div>

          <div className="border-2 border-black p-1.5 mb-1.5 bg-gray-50">
            <div className="text-[9px] font-bold text-center">💎 K-BEAUTY & PLASTIC SURGERY</div>
            <p className="text-[8px] text-center leading-tight">
              Discover true beauty in the home of K-Beauty. Get 20% off at Korea's top dermatology clinics and plastic surgery centers.
            </p>
            <div className="text-[9px] font-black text-center">beauty.sc.kr</div>
          </div>

          <div className="border-2 border-black p-1.5 flex-1 bg-gray-50 flex flex-col justify-center">
            <div className="text-[9px] font-bold text-center">💕 FIND TRUE LOVE</div>
            <p className="text-[8px] text-center leading-tight">
              Cross borders. Meet someone from Korea. Professional matchmakers connecting you with Korean singles for meaningful relationships.
            </p>
            <div className="text-[9px] font-black text-center">truelove.ai.kr</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center text-[11px] font-medium">
        <span>www.recordingcafe.com</span>
        <span>© {futureYear} Recording Cafe</span>
        <span>@recordingcafe</span>
      </div>
    </div>
  );
}

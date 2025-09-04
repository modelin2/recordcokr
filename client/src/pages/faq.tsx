import { useState } from "react";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

type Language = 'ko' | 'en' | 'zh';

const koreanFaqs = [
  {
    question: "안녕하세요 / 하이 / 여기 처음이에요",
    answer: "안녕하세요! 케이팝 레코딩카페에 오신 것을 환영합니다. 저는 매장 안내를 도와드리는 AI 도우미예요. 궁금한 것이 있으시면 언제든 말씀해 주세요!"
  },
  {
    question: "여기가 어떤 곳인가요? / 뭐 하는 곳이에요?",
    answer: "저희는 케이팝을 사랑하는 분들을 위한 특별한 레코딩카페입니다. 좋아하는 케이팝 노래를 직접 녹음하고, 아이돌처럼 포토 촬영도 할 수 있어요. 전문 장비와 함께 나만의 케이팝 커버를 만들어보세요!"
  },
  {
    question: "처음 와봤는데 뭘 할 수 있나요? / 초보자도 가능한가요?",
    answer: "처음 오신 분들께 인기 있는 체험은 케이팝 커버 녹음이에요! 좋아하는 노래를 선택해서 전문 레코딩 부스에서 녹음하고, 예쁜 포토존에서 사진도 찍을 수 있습니다. 직원이 친절하게 도와드릴 테니 걱정 마세요!"
  },
  {
    question: "혼자 와도 되나요? / 혼자 이용 가능해요?",
    answer: "물론이죠! 혼자 오시는 분들도 많이 계세요. 나만의 시간을 즐기며 좋아하는 케이팝 노래를 마음껏 불러보세요. 부담 없이 편안하게 이용하실 수 있어요."
  },
  {
    question: "친구들과 같이 와도 되나요? / 단체 이용 가능해요?",
    answer: "네, 친구분들과 함께 오시면 더욱 재미있게 즐기실 수 있어요! 함께 듀엣이나 그룹 커버를 녹음하거나, 서로 응원하며 촬영할 수도 있습니다. 단체 이용도 가능하니 미리 예약해 주세요."
  },
  {
    question: "뭐가 제일 인기 있어요? / 추천해주세요",
    answer: "처음이시라면 평소에 많이 부르시는 노래로 기본 녹음 패키지를 추천해요. 1~2곡 체험하고 파일까지 받아가실 수 있어요."
  },
  {
    question: "언제 문을 여나요? / 영업시간이 어떻게 되나요?",
    answer: "정확한 영업시간은 오전 10시부터 밤 10시까지 입니다. 방문 전 미리 전화나 웹사이트에서 확인하시는 것을 추천드려요!"
  },
  {
    question: "휴무일 있어요? / 언제 쉬나요?",
    answer: "휴무일은 없습니다. 하지만, 방문전에는 사전 예약제로 운영되니 방문 전 꼭 홈페이지를 확인해 주세요."
  },
  {
    question: "여기 주소가 어떻게 되나요? / 전화번호 알려주세요",
    answer: "자세한 주소와 연락처는 저희 웹사이트 https://record.co.kr에서 확인하실 수 있어요."
  },
  {
    question: "주차할 수 있나요? / 주차요금 있어요?",
    answer: "주차는 불가능해요. 가까운 유료주차장이나 공영주차장을 이용해주세요."
  },
  {
    question: "지하철역에서 가깝나요? / 어떻게 찾아가요?",
    answer: "3호선 신사역 5번 출구에서 5분거리예요"
  },
  {
    question: "와이파이 있나요? / 휴대폰 충전할 수 있나요?",
    answer: "와이파이 및 휴대폰 충전 가능해요"
  },
  {
    question: "짐 맡길 곳 있나요? / 사물함 있어요?",
    answer: "사물함은 없지만, 여행가방을 두는 공간은 마련되어 있습니다."
  },
  {
    question: "전체 이용 시간 얼마나 걸려요?",
    answer: "기본적으로 카페이기 때문에 이용시간이 특별히 제한은 없습니다. 녹음실 이용만 1세션 10분 단위로 이용하실 수 있습니다."
  },
  {
    question: "케이팝 노래만 녹음할 수 있나요? / 커버 녹음 가능해요?",
    answer: "케이팝이 아닌 어떠한 노래도 녹음하실 수 있습니다. 단지 해당 곡의 반주가 유튜브에 있어야 합니다. 미리 찾아보시고 와주세요."
  },
  {
    question: "어떤 노래들 있나요? / 원하는 곡이 없으면 어떻게 하나요?",
    answer: "케이팝이 아닌 어떠한 노래도 녹음하실 수 있습니다. 단지 해당 곡의 반주가 유튜브에 있어야 합니다. 미리 찾아보시고 와주세요."
  },
  {
    question: "친구들과 함께 그룹으로 녹음할 수 있나요? / 듀엣곡도 되나요?",
    answer: "기본적으로 1개의 마이크가 준비되어 있습니다. 1세션은 1명이 기본입니다."
  },
  {
    question: "랩 파트만 따로 녹음할 수 있나요? / 보컬과 랩 섞어서도 되나요?",
    answer: "반주를 유튜브에서 들으시면서 노래하시는 것이기 때문에 제한 사항은 없습니다."
  },
  {
    question: "사진 촬영도 할 수 있나요? / 포토존 있어요?",
    answer: "네! 전문 조명과 셀피스틱이 거치되어 있어 휴대폰을 거치해 촬영 하실 수 있습니다."
  },
  {
    question: "반주는 매장에서 제공하나요? / 키 변경 가능해요?",
    answer: "반주는 유튜브에서 노래방이나 가라오케로 검색해 미리 주소를 저희에게 주셔야 합니다. MR파일을 가지고 계신 분은 유튜브에 직접 일부공개로 올리시고 링크주소를 저희에게 주시면 됩니다."
  },
  {
    question: "녹음은 어떻게 하나요? / 처음인데 어려워요?",
    answer: "걱정 마세요! 매우 간단해요. 곡 선택 → 부스 입장 → 헤드폰 착용 → MR 들으며 노래하기 순으로 진행됩니다. 경험 많은 엔지니어가 친절하게 도와드리고, 장비 조작은 저희가 다 해드려요!"
  },
  {
    question: "잘못 불렀는데 다시 할 수 있나요? / 부분만 다시 녹음 되나요?",
    answer: "부분만 부르는 것은 불가능합니다. 노래방처럼 처음부터 끝가지 반주가 계속 흐르고 완창을 하는 시스템입니다. 1세션에 2번 완창을 하시는 것을 추천드려요."
  },
  {
    question: "음정 보정해주나요? / 믹싱도 해주나요?",
    answer: "기본적인 상품에는 음정 보정과 믹싱은 포함되지 않습니다. 보정과 믹싱은 추가 옵션으로 신청하셔야 합니다."
  },
  {
    question: "녹음한 파일은 어떻게 받나요? / 어떤 형식으로 주나요?",
    answer: "카페에 도착하시면 파일 받으실 이메일 주소를 저희에게 알려주세요. 녹음 완료 후 다음날 파일을 메일로 보내드려요. 보컬만 있는 파일과 반주와 합친 파일. 이렇게 두 개를 보내드려요."
  },
  {
    question: "가사 보면서 녹음할 수 있나요? / 제 목소리 잘 들려요?",
    answer: "가사는 따로 준비해 드리지 않습니다. 자신이 휴대폰이나 종이로 가져오셔야 해요. 헤드폰으로 자신의 목소리를 선명하게 들으실 수 있어요."
  },
  {
    question: "녹음한 파일 유튜브에 올려도 되나요? / 저작권 문제 없나요?",
    answer: "개인 소장이나 SNS 개인 계정 업로드는 일반적으로 가능해요. 하지만 상업적 이용이나 수익 창출 시에는 저작권 문제가 있을 수 있으니 필요하신 분은 옵션을 선택해 주세요."
  },
  {
    question: "키 변경이나 템포 조절 가능한가요? / 화음도 만들어 주나요?",
    answer: "유튜브에 올려진 반주를 사용하기 때문에 불가능합니다. 화음은 따로 옵션이 없으며 믹싱 상품을 선택하시고 요청하시면 기계적으로 만들어 드립니다."
  },
  {
    question: "온라인으로 예약할 수 있나요? / 웹사이트에서 예약 어떻게 해요?",
    answer: "네, https://record.co.kr 웹사이트에서 24시간 언제든 온라인 예약이 가능해요!"
  },
  {
    question: "전화로도 예약할 수 있나요? / 예약 없이 가도 되나요?",
    answer: "전화 예약은 불가능해요. 현장 방문도 가능하지만 녹음실 이용이 불가능 할 수 있어요. 원활한 이용을 위해 미리 예약하시는 것을 강력 추천드려요!"
  },
  {
    question: "예약 시간 바꿀 수 있나요? / 취소 수수료 있어요?",
    answer: "예약 변경과 취소는 클룩(Klook) 표준 취소 약관을 따릅니다. 취소나 노쇼의 경우 수수료가 발생할 수 있으니 약관을 꼭 확인해주세요."
  },
  {
    question: "시간 연장 가능해요?",
    answer: "시간을 연장 하시려면 현장에서 다시 홈페이지 https://record.co.kr에 접속해 예약을 하시면 가능해요."
  },
  {
    question: "예약 시간에 늦으면 어떻게 되나요?",
    answer: "예약시간이 늦으면 노쇼 처리 되요. 최소 30분전에는 도착해주세요."
  },
  {
    question: "한 부스에 몇 명까지 들어가요? / 단체 이용 가능해요?",
    answer: "부스는 기본적으로 1인용이예요."
  },
  {
    question: "미성년자도 이용 가능한가요? / 보호자 동반해야 하나요?",
    answer: "미성년자도 이용 가능합니다. 만 14세 미만은 보호자 동반을 권장합니다."
  },
  {
    question: "뭘 준비해 가야 하나요? / 개인 MR 가져가도 되나요?",
    answer: "녹음하고 싶은 노래의 반주를 유튜브에서 찾아 주소를 전달해 주시면 됩니다. 보컬이 없는 반주파일은 MR 이나 가라오케로 검색하시면 되요."
  },
  {
    question: "전문 엔지니어나 믹싱 비용 따로 있나요?",
    answer: "기본 서비스에는 간단한 믹싱이 포함되어 있어요. 전문적인 보컬 튜닝, 하모니 추가, 고급 믹싱, 마스터링 등은 추가 옵션으로 별도 요금이 적용됩니다."
  },
  {
    question: "카드로 결제할 수 있나요? / 간편결제도 되나요?",
    answer: "신용카드, 체크카드, 현금 모두 가능해요! 카카오페이, 네이버페이, 삼성페이 등 간편결제도 대부분 지원합니다."
  },
  {
    question: "환불 가능한가요? / 취소하면 돈 돌려받을 수 있어요?",
    answer: "예약 변경과 취소는 클룩(Klook) 표준 취소 약관을 따릅니다. 취소나 노쇼의 경우 수수료가 발생할 수 있으니 약관을 꼭 확인해주세요."
  },
  {
    question: "미리 결제해야 하나요? / 예약금만 내도 되나요?",
    answer: "온라인 예약 시 전액 선결제하셔야 합니다. 현장에 계신 경우 현장 결제도 가능해요."
  },
  {
    question: "영수증 발행 가능한가요? / 세금계산서 필요해요",
    answer: "영수증, 현금영수증, 세금계산서 발행 모두 가능해요! 현장에서 요청하시거나 결제 시 미리 말씀해 주세요. 이메일로도 발송 가능합니다."
  },
  {
    question: "외부 음식 가져와도 되나요? / 배달 주문 가능해요?",
    answer: "쾌적한 환경 유지를 위해 외부 음식물 반입은 제한하고 있어요."
  },
  {
    question: "녹음부스 안에서 음료 마셔도 되나요?",
    answer: "전문 장비 보호를 위해 부스 내에서는 뚜껑이 있는 음료만 허용하고 있어요."
  },
  {
    question: "기다릴 곳 있나요? / 편하게 쉴 수 있는 공간 있어요?",
    answer: "네, 넓고 편안한 카페 공간이 마련되어 있어요!"
  },
  {
    question: "와이파이 비밀번호 알려주세요 / 핸드폰 충전할 수 있나요?",
    answer: "무료 와이파이를 제공하고 있어요! 비밀번호는 정문에 붙어 있어요. 충전기는 안내데스크 앞에 있어요."
  },
  {
    question: "흡연할 수 있는 곳 있나요?",
    answer: "화장실을 포함한 매장 내부는 전면 금연입니다. 건물 옥상에 올라가시면 지정 흡연 구역이 있어요."
  },
  {
    question: "지켜야 할 규칙이 있나요? / 이용 시 주의사항은?",
    answer: "모든 분들이 즐겁게 이용하실 수 있도록 기본 매너를 지켜주세요. 부스 내 음식물 반입 제한, 장비 소중히 다루기, 공용 공간에서 조용히 하기, 예약 시간 준수 등이 있어요."
  },
  {
    question: "유튜브나 틱톡용 영상 만들 수 있나요? / 뮤직비디오 촬영 도와주나요?",
    answer: "크리에이터를 위한 콘텐츠 제작 서비스를 제공해요! 고품질 오디오 녹음과 기본 촬영 지원을 통해 SNS용 클립부터 커버 영상까지 제작 가능합니다. 유료 옵션을 신청해 주세요."
  },
  {
    question: "외화 결제 가능한가요? / 외국인 할인 있어요?",
    answer: "마스터카드와 비자카드 등 해외 카드 결제가 가능해요."
  }
];

const englishFaqs = [
  {
    question: "Hello / Hi / First time here",
    answer: "Hello! Welcome to K-pop Recording Cafe. I'm an AI assistant to help guide you around the store. Please feel free to ask me anything!"
  },
  {
    question: "What is this place? / What do you do here?",
    answer: "We are a special recording cafe for K-pop lovers. You can record your favorite K-pop songs directly and take photos like an idol. Create your own K-pop cover with professional equipment!"
  },
  {
    question: "It's my first time, what can I do? / Is it possible for beginners?",
    answer: "The popular experience for first-time visitors is K-pop cover recording! Choose your favorite song to record in a professional recording booth and take photos in our beautiful photo zone. Our staff will kindly help you, so don't worry!"
  },
  {
    question: "Can I come alone? / Is solo use possible?",
    answer: "Of course! Many people come alone. Enjoy your own time and sing your favorite K-pop songs to your heart's content. You can use it comfortably without any burden."
  },
  {
    question: "Can I come with friends? / Is group use possible?",
    answer: "Yes, coming with friends makes it even more fun! You can record duets or group covers together, or cheer each other on while filming. Group use is also possible, so please book in advance."
  },
  {
    question: "What's most popular? / Please recommend",
    answer: "If it's your first time, we recommend the basic recording package with songs you usually sing a lot. You can experience 1-2 songs and receive the files."
  },
  {
    question: "When do you open? / What are your business hours?",
    answer: "Our exact business hours are from 10 AM to 10 PM. We recommend checking by phone or website before visiting!"
  },
  {
    question: "Do you have holidays? / When are you closed?",
    answer: "We don't have holidays. However, we operate by advance reservation, so please check our homepage before visiting."
  },
  {
    question: "What's your address? / Can you tell me the phone number?",
    answer: "You can check our detailed address and contact information on our website https://record.co.kr."
  },
  {
    question: "Can I park? / Is there parking fee?",
    answer: "Parking is not available. Please use nearby paid parking lots or public parking."
  },
  {
    question: "Is it close to the subway station? / How do I get there?",
    answer: "It's a 5-minute walk from Sinsa Station Exit 5 on Line 3."
  },
  {
    question: "Is there WiFi? / Can I charge my phone?",
    answer: "WiFi and phone charging are available."
  },
  {
    question: "Is there a place to store luggage? / Are there lockers?",
    answer: "There are no lockers, but there is space to leave your travel bags."
  },
  {
    question: "How long does the whole experience take?",
    answer: "Since it's basically a cafe, there's no special time limit. Only the recording studio use is limited to 10-minute sessions."
  },
  {
    question: "Can I only record K-pop songs? / Is cover recording possible?",
    answer: "You can record any song, not just K-pop. The only requirement is that the backing track must be available on YouTube. Please find it beforehand."
  },
  {
    question: "What songs do you have? / What if you don't have the song I want?",
    answer: "You can record any song, not just K-pop. The only requirement is that the backing track must be available on YouTube. Please find it beforehand."
  },
  {
    question: "Can I record as a group with friends? / Are duets possible?",
    answer: "Basically, one microphone is prepared. One session is for one person by default."
  },
  {
    question: "Can I record just the rap part? / Can I mix vocals and rap?",
    answer: "Since you sing along to the backing track from YouTube, there are no restrictions."
  },
  {
    question: "Can I take photos? / Is there a photo zone?",
    answer: "Yes! Professional lighting and selfie sticks are installed so you can mount your phone and take photos."
  },
  {
    question: "Do you provide backing tracks? / Can you change the key?",
    answer: "You need to search for backing tracks on YouTube as karaoke or karaoke versions and provide us with the address. If you have an MR file, you can upload it to YouTube as unlisted and give us the link."
  },
  {
    question: "How do I record? / It's my first time, is it difficult?",
    answer: "Don't worry! It's very simple. The process is: song selection → enter booth → wear headphones → sing along to MR. Experienced engineers will kindly help you, and we'll handle all the equipment operation!"
  },
  {
    question: "I sang wrong, can I do it again? / Can I re-record just parts?",
    answer: "Recording only parts is not possible. Like karaoke, the backing track plays continuously from start to finish and you sing the whole song. We recommend doing 2 full performances in one session."
  },
  {
    question: "Do you do pitch correction? / Do you do mixing too?",
    answer: "Basic products don't include pitch correction and mixing. Correction and mixing must be requested as additional options."
  },
  {
    question: "How do I receive the recorded files? / What format do you provide?",
    answer: "When you arrive at the cafe, please provide us with the email address where you'd like to receive the files. We'll email you the files the day after recording is complete. We send two files: vocals only and vocals mixed with backing track."
  },
  {
    question: "Can I see lyrics while recording? / Can I hear my voice well?",
    answer: "We don't provide lyrics separately. You need to bring them on your phone or paper. You can clearly hear your voice through the headphones."
  },
  {
    question: "Can I upload recorded files to YouTube? / Are there copyright issues?",
    answer: "Personal use or uploading to personal SNS accounts is generally fine. However, there may be copyright issues for commercial use or monetization, so please select the appropriate option if needed."
  },
  {
    question: "Can you change key or adjust tempo? / Do you create harmonies?",
    answer: "It's not possible since we use backing tracks uploaded to YouTube. There's no separate harmony option, but if you select the mixing service and request it, we can create them mechanically."
  },
  {
    question: "Can I book online? / How do I book on the website?",
    answer: "Yes, you can make online reservations 24/7 on our website https://record.co.kr!"
  },
  {
    question: "Can I book by phone? / Can I visit without a reservation?",
    answer: "Phone reservations are not possible. Walk-ins are possible but recording studio use may not be available. We strongly recommend booking in advance for smooth service!"
  },
  {
    question: "Can I change reservation time? / Are there cancellation fees?",
    answer: "Reservation changes and cancellations follow Klook's standard cancellation terms. Cancellation or no-show fees may apply, so please check the terms."
  },
  {
    question: "Can I extend time?",
    answer: "To extend time, you can access our homepage https://record.co.kr on-site and make another reservation."
  },
  {
    question: "What happens if I'm late for my reservation?",
    answer: "Being late for your reservation will result in a no-show. Please arrive at least 30 minutes early."
  },
  {
    question: "How many people can fit in one booth? / Is group use possible?",
    answer: "Booths are basically for one person."
  },
  {
    question: "Can minors use it? / Do they need guardian accompaniment?",
    answer: "Minors can use it. We recommend guardian accompaniment for those under 14."
  },
  {
    question: "What should I prepare? / Can I bring my own MR?",
    answer: "You need to find the backing track of the song you want to record on YouTube and provide us with the address. Instrumental files without vocals can be found by searching for MR or karaoke."
  },
  {
    question: "Are there separate costs for professional engineers or mixing?",
    answer: "Basic service includes simple mixing. Professional vocal tuning, harmony addition, advanced mixing, mastering, etc. are additional options with separate charges."
  },
  {
    question: "Can I pay with card? / Are mobile payments accepted?",
    answer: "Credit cards, debit cards, and cash are all accepted! Most mobile payments like KakaoPay, NaverPay, Samsung Pay are also supported."
  },
  {
    question: "Are refunds possible? / Can I get money back if I cancel?",
    answer: "Reservation changes and cancellations follow Klook's standard cancellation terms. Cancellation or no-show fees may apply, so please check the terms."
  },
  {
    question: "Do I need to pay in advance? / Can I just pay a deposit?",
    answer: "For online reservations, you must pay in full in advance. If you're on-site, on-site payment is also possible."
  },
  {
    question: "Can you issue receipts? / I need a tax invoice",
    answer: "Receipts, cash receipts, and tax invoices are all available! Please request on-site or mention in advance when paying. Email delivery is also possible."
  },
  {
    question: "Can I bring outside food? / Can I order delivery?",
    answer: "Outside food is restricted to maintain a pleasant environment."
  },
  {
    question: "Can I drink beverages in the recording booth?",
    answer: "To protect professional equipment, only beverages with lids are allowed in the booth."
  },
  {
    question: "Is there a waiting area? / Is there a comfortable space to rest?",
    answer: "Yes, we have a spacious and comfortable cafe space!"
  },
  {
    question: "What's the WiFi password? / Can I charge my phone?",
    answer: "We provide free WiFi! The password is posted at the front door. Chargers are available at the information desk."
  },
  {
    question: "Is there a smoking area?",
    answer: "The entire store including restrooms is non-smoking. There's a designated smoking area on the building rooftop."
  },
  {
    question: "Are there rules to follow? / What are the usage precautions?",
    answer: "Please follow basic manners so everyone can enjoy. This includes restrictions on bringing food into booths, handling equipment carefully, being quiet in common areas, and punctuality for reservations."
  },
  {
    question: "Can I make videos for YouTube or TikTok? / Do you help with music video filming?",
    answer: "We provide content creation services for creators! From SNS clips to cover videos are possible through high-quality audio recording and basic filming support. Please apply for paid options."
  },
  {
    question: "Can I pay with foreign currency? / Are there discounts for foreigners?",
    answer: "Foreign card payments like Mastercard and Visa are accepted."
  }
];

const chineseFaqs = [
  {
    question: "你好 / 嗨 / 第一次来这里",
    answer: "你好！欢迎来到K-pop录音咖啡厅。我是帮助您了解店铺的AI助手。有任何问题请随时告诉我！"
  },
  {
    question: "这是什么地方？/ 你们做什么的？",
    answer: "我们是为K-pop爱好者打造的特别录音咖啡厅。您可以直接录制喜欢的K-pop歌曲，还可以像偶像一样拍照。用专业设备制作属于您自己的K-pop翻唱吧！"
  },
  {
    question: "第一次来可以做什么？/ 初学者也可以吗？",
    answer: "第一次来的客人最受欢迎的体验是K-pop翻唱录音！选择喜欢的歌曲在专业录音室录制，还可以在漂亮的拍照区拍照。工作人员会亲切地帮助您，请不要担心！"
  },
  {
    question: "可以一个人来吗？/ 可以单独使用吗？",
    answer: "当然可以！很多人都是一个人来的。享受属于自己的时间，尽情演唱喜欢的K-pop歌曲吧。可以毫无负担地轻松使用。"
  },
  {
    question: "可以和朋友一起来吗？/ 可以团体使用吗？",
    answer: "是的，和朋友一起来会更有趣！可以一起录制二重唱或团体翻唱，或者互相加油拍摄。也支持团体使用，请提前预约。"
  },
  {
    question: "什么最受欢迎？/ 请推荐",
    answer: "如果是第一次来，推荐用平时经常唱的歌曲选择基础录音套餐。可以体验1-2首歌并获得文件。"
  },
  {
    question: "什么时候开门？/ 营业时间是怎样的？",
    answer: "准确的营业时间是上午10点到晚上10点。建议访问前先通过电话或网站确认！"
  },
  {
    question: "有休息日吗？/ 什么时候休息？",
    answer: "没有休息日。但是，访问前需要提前预约，请务必在访问前查看主页。"
  },
  {
    question: "地址是什么？/ 请告诉我电话号码",
    answer: "详细地址和联系方式可以在我们的网站 https://record.co.kr 查看。"
  },
  {
    question: "可以停车吗？/ 有停车费吗？",
    answer: "无法停车。请使用附近的付费停车场或公共停车场。"
  },
  {
    question: "离地铁站近吗？/ 怎么去？",
    answer: "从3号线新沙站5号出口步行5分钟"
  },
  {
    question: "有WiFi吗？/ 可以给手机充电吗？",
    answer: "有WiFi，也可以给手机充电"
  },
  {
    question: "有地方存放行李吗？/ 有储物柜吗？",
    answer: "没有储物柜，但有放置旅行箱的空间。"
  },
  {
    question: "整个使用时间需要多长？",
    answer: "基本上是咖啡厅，使用时间没有特别限制。只有录音室使用是以10分钟为一个单位。"
  },
  {
    question: "只能录K-pop歌曲吗？/ 可以录翻唱吗？",
    answer: "可以录制任何歌曲，不仅仅是K-pop。只要该歌曲的伴奏在YouTube上有就可以。请提前查找。"
  },
  {
    question: "有什么歌曲？/ 如果没有想要的歌曲怎么办？",
    answer: "可以录制任何歌曲，不仅仅是K-pop。只要该歌曲的伴奏在YouTube上有就可以。请提前查找。"
  },
  {
    question: "可以和朋友一起录制团体歌曲吗？/ 二重唱也可以吗？",
    answer: "基本上准备了1个麦克风。1个session基本是1个人。"
  },
  {
    question: "可以单独录rap部分吗？/ 声乐和rap混合也可以吗？",
    answer: "因为是听着YouTube的伴奏唱歌，所以没有限制。"
  },
  {
    question: "可以拍照吗？/ 有拍照区吗？",
    answer: "有！配备了专业照明和自拍杆，可以放置手机进行拍摄。"
  },
  {
    question: "店里提供伴奏吗？/ 可以改变音调吗？",
    answer: "伴奏需要您在YouTube上搜索卡拉OK或伴奏版本，提前给我们地址。如果您有MR文件，可以上传到YouTube设为部分公开，然后给我们链接地址。"
  },
  {
    question: "录音怎么进行？/ 第一次很难吗？",
    answer: "不要担心！非常简单。流程是：选曲 → 进入录音室 → 戴耳机 → 听着MR唱歌。有经验的工程师会亲切地帮助您，设备操作我们都会为您处理！"
  },
  {
    question: "唱错了可以重新录吗？/ 可以只重录部分吗？",
    answer: "无法只唱部分。像卡拉OK一样，伴奏从头到尾连续播放，需要完整演唱。建议在1个session内完整演唱2遍。"
  },
  {
    question: "会修正音准吗？/ 也会混音吗？",
    answer: "基础产品不包含音准修正和混音。修正和混音需要申请额外选项。"
  },
  {
    question: "录音文件怎么接收？/ 以什么格式提供？",
    answer: "到达咖啡厅后，请告诉我们接收文件的邮箱地址。录音完成后第二天会通过邮件发送文件。会发送两个文件：只有人声的文件和与伴奏混合的文件。"
  },
  {
    question: "可以看着歌词录音吗？/ 能听清自己的声音吗？",
    answer: "我们不单独准备歌词。您需要用手机或纸张自己带来。通过耳机可以清楚地听到自己的声音。"
  },
  {
    question: "录音文件可以上传到YouTube吗？/ 没有版权问题吗？",
    answer: "个人收藏或SNS个人账户上传一般是可以的。但商业使用或收益创造时可能有版权问题，需要的话请选择选项。"
  },
  {
    question: "可以改变音调或调节节拍吗？/ 也会制作和声吗？",
    answer: "因为使用YouTube上传的伴奏所以无法改变。和声没有单独的选项，如果选择混音产品并提出要求，可以机械性地制作。"
  },
  {
    question: "可以在线预约吗？/ 网站上怎么预约？",
    answer: "是的，可以在网站 https://record.co.kr 24小时随时在线预约！"
  },
  {
    question: "也可以电话预约吗？/ 不预约也可以去吗？",
    answer: "无法电话预约。现场访问也可以，但可能无法使用录音室。为了顺利使用，强烈建议提前预约！"
  },
  {
    question: "可以更改预约时间吗？/ 有取消手续费吗？",
    answer: "预约更改和取消遵循Klook标准取消条款。取消或爽约可能产生手续费，请务必确认条款。"
  },
  {
    question: "可以延长时间吗？",
    answer: "要延长时间，可以在现场重新访问主页 https://record.co.kr 进行预约。"
  },
  {
    question: "预约时间迟到会怎样？",
    answer: "预约时间迟到会被处理为爽约。请至少提前30分钟到达。"
  },
  {
    question: "一个录音室可以进几个人？/ 可以团体使用吗？",
    answer: "录音室基本上是1人用的。"
  },
  {
    question: "未成年人也可以使用吗？/ 需要监护人陪同吗？",
    answer: "未成年人也可以使用。建议14岁以下儿童有监护人陪同。"
  },
  {
    question: "需要准备什么？/ 可以带个人MR吗？",
    answer: "需要在YouTube上找到想录制歌曲的伴奏并提供地址。没有人声的伴奏文件可以搜索MR或karaoke找到。"
  },
  {
    question: "专业工程师或混音费用另外收费吗？",
    answer: "基础服务包含简单混音。专业人声调音、和声添加、高级混音、母带处理等作为额外选项单独收费。"
  },
  {
    question: "可以刷卡吗？/ 简便支付也可以吗？",
    answer: "信用卡、借记卡、现金都可以！KakaoPay、NaverPay、Samsung Pay等简便支付大部分都支持。"
  },
  {
    question: "可以退款吗？/ 取消的话可以退钱吗？",
    answer: "预约更改和取消遵循Klook标准取消条款。取消或爽约可能产生手续费，请务必确认条款。"
  },
  {
    question: "需要提前付款吗？/ 只付定金也可以吗？",
    answer: "在线预约时必须全额预付。如果在现场，现场付款也可以。"
  },
  {
    question: "可以开发票吗？/ 需要税务发票",
    answer: "收据、现金收据、税务发票都可以开具！可以在现场要求或付款时提前说明。也可以通过邮件发送。"
  },
  {
    question: "可以带外面的食物吗？/ 可以叫外卖吗？",
    answer: "为了维持舒适的环境，限制外部食物带入。"
  },
  {
    question: "在录音室里可以喝饮料吗？",
    answer: "为了保护专业设备，录音室内只允许有盖子的饮料。"
  },
  {
    question: "有等候的地方吗？/ 有舒适休息的空间吗？",
    answer: "有，准备了宽敞舒适的咖啡厅空间！"
  },
  {
    question: "WiFi密码是什么？/ 可以给手机充电吗？",
    answer: "提供免费WiFi！密码贴在正门。充电器在咨询台前面。"
  },
  {
    question: "有可以吸烟的地方吗？",
    answer: "包括洗手间在内的店内全面禁烟。如果上到建筑物屋顶，有指定的吸烟区域。"
  },
  {
    question: "有需要遵守的规则吗？/ 使用时的注意事项是什么？",
    answer: "为了让所有人都能愉快使用，请遵守基本礼仪。包括录音室内限制食物带入、爱护设备、在公共空间保持安静、遵守预约时间等。"
  },
  {
    question: "可以制作YouTube或TikTok用的视频吗？/ 帮助拍摄音乐视频吗？",
    answer: "为创作者提供内容制作服务！通过高品质音频录制和基础拍摄支持，从SNS剪辑到翻唱视频都可以制作。请申请付费选项。"
  },
  {
    question: "可以外币结算吗？/ 有外国人折扣吗？",
    answer: "可以使用万事达卡和维萨卡等海外卡结算。"
  }
];

const languageLabels = {
  ko: '한국어',
  en: 'English', 
  zh: '中文'
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCurrentFaqs = () => {
    switch (currentLanguage) {
      case 'en':
        return englishFaqs;
      case 'zh':
        return chineseFaqs;
      default:
        return koreanFaqs;
    }
  };

  const getTitle = () => {
    switch (currentLanguage) {
      case 'en':
        return 'Frequently Asked Questions';
      case 'zh':
        return '常见问题';
      default:
        return '자주 묻는 질문';
    }
  };

  const getSubtitle = () => {
    switch (currentLanguage) {
      case 'en':
        return 'Check everything you want to know about K-pop Recording Cafe';
      case 'zh':
        return '查看关于K-pop录音咖啡厅的所有疑问';
      default:
        return '케이팝 레코딩카페에 대해 궁금한 모든 것들을 확인해보세요';
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="text-center">
            {/* Language Toggle */}
            <div className="flex justify-center mb-8">
              <div className="glass rounded-full p-2 border border-white/10">
                <div className="flex items-center space-x-1">
                  <Globe className="text-[hsl(var(--k-pink))] mr-2" size={20} />
                  {(['ko', 'en', 'zh'] as Language[]).map((lang) => (
                    <Button
                      key={lang}
                      onClick={() => setCurrentLanguage(lang)}
                      variant={currentLanguage === lang ? "default" : "ghost"}
                      size="sm"
                      className={`rounded-full px-4 py-2 transition-all ${
                        currentLanguage === lang 
                          ? 'k-gradient-pink-purple text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {languageLabels[lang]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
              {getTitle()}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {getSubtitle()}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="max-w-4xl mx-auto space-y-4">
            {getCurrentFaqs().map((faq, index) => (
              <div 
                key={index}
                className="glass rounded-2xl overflow-hidden border border-white/10"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="text-[hsl(var(--k-pink))] flex-shrink-0" size={24} />
                  ) : (
                    <ChevronDown className="text-[hsl(var(--k-pink))] flex-shrink-0" size={24} />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
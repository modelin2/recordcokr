import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, Music, Video, Disc3, Headphones, Loader2, Check, AlertCircle, CheckCircle2 } from "lucide-react";

type Language = "ko" | "en" | "ja" | "zh";

const languageOptions = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
  { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
];

const t = {
  ko: {
    privatePage: "이 페이지는",
    private: "비공개",
    privateDesc: "입니다. 이 링크를 가진 분만 접속할 수 있습니다.",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "녹음 파일 다운로드",
    postProduction: "후반 작업 중입니다",
    postProductionSub: "약 3일 후 다운로드 가능합니다",
    fileReady: "파일 준비 완료",
    download: "다운로드",
    downloadWarning: "⚠ 다운로드 후 파일은 서버에서 삭제됩니다",
    downloadComplete: "다운로드 완료",
    downloadCompleteSub: "파일이 서버에서 삭제되었습니다",
    additionalServices: "추가 서비스 신청",
    soundCorrection: "음향 보정",
    videoService: "영상 서비스",
    albumRelease: "음원 발매",
    selected: "선택된 서비스",
    requestServices: "서비스 신청하기",
    requestSubmitted: "신청이 접수되었습니다!",
    requestSubmittedSub: "확인 후 연락드리겠습니다.",
    requestHistory: "신청 내역",
    pending: "대기중",
    completed: "완료",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "페이지를 찾을 수 없습니다",
    pageNotFoundSub: "유효하지 않은 링크입니다",
    alreadyProvided: "기본 제공됨",
    downloadToastTitle: "다운로드 완료",
    downloadToastDesc: "파일이 서버에서 삭제되었습니다.",
    errorToast: "오류가 발생했습니다.",
    requestToastTitle: "신청 완료",
    requestToastDesc: "추가 서비스 신청이 접수되었습니다.",
  },
  en: {
    privatePage: "This is a",
    private: "private",
    privateDesc: "page. Only accessible with this link.",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "Download Recording",
    postProduction: "Post-production in progress",
    postProductionSub: "Available in approx. 3 days",
    fileReady: "File Ready",
    download: "Download",
    downloadWarning: "⚠ File will be deleted from server after download",
    downloadComplete: "Download Complete",
    downloadCompleteSub: "File has been removed from server",
    additionalServices: "Additional Services",
    soundCorrection: "Sound Correction",
    videoService: "Video Service",
    albumRelease: "Album Release",
    selected: "Selected",
    requestServices: "Request Services",
    requestSubmitted: "Request Submitted!",
    requestSubmittedSub: "We will contact you after review.",
    requestHistory: "Request History",
    pending: "Pending",
    completed: "Completed",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "Page not found",
    pageNotFoundSub: "Invalid link",
    alreadyProvided: "Included",
    downloadToastTitle: "Download Complete",
    downloadToastDesc: "File has been removed from server.",
    errorToast: "An error occurred.",
    requestToastTitle: "Request Submitted",
    requestToastDesc: "Your service request has been submitted.",
  },
  ja: {
    privatePage: "このページは",
    private: "非公開",
    privateDesc: "です。このリンクをお持ちの方のみアクセスできます。",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "録音ファイルダウンロード",
    postProduction: "後処理中です",
    postProductionSub: "約3日後にダウンロード可能です",
    fileReady: "ファイル準備完了",
    download: "ダウンロード",
    downloadWarning: "⚠ ダウンロード後、ファイルはサーバーから削除されます",
    downloadComplete: "ダウンロード完了",
    downloadCompleteSub: "ファイルはサーバーから削除されました",
    additionalServices: "追加サービス申請",
    soundCorrection: "サウンド補正",
    videoService: "映像サービス",
    albumRelease: "アルバムリリース",
    selected: "選択済み",
    requestServices: "サービスを申請する",
    requestSubmitted: "申請が受け付けられました！",
    requestSubmittedSub: "確認後ご連絡いたします。",
    requestHistory: "申請履歴",
    pending: "待機中",
    completed: "完了",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "ページが見つかりません",
    pageNotFoundSub: "無効なリンクです",
    alreadyProvided: "基本提供",
    downloadToastTitle: "ダウンロード完了",
    downloadToastDesc: "ファイルはサーバーから削除されました。",
    errorToast: "エラーが発生しました。",
    requestToastTitle: "申請完了",
    requestToastDesc: "追加サービスの申請が受け付けられました。",
  },
  zh: {
    privatePage: "此页面是",
    private: "私密",
    privateDesc: "的。只有拥有此链接的人才能访问。",
    nftKeyring: "NFT Digital Keyring",
    downloadTitle: "下载录音文件",
    postProduction: "后期制作中",
    postProductionSub: "约3天后可下载",
    fileReady: "文件准备完成",
    download: "下载",
    downloadWarning: "⚠ 下载后文件将从服务器删除",
    downloadComplete: "下载完成",
    downloadCompleteSub: "文件已从服务器删除",
    additionalServices: "附加服务申请",
    soundCorrection: "音频修正",
    videoService: "视频服务",
    albumRelease: "专辑发行",
    selected: "已选择",
    requestServices: "申请服务",
    requestSubmitted: "申请已提交！",
    requestSubmittedSub: "审核后我们会联系您。",
    requestHistory: "申请记录",
    pending: "待处理",
    completed: "已完成",
    copyright: "© Recording Café. All rights reserved.",
    pageNotFound: "未找到页面",
    pageNotFoundSub: "无效链接",
    alreadyProvided: "已包含",
    downloadToastTitle: "下载完成",
    downloadToastDesc: "文件已从服务器删除。",
    errorToast: "发生错误。",
    requestToastTitle: "申请完成",
    requestToastDesc: "附加服务申请已提交。",
  },
};

interface ServiceItem {
  id: string;
  name: Record<Language, string>;
  price: number;
  desc: Record<Language, string>;
  isFree?: boolean;
}

const services: Record<string, ServiceItem[]> = {
  mixing: [
    { id: "basic", name: { ko: "기본 (Basic)", en: "Basic Mixing", ja: "基本ミキシング", zh: "基本混音" }, price: 0, desc: { ko: "베스트 구간 편집 + 음량 조절 + 에코 효과 추가", en: "Best section editing + volume control + echo effects", ja: "ベスト区間編集 + 音量調整 + エコー効果追加", zh: "最佳片段编辑 + 音量调节 + 回声效果" }, isFree: true },
    { id: "ai", name: { ko: "기본 + AI 보정", en: "Basic + AI Correction", ja: "基本 + AI補正", zh: "基本 + AI修正" }, price: 20000, desc: { ko: "틀린 음정을 AI로 자동 수정", en: "Auto-correct pitch with AI", ja: "音程をAIで自動修正", zh: "AI自动修正音准" } },
    { id: "engineer", name: { ko: "기본 + 전문가 보정", en: "Basic + Expert Correction", ja: "基本 + 専門家補正", zh: "基本 + 专家修正" }, price: 100000, desc: { ko: "틀린 음정을 전문가가 수작업으로 수정", en: "Expert manual pitch correction", ja: "専門家が手作業で音程を修正", zh: "专家手动修正音准" } },
  ],
  video: [
    { id: "self", name: { ko: "셀프 촬영", en: "Self Recording", ja: "セルフ撮影", zh: "自拍录制" }, price: 0, desc: { ko: "셀피용 스탠드 제공", en: "Selfie stand provided", ja: "セルフィースタンド提供", zh: "提供自拍支架" }, isFree: true },
    { id: "cameraman", name: { ko: "셀프 + 촬영기사", en: "Self + Cameraman", ja: "セルフ + カメラマン", zh: "自拍 + 摄影师" }, price: 20000, desc: { ko: "DSLR카메라로 촬영 (원본 파일 제공)", en: "DSLR filming (raw files provided)", ja: "DSLRカメラで撮影（原本ファイル提供）", zh: "DSLR拍摄（提供原始文件）" } },
    { id: "full", name: { ko: "셀프 + 촬영기사 + 편집", en: "Self + Cameraman + Editing", ja: "セルフ + カメラマン + 編集", zh: "自拍 + 摄影师 + 编辑" }, price: 100000, desc: { ko: "뮤직비디오 완성", en: "Complete music video", ja: "ミュージックビデオ完成", zh: "完成MV制作" } },
  ],
  release: [
    { id: "standard", name: { ko: "앨범 발매", en: "Album Release", ja: "アルバムリリース", zh: "专辑发行" }, price: 200000, desc: { ko: "전세계 음원 사이트에 발매 (반주 제작 + 앨범 자켓 + 저작권료)", en: "Release on all streaming platforms worldwide", ja: "全世界の音楽サイトでリリース", zh: "在全球音乐平台发行" } },
    { id: "pro", name: { ko: "전문가 앨범 발매", en: "Pro Album Release", ja: "プロアルバムリリース", zh: "专业专辑发行" }, price: 500000, desc: { ko: "전문 발매 서비스 (맞춤 반주 + 앨범 자켓 + 수정 2회)", en: "Professional release with custom production", ja: "プロリリースサービス（カスタム伴奏 + アルバムジャケット + 修正2回）", zh: "专业发行服务（定制伴奏 + 封面 + 2次修改）" } },
  ],
  lp: [
    { id: "lp", name: { ko: "LP 레코드 제작", en: "LP Record Production", ja: "LPレコード制作", zh: "LP唱片制作" }, price: 300000, desc: { ko: "물리적 레코드판 제작 후 배송", en: "Physical vinyl record, delivered to your address", ja: "フィジカルレコード制作後配送", zh: "制作实体唱片并邮寄" } },
  ],
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString()}`;
}

export default function NftPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const tx = t[lang];

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["/api/nft", token],
    queryFn: () => fetch(`/api/nft/${token}`).then(r => {
      if (!r.ok) throw new Error("Page not found");
      return r.json();
    }),
    enabled: !!token,
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nft/${token}/download`);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = page?.audioFileName || "recording.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nft", token] });
      toast({ title: tx.downloadToastTitle, description: tx.downloadToastDesc });
    },
    onError: () => {
      toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (serviceIds: string[]) => {
      const serviceDetails = serviceIds.map(id => {
        for (const category of Object.values(services)) {
          const found = category.find(s => s.id === id);
          if (found) return { id: found.id, name: found.name.ko, nameEn: found.name.en, price: found.price };
        }
        return null;
      }).filter(Boolean);

      const res = await apiRequest("POST", `/api/nft/${token}/request-service`, { services: serviceDetails });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setSelectedServices([]);
      queryClient.invalidateQueries({ queryKey: ["/api/nft", token] });
      toast({ title: tx.requestToastTitle, description: tx.requestToastDesc });
    },
    onError: () => {
      toast({ title: "Error", description: tx.errorToast, variant: "destructive" });
    },
  });

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">{tx.pageNotFound}</h1>
          <p className="text-gray-400">{tx.pageNotFoundSub}</p>
        </div>
      </div>
    );
  }

  const existingRequests = page.serviceRequests ? JSON.parse(page.serviceRequests) : [];
  const totalSelected = selectedServices.reduce((sum, id) => {
    for (const category of Object.values(services)) {
      const found = category.find(s => s.id === id);
      if (found) return sum + found.price;
    }
    return sum;
  }, 0);

  const renderServiceItem = (s: ServiceItem) => {
    if (s.isFree) {
      return (
        <div
          key={s.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-green-800/40 bg-green-900/10"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{s.name[lang]}</span>
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">{tx.alreadyProvided}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{s.desc[lang]}</p>
          </div>
        </div>
      );
    }

    return (
      <label
        key={s.id}
        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
          selectedServices.includes(s.id)
            ? "border-yellow-500/50 bg-yellow-500/5"
            : "border-gray-800 hover:border-gray-700"
        }`}
      >
        <input
          type="checkbox"
          checked={selectedServices.includes(s.id)}
          onChange={() => toggleService(s.id)}
          className="mt-1 accent-yellow-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{s.name[lang]}</span>
            <span className="text-yellow-500 text-sm font-bold">{formatPrice(s.price)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{s.desc[lang]}</p>
        </div>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-2 mb-6">
          {languageOptions.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === l.code
                  ? "bg-yellow-600 text-black"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 bg-gray-900/80 border border-gray-800 rounded-lg px-4 py-3">
          <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            {tx.privatePage} <span className="text-yellow-500 font-semibold">{tx.private}</span> {tx.privateDesc}
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-700/30 rounded-full px-4 py-1 mb-4">
            <span className="text-yellow-500 text-xs font-bold tracking-widest uppercase">{tx.nftKeyring}</span>
          </div>
          <h1 className="text-3xl font-black mb-1">
            {page.customerName}
            {page.koreanName && <span className="text-gray-400 text-xl ml-2">({page.koreanName})</span>}
          </h1>
          <p className="text-gray-500 text-sm">{page.recordingDate}</p>
        </div>

        {page.albumCoverImage && (
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/10 border border-gray-800">
              <img
                src={page.albumCoverImage}
                alt="Album Cover"
                className="w-full"
              />
            </div>
          </div>
        )}

        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Download className="w-5 h-5 text-yellow-500" />
              {tx.downloadTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {page.audioStatus === "pending" && (
              <div className="text-center py-6">
                <Loader2 className="w-10 h-10 mx-auto mb-3 text-gray-600 animate-pulse" />
                <p className="text-gray-400 font-medium">{tx.postProduction}</p>
                <p className="text-gray-600 text-xs mt-2">{tx.postProductionSub}</p>
              </div>
            )}
            {page.audioStatus === "ready" && page.hasAudioFile && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-sm font-medium">{tx.fileReady}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{page.audioFileName}</p>
                <Button
                  onClick={() => downloadMutation.mutate()}
                  disabled={downloadMutation.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-8"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {tx.download}
                </Button>
                <p className="text-red-400/60 text-xs mt-3">{tx.downloadWarning}</p>
              </div>
            )}
            {page.audioStatus === "downloaded" && (
              <div className="text-center py-6">
                <Check className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">{tx.downloadComplete}</p>
                <p className="text-gray-600 text-sm mt-1">{tx.downloadCompleteSub}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Music className="w-5 h-5 text-yellow-500" />
              {tx.additionalServices}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Headphones className="w-4 h-4" /> {tx.soundCorrection}
              </h3>
              <div className="space-y-2">
                {services.mixing.map(s => renderServiceItem(s))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Video className="w-4 h-4" /> {tx.videoService}
              </h3>
              <div className="space-y-2">
                {services.video.map(s => renderServiceItem(s))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Disc3 className="w-4 h-4" /> {tx.albumRelease}
              </h3>
              <div className="space-y-2">
                {services.release.map(s => renderServiceItem(s))}
                {services.lp.map(s => renderServiceItem(s))}
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">{tx.selected}</span>
                  <span className="text-lg font-black text-yellow-500">{formatPrice(totalSelected)}</span>
                </div>
                <Button
                  onClick={() => requestMutation.mutate(selectedServices)}
                  disabled={requestMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black font-bold py-3"
                >
                  {requestMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Music className="w-4 h-4 mr-2" />
                  )}
                  {tx.requestServices}
                </Button>
              </div>
            )}

            {submitted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <Check className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-green-400 text-sm font-medium">{tx.requestSubmitted}</p>
                <p className="text-gray-500 text-xs mt-1">{tx.requestSubmittedSub}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {existingRequests.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">{tx.requestHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {existingRequests.map((req: any, i: number) => (
                  <div key={i} className="border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(req.requestedAt).toLocaleDateString("ko-KR")}
                      </span>
                      <Badge variant={req.status === "pending" ? "secondary" : req.status === "completed" ? "default" : "outline"}>
                        {req.status === "pending" ? tx.pending : req.status === "completed" ? tx.completed : req.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {req.services?.map((s: any, j: number) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{s.name || s.nameEn}</span>
                          <span className="text-yellow-500 text-xs">{formatPrice(s.price || 0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-gray-700 text-xs mt-12 pb-8">
          <p>{tx.copyright}</p>
        </div>
      </div>
    </div>
  );
}

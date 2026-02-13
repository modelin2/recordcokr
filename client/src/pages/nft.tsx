import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, Music, Video, Disc3, Headphones, Loader2, Check, AlertCircle } from "lucide-react";

const services = {
  mixing: [
    { id: "basic", name: "기본 (Basic)", nameEn: "Basic Mixing", price: 0, desc: "베스트 구간 편집 + 음량 조절 + 에코 효과 추가", descEn: "Best section editing + volume control + echo effects" },
    { id: "ai", name: "기본 + AI 보정", nameEn: "Basic + AI Correction", price: 20000, desc: "틀린 음정을 AI로 자동 수정", descEn: "Auto-correct pitch with AI" },
    { id: "engineer", name: "기본 + 전문가 보정", nameEn: "Basic + Expert Correction", price: 100000, desc: "틀린 음정을 전문가가 수작업으로 수정", descEn: "Expert manual pitch correction" },
  ],
  video: [
    { id: "self", name: "셀프 촬영", nameEn: "Self Recording", price: 0, desc: "셀피용 스탠드 제공", descEn: "Selfie stand provided" },
    { id: "cameraman", name: "셀프 + 촬영기사", nameEn: "Self + Cameraman", price: 20000, desc: "DSLR카메라로 촬영 (원본 파일 제공)", descEn: "DSLR filming (raw files provided)" },
    { id: "full", name: "셀프 + 촬영기사 + 편집", nameEn: "Self + Cameraman + Editing", price: 100000, desc: "뮤직비디오 완성", descEn: "Complete music video" },
  ],
  release: [
    { id: "standard", name: "앨범 발매", nameEn: "Album Release", price: 200000, desc: "전세계 음원 사이트에 발매 (반주 제작 + 앨범 자켓 + 저작권료)", descEn: "Release on all streaming platforms worldwide" },
    { id: "pro", name: "전문가 앨범 발매", nameEn: "Pro Album Release", price: 500000, desc: "전문 발매 서비스 (맞춤 반주 + 앨범 자켓 + 수정 2회)", descEn: "Professional release with custom production" },
  ],
  lp: [
    { id: "lp", name: "LP 레코드 제작", nameEn: "LP Record Production", price: 300000, desc: "물리적 레코드판 제작 후 배송", descEn: "Physical vinyl record, delivered to your address" },
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
      toast({ title: "다운로드 완료 | Download Complete", description: "파일이 서버에서 삭제되었습니다. | File has been removed from server." });
    },
    onError: () => {
      toast({ title: "Error", description: "다운로드에 실패했습니다.", variant: "destructive" });
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (serviceIds: string[]) => {
      const serviceDetails = serviceIds.map(id => {
        for (const category of Object.values(services)) {
          const found = category.find(s => s.id === id);
          if (found) return { id: found.id, name: found.name, nameEn: found.nameEn, price: found.price };
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
      toast({ title: "신청 완료 | Request Submitted", description: "추가 서비스 신청이 접수되었습니다." });
    },
    onError: () => {
      toast({ title: "Error", description: "신청에 실패했습니다.", variant: "destructive" });
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
          <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-400">Page not found</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 bg-gray-900/80 border border-gray-800 rounded-lg px-4 py-3">
          <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            이 페이지는 <span className="text-yellow-500 font-semibold">비공개</span>입니다. 이 링크를 가진 분만 접속할 수 있습니다.
            <br />
            <span className="text-gray-500">This is a <span className="text-yellow-500">private</span> page. Only accessible with this link.</span>
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-700/30 rounded-full px-4 py-1 mb-4">
            <span className="text-yellow-500 text-xs font-bold tracking-widest uppercase">NFT Digital Keyring</span>
          </div>
          <h1 className="text-3xl font-black mb-1">
            {page.customerName}
            {page.koreanName && <span className="text-gray-400 text-xl ml-2">({page.koreanName})</span>}
          </h1>
          <p className="text-gray-500 text-sm">{page.recordingDate || "Recording Café"}</p>
        </div>

        {page.albumCoverImage && (
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/10 border border-gray-800">
              <img
                src={page.albumCoverImage}
                alt="Album Cover"
                className="w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Album Cover</p>
              </div>
            </div>
          </div>
        )}

        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-500" />
              녹음 파일 다운로드 | Download Recording
            </CardTitle>
          </CardHeader>
          <CardContent>
            {page.audioStatus === "pending" && (
              <div className="text-center py-6">
                <Loader2 className="w-10 h-10 mx-auto mb-3 text-gray-600 animate-pulse" />
                <p className="text-gray-400 font-medium">후반 작업 중입니다</p>
                <p className="text-gray-600 text-sm mt-1">Post-production in progress</p>
                <p className="text-gray-600 text-xs mt-2">약 3일 후 다운로드 가능합니다 | Available in approx. 3 days</p>
              </div>
            )}
            {page.audioStatus === "ready" && page.hasAudioFile && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-sm font-medium">파일 준비 완료 | File Ready</span>
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
                  다운로드 | Download
                </Button>
                <p className="text-red-400/60 text-xs mt-3">⚠ 다운로드 후 파일은 서버에서 삭제됩니다 | File will be deleted after download</p>
              </div>
            )}
            {page.audioStatus === "downloaded" && (
              <div className="text-center py-6">
                <Check className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">다운로드 완료</p>
                <p className="text-gray-600 text-sm mt-1">Download completed — file has been removed from server</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Music className="w-5 h-5 text-yellow-500" />
              추가 서비스 신청 | Additional Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Headphones className="w-4 h-4" /> 음향 보정 | Sound Correction
              </h3>
              <div className="space-y-2">
                {services.mixing.map(s => (
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
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-yellow-500 text-sm font-bold">{s.price === 0 ? "FREE" : formatPrice(s.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      <p className="text-xs text-gray-600">{s.descEn}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Video className="w-4 h-4" /> 영상 서비스 | Video Service
              </h3>
              <div className="space-y-2">
                {services.video.map(s => (
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
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-yellow-500 text-sm font-bold">{s.price === 0 ? "FREE" : formatPrice(s.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      <p className="text-xs text-gray-600">{s.descEn}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
                <Disc3 className="w-4 h-4" /> 음원 발매 | Album Release
              </h3>
              <div className="space-y-2">
                {services.release.map(s => (
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
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-yellow-500 text-sm font-bold">{formatPrice(s.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      <p className="text-xs text-gray-600">{s.descEn}</p>
                    </div>
                  </label>
                ))}
                {services.lp.map(s => (
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
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-yellow-500 text-sm font-bold">{formatPrice(s.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      <p className="text-xs text-gray-600">{s.descEn}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">선택된 서비스 | Selected</span>
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
                  서비스 신청하기 | Request Services
                </Button>
              </div>
            )}

            {submitted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <Check className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-green-400 text-sm font-medium">신청이 접수되었습니다!</p>
                <p className="text-gray-500 text-xs mt-1">Your request has been submitted.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {existingRequests.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">신청 내역 | Request History</CardTitle>
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
                        {req.status === "pending" ? "대기중" : req.status === "completed" ? "완료" : req.status}
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
          <p>Recording Café · Seoul, Sinsa-dong</p>
          <p className="mt-1">© Recording Café. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

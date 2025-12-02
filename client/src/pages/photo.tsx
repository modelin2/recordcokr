import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Camera, Upload, Printer, Trash2, Check, ArrowLeft, Newspaper, Image, Wand2, Loader2, Sparkles } from "lucide-react";
import type { VisitorPhoto } from "@shared/schema";
import NewspaperTemplate from "@/components/newspaper-template";

interface CustomerInfo {
  id: number;
  name: string;
  bookingDate: string | null;
  bookingTime: string | null;
  selectedDrink: string | null;
  drinkTemperature: string | null;
  createdAt: Date;
}

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

export default function PhotoPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [koreanName, setKoreanName] = useState<string>("");
  const [selectedDrink, setSelectedDrink] = useState<string>("");
  const [drinkTemperature, setDrinkTemperature] = useState<string>("");
  const [customHeadline, setCustomHeadline] = useState<string>("");
  const [previewPhoto, setPreviewPhoto] = useState<VisitorPhoto | null>(null);
  const [previewKoreanName, setPreviewKoreanName] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<LifeStageImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStage, setGeneratingStage] = useState<string>("");

  const { data: user, isLoading: userLoading } = useQuery<{ id: number; username: string; role: string }>({
    queryKey: ["/api/auth/user"],
  });

  const { data: customers = [] } = useQuery<CustomerInfo[]>({
    queryKey: ["/api/photos/customers/list"],
    enabled: !!user,
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery<VisitorPhoto[]>({
    queryKey: ["/api/photos"],
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { customerName: string; photoData: string; headline?: string }) => {
      return apiRequest("POST", "/api/photos", data);
    },
    onSuccess: () => {
      toast({
        title: "사진 업로드 완료",
        description: "사진이 성공적으로 업로드되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setSelectedPhoto(null);
      setSelectedCustomerName("");
      setCustomHeadline("");
    },
    onError: (error: any) => {
      toast({
        title: "업로드 실패",
        description: error.message || "사진 업로드에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/photos/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "삭제 완료",
        description: "사진이 삭제되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
    },
    onError: (error: any) => {
      toast({
        title: "삭제 실패",
        description: error.message || "사진 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const markPrintedMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/photos/${id}/print`, { isPrinted: true });
    },
    onSuccess: () => {
      toast({
        title: "출력 완료",
        description: "출력 상태가 업데이트되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "10MB 이하의 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedPhoto || !selectedCustomerName) {
      toast({
        title: "정보 입력 필요",
        description: "사진과 고객 이름을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      customerName: selectedCustomerName,
      photoData: selectedPhoto,
      headline: customHeadline || undefined,
    });
  };

  const handlePrint = (photo: VisitorPhoto) => {
    setPreviewPhoto(photo);
    setTimeout(() => {
      window.print();
      markPrintedMutation.mutate(photo.id);
    }, 500);
  };

  const handleGenerateAllImages = async () => {
    if (!selectedPhoto) {
      toast({
        title: "사진 필요",
        description: "AI 이미지 생성을 위해 먼저 사진을 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingStage("all");
    setGeneratedImages([]);

    try {
      const response = await apiRequest("POST", "/api/photos/generate-all-stages", {
        sourceImageBase64: selectedPhoto
      });
      
      const data = await response.json();
      
      if (data.success && data.results) {
        setGeneratedImages(data.results);
        toast({
          title: "AI 이미지 생성 완료",
          description: `${data.results.filter((r: LifeStageImage) => r.success).length}개의 성장단계별 이미지가 생성되었습니다.`,
        });
      } else {
        throw new Error(data.message || "이미지 생성 실패");
      }
    } catch (error: any) {
      toast({
        title: "AI 이미지 생성 실패",
        description: error.message || "이미지 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGeneratingStage("");
    }
  };

  const handleGenerateSingleImage = async (stage: string) => {
    if (!selectedPhoto) {
      toast({
        title: "사진 필요",
        description: "AI 이미지 생성을 위해 먼저 사진을 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingStage(stage);

    try {
      const response = await apiRequest("POST", "/api/photos/generate-ai", {
        sourceImageBase64: selectedPhoto,
        lifeStage: stage
      });
      
      const data = await response.json();
      
      if (data.success && data.imageData) {
        setGeneratedImages(prev => {
          const filtered = prev.filter(img => img.lifeStage !== stage);
          return [...filtered, {
            lifeStage: data.lifeStage,
            stageName: data.stageName,
            stageNameKr: data.stageNameKr,
            ageRange: data.ageRange,
            imageData: data.imageData,
            prompt: data.prompt,
            success: true
          }];
        });
        toast({
          title: `${data.stageNameKr} 이미지 생성 완료`,
        });
      } else {
        throw new Error(data.message || "이미지 생성 실패");
      }
    } catch (error: any) {
      toast({
        title: "AI 이미지 생성 실패",
        description: error.message || "이미지 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setGeneratingStage("");
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
          <p className="mt-4 text-amber-900">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e1]">
        <Card className="w-full max-w-md bg-[#d4c4a8] border-amber-800">
          <CardHeader>
            <CardTitle className="text-amber-900 text-center">접근 제한</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-amber-800 mb-4">관리자만 접근 가능합니다.</p>
            <Button onClick={() => setLocation("/admin")} className="bg-amber-800 hover:bg-amber-900">
              관리자 로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lifeStageButtons = [
    { stage: "infancy", name: "유아기", age: "0-2세", color: "bg-pink-500 hover:bg-pink-600" },
    { stage: "kindergarten", name: "유치원", age: "5-6세", color: "bg-amber-500 hover:bg-amber-600" },
    { stage: "elementary", name: "초등학교", age: "10-11세", color: "bg-green-500 hover:bg-green-600" },
    { stage: "middleschool", name: "중학교", age: "14-15세", color: "bg-blue-500 hover:bg-blue-600" },
  ];

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {previewPhoto && (
        <div id="print-area" className="hidden print:block">
          <NewspaperTemplate 
            customerName={previewPhoto.customerName}
            koreanName={previewKoreanName || undefined}
            photoData={previewPhoto.photoData}
            headline={previewPhoto.headline || undefined}
            drinkName={selectedDrink || undefined}
            drinkTemperature={drinkTemperature || undefined}
            lifeStageImages={generatedImages}
          />
        </div>
      )}

      <div className="min-h-screen bg-[#f5f0e1] print:hidden">
        <div className="bg-amber-800 text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin")}
                className="text-white hover:bg-amber-700"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                관리자 페이지로
              </Button>
              <div className="flex items-center gap-2">
                <Newspaper className="w-6 h-6" />
                <h1 className="text-xl font-bold">기념 사진 출력</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span className="text-sm">Recording Cafe</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-[#d4c4a8] border-amber-700 shadow-xl">
              <CardHeader className="bg-amber-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  사진 업로드
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-amber-900 font-medium">사진 선택</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    data-testid="input-photo-file"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 border-2 border-dashed border-amber-700 rounded-lg p-8 text-center cursor-pointer hover:bg-amber-100 transition-colors"
                    data-testid="button-select-photo"
                  >
                    {selectedPhoto ? (
                      <img
                        src={selectedPhoto}
                        alt="선택된 사진"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                        data-testid="img-preview"
                      />
                    ) : (
                      <div className="text-amber-700">
                        <Image className="w-12 h-12 mx-auto mb-2" />
                        <p>클릭하여 사진 선택</p>
                        <p className="text-sm text-amber-600">또는 파일을 여기에 드롭</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-amber-900 font-medium">고객 이름 선택</Label>
                  <Select 
                    value={selectedCustomerName} 
                    onValueChange={(name) => {
                      setSelectedCustomerName(name);
                      const customer = customers.find(c => c.name === name);
                      if (customer) {
                        setSelectedDrink(customer.selectedDrink || "");
                        setDrinkTemperature(customer.drinkTemperature || "");
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2 bg-white border-amber-600" data-testid="select-customer">
                      <SelectValue placeholder="예약자 이름 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name} {customer.bookingDate && `(${customer.bookingDate})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-amber-900 font-medium">직접 이름 입력 (선택)</Label>
                  <Input
                    type="text"
                    placeholder="예약자 목록에 없으면 직접 입력"
                    value={selectedCustomerName}
                    onChange={(e) => setSelectedCustomerName(e.target.value)}
                    className="mt-2 bg-white border-amber-600"
                    data-testid="input-customer-name"
                  />
                </div>

                <div>
                  <Label className="text-amber-900 font-medium">한국어 이름 (영어 이름일 경우)</Label>
                  <Input
                    type="text"
                    placeholder="예: John → 존"
                    value={koreanName}
                    onChange={(e) => setKoreanName(e.target.value)}
                    className="mt-2 bg-white border-amber-600"
                    data-testid="input-korean-name"
                  />
                </div>

                <div>
                  <Label className="text-amber-900 font-medium">헤드라인 (선택)</Label>
                  <Input
                    type="text"
                    placeholder="예: Recording Cafe에서의 특별한 순간"
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    className="mt-2 bg-white border-amber-600"
                    data-testid="input-headline"
                  />
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedPhoto || !selectedCustomerName || uploadMutation.isPending}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                  data-testid="button-upload"
                >
                  {uploadMutation.isPending ? (
                    "업로드 중..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      사진 업로드
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Life Stage Image Generation Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-amber-50 border-pink-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI 성장앨범 이미지 생성
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center p-4 bg-white/50 rounded-lg border border-pink-200">
                  {selectedPhoto ? (
                    <div className="space-y-2">
                      <img 
                        src={selectedPhoto} 
                        alt="선택된 사진" 
                        className="max-h-32 mx-auto rounded-lg shadow"
                      />
                      <p className="text-sm text-pink-700 font-medium">
                        이 얼굴로 어린 시절 모습을 생성합니다
                      </p>
                    </div>
                  ) : (
                    <div className="text-pink-600">
                      <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">왼쪽에서 먼저 사진을 선택해주세요</p>
                      <p className="text-xs text-pink-500 mt-1">AI가 유아기부터 중학교까지 성장앨범을 만들어드립니다</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerateAllImages}
                  disabled={isGenerating || !selectedPhoto}
                  className="w-full bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white"
                  data-testid="button-generate-all"
                >
                  {isGenerating && generatingStage === "all" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      성장앨범 생성 중... (약 1분 소요)
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      전체 성장단계 이미지 생성 (4장)
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  {lifeStageButtons.map((btn) => (
                    <Button
                      key={btn.stage}
                      onClick={() => handleGenerateSingleImage(btn.stage)}
                      disabled={isGenerating || !selectedPhoto}
                      className={`${btn.color} text-white text-sm flex flex-col py-2 h-auto`}
                      data-testid={`button-generate-${btn.stage}`}
                    >
                      <div className="flex items-center">
                        {generatingStage === btn.stage ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-1" />
                        )}
                        {btn.name}
                      </div>
                      <span className="text-xs opacity-80">{btn.age}</span>
                    </Button>
                  ))}
                </div>

                {generatedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {generatedImages.map((img) => (
                      <div key={img.lifeStage} className="relative">
                        {img.imageData ? (
                          <div className="space-y-1">
                            <img
                              src={img.imageData}
                              alt={img.stageNameKr}
                              className="w-full aspect-[3/4] object-cover rounded-lg shadow-md border-4 border-white"
                              style={{ filter: 'sepia(0.1)' }}
                            />
                            <p className="text-xs text-center font-medium text-amber-800">
                              {img.stageNameKr} ({img.ageRange})
                            </p>
                          </div>
                        ) : (
                          <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center border-4 border-white">
                            <p className="text-xs text-gray-500 text-center p-2">
                              {img.error || "생성 실패"}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Photo List */}
          <Card className="mt-8 bg-[#d4c4a8] border-amber-700 shadow-xl">
            <CardHeader className="bg-amber-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                업로드된 사진 목록
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {photosLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto"></div>
                  <p className="mt-2 text-amber-700">로딩 중...</p>
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-8 text-amber-700">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>업로드된 사진이 없습니다.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex items-center gap-4 p-4 bg-[#e8dcc8] rounded-lg border border-amber-600"
                      data-testid={`photo-item-${photo.id}`}
                    >
                      <img
                        src={photo.photoData}
                        alt={photo.customerName}
                        className="w-20 h-20 object-cover rounded-lg shadow"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-900">{photo.customerName}</h3>
                        {photo.headline && (
                          <p className="text-sm text-amber-700">{photo.headline}</p>
                        )}
                        <p className="text-xs text-amber-600">
                          {new Date(photo.createdAt!).toLocaleDateString("ko-KR")}
                        </p>
                        {photo.isPrinted && (
                          <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            출력 완료
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePrint(photo)}
                          className="bg-amber-700 hover:bg-amber-800"
                          data-testid={`button-print-${photo.id}`}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(photo.id)}
                          data-testid={`button-delete-${photo.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="mt-8 bg-[#d4c4a8] border-amber-700 shadow-xl">
            <CardHeader className="bg-amber-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                미리보기
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedPhoto && selectedCustomerName ? (
                <div className="max-w-4xl mx-auto">
                  <NewspaperTemplate
                    customerName={selectedCustomerName}
                    koreanName={koreanName || undefined}
                    photoData={selectedPhoto}
                    headline={customHeadline || undefined}
                    drinkName={selectedDrink || undefined}
                    drinkTemperature={drinkTemperature || undefined}
                    lifeStageImages={generatedImages}
                  />
                  <div className="mt-6 flex justify-center gap-4">
                    <Button
                      onClick={() => {
                        setPreviewPhoto({
                          id: 0,
                          customerName: selectedCustomerName,
                          photoData: selectedPhoto,
                          headline: customHeadline || null,
                          isPrinted: false,
                          createdAt: new Date(),
                        });
                        setPreviewKoreanName(koreanName);
                        setTimeout(() => {
                          window.print();
                        }, 500);
                      }}
                      className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-lg"
                      data-testid="button-print-preview"
                    >
                      <Printer className="w-5 h-5 mr-2" />
                      미리보기 출력하기
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-amber-700">
                  <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>사진을 업로드하고 고객 이름을 선택하면</p>
                  <p>신문 스타일 미리보기가 표시됩니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

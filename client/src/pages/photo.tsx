import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Camera, Upload, Printer, Trash2, Check, ArrowLeft, Newspaper, Image, Wand2, Loader2, Sparkles } from "lucide-react";
import type { VisitorPhoto } from "@shared/schema";
import NewspaperTemplate, { type ImagePositions } from "@/components/newspaper-template";

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
  const searchString = useSearch();
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
  const [imagePositions, setImagePositions] = useState<ImagePositions>({
    main: { x: 50, y: 0, scale: 1 },
    infancy: { x: 50, y: 0, scale: 1 },
    middleschool: { x: 50, y: 0, scale: 1 },
    future: { x: 50, y: 50, scale: 1 },
  });

  const { data: user, isLoading: userLoading } = useQuery<{ id: number; username: string; role: string }>({
    queryKey: ["/api/auth/user"],
  });

  const { data: customers = [] } = useQuery<CustomerInfo[]>({
    queryKey: ["/api/photos/customers/list"],
    enabled: !!user,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const customerName = params.get("customer");
    if (customerName) {
      setSelectedCustomerName(customerName);
    }
  }, [searchString]);

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

  const compressImage = (file: File, maxWidth: number = 1024, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      try {
        toast({
          title: "이미지 처리 중...",
          description: "AI 생성을 위해 이미지를 최적화하고 있습니다.",
        });
        const compressedImage = await compressImage(file, 1024, 0.7);
        setSelectedPhoto(compressedImage);
        toast({
          title: "이미지 준비 완료",
          description: "이미지가 최적화되었습니다.",
        });
      } catch (error) {
        toast({
          title: "이미지 처리 실패",
          description: "이미지를 처리할 수 없습니다.",
          variant: "destructive",
        });
      }
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
    const originalTitle = document.title;
    document.title = photo.customerName;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      markPrintedMutation.mutate(photo.id);
    }, 500);
  };

  const compressBase64Image = (base64: string, maxWidth: number = 800, quality: number = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = base64;
    });
  };

  const compressUntilSmallEnough = async (base64Image: string, maxSizeKB: number = 2000): Promise<string> => {
    let currentImage = base64Image;
    let attempts = 0;
    const maxAttempts = 8;
    const compressionSteps = [
      { maxWidth: 1600, quality: 0.85 },
      { maxWidth: 1400, quality: 0.8 },
      { maxWidth: 1200, quality: 0.75 },
      { maxWidth: 1024, quality: 0.7 },
      { maxWidth: 900, quality: 0.65 },
      { maxWidth: 800, quality: 0.6 },
      { maxWidth: 700, quality: 0.55 },
      { maxWidth: 600, quality: 0.5 },
    ];

    while (attempts < maxAttempts) {
      const base64Size = (currentImage.length * 3) / 4;
      const sizeKB = Math.round(base64Size / 1024);
      
      if (base64Size <= maxSizeKB * 1024) {
        console.log(`Image compressed to ${sizeKB}KB after ${attempts} attempts`);
        return currentImage;
      }

      const step = compressionSteps[Math.min(attempts, compressionSteps.length - 1)];
      console.log(`Compressing image (attempt ${attempts + 1}): ${sizeKB}KB -> target ${maxSizeKB}KB, using ${step.maxWidth}px @ ${step.quality}`);
      
      currentImage = await compressBase64Image(currentImage, step.maxWidth, step.quality);
      attempts++;
    }

    const finalSize = Math.round((currentImage.length * 3) / 4 / 1024);
    console.log(`Final image size after max compression: ${finalSize}KB`);
    return currentImage;
  };

  const handleGenerateAllImages = async (personCount: number = 1) => {
    if (!selectedPhoto) {
      toast({
        title: "사진 필요",
        description: "AI 이미지 생성을 위해 먼저 사진을 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingStage(personCount === 2 ? "all-duo" : "all");
    setGeneratedImages([]);

    try {
      // Check if image needs compression (over 2MB)
      const base64Size = (selectedPhoto.length * 3) / 4;
      const sizeKB = Math.round(base64Size / 1024);
      
      let imageToSend = selectedPhoto;
      
      // Only compress if larger than 2MB to preserve quality for AI face recognition
      if (sizeKB > 2000) {
        toast({
          title: "이미지 최적화 중...",
          description: `원본 크기: ${sizeKB}KB - 고품질 압축을 진행합니다.`,
        });
        
        imageToSend = await compressUntilSmallEnough(selectedPhoto, 2000);
        const finalSizeKB = Math.round((imageToSend.length * 3) / 4 / 1024);
        
        toast({
          title: "이미지 준비 완료",
          description: `최적화된 크기: ${finalSizeKB}KB - AI 생성을 시작합니다.`,
        });
      } else {
        toast({
          title: "AI 이미지 생성 시작",
          description: `이미지 크기: ${sizeKB}KB (최적 품질)`,
        });
      }

      const response = await apiRequest("POST", "/api/photos/generate-all-stages", {
        sourceImageBase64: imageToSend,
        personCount
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
    { stage: "middleschool", name: "중학교", age: "14-15세", color: "bg-blue-500 hover:bg-blue-600" },
    { stage: "future", name: "미래", age: "한류 홍보대사", color: "bg-purple-500 hover:bg-purple-600" },
  ];

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A3 portrait;
            margin: 5mm;
          }
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
            max-width: 297mm;
          }
          .print-container {
            width: 100%;
            max-height: 410mm;
            page-break-inside: avoid;
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
            imagePositions={imagePositions}
            customerId={customers.find(c => c.name === previewPhoto.customerName)?.id}
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
                        유아기 → 중학교 → 미래 월드스타
                      </p>
                    </div>
                  ) : (
                    <div className="text-pink-600">
                      <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">왼쪽에서 먼저 사진을 선택해주세요</p>
                      <p className="text-xs text-pink-500 mt-1">AI가 유아기부터 미래 월드스타까지 성장앨범을 만들어드립니다</p>
                    </div>
                  )}
                </div>

                {/* 1인용 생성 버튼 */}
                <div className="space-y-2">
                  <p className="text-xs text-center text-pink-700 font-medium">1명 사진용</p>
                  <Button
                    onClick={() => handleGenerateAllImages(1)}
                    disabled={isGenerating || !selectedPhoto}
                    className="w-full bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white h-14"
                    data-testid="button-generate-solo"
                  >
                    {isGenerating && generatingStage === "all" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        1인 성장앨범 생성 중... (약 1분)
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center">
                          <Wand2 className="w-5 h-5 mr-2" />
                          1인 성장앨범 생성 (3장)
                        </div>
                        <span className="text-xs opacity-80">혼자 찍은 사진용</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* 2인용 생성 버튼 */}
                <div className="space-y-2">
                  <p className="text-xs text-center text-purple-700 font-medium">2명 사진용</p>
                  <Button
                    onClick={() => handleGenerateAllImages(2)}
                    disabled={isGenerating || !selectedPhoto}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-14"
                    data-testid="button-generate-duo"
                  >
                    {isGenerating && generatingStage === "all-duo" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        2인 성장앨범 생성 중... (약 1분)
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center">
                          <Wand2 className="w-5 h-5 mr-2" />
                          2인 성장앨범 생성 (3장)
                        </div>
                        <span className="text-xs opacity-80">두 명이 함께 찍은 사진용</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* 생성 단계 미리보기 */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-white/30 rounded-lg border border-pink-100">
                  {lifeStageButtons.map((btn) => (
                    <div key={btn.stage} className="text-center">
                      <div className={`${btn.color} text-white text-xs py-1 px-2 rounded-full`}>
                        {btn.name}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">{btn.age}</p>
                    </div>
                  ))}
                </div>

                {generatedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {generatedImages
                      .sort((a, b) => {
                        const order = ["infancy", "middleschool", "future"];
                        return order.indexOf(a.lifeStage) - order.indexOf(b.lifeStage);
                      })
                      .map((img) => (
                      <div key={img.lifeStage} className="relative">
                        {img.imageData ? (
                          <div className="space-y-1">
                            <img
                              src={img.imageData}
                              alt={img.stageNameKr}
                              className="w-full aspect-[3/4] object-cover rounded-lg shadow-md border-4 border-white"
                              style={{ filter: img.lifeStage === "infancy" ? 'sepia(0.3)' : img.lifeStage === "middleschool" ? 'sepia(0.1)' : 'none' }}
                            />
                            <p className="text-xs text-center font-medium text-amber-800">
                              {img.stageNameKr}
                            </p>
                            <p className="text-[10px] text-center text-gray-500">
                              {img.ageRange}
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
                    imagePositions={imagePositions}
                    onPositionChange={setImagePositions}
                    customerId={customers.find(c => c.name === selectedCustomerName)?.id}
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
                        const originalTitle = document.title;
                        document.title = selectedCustomerName;
                        setTimeout(() => {
                          window.print();
                          document.title = originalTitle;
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

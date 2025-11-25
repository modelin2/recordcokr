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
import { Camera, Upload, Printer, Trash2, Check, ArrowLeft, Newspaper, Image } from "lucide-react";
import type { VisitorPhoto } from "@shared/schema";
import NewspaperTemplate from "@/components/newspaper-template";

interface CustomerInfo {
  id: number;
  name: string;
  bookingDate: string | null;
  bookingTime: string | null;
  createdAt: Date;
}

export default function PhotoPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [customHeadline, setCustomHeadline] = useState<string>("");
  const [previewPhoto, setPreviewPhoto] = useState<VisitorPhoto | null>(null);

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
            photoData={previewPhoto.photoData}
            headline={previewPhoto.headline || undefined}
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
                  <Select value={selectedCustomerName} onValueChange={setSelectedCustomerName}>
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

            <Card className="bg-[#d4c4a8] border-amber-700 shadow-xl">
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
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
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
                        <div className="flex gap-2">
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
          </div>

          <Card className="mt-8 bg-[#d4c4a8] border-amber-700 shadow-xl">
            <CardHeader className="bg-amber-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                미리보기
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedPhoto && selectedCustomerName ? (
                <div className="max-w-2xl mx-auto">
                  <NewspaperTemplate
                    customerName={selectedCustomerName}
                    photoData={selectedPhoto}
                    headline={customHeadline || undefined}
                  />
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

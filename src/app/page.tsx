"use client"

import { toast } from "sonner";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { CalendarIcon, Loader2, Train, Clock, MapPin, Locate, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import liff from "@line/liff";
import { counties, stationsByCounty, StationInfo } from "@/lib/locationData" // 假設你的 tsconfig.json 有設定 @/ 指向 src/


export default function BookingPage() {
  const router = useRouter()
  const [originCounty, setOriginCounty] = useState<string>("")
  const [originStation, setOriginStation] = useState<string>("")
  const [destCounty, setDestCounty] = useState<string>("")
  const [destStation, setDestStation] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [bookNow, setBookNow] = useState<boolean>(true)
  const [autoTime, setAutoTime] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mockTrains, setMockTrains] = useState<any[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    train: any | null
  }>({
    open: false,
    train: null,
  })

  useEffect(() => {
    // 初始化 LIFF
    liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID!, // 請確認你的 .env.local 或環境變數已設定此值
      withLoginOnExternalBrowser: true, // 在外部瀏覽器中也要求登入
    })
      .then(async () => {
        if (liff.isLoggedIn()) {
          try {
            const profile = await liff.getProfile();
            toast.info(`你好，${profile.displayName}`);
            setUserId(profile.userId);
          } catch (error) {
            console.error("取得使用者資料失敗: ", error);
            toast.error('取得使用者資料失敗，請檢查控制台錯誤訊息');
          }
        } else {
          toast.warning('尚未登入 LINE');
          if (!liff.isInClient()) { // 只在外部瀏覽器中嘗試自動登入
            liff.login({ redirectUri: window.location.href }); // 登入後導回目前頁面
          }
        }
      })
      .catch((error) => {
        console.error("LIFF 初始化失敗: ", error);
        toast.error('LIFF 初始化失敗，請檢查 LIFF ID 或網路連線');
      });
  }, []);

  function getStationIDByName(county: string, name: string): string | undefined {
    const stations = stationsByCounty[county];
    if (!stations) return undefined;

    const station = stations.find(s => s.name === name);
    return station?.StationID;
  }

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是 0~11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const formatted = formatDate(autoTime);

  const handleSearch = async () => {
    setIsLoading(true)
    setSearchResults([]); // 開始查詢前先清空舊結果

    console.log(getStationIDByName(originCounty, originStation))
    console.log(getStationIDByName(destCounty, destStation))
    console.log(formatted)
    // API請求
    try {
      const response = await fetch("https://smart-train-backend.onrender.com/get_train_schedule", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: getStationIDByName(originCounty, originStation),
          end: getStationIDByName(destCounty, destStation),
          time: formatted,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API 錯誤回應:", errorData);
        throw new Error(errorData.detail || `查詢班次失敗: ${response.statusText}`);
      }

      const data = await response.json();

      function extractSimplifiedTrainInfo(data: any) {
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("提供的資料不是有效的陣列或陣列為空。");
          return [];
        }

        return data.map(trainEntry => {
          const arrivalTime = trainEntry?.DestinationStopTime?.ArrivalTime;
          const endingStationName = trainEntry?.DailyTrainInfo?.EndingStationName?.Zh_tw;
          const trainNo = trainEntry?.DailyTrainInfo?.TrainNo;

          return {
            arrivalTime: arrivalTime,
            endingStationName: endingStationName,
            trainNo: trainNo,
          };
        }).filter(entry => entry !== null); // 如果上面選擇回傳 null，則過濾掉
      }

      const simplifiedData = extractSimplifiedTrainInfo(data);
      console.log("簡化後的列車資訊:", simplifiedData);
      setSearchResults(simplifiedData);
    } catch (error: any) {
      console.error("查詢班次時發生錯誤:", error);
      toast.error(`查詢失敗: ${error.message}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBookTrain = (train: any) => {
    setConfirmDialog({
      open: true,
      train,
    })
  }

  const confirmBooking = () => {
    setIsLoading(true)
    // 在這裡可以處理實際的預約邏輯，例如發送請求到後端 API
    // 如果預約需要使用者資訊，可以從 LIFF profile 中取得

    // 模擬API請求
    setTimeout(() => {
      setConfirmDialog({ open: false, train: null })
      setIsLoading(false)
      toast.success(`已成功預約 ${confirmDialog.train?.trainNumber} 次列車停靠！`)
      router.push("/my-bookings") // 假設有一個我的預約頁面
    }, 1000)
  }

  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      timeOptions.push(`${formattedHour}:${formattedMinute}`)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="text-2xl font-bold text-center">預約停靠服務</CardHeader>
        <CardContent>
          <div className="space-y-4">

            <div className="mb-8">
              <h3 className="text-md font-medium">起站</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">縣市</label>
                  <Select
                    value={originCounty}
                    onValueChange={(value) => {
                      setOriginCounty(value)
                      setOriginStation("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">車站</label>
                  <Select value={originStation} onValueChange={setOriginStation} disabled={!originCounty}>
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇車站" />
                    </SelectTrigger>
                    <SelectContent>
                      {originCounty &&
                        stationsByCounty[originCounty]?.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="py-6">
                <hr />
              </div>

              <h3 className="text-md font-medium">迄站</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">縣市</label>
                  <Select
                    value={destCounty}
                    onValueChange={(value) => {
                      setDestCounty(value)
                      setDestStation("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">車站</label>
                  <Select value={destStation} onValueChange={setDestStation} disabled={!destCounty}>
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇車站" />
                    </SelectTrigger>
                    <SelectContent>
                      {destCounty &&
                        stationsByCounty[destCounty]?.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="book-now"
                checked={bookNow}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setBookNow(checked)
                    if (checked) { // 如果切換為現在預約，重置日期為今天
                      setAutoTime(new Date());
                    }
                  }
                }}
              />
              <label
                htmlFor="book-now"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                立即預約 (預設查詢今日班次)
              </label>
            </div>

            {!bookNow && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="date-picker" className="block text-sm font-medium mb-1">預約日期</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {autoTime ? format(autoTime, "yyyy年 MM月 dd日", { locale: zhTW }) : "選擇日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={autoTime}
                        onSelect={setAutoTime}
                        disabled={(day) => {
                          const today = new Date()
                          return autoTime ? autoTime < today : true
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label htmlFor="time-select" className="block text-sm font-medium mb-1">預約時間 (約)</label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger id="time-select">
                      <SelectValue placeholder="選擇時間" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-500"
              onClick={handleSearch}
              disabled={!originCounty || !originStation || !destCounty || !destStation || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  查詢中...
                </>
              ) : (
                "查詢可預約班次"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">可預約班次</h2>
            {searchResults === null || searchResults === undefined ? ( // 檢查 searchResults 是否為 null 或 undefined
              <p className="text-center text-muted-foreground py-8">尚未查詢</p>
            ) : searchResults.length === 0 ? ( // 如果 searchResults 已定義，再檢查其長度
              <p className="text-center text-muted-foreground py-8">抱歉，該時段查無符合條件的可預約班次</p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((train) => (
                  <Card key={train.trainNo} className="border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{train.trainNo} 次列車</div>
                          <div className="text-sm text-muted-foreground">預計抵達時間: {train.arrivalTime}</div>
                          <div className="text-sm text-muted-foreground">終點站: {train.endingStationName}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookTrain(train)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          預約此班次
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Dialog
            open={confirmDialog.open}
            onOpenChange={(open) => {
              if (!open) {
                setConfirmDialog({ open: false, train: null })
              }
            }}
          >
            <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
              {/* 頂部裝飾條 */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="p-6">
                <DialogHeader className="mb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold text-gray-800">確認預約</DialogTitle>
                    <X className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={() => setConfirmDialog({ open: false, train: null })} />
                  </div>
                  <DialogDescription className="text-gray-600 mt-1">
                    您確定要預約以下班次停靠嗎？
                  </DialogDescription>
                </DialogHeader>

                {confirmDialog.train && (
                  <div className="bg-blue-50 rounded-lg p-4 my-4 border-l-4 border-blue-500">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 flex items-center mb-1">
                        <Train className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-700">車次:</span>
                        <span className="ml-2 text-gray-900 font-bold">{confirmDialog.train.trainNumber}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-700">預計抵達:</span>
                        <span className="ml-2 text-gray-900">{confirmDialog.train.arrivalTime}</span>
                      </div>

                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-700">終點站:</span>
                        <span className="ml-2 text-gray-900">{confirmDialog.train.destination}</span>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <Locate className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-700">停靠車站:</span>
                        <span className="ml-2 text-gray-900">{originStation}</span>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDialog({ open: false, train: null })}
                    className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={confirmBooking}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        處理中...
                      </div>
                    ) : (
                      "確認預約"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
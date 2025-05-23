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

// 從 lib 匯入資料
import { counties, stationsByCounty, StationInfo } from "@/lib/locationData"

// 定義 API 回傳的班次資料結構 (前端使用)
interface TrainSchedule {
  trainDate: string;
  trainNumber: string;
  trainTypeName: string;
  originStationName: string;
  originStationID: string;
  destinationStationName: string; // 指的是查詢的迄站
  destinationStationID: string;   // 指的是查詢的迄站 ID
  departureTime: string; // 起站發車時間
  arrivalTime: string;   // 抵達查詢迄站的時間
  tripEndingStationName: string; // 該列車的最終終點站名稱
  // 可以保留原始 API 資料以供不時之需
  rawTrainData: any;
}


export default function BookingPage() {
  const router = useRouter()
  const [originCounty, setOriginCounty] = useState<string>("")
  const [originStation, setOriginStation] = useState<string>("") // 存車站名稱
  const [destCounty, setDestCounty] = useState<string>("")
  const [destStation, setDestStation] = useState<string>("")   // 存車站名稱
  const [userId, setUserId] = useState<string>("")
  const [bookNow, setBookNow] = useState<boolean>(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("12:00") // 這個時間主要用於使用者參考，API 以日期為主
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<TrainSchedule[] | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    train: TrainSchedule | null // 使用新的 TrainSchedule 介面
  }>({
    open: false,
    train: null,
  })

  useEffect(() => {
    liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
      withLoginOnExternalBrowser: true,
    })
      .then(async () => {
        if (liff.isLoggedIn()) {
          try {
            const profile = await liff.getProfile();
            toast.info(`已登入,你好，${profile.displayName}`);
            setUserId(profile.userId);
          } catch (error) {
            console.error("取得使用者資料失敗: ", error);
            toast.error('取得使用者資料失敗，請檢查控制台錯誤訊息');
          }
        } else {
          toast.warning('尚未登入 LINE');
          if (!liff.isInClient()) {
            liff.login({ redirectUri: window.location.href });
          }
        }
      })
      .catch((error) => {
        console.error("LIFF 初始化失敗: ", error);
        toast.error('LIFF 初始化失敗，請檢查 LIFF ID 或網路連線');
      });
  }, []);

  const getStationIDByName = (county: string, stationName: string): string | undefined => {
    const stationsInCounty = stationsByCounty[county];
    if (stationsInCounty) {
      const station = stationsInCounty.find(s => s.name === stationName);
      return station?.StationID;
    }
    return undefined;
  };

  const handleSearch = async () => {
    if (!originCounty || !originStation || !destCounty || !destStation) {
      toast.error("請選擇完整的起訖縣市與車站");
      return
    }
    if (!date && !bookNow) {
      toast.error("請選擇預約日期");
      return;
    }

    const originStationID = getStationIDByName(originCounty, originStation);
    const destStationID = getStationIDByName(destCounty, destStation);

    if (!originStationID || !destStationID) {
      toast.error("無法找到車站代碼，請確認車站選擇是否正確");
      return;
    }

    setIsLoading(true)
    setSearchResults(null);

    const searchDate = bookNow ? new Date() : date;
    if (!searchDate) {
      toast.error("日期無效");
      setIsLoading(false);
      return;
    }
    const formattedDate = format(searchDate, "yyyy-MM-dd");

    try {
      // 注意：確保您的後端服務器在 http://localhost:PORT (您的後端 port) 上運行
      // 並且處理了CORS，或者您在 next.config.js 中設定了 rewrites
      const response = await fetch(`/get_train_schedule`, { // 假設您的後端 API 路徑是 /get_train_schedule
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: originStationID,
          end: destStationID,
          time: formattedDate, // API 文件中的 time 參數是指日期
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API 錯誤回應:", errorData);
        throw new Error(errorData.detail || `查詢班次失敗: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("API 回傳格式非預期 (非陣列):", data);
        toast.error("查詢結果格式錯誤");
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      const transformedResults: TrainSchedule[] = data.map((item: any) => ({
        trainDate: item.TrainDate,
        trainNumber: item.DailyTrainInfo.TrainNo,
        trainTypeName: item.DailyTrainInfo.TrainTypeName.Zh_tw,
        originStationName: item.OriginStopTime.StationName.Zh_tw, // 起站名稱 (API 回傳的)
        originStationID: item.OriginStopTime.StationID,         // 起站 ID (API 回傳的)
        destinationStationName: item.DestinationStopTime.StationName.Zh_tw, // 迄站名稱 (API 回傳的)
        destinationStationID: item.DestinationStopTime.StationID,           // 迄站 ID (API 回傳的)
        departureTime: item.OriginStopTime.DepartureTime,
        arrivalTime: item.DestinationStopTime.ArrivalTime,
        tripEndingStationName: item.DailyTrainInfo.EndingStationName.Zh_tw,
        rawTrainData: item, // 保留原始資料
      }));

      // 根據前端選擇的時間 (HH:mm) 篩選結果 (可選)
      // TDX API `/OD/{Date}` 會回傳整天的，如果需要根據選擇的 HH:mm 時間篩選，可以在此進行
      const filteredResults = transformedResults.filter(train => {
        // 如果是 bookNow 或沒有選特定時間，則不過濾時間
        // 否則，只顯示預約時間之後的班次 (以起站發車時間為準)
        if (bookNow) return true;
        if (!time) return true; // 如果 time state 是空的，也不篩選
        return train.departureTime >= time;
      });


      setSearchResults(filteredResults);
      if (filteredResults.length > 0) {
        toast.success("查詢完成！");
      } else {
        toast.info("查無符合條件的班次");
      }

    } catch (error: any) {
      console.error("查詢班次時發生錯誤:", error);
      toast.error(`查詢失敗: ${error.message}`);
      setSearchResults([]); // 錯誤時清空或設為空陣列
    } finally {
      setIsLoading(false);
    }
  }

  const handleBookTrain = (train: TrainSchedule) => {
    setConfirmDialog({
      open: true,
      train,
    })
  }

  const confirmBooking = async () => {
    if (!confirmDialog.train || !userId) {
      toast.error("預約資訊不完整或尚未登入");
      return;
    }
    setIsLoading(true)

    // 模擬API請求 - 實際預約邏輯
    // 您需要一個後端 API 來處理預約儲存
    // 以下是假設的預約請求
    const bookingData = {
      userId: userId,
      trainNumber: confirmDialog.train.trainNumber,
      trainDate: confirmDialog.train.trainDate,
      originStationID: confirmDialog.train.originStationID, // 使用 API 回傳的實際起站 ID
      originStationName: originStation, // 使用者選擇的起站名稱
      destinationStationID: confirmDialog.train.destinationStationID, // 使用 API 回傳的實際迄站 ID
      destinationStationName: destStation, // 使用者選擇的迄站名稱
      departureTime: confirmDialog.train.departureTime,
      arrivalTime: confirmDialog.train.arrivalTime,
    };

    console.log("準備送出的預約資料:", bookingData);

    // 假設的預約 API 端點
    // const response = await fetch('/api/book-train-stop', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(bookingData),
    // });

    // if (!response.ok) {
    //   toast.error("預約失敗，請稍後再試");
    //   setIsLoading(false);
    //   return;
    // }

    // 模擬成功
    setTimeout(() => {
      setConfirmDialog({ open: false, train: null })
      setIsLoading(false)
      toast.success(`已成功送出 ${confirmDialog.train?.trainNumber} 次列車 (${originStation} -> ${destStation}) 停靠預約！`)
      // router.push("/my-bookings") // 導向到我的預約頁面
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

            <div className="mb-4"> {/* 調整 mb */}
              <h3 className="text-md font-medium mb-2">起站</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">縣市</label>
                  <Select
                    value={originCounty}
                    onValueChange={(value) => {
                      setOriginCounty(value)
                      setOriginStation("") // 重設車站
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((c) => (
                        <SelectItem key={`origin-county-${c}`} value={c}>
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
                          <SelectItem key={`origin-station-${s.StationID}`} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="py-3 px-6"> {/* 調整 padding */}
                <hr />
              </div>

              <h3 className="text-md font-medium mb-2">迄站</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">縣市</label>
                  <Select
                    value={destCounty}
                    onValueChange={(value) => {
                      setDestCounty(value)
                      setDestStation("") // 重設車站
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((c) => (
                        <SelectItem key={`dest-county-${c}`} value={c}>
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
                          <SelectItem key={`dest-station-${s.StationID}`} value={s.name}>
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
                    if (checked) {
                      setDate(new Date());
                      setTime("00:00"); // 立即預約時，時間篩選從 00:00 開始
                    }
                  }
                }}
              />
              <label
                htmlFor="book-now"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                立即預約 (查詢今日班次)
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
                        {date ? format(date, "yyyy年 MM月 dd日", { locale: zhTW }) : "選擇日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(day) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // 設定為今天的開始，避免時區問題
                          return day < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label htmlFor="time-select" className="block text-sm font-medium mb-1">預約時間 (此時間後)</label>
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
              className="w-full bg-blue-600 hover:bg-blue-500 mt-4" // 加一點間距
              onClick={handleSearch}
              disabled={!originStation || !destStation || isLoading} // 簡化 disable 條件
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

      {/* 查詢結果區塊 */}
      <Card className="mt-6">
        <CardHeader className="text-lg font-semibold">可預約班次</CardHeader>
        <CardContent>
          <div className="mt-2"> {/* 調整間距 */}
            {isLoading && searchResults === null && ( // 初始查詢時顯示 Loading
                 <div className="flex justify-center items-center py-8">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">查詢中...</p>
                 </div>
            )}
            {searchResults === null && !isLoading && (
              <p className="text-center text-muted-foreground py-8">請先設定起訖站並點擊查詢</p>
            )}
            {searchResults !== null && searchResults.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground py-8">抱歉，該時段查無符合條件的可預約班次</p>
            )}
            {searchResults && searchResults.length > 0 && !isLoading && (
              <div className="space-y-3">
                {searchResults.map((train) => (
                  <Card key={`${train.trainDate}-${train.trainNumber}-${train.departureTime}`} className="border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{train.trainNumber} 次 {train.trainTypeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {train.originStationName} <span className="text-blue-600 font-semibold">({train.departureTime})</span> → {train.destinationStationName} <span className="text-green-600 font-semibold">({train.arrivalTime})</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            行駛日期: {train.trainDate}
                          </div>
                          <div className="text-xs text-gray-500">
                            列車終點站: {train.tripEndingStationName}
                          </div>
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
        </CardContent>
      </Card>

      {/* 確認預約 Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({ open: false, train: null })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認預約</DialogTitle>
            <DialogDescription>您確定要預約以下班次停靠嗎？</DialogDescription>
          </DialogHeader>
          {confirmDialog.train && (
            <div className="py-4 space-y-1">
              <p><strong>車次:</strong> {confirmDialog.train.trainNumber} ({confirmDialog.train.trainTypeName})</p>
              <p><strong>日期:</strong> {confirmDialog.train.trainDate}</p>
              <p><strong>起站:</strong> {originStation} ( {confirmDialog.train.departureTime} 開 )</p>
              <p><strong>迄站:</strong> {destStation} ( {confirmDialog.train.arrivalTime} 到 )</p>
              <p><strong>列車終點:</strong> {confirmDialog.train.tripEndingStationName}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, train: null })} disabled={isLoading}>
              取消
            </Button>
            <Button onClick={confirmBooking} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                "確認預約"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
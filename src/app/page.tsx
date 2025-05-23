"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

// 模擬資料
const counties = [
  "基隆市",
  "台北市",
  "新北市",
  "桃園市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
]

const stationsByCounty: Record<string, Array<{ name: string; isSmall: boolean }>> = {
  基隆市: [
    { name: "基隆", isSmall: false },
    { name: "三坑", isSmall: true },
    { name: "八堵", isSmall: false },
    { name: "七堵", isSmall: false },
  ],
  台北市: [
    { name: "南港", isSmall: false },
    { name: "松山", isSmall: false },
    { name: "台北", isSmall: false },
    { name: "萬華", isSmall: false },
  ],
  新北市: [
    { name: "板橋", isSmall: false },
    { name: "樹林", isSmall: false },
    { name: "鶯歌", isSmall: false },
    { name: "福隆", isSmall: true },
  ],
  // 其他縣市的車站...
}

// 模擬班次資料
const mockTrains = [
  {
    trainNumber: "1254",
    arrivalTime: "14:25",
    destination: "花蓮",
  },
  {
    trainNumber: "1256",
    arrivalTime: "15:10",
    destination: "台東",
  },
  {
    trainNumber: "1258",
    arrivalTime: "15:45",
    destination: "花蓮",
  },
  {
    trainNumber: "1260",
    arrivalTime: "16:20",
    destination: "台東",
  },
]

export default function BookingPage() {
  const router = useRouter()
  const [county, setCounty] = useState<string>("")
  const [station, setStation] = useState<string>("")
  const [bookNow, setBookNow] = useState<boolean>(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("12:00")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    train: any | null
  }>({
    open: false,
    train: null,
  })

  const handleSearch = () => {
    if (!county || !station) {
      return
    }

    setIsLoading(true)

    // 模擬API請求
    setTimeout(() => {
      setSearchResults(mockTrains)
      setIsLoading(false)
    }, 1000)
  }

  const handleBookTrain = (train: any) => {
    setConfirmDialog({
      open: true,
      train,
    })
  }

  const confirmBooking = () => {
    setIsLoading(true)

    // 模擬API請求
    setTimeout(() => {
      setConfirmDialog({ open: false, train: null })
      setIsLoading(false)
      router.push("/my-bookings")
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
        <CardHeader className="text-2xl font-bold">預約停靠</CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">縣市</label>
              <Select value={county} onValueChange={setCounty}>
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
              <Select value={station} onValueChange={setStation} disabled={!county}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇車站" />
                </SelectTrigger>
                <SelectContent>
                  {county &&
                    stationsByCounty[county]?.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name} {s.isSmall && <span className="text-xs text-muted-foreground">(小站)</span>}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="book-now"
                checked={bookNow}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setBookNow(checked)
                  }
                }}
              />
              <label
                htmlFor="book-now"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                現在預約
              </label>
            </div>

            {!bookNow && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">日期</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "yyyy-MM-dd", { locale: zhTW }) : "選擇日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => {
                          const today = new Date()
                          const thirtyDaysLater = new Date()
                          thirtyDaysLater.setDate(today.getDate() + 30)
                          return date < today || date > thirtyDaysLater
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">時間</label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
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

            <Button className="w-full" onClick={handleSearch} disabled={!county || !station || isLoading}>
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
            {
              searchResults === null || searchResults === undefined ? ( // 檢查 searchResults 是否為 null 或 undefined
                <p className="text-center text-muted-foreground py-8">等待查詢...</p>
              ) : searchResults.length === 0 ? ( // 如果 searchResults 已定義，再檢查其長度
                <p className="text-center text-muted-foreground py-8">抱歉，該時段查無符合條件的可預約班次</p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((train) => (
                    <Card key={train.trainNumber}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{train.trainNumber} 次列車</div>
                            <div className="text-sm text-muted-foreground">預計抵達時間: {train.arrivalTime}</div>
                            <div className="text-sm text-muted-foreground">終點站: {train.destination}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleBookTrain(train)}>
                            預約此班次
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            }
          </div>

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
                <div className="py-4">
                  <p>
                    <strong>車次:</strong> {confirmDialog.train.trainNumber}
                  </p>
                  <p>
                    <strong>預計抵達時間:</strong> {confirmDialog.train.arrivalTime}
                  </p>
                  <p>
                    <strong>終點站:</strong> {confirmDialog.train.destination}
                  </p>
                  <p>
                    <strong>停靠車站:</strong> {station}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDialog({ open: false, train: null })}>
                  取消
                </Button>
                <Button onClick={confirmBooking} disabled={isLoading}>
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
        </CardContent>
      </Card>
    </div>
  )
}

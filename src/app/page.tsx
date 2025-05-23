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

// 從 lib 匯入資料
import { counties, stationsByCounty, StationInfo } from "@/lib/locationData" // 假設你的 tsconfig.json 有設定 @/ 指向 src/

// 模擬班次資料 (這個可以保留在組件內，或者如果需要在其他地方使用，也可以移到 lib)
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
  const [searchResults, setSearchResults] = useState<any[] | null>(null) // 可以考慮為 train 定義更精確的型別
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    train: any | null // 同上
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

  // 獲取選定縣市的車站列表，如果縣市未選或資料中不存在，則返回空陣列
  const currentStations: StationInfo[] = county && stationsByCounty[county] ? stationsByCounty[county] : []

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="text-2xl font-bold">預約停靠</CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">縣市</label>
              <Select value={county} onValueChange={(value) => {
                setCounty(value)
                setStation("") // 當縣市改變時，重置車站選擇
              }}>
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
              <Select value={station} onValueChange={setStation} disabled={!county || currentStations.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={!county ? "請先選擇縣市" : "請選擇車站"} />
                </SelectTrigger>
                <SelectContent>
                  {currentStations.map((s) => (
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
                          // 將今天的時間設為 00:00:00 以便比較
                          today.setHours(0,0,0,0)
                          const thirtyDaysLater = new Date()
                          thirtyDaysLater.setDate(new Date().getDate() + 30)
                          thirtyDaysLater.setHours(23,59,59,999) // 將30天後的日期時間設為當天結束
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
              searchResults === null ? (
                <p className="text-center text-muted-foreground py-8">等待查詢...</p>
              ) : searchResults.length === 0 ? (
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
                    <strong>停靠車站:</strong> {station} ({county})
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
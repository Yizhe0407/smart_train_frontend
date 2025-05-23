"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Loader2 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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

// 模擬時刻表資料
const mockTimetable = [
  {
    trainType: "區間車",
    trainNumber: "1254",
    destination: "花蓮",
    departureTime: "14:25",
    estimatedDepartureTime: "14:25",
    platform: "1",
    status: "準點",
    canBook: true,
  },
  {
    trainType: "自強號",
    trainNumber: "402",
    destination: "台東",
    departureTime: "14:50",
    estimatedDepartureTime: "14:55",
    platform: "2",
    status: "晚5分鐘",
    canBook: false,
  },
  {
    trainType: "區間車",
    trainNumber: "1256",
    destination: "台東",
    departureTime: "15:10",
    estimatedDepartureTime: "15:10",
    platform: "1",
    status: "準點",
    canBook: true,
  },
  {
    trainType: "莒光號",
    trainNumber: "512",
    destination: "高雄",
    departureTime: "15:30",
    estimatedDepartureTime: "15:30",
    platform: "3",
    status: "準點",
    canBook: false,
  },
  {
    trainType: "區間車",
    trainNumber: "1258",
    destination: "花蓮",
    departureTime: "15:45",
    estimatedDepartureTime: "15:45",
    platform: "1",
    status: "準點",
    canBook: true,
  },
  {
    trainType: "區間車",
    trainNumber: "1260",
    destination: "台東",
    departureTime: "16:20",
    estimatedDepartureTime: "16:20",
    platform: "1",
    status: "準點",
    canBook: true,
  },
]

export default function TimetablePage() {
  const [originCounty, setOriginCounty] = useState<string>("")
  const [originStation, setOriginStation] = useState<string>("")
  const [destCounty, setDestCounty] = useState<string>("")
  const [destStation, setDestStation] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [direction, setDirection] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [timetable, setTimetable] = useState<any[] | null>(null)

  const handleSearch = () => {
    if (!originCounty || !originStation || !destCounty || !destStation) {
      return
    }

    setIsLoading(true)

    // 模擬API請求
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-2xl font-bold text-center">時刻表查詢</CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              <Card className="mb-8">
                <CardHeader className="text-md font-medium">起站</CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
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
                              {s.name} {s.isSmall && <span className="text-xs text-blue-400">(小站)</span>}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>

                <div className="px-6">
                  <hr />
                </div>

                <CardHeader className="text-md font-medium">迄站</CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="basis-1/2">
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

                  <div className="basis-1/2">
                    <label className="block text-sm font-medium mb-1">車站</label>
                    <Select value={destStation} onValueChange={setDestStation} disabled={!destCounty}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇車站" />
                      </SelectTrigger>
                      <SelectContent>
                        {destCounty &&
                          stationsByCounty[destCounty]?.map((s) => (
                            <SelectItem key={s.name} value={s.name}>
                              {s.name} {s.isSmall && <span className="text-xs text-blue-400">(小站)</span>}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

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
              <label className="block text-sm font-medium mb-1">行駛方向</label>
              <ToggleGroup type="single" value={direction} onValueChange={(value) => value && setDirection(value)}>
                <ToggleGroupItem value="all" className="flex-1 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-600">
                  全部
                </ToggleGroupItem>
                <ToggleGroupItem value="north" className="flex-1 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-600">
                  北上/順行
                </ToggleGroupItem>
                <ToggleGroupItem value="south" className="flex-1 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-600">
                  南下/逆行
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

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
                "查詢時刻表"
              )}
            </Button>
          </div>

          {timetable && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">時刻表</h2>
              <div className="text-sm mb-4">
                <p>
                  <span className="font-medium">起站:</span> {originStation}
                </p>
                <p>
                  <span className="font-medium">迄站:</span> {destStation}
                </p>
              </div>
              {timetable.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">查無列車時刻資訊</p>
              ) : (
                <div className="space-y-3">
                  {timetable.map((train) => (
                    <Card key={train.trainNumber} className={train.canBook ? "border-blue-200" : ""}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">{train.trainType} </span>
                            <span>{train.trainNumber}</span>
                          </div>
                          <div>
                            {train.status === "準點" ? (
                              <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">
                                準點
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                {train.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">終點站: </span>
                            {train.destination}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">發車時間: </span>
                            {train.departureTime}
                            {train.departureTime !== train.estimatedDepartureTime && (
                              <span className="text-yellow-600"> (預計 {train.estimatedDepartureTime})</span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">月台: </span>
                            {train.platform}
                          </div>
                          {train.canBook && (
                            <div className="mt-2">
                              <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none">
                                本站可預約停靠
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center mt-4">
                時刻表資訊僅供參考，實際運行狀況請注意車站公告或App即時更新
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { toast } from "sonner";
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
import { counties, stationsByCounty, StationInfo } from "@/lib/locationData"

export default function TimetablePage() {
  const [originCounty, setOriginCounty] = useState<string>("")
  const [originStation, setOriginStation] = useState<string>("")
  const [destCounty, setDestCounty] = useState<string>("")
  const [destStation, setDestStation] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [direction, setDirection] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [timetable, setTimetable] = useState<any[] | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [autoTime, setAutoTime] = useState<Date | undefined>(new Date())

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
      const response = await fetch("/api/get_train_schedule", {
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

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-2xl font-bold text-center">時刻表查詢</CardHeader>

        <CardContent>
          <div className="space-y-4">
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

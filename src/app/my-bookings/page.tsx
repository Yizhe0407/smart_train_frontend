"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// 模擬預約資料
const mockBookings = {
  upcoming: [
    {
      id: "1",
      station: "三坑",
      date: "2025-05-24",
      time: "15:10",
      trainNumber: "1256",
      status: "已確認",
    },
    {
      id: "2",
      station: "福隆",
      date: "2025-05-26",
      time: "09:45",
      trainNumber: "1122",
      status: "待生效",
    },
  ],
  completed: [
    {
      id: "3",
      station: "三坑",
      date: "2025-05-20",
      time: "14:30",
      trainNumber: "1244",
      status: "已完成",
    },
  ],
  cancelled: [
    {
      id: "4",
      station: "福隆",
      date: "2025-05-18",
      time: "16:20",
      trainNumber: "1260",
      status: "已取消",
    },
  ],
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(false)
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean
    bookingId: string | null
  }>({
    open: false,
    bookingId: null,
  })

  const handleCancelBooking = (bookingId: string) => {
    setCancelDialog({
      open: true,
      bookingId,
    })
  }

  const confirmCancelBooking = () => {
    setIsLoading(true)

    // 模擬API請求
    setTimeout(() => {
      setCancelDialog({ open: false, bookingId: null })
      setIsLoading(false)

      // 在實際應用中，這裡應該重新獲取預約列表
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已確認":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已確認
          </Badge>
        )
      case "待生效":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            待生效
          </Badge>
        )
      case "已完成":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            已完成
          </Badge>
        )
      case "已取消":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            已取消
          </Badge>
        )
      case "列車即將抵達":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            列車即將抵達
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-2xl font-bold">我的預約</CardHeader>

        <CardContent>
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">進行中/未來</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="cancelled">已取消</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              {mockBookings.upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">您目前沒有任何進行中的預約</p>
                  <Button onClick={() => router.push("/")}>前往預約</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockBookings.upcoming.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-lg">{booking.station}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="space-y-1 mb-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">日期時間: </span>
                            {booking.date} {booking.time}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">列車車次: </span>
                            {booking.trainNumber}
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                          取消預約
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {mockBookings.completed.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">您目前沒有任何已完成的預約</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockBookings.completed.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-lg">{booking.station}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">日期時間: </span>
                            {booking.date} {booking.time}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">列車車次: </span>
                            {booking.trainNumber}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-4">
              {mockBookings.cancelled.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">您目前沒有任何已取消的預約</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockBookings.cancelled.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-lg">{booking.station}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">日期時間: </span>
                            {booking.date} {booking.time}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">列車車次: </span>
                            {booking.trainNumber}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <AlertDialog
            open={cancelDialog.open}
            onOpenChange={(open) => {
              if (!open) {
                setCancelDialog({ open: false, bookingId: null })
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>取消預約</AlertDialogTitle>
                <AlertDialogDescription>您確定要取消此預約嗎？此操作無法撤銷。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>返回</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmCancelBooking}
                  disabled={isLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      處理中...
                    </>
                  ) : (
                    "確認取消"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

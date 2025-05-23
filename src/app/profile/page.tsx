"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "王小明",
    idNumber: "A123456789",
    phone: "0912345678",
    email: "example@mail.com",
    easyCard: "0123456789",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬API請求
    setTimeout(() => {
      setIsLoading(false)
      // 在實際應用中，這裡應該顯示成功訊息
    }, 1000)
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>個人資料</CardTitle>
          <CardDescription>請確保您的個人資料正確無誤，以便系統能夠正確處理您的預約請求。</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">身分證字號</Label>
              <Input id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">聯絡電話</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">電子郵件 (選填)</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="easyCard">悠遊卡號碼</Label>
              <Input id="easyCard" name="easyCard" value={formData.easyCard} onChange={handleChange} required />
              <p className="text-xs text-muted-foreground">綁定悠遊卡用於驗證您是否如期搭乘預約的列車</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  儲存中...
                </>
              ) : (
                "儲存變更"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

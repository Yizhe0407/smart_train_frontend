import type React from "react"
import { BottomNavigation } from "@/components/buttom-navigation"
import { cn } from "@/lib/utils"
import "@/app/globals.css"
import { Mona_Sans as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <title>台鐵智慧停靠預約系統</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
          <main className="pb-16">{children}</main>
          <BottomNavigation />
      </body>
    </html>
  )
}

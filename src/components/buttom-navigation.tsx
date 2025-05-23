"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, Ticket, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "預約",
      href: "/",
      icon: Calendar,
    },
    {
      name: "我的預約",
      href: "/my-bookings",
      icon: Ticket,
    },
    {
      name: "時刻表",
      href: "/timetable",
      icon: Clock,
    },
    {
      name: "個人資訊",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-background">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

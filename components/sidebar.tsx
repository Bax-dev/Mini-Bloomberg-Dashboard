"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, TrendingUp, Home, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function Sidebar({ open, onOpenChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: TrendingUp, label: "Market Trends", href: "/trends" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "#settings" },
  ]

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="border-b border-sidebar-border p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-lg font-bold text-sidebar-foreground">FinDash</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hidden md:flex"
          type="button"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                // Close mobile sidebar when link is clicked
                if (onOpenChange) {
                  onOpenChange(false)
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "text-sidebar-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
              title={collapsed ? item.label : ""}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col hidden md:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

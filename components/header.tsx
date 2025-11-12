"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card flex-shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
              type="button"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            {/* <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-primary-foreground">
                ₿
              </span>
            </div> */}
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
              Bloomberg Replica
            </h1>
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
            Live Market Data & News
          </div>
        </div>
      </div>
    </header>
  );
}

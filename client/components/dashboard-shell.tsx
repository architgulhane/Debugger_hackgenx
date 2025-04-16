"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  Brain,
  Calculator,
  HelpCircle,
  Home,
  IndianRupee,
  Menu,
  PieChart,
  Settings,
  Users,
  X,
} from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { ThemeToggle } from "./theme-toggle"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r bg-background md:block md:w-56">
        <div className="flex h-16 items-center border-b px-4">
          <PieChart className="h-6 w-6 mr-2" />
          <span className="font-bold text-sm">Budget System</span>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/dashboard") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/dashboard">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/blockchain") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/blockchain">
              <IndianRupee className="h-4 w-4" />
              Blockchain Ledger
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/participation") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/participation">
              <Users className="h-4 w-4" />
              Public Participation
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/admin") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/transparency") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/transparency">
              <IndianRupee className="h-4 w-4" />
              Transparency
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/optimization") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/optimization">
              <Brain className="h-4 w-4" />
              AI Optimization
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
              isActive("/scenarios") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Link href="/scenarios">
              <Calculator className="h-4 w-4" />
              Scenarios
            </Link>
          </Button>
    
        </nav>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:max-w-xs">
              <div className="flex items-center gap-2 pb-4">
                <PieChart className="h-6 w-6" />
                <span className="font-bold">Smart Budget System</span>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-2 text-sm">
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/dashboard">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/blockchain") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/blockchain">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Blockchain Ledger
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/participation") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/participation">
                    <Users className="h-4 w-4 mr-2" />
                    Public Participation
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/optimization") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/optimization">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Optimization
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/scenarios") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/scenarios">
                    <Calculator className="h-4 w-4 mr-2" />
                    Scenarios
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/transparency") ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Link href="/transparency">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Transparency
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 md:hidden">
            <PieChart className="h-6 w-6" />
            <span className="font-bold text-sm">Budget System</span>
          </div>
          <span className="font-bold hidden md:inline-flex">Smart Budget Allocation System</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Video Tutorials</DropdownMenuItem>
                <DropdownMenuItem>Contact Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</main>
      </div>
    </div>
  )
}

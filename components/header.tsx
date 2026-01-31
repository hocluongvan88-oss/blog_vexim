"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, ChevronDown, Shield } from "lucide-react"
import { ConsultationDialog } from "@/components/consultation-dialog"
import Link from "next/link"
import Image from "next/image"
import { BlogSearch } from "@/components/blog-search"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
              <Image
                src="/vexim-logo.png"
                alt="Vexim Global"
                width={140}
                height={50}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#services" className="text-foreground hover:text-primary transition-colors font-medium">
                Dịch vụ
              </Link>
              <Link href="/fda-tracker" className="text-foreground hover:text-primary transition-colors font-medium">
                FDA Tracker
              </Link>
              <Link href="/services/gacc/assessment" className="text-foreground hover:text-primary transition-colors font-medium">
                Tra cứu GACC
              </Link>
              <Link href="/#about" className="text-foreground hover:text-primary transition-colors font-medium">
                Giới thiệu
              </Link>
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
                Tin tức
              </Link>
              <Link href="/#contact" className="text-foreground hover:text-primary transition-colors font-medium">
                Liên hệ
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* CTA Button */}
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Yêu cầu tư vấn
              </Button>

              {/* Profile Dropdown */}
              {isMounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-emerald-600 text-white text-sm font-semibold">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/client-portal" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        <span>Khách hàng</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/login" className="cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Quản trị viên</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <div className="pb-2">
                  <BlogSearch />
                </div>
                <Link
                  href="/#services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/fda-tracker"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  FDA Tracker
                </Link>
                <Link
                  href="/services/gacc/assessment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  Tra cứu GACC
                </Link>
                <Link
                  href="/#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  Tin tức
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  Liên hệ
                </Link>
                <div className="pt-2 border-t">
                  <Link
                    href="/client-portal"
                    className="text-left text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Đăng nhập Khách hàng</span>
                  </Link>
                  <Link
                    href="/admin/login"
                    className="text-left text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Quản trị viên</span>
                  </Link>
                </div>
                <Button
                  onClick={() => {
                    setIsDialogOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                >
                  Yêu cầu tư vấn
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Consultation Dialog */}
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

export default Header

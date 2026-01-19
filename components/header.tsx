"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield } from "lucide-react"
import { ConsultationDialog } from "@/components/consultation-dialog"
import Link from "next/link"
import { BlogSearch } from "@/components/blog-search"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
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
            <Link href="/" className="flex items-center gap-0 hover:opacity-80 transition-opacity group">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-gray-900">VEXIM</span>
                <span className="text-emerald-600 ml-1">GLOBAL</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#services" className="text-foreground hover:text-primary transition-colors font-medium">
                Dịch vụ
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
              <Link
                href="/admin/login"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                title="Quản trị viên"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">Admin</span>
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Yêu cầu tư vấn
              </Button>
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
                <Link
                  href="/admin/login"
                  className="text-left text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
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

"use client"

import Image from "next/image"

// Partners data
const partners = [
  {
    name: "FDA",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9QYl9IzETixvFt9U819Lt80KkgoCT2.png",
    altText: "FDA Logo",
  },
  {
    name: "ACT",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9QYl9IzETixvFt9U819Lt80KkgoCT2.png",
    altText: "ACT Checkmark Logo",
  },
  {
    name: "CE",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9QYl9IzETixvFt9U819Lt80KkgoCT2.png",
    altText: "CE Marking Logo",
  },
  {
    name: "CMC Medical Devices",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9QYl9IzETixvFt9U819Lt80KkgoCT2.png",
    altText: "CMC Medical Devices Logo",
  },
  {
    name: "European Commission",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9QYl9IzETixvFt9U819Lt80KkgoCT2.png",
    altText: "European Commission Logo",
  },
]

export function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            ĐỐI TÁC CỦA CHÚNG TÔI
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Vexim Global tự hào kết hợp cùng các tổ chức và cơ quan hàng đầu thế giới
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-32 md:h-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <Image
                  src={partner.logo}
                  alt={partner.altText}
                  width={140}
                  height={140}
                  className="max-h-24 md:max-h-32 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Muốn trở thành đối tác của Vexim Global?</p>
          <a
            href="#contact"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Liên hệ hợp tác
          </a>
        </div>
      </div>
    </section>
  )
}

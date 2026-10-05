const stats = [
  {
    number: "200+",
    label: "Doanh nghiệp đã đồng hành",
  },
  {
    number: "500+",
    label: "Hồ sơ đã tư vấn & xử lý",
  },
  {
    number: "90%+",
    label: "Khách hàng hài lòng*",
  },
  {
    number: "24/7",
    label: "Tiếp nhận yêu cầu hỗ trợ",
  },
]

export function Statistics() {
  return (
    <section className="py-16 md:py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Con số nói lên sự tận tâm</h2>
          <p className="text-white/90 text-lg font-semibold">
            Kết quả thực tế từ quá trình đồng hành cùng doanh nghiệp Việt
          </p>
          <p className="text-white/70 text-sm mt-2 italic">
            Dựa trên dữ liệu và phản hồi khách hàng. Kết quả có thể khác nhau tùy từng hồ sơ và điều kiện thực tế.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-400 drop-shadow-lg">{stat.number}</div>
              <div className="text-lg text-white/90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

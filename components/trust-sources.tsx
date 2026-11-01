import { ExternalLink } from "lucide-react"
import { FDA_US_MARKET_SOURCES } from "@/lib/official-sources"
import { VEXIM_CREDENTIALS_URL } from "@/lib/contact-info"

/**
 * Khối "Căn cứ pháp lý & kiểm chứng" — đặt sau khối số liệu ở trang chủ.
 *
 * Vì sao có khối này: trang chủ trước khi sửa có 0 link ra ngoài. Nội dung của site
 * là quy định pháp lý ảnh hưởng trực tiếp tới quyết định kinh doanh (Google xếp vào
 * nhóm cần độ tin cậy cao — E-E-A-T/YMYL). Với loại nội dung này, dẫn nguồn tới cơ
 * quan ban hành quy định là tín hiệu mạnh nhất, và cũng là cách duy nhất để người
 * đọc TỰ kiểm chứng thay vì phải tin lời doanh nghiệp.
 *
 * Hai nguyên tắc áp dụng:
 *  - Chỉ dẫn nguồn cơ quan chính thức (fda.gov), không dẫn blog bên thứ ba.
 *  - `rel="noopener noreferrer"` nhưng KHÔNG dùng `nofollow`/`ugc`: dẫn nguồn có chủ
 *    đích, ta muốn truyền tín hiệu chứ không phải chặn nó.
 */
export function TrustSources() {
  return (
    <section className="py-12 md:py-16 bg-secondary/40 border-y border-border/60">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-3 text-balance">
            Căn cứ pháp lý chúng tôi làm theo
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Mọi yêu cầu hồ sơ Vexim tư vấn đều bám theo quy định đang có hiệu lực của FDA. Doanh
            nghiệp có thể tự đối chiếu tại các nguồn chính thức dưới đây.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3 md:gap-4">
          {FDA_US_MARKET_SOURCES.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg border border-border/80 bg-white p-4 hover:border-sky-200 hover:shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-navy-900 group-hover:text-accent transition-colors text-sm md:text-base">
                    {source.title}
                  </span>
                  {source.note && (
                    <span className="block text-sm text-muted-foreground mt-0.5">{source.note}</span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Cần bằng chứng thực tế? Xem{" "}
          <a
            href={VEXIM_CREDENTIALS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            hồ sơ năng lực và các chứng nhận FDA đã cấp
          </a>
          .
        </p>
      </div>
    </section>
  )
}

export default TrustSources

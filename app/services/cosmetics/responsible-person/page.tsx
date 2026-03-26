import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Responsible Person Mỹ Phẩm | Dịch vụ MoCRA FDA | Vexim',
  description: 'Dịch vụ chỉ định Responsible Person (RP) cho mỹ phẩm MoCRA. Đại diện pháp lý tại Mỹ để chịu trách nhiệm với FDA.',
};

export default function ResponsiblePerson() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Responsible Person (RP)</h1>
          <p className="text-xl text-purple-100 text-pretty">
            Chỉ định đại diện pháp lý tại Mỹ chịu trách nhiệm với FDA cho mỹ phẩm MoCRA của bạn
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Thời gian xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-purple-700">1-2 tuần</p>
              <p className="text-sm text-gray-600 mt-1">Từ khi hợp đồng ký kết đến khi hoàn tất</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Kiểu hợp tác
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-purple-700">Hợp tác dài hạn</p>
              <p className="text-sm text-gray-600 mt-1">RP phải duy trì hoạt động liên tục với FDA</p>
            </CardContent>
          </Card>
        </div>

        {/* What is RP */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Responsible Person là gì?</h2>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <p className="text-gray-800 mb-4">
              Responsible Person (RP) là cá nhân hoặc công ty có địa chỉ tại Hoa Kỳ, được chỉ định để:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Chịu trách nhiệm pháp lý trước FDA về sản phẩm mỹ phẩm</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Nhận các thông báo và yêu cầu từ FDA</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Giám sát tuân thủ các quy định MoCRA</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Phối hợp recall sản phẩm nếu có vấn đề về an toàn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RP Requirements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Yêu cầu Responsible Person</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yêu cầu về địa chỉ</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phải có địa chỉ thực tế tại Hoa Kỳ</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Không được là địa chỉ ảo hoặc mailbox</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phải có số điện thoại liên lạc hợp lệ</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yêu cầu về pháp nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Có thể là cá nhân hoặc công ty có pháp nhân Mỹ</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phải công khai tên, địa chỉ trên nhãn sản phẩm</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Có thể là US Distributor hoặc Importer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yêu cầu về hoạt động</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phải giám sát chất lượng sản phẩm</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phải có khả năng phản ứng với FDA</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phải cập nhật Product Listing khi có thay đổi</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RP vs US Agent */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Responsible Person vs US Agent</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold">Tiêu chí</th>
                  <th className="text-left py-3 px-4 font-semibold">Responsible Person</th>
                  <th className="text-left py-3 px-4 font-semibold">US Agent (Food)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Ngành sản phẩm</td>
                  <td className="py-3 px-4">Mỹ phẩm (MoCRA)</td>
                  <td className="py-3 px-4">Thực phẩm (Food)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Trách nhiệm</td>
                  <td className="py-3 px-4">Chịu trách nhiệm pháp lý toàn bộ</td>
                  <td className="py-3 px-4">Đại diện giao dịch với FDA</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Trên nhãn sản phẩm</td>
                  <td className="py-3 px-4">Phải công khai tên RP</td>
                  <td className="py-3 px-4">Không nhất thiết phải trên nhãn</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Khách hàng chỉ định</td>
                  <td className="py-3 px-4">Nhà sản xuất/Importer</td>
                  <td className="py-3 px-4">Nhà sản xuất nước ngoài</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded mb-12">
          <div className="flex gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <h3 className="font-semibold text-lg text-amber-900">Lưu ý quan trọng</h3>
          </div>
          <ul className="space-y-2 text-amber-900 text-sm ml-9">
            <li>• Tên RP phải xuất hiện trên nhãn sản phẩm theo quy định 21 CFR 701.4</li>
            <li>• RP phải duy trì hoạt động liên tục, không được tạm dừng</li>
            <li>• Nếu thay đổi RP, phải cập nhật với FDA trong vòng 60 ngày</li>
            <li>• RP chịu trách nhiệm pháp lý nếu sản phẩm gây hại cho người dùng</li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cần chỉ định Responsible Person?</h3>
          <p className="text-gray-700 mb-6">
            Chúng tôi hỗ trợ tìm kiếm RP phù hợp hoặc làm RP cho sản phẩm mỹ phẩm của bạn
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/contact">Tư vấn miễn phí</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services?tab=cosmetics">Xem dịch vụ MoCRA</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

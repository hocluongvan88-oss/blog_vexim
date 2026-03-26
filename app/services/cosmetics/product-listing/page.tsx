import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, PackageOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Product Listing Mỹ Phẩm | MoCRA FDA | Vexim',
  description: 'Dịch vụ khai báo sản phẩm mỹ phẩm mới trên hệ thống Cosmetics Direct. Cập nhật Product Listing khi có sản phẩm mới.',
};

export default function ProductListing() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Product Listing Mỹ Phẩm</h1>
          <p className="text-xl text-cyan-100 text-pretty">
            Khai báo sản phẩm mỹ phẩm mới lên hệ thống Cosmetics Direct của FDA trong vòng 60 ngày sau khi sản xuất
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                Thời gian xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-cyan-700">1-2 tuần</p>
              <p className="text-sm text-gray-600 mt-1">Từ khi hoàn tất hồ sơ đến khi được chấp thuận</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-cyan-600" />
                Yêu cầu cập nhật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-cyan-700">60 ngày</p>
              <p className="text-sm text-gray-600 mt-1">Phải khai báo trong 60 ngày sau khi sản xuất</p>
            </CardContent>
          </Card>
        </div>

        {/* What is Product Listing */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Product Listing là gì?</h2>
          <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 rounded">
            <p className="text-gray-800 mb-4">
              Product Listing là danh sách chi tiết các sản phẩm mỹ phẩm mà công ty sản xuất, nhập khẩu hoặc phân phối tại Hoa Kỳ. 
              Mỗi sản phẩm phải được khai báo lên hệ thống Cosmetics Direct của FDA.
            </p>
            <p className="text-gray-800 mt-4">
              <strong>Yêu cầu:</strong> Bất kỳ sản phẩm mỹ phẩm nào sản xuất hoặc phân phối tại Hoa Kỳ từ ngày 1/1/2023 trở đi 
              phải được khai báo trong vòng 60 ngày kể từ ngày bắt đầu sản xuất.
            </p>
          </div>
        </div>

        {/* Product Listing Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Quy trình khai báo Product Listing</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Thu thập thông tin sản phẩm',
                desc: 'Cung cấp tên sản phẩm, danh sách thành phần INCI, phân loại (Cosmetic/OTC)',
              },
              {
                step: 2,
                title: 'Chuẩn bị hồ sơ',
                desc: 'Lập danh sách chi tiết theo format FDA Cosmetics Direct, kiểm tra thành phần prohibited',
              },
              {
                step: 3,
                title: 'Đăng ký trên Cosmetics Direct',
                desc: 'Gửi khai báo thông qua hệ thống Cosmetics Direct với tài khoản công ty',
              },
              {
                step: 4,
                title: 'FDA xác nhận tiếp nhận',
                desc: 'Nhận email xác nhận từ FDA, sản phẩm được ghi nhận trong hệ thống',
              },
              {
                step: 5,
                title: 'Hoàn tất khai báo',
                desc: 'Sản phẩm chính thức được phép phân phối tại Hoa Kỳ',
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-600 text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Required Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Thông tin cần thiết cho Product Listing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Tên sản phẩm (tiếng Anh)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Mã sản phẩm hoặc UPC</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phân loại (Cosmetic/OTC)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Loại sản phẩm (skincare, makeup...)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thành phần & Công dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Danh sách thành phần (INCI format)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Tên công ty sản xuất</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Đăng ký Responsible Person</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ngày bắt đầu sản xuất</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prohibited Ingredients */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Thành phần cấm trong mỹ phẩm FDA</h2>
          <p className="text-gray-700 mb-4">
            FDA cấm hoặc hạn chế hơn 11 thành phần trong mỹ phẩm. Các thành phần phổ biến bị cấm:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Hydroquinone', desc: 'Chất tẩy trắng da' },
              { name: 'Mercury', desc: 'Thủy ngân' },
              { name: 'Lead Acetate', desc: 'Chì acetate' },
              { name: 'Methylene Chloride', desc: 'Dung môi' },
              { name: 'Chloroform', desc: 'Dung môi' },
              { name: 'Urethan Foam', desc: 'Bọt urê thane' },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4">
                  <p className="font-semibold text-red-700">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded mb-12">
          <div className="flex gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <h3 className="font-semibold text-lg text-amber-900">Lưu ý quan trọng</h3>
          </div>
          <ul className="space-y-2 text-amber-900 text-sm ml-9">
            <li>• Phải khai báo trong vòng 60 ngày sau khi bắt đầu sản xuất</li>
            <li>• Nếu trễ deadline, sản phẩm không được phép bán tại Hoa Kỳ</li>
            <li>• Phải cập nhật ngay khi có thay đổi về thành phần hoặc tên sản phẩm</li>
            <li>• Nếu có thành phần cấm, FDA sẽ từ chối khai báo</li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cần khai báo sản phẩm mỹ phẩm mới?</h3>
          <p className="text-gray-700 mb-6">
            Chúng tôi hỗ trợ chuẩn bị hồ sơ và khai báo lên Cosmetics Direct của FDA
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              <Link href="/contact">Tư vấn miễn phí</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services?tab=cosmetics">Xem các dịch vụ khác</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

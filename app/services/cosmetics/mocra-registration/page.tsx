import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Đăng ký MoCRA FDA | Dịch vụ Mỹ Phẩm | Vexim',
  description: 'Dịch vụ đăng ký Modernization of Cosmetics Regulation (MoCRA) với FDA. Hỗ trợ đầy đủ Facility Registration & Product Listing cho mỹ phẩm xuất khẩu Mỹ.',
};

export default function MoCRARegistration() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Đăng Ký MoCRA FDA</h1>
          <p className="text-xl text-blue-100 text-pretty">
            Đăng ký Facility và Product Listing cho mỹ phẩm xuất khẩu sang Hoa Kỳ theo quy định MoCRA mới nhất
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Thời gian xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-blue-700">3-5 tuần</p>
              <p className="text-sm text-gray-600 mt-1">Từ khi hồ sơ hoàn chỉnh đến khi được chấp thuận</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Chi phí
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-green-700">Từ $500+</p>
              <p className="text-sm text-gray-600 mt-1">Phụ thuộc số lượng sản phẩm & độ phức tạp</p>
            </CardContent>
          </Card>
        </div>

        {/* What is MoCRA */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">MoCRA là gì?</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <p className="text-gray-800 mb-4">
              MoCRA (Modernization of Cosmetics Regulation) là quy định mới của FDA được thông qua vào tháng 12/2022, 
              có hiệu lực từ ngày 1/1/2023, yêu cầu tất cả các nhà sản xuất mỹ phẩm (trong nước và xuất khẩu) phải:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Đăng ký Facility (cơ sở sản xuất/đóng gói) với FDA</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Khai báo danh sách sản phẩm (Product Listing)</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Chỉ định Responsible Person đại diện tại Mỹ</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Cập nhật thông tin khi có sản phẩm mới</span>
              </li>
            </ul>
          </div>
        </div>

        {/* MoCRA Registration Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Quy trình đăng ký MoCRA</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Thu thập thông tin',
                desc: 'Cung cấp thông tin cơ sở sản xuất, danh sách sản phẩm, thành phần chính',
              },
              {
                step: 2,
                title: 'Chuẩn bị hồ sơ',
                desc: 'Lập danh sách sản phẩm chi tiết theo format FDA, phân loại Cosmetic vs OTC',
              },
              {
                step: 3,
                title: 'Đăng ký qua Cosmetics Direct',
                desc: 'Gửi đăng ký thông qua hệ thống Cosmetics Direct của FDA',
              },
              {
                step: 4,
                title: 'Xác nhận & Chủng loại',
                desc: 'FDA xác nhận nhận đăng ký, chỉ định số hiệu Cosmetic Facility Registration',
              },
              {
                step: 5,
                title: 'Cấp phép hoàn tất',
                desc: 'Nhận chứng chỉ đăng ký MoCRA từ FDA',
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
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

        {/* Required Documents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Tài liệu cần thiết</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin Facility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Địa chỉ cơ sở sản xuất</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Loại hoạt động (sản xuất, đóng gói...)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Danh sách sản phẩm được sản xuất</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Tên sản phẩm (tiếng Anh)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Danh sách thành phần (INCI)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Phân loại (Cosmetic/OTC Drug)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded mb-12">
          <div className="flex gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <h3 className="font-semibold text-lg text-amber-900">Lưu ý quan trọng</h3>
          </div>
          <ul className="space-y-2 text-amber-900 text-sm ml-9">
            <li>• Cosmetic vs OTC Drug: Nếu sản phẩm có tuyên bố công dụng liệu pháp (therapeutic claims) sẽ được phân loại là OTC Drug, không phải Cosmetic</li>
            <li>• Responsible Person bắt buộc phải có địa chỉ tại Hoa Kỳ</li>
            <li>• Phải gia hạn đăng ký hàng năm (thường vào tháng 7)</li>
            <li>• Khi có sản phẩm mới, phải cập nhật Product Listing trong vòng 60 ngày</li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Sẵn sàng đăng ký MoCRA cho mỹ phẩm của bạn?</h3>
          <p className="text-gray-700 mb-6">
            Chúng tôi hỗ trợ đầy đủ từ chuẩn bị hồ sơ đến khi nhận được chứng chỉ từ FDA
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">Tư vấn miễn phí</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Xem các dịch vụ khác</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

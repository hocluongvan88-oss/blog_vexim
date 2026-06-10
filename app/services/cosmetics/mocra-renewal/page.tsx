import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, RotateCw } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Gia hạn MoCRA FDA | Dịch vụ Mỹ Phẩm | Vexim',
  description: 'Dịch vụ gia hạn đăng ký MoCRA hàng năm cho mỹ phẩm. Cập nhật Facility và Product Listing đúng hạn với FDA.',
  alternates: {
    canonical: '/services/cosmetics/mocra-renewal',
  },
};

export default function MoCRARenewal() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Gia hạn MoCRA Hàng Năm</h1>
          <p className="text-xl text-orange-100 text-pretty">
            Cập nhật đăng ký Facility và sản phẩm mỹ phẩm MoCRA đúng hạn với FDA hàng năm
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Thời gian xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-orange-700">1-2 tuần</p>
              <p className="text-sm text-gray-600 mt-1">Để chuẩn bị và gửi hồ sơ gia hạn</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-orange-600" />
                Chu kỳ gia hạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-orange-700">Hàng năm</p>
              <p className="text-sm text-gray-600 mt-1">Vào tháng 7 của mỗi năm</p>
            </CardContent>
          </Card>
        </div>

        {/* What is MoCRA Renewal */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Gia hạn MoCRA là gì?</h2>
          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded">
            <p className="text-gray-800 mb-4">
              Gia hạn MoCRA là quy trình hàng năm mà mỗi công ty sản xuất, nhập khẩu hoặc phân phối mỹ phẩm tại Hoa Kỳ 
              phải cập nhật thông tin Facility và danh sách sản phẩm với FDA.
            </p>
            <p className="text-gray-800 mt-4">
              <strong>Deadline:</strong> Phải hoàn tất gia hạn trước ngày 31/7 hàng năm. Nếu trễ deadline, Facility 
              Registration sẽ bị vô hiệu lực.
            </p>
          </div>
        </div>

        {/* Renewal Timeline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Lịch gia hạn MoCRA</h2>
          <div className="space-y-4">
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">Tháng 4-6: Chuẩn bị hồ sơ</h3>
                    <p className="text-gray-600">Thu thập thông tin cập nhật, danh sách sản phẩm mới/xoá bỏ/thay đổi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">Tháng 7 trước 31/7: Nộp gia hạn</h3>
                    <p className="text-gray-600">Gửi Facility Registration Renewal + cập nhật Product Listing lên Cosmetics Direct</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">Sau 31/7: FDA xác nhận</h3>
                    <p className="text-gray-600">Nhận email xác nhận gia hạn từ FDA, Facility Registration được cập nhật</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What to Renew */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Nội dung gia hạn MoCRA</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facility Registration Renewal</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Xác nhận địa chỉ cơ sở sản xuất</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Cập nhật loại hoạt động (nếu có thay đổi)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Xác nhận Responsible Person</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Cập nhật danh sách liên hệ</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Listing Update</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Thêm sản phẩm mới sản xuất trong năm</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Xoá sản phẩm ngừng sản xuất</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Cập nhật thành phần sản phẩm (nếu thay đổi)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Kiểm tra tuân thủ thành phần cấm</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Renewal Checklist */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Danh sách kiểm tra gia hạn</h2>
          <div className="space-y-3">
            {[
              'Thông tin Facility Registration hiện tại còn chính xác không?',
              'Có sản phẩm mới sản xuất trong năm qua cần thêm vào Product Listing?',
              'Có sản phẩm ngừng sản xuất cần xóa khỏi danh sách?',
              'Thành phần sản phẩm có thay đổi so với khai báo trước đó không?',
              'Responsible Person có thay đổi không?',
              'Địa chỉ liên hệ của công ty có thay đổi không?',
              'Có sản phẩm nào bị reported adverse events cần cập nhật không?',
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-orange-600 rounded flex-shrink-0 mt-0.5"
                    />
                    <label className="text-gray-700 cursor-pointer">{item}</label>
                  </div>
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
            <li>• Deadline gia hạn là 31/7 hàng năm - nếu trễ, Facility sẽ bị vô hiệu lực</li>
            <li>• Tất cả sản phẩm phải được khai báo trong Product Listing, không được bỏ sót</li>
            <li>• Nếu Responsible Person thay đổi, phải cập nhật ngay lập tức, không chờ gia hạn</li>
            <li>• Phải duy trì hồ sơ chứng minh sản phẩm tuân thủ quy định trong 3 năm</li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cần gia hạn MoCRA?</h3>
          <p className="text-gray-700 mb-6">
            Chúng tôi quản lý toàn bộ quy trình chuẩn bị và gửi gia hạn MoCRA đảm bảo không trễ deadline
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
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

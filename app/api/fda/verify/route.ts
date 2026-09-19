import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

// Email verification endpoint
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    if (!email || !token) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Lỗi xác thực</title>
          <style>
            body { font-family: 'Be Vietnam Pro', Arial, sans-serif; background: #f4f6ec; padding: 40px; text-align: center; margin: 0; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 14px; border: 1px solid #e6e9dd; }
            .accent-bar { height: 5px; background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%); border-radius: 14px 14px 0 0; margin: -40px -40px 30px -40px; }
            h1 { color: #365314; }
            p { color: #57534e; }
            a { color: #4d7c0f; text-decoration: none; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="accent-bar"></div>
            <h1>❌ Lỗi xác thực</h1>
            <p>Link xác thực không hợp lệ hoặc đã hết hạn.</p>
            <p><a href="https://www.veximglobal.com/fda-tracker">← Quay lại trang chủ</a></p>
          </div>
        </body>
        </html>
      `,
        {
          status: 400,
          headers: { "Content-Type": "text/html" },
        },
      )
    }

    const supabase = await createServerClient()

    // Find subscription with matching email and token (check expiry)
    const { data: subscription, error } = await supabase
      .from("fda_subscriptions")
      .select("*")
      .eq("email", email)
      .eq("verification_token", token)
      .gt("token_expires_at", new Date().toISOString()) // Token must not be expired
      .single()

    if (error || !subscription) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Lỗi xác thực</title>
          <style>
            body { font-family: 'Be Vietnam Pro', Arial, sans-serif; background: #f4f6ec; padding: 40px; text-align: center; margin: 0; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 14px; border: 1px solid #e6e9dd; }
            .accent-bar { height: 5px; background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%); border-radius: 14px 14px 0 0; margin: -40px -40px 30px -40px; }
            h1 { color: #365314; }
            p { color: #57534e; }
            a { color: #4d7c0f; text-decoration: none; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="accent-bar"></div>
            <h1>❌ Không tìm thấy đăng ký</h1>
            <p>Không tìm thấy đăng ký với email và token này.</p>
            <p>Link có thể đã hết hạn hoặc bạn đã xác thực trước đó.</p>
            <p style="margin-top: 30px;"><a href="https://www.veximglobal.com/fda-tracker">← Quay lại FDA Tracker</a></p>
          </div>
        </body>
        </html>
      `,
        {
          status: 404,
          headers: { "Content-Type": "text/html" },
        },
      )
    }

    // Check if already verified
    if (subscription.verified) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Đã xác thực</title>
          <style>
            body { font-family: 'Be Vietnam Pro', Arial, sans-serif; background: #f4f6ec; padding: 40px; text-align: center; margin: 0; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 14px; border: 1px solid #e6e9dd; }
            .accent-bar { height: 5px; background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%); border-radius: 14px 14px 0 0; margin: -40px -40px 30px -40px; }
            h1 { color: #4d7c0f; }
            p { color: #57534e; line-height: 1.6; }
            a { display: inline-block; background: #4d7c0f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="accent-bar"></div>
            <h1>✅ Email đã được xác thực trước đó</h1>
            <p>Email <strong>${email}</strong> đã được xác thực.</p>
            <p>Bạn đang nhận cảnh báo FDA theo lịch đã đăng ký.</p>
            <a href="https://www.veximglobal.com/fda-tracker">Xem cảnh báo FDA →</a>
          </div>
        </body>
        </html>
      `,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        },
      )
    }

    // Update subscription to verified
    const { error: updateError } = await supabase
      .from("fda_subscriptions")
      .update({
        verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      console.error("[v0] Error updating subscription:", updateError)
      throw updateError
    }

    console.log(`[v0] Email verified successfully: ${email}`)

    // Return success page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác thực thành công</title>
        <style>
          body { 
            font-family: 'Be Vietnam Pro', Arial, sans-serif; 
            background: linear-gradient(135deg, #ecfccb 0%, #f7fee7 100%); 
            padding: 40px; 
            text-align: center;
            margin: 0;
          }
          .container { 
            max-width: 550px; 
            margin: 0 auto; 
            background: white; 
            padding: 50px 40px; 
            border-radius: 16px; 
            border: 1px solid #e6e9dd;
            overflow: hidden;
          }
          .accent-bar {
            height: 6px;
            background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%);
            margin: -50px -40px 30px -40px;
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 { 
            color: #4d7c0f; 
            font-size: 28px;
            margin-bottom: 15px;
          }
          p { 
            color: #57534e; 
            line-height: 1.8; 
            margin-bottom: 15px;
            font-size: 16px;
          }
          .email-highlight {
            background: #f7fee7;
            border: 1px solid #d9f99d;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #3f6212;
            font-weight: 600;
          }
          .features {
            text-align: left;
            background: #f8faf3;
            border: 1px solid #e6e9dd;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
          }
          .features ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .features li {
            color: #44403c;
            margin-bottom: 8px;
          }
          .btn { 
            display: inline-block; 
            background: #4d7c0f; 
            color: white; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin-top: 20px; 
            font-weight: 600;
            transition: background 0.3s;
          }
          .btn:hover {
            background: #3f6212;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e6e9dd;
          }
          .footer p {
            color: #78716c;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="accent-bar"></div>
          <div class="success-icon">🎉</div>
          <h1>Xác thực email thành công!</h1>
          
          <p>Cảm ơn bạn đã xác nhận email:</p>
          <div class="email-highlight">${email}</div>
          
          <div class="features">
            <strong style="color: #3f6212;">Bạn sẽ nhận được:</strong>
            <ul>
              <li>✅ Cảnh báo FDA realtime từ Mỹ</li>
              <li>✅ Tóm tắt tiếng Việt với AI</li>
              <li>✅ Thông báo theo lịch: ${subscription.frequency === "daily" ? "Hàng ngày" : subscription.frequency === "weekly" ? "Hàng tuần" : "Ngay lập tức"}</li>
              <li>✅ Danh mục: ${subscription.categories.join(", ")}</li>
            </ul>
          </div>
          
          <p>Hệ thống đã kích hoạt và sẽ bắt đầu gửi cảnh báo theo lịch của bạn.</p>
          
          <a href="https://www.veximglobal.com/fda-tracker" class="btn">Xem cảnh báo FDA ngay →</a>
          
          <div class="footer">
            <p><strong>Vexim Global</strong> - Chuyên gia xuất nhập khẩu toàn cầu</p>
            <p>Email: contact@veximglobal.vn | Phone: 0373 685 634</p>
          </div>
        </div>
      </body>
      </html>
    `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      },
    )
  } catch (error) {
    console.error("[v0] Error in verification endpoint:", error)

    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Lỗi hệ thống</title>
        <style>
          body { font-family: 'Be Vietnam Pro', Arial, sans-serif; background: #f4f6ec; padding: 40px; text-align: center; margin: 0; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 14px; border: 1px solid #e6e9dd; }
          .accent-bar { height: 5px; background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%); border-radius: 14px 14px 0 0; margin: -40px -40px 30px -40px; }
          h1 { color: #365314; }
          p { color: #57534e; }
          a { color: #4d7c0f; text-decoration: none; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="accent-bar"></div>
          <h1>❌ Lỗi hệ thống</h1>
          <p>Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại sau.</p>
          <p style="margin-top: 30px;"><a href="https://www.veximglobal.com/fda-tracker">← Quay lại FDA Tracker</a></p>
        </div>
      </body>
      </html>
    `,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}

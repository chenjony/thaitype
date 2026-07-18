# ThaiType 上线前认证联调清单

> 当前状态：前端界面和代码已完成；Supabase、微信登录、LINE 登录暂未配置。请在正式上线前完成以下联调。

## 1. Supabase 项目

- [ ] 创建或确认生产环境 Supabase 项目
- [ ] 在 SQL Editor 执行 `supabase/schema.sql`
- [ ] 确认 `profiles` 包含 `username`、`display_name`、`avatar_url`、`country_code`
- [ ] 确认 `avatars` Storage bucket 已创建
- [ ] 检查头像权限：公开读取，登录用户只能写入自己的目录
- [ ] 检查排行榜函数会返回 `country_code`
- [ ] 将生产环境 Project URL 和 anon key 写入 `.env.production`

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SITE_URL=https://thaitypes.com
```

- [ ] 确认 `.env.production` 不提交到 Git
- [ ] 确认 service-role key 只存在于 Supabase 服务端，绝不能写入前端环境变量

## 2. 用户名和密码登录

- [ ] 部署用户名登录函数：`supabase functions deploy username-login`
- [ ] 确认 `supabase/config.toml` 中 `username-login` 的 `verify_jwt = false`
- [ ] 为用户名登录接口配置限流、验证码或其他防暴力破解措施
- [ ] 测试邮箱 + 密码登录
- [ ] 测试用户名 + 密码登录
- [ ] 测试重复用户名注册是否被拒绝
- [ ] 测试错误账号或密码不会泄露用户是否存在
- [ ] 测试退出登录和会话过期

## 3. 注册与邮件

- [ ] 在 Supabase 配置生产 SMTP 服务
- [ ] 配置注册确认邮件模板
- [ ] 配置密码重置邮件模板
- [ ] 设置发件人名称、发件邮箱和回复邮箱
- [ ] 将站点地址设置为 `https://thaitypes.com`
- [ ] 添加允许的回调地址：`https://thaitypes.com/**`
- [ ] 联调期间按需添加本地回调地址：`http://localhost:5173/**`
- [ ] 测试注册确认链接
- [ ] 测试忘记密码邮件和新密码设置
- [ ] 测试过期、重复使用和错误的重置链接
- [ ] 检查邮件是否进入垃圾邮件，并完成 SPF、DKIM、DMARC 配置

## 4. Google 和 Facebook

- [ ] 确认生产 OAuth 应用和客户端凭据
- [ ] 更新允许域名与生产回调地址
- [ ] 分别测试首次登录、再次登录、取消授权和授权失败
- [ ] 确认登录后正确同步显示名称和头像
- [ ] 确认用户可以在个人设置中修改显示名称、头像和国家

## 5. 微信登录

- [ ] 申请并审核微信开放平台网站应用
- [ ] 准备 App ID 和 App Secret
- [ ] 配置授权回调域名
- [ ] 在 Supabase 添加自定义 OAuth/OIDC provider，标识符使用 `wechat`
- [ ] 确认前端 provider 名称为 `custom:wechat`
- [ ] 测试扫码、取消、拒绝授权和回调失败
- [ ] 确认微信用户缺少邮箱时的账号资料和找回方案
- [ ] 确认同一用户使用微信和密码登录时的账号绑定策略

## 6. LINE 登录

- [ ] 在 LINE Developers 创建生产 Channel
- [ ] 准备 Channel ID 和 Channel Secret
- [ ] 配置 Callback URL
- [ ] 在 Supabase 添加自定义 OAuth/OIDC provider，标识符使用 `line`
- [ ] 确认前端 provider 名称为 `custom:line`
- [ ] 测试授权、取消授权、回调失败和 Token 过期
- [ ] 确认 LINE 用户资料、头像和邮箱授权范围
- [ ] 确认同一用户使用 LINE 和其他方式登录时的账号绑定策略

## 7. 用户资料与排行榜

- [ ] 测试修改显示名称
- [ ] 测试上传 JPG、PNG、WebP 头像
- [ ] 测试拒绝超过 2 MB 或不支持格式的头像
- [ ] 测试选择和修改国家/地区
- [ ] 确认排行榜显示：排名、用户、国家国旗与代码、WPM、准确率、日期
- [ ] 确认没有国家资料时显示 `—`
- [ ] 确认用户不能修改其他用户的资料或头像

## 8. 五语言检查

- [ ] 简体中文
- [ ] 繁体中文
- [ ] 英文
- [ ] 泰语
- [ ] 俄语
- [ ] 检查登录、注册、忘记密码、个人设置和排行榜国家字段
- [ ] 检查浏览器语言不在支持范围时默认使用英文

## 9. 上线前最终验收

- [ ] 在正式域名执行完整注册、登录、重置密码流程
- [ ] 分别使用桌面 Chrome、Safari、Edge 测试
- [ ] 检查手机或平板的设备限制页面
- [ ] 检查浏览器控制台和网络请求没有错误
- [ ] 确认 HTTPS、Cookie、OAuth 回调和跨域配置正确
- [ ] 检查隐私政策是否说明账户资料、头像、国家和第三方登录数据的用途
- [ ] 准备账号删除、数据导出和客服处理流程
- [ ] 执行 `npm run build` 并完成生产环境冒烟测试

## 10. VIP 纸质证书订单

- [ ] 选择并接入支持 THB 的支付渠道
- [ ] 实现 `vip/CERTIFICATE_ORDER_API.md` 定义的三个服务端接口
- [ ] 服务端严格验证支付金额为 ฿299 THB，不能信任前端回调参数
- [ ] 限制收件国家为泰国 `TH`，拒绝境外地址
- [ ] 配置私密环境变量 `CERTIFICATE_ORDER_EMAIL`
- [ ] 支付验证成功且地址提交后，向运营邮箱发送完整订单邮件
- [ ] 防止同一个支付流水被重复创建订单
- [ ] 测试付款失败、取消付款、重复回调和邮件发送失败
- [ ] 测试纸质证书打印清晰度、包装和泰国境内快递流程

## 相关代码

- `src/auth.js`：认证、注册、重置密码、资料更新
- `src/main.js`：登录、注册、个人设置和排行榜界面
- `src/data/countries.js`：国家列表和国旗
- `supabase/schema.sql`：用户资料、头像权限和排行榜数据
- `supabase/functions/username-login/index.ts`：用户名登录服务端函数
- `supabase/config.toml`：Edge Function 配置

# ThaiType 商业化行动指南

**适用项目：** thaitypes.com  
**日期：** 2026-07-17  
**目标：** 将免费泰语打字练习网站转化为具备收入能力的训练与认证平台

---

## 一、总体执行原则

1. **核心练习永久免费。** 不要破坏获客入口。
2. **付费卖结果，不卖输入框。** 用户愿意为进步、记录、证书、管理能力付费。
3. **先验证，再重开发。** 每个付费功能先用最小版本验证点击和支付意愿。
4. **完成页优先商业化。** 用户取得成绩时最容易转化。
5. **先 C 端现金流，再 B 端高客单价。** Pro 和证书先做，教师版随后。

---

## 二、30 天优先行动清单

### 第 1 周：埋点与变现入口

| 优先级 | 动作 | 负责人 | 产出 | 验收标准 |
|---|---|---|---|---|
| P0 | 增加 Pro 按钮 | 产品/开发 | Header 和完成页出现 Go Pro | 点击可进入 Pricing 页 |
| P0 | 创建 Pricing 页面 | 产品/开发 | /pricing 页面 | 有 Free / Pro / Classroom waitlist |
| P0 | 完成页增加证书付费入口 | 产品/开发 | Download Verified Certificate | 按钮点击可记录事件 |
| P0 | 接入基础分析 | 开发 | GA4/Plausible/PostHog | 可看到开始、完成、点击、注册事件 |
| P1 | 邮箱收集 | 产品/开发 | Pro/Teacher waitlist 表单 | 邮箱可保存和导出 |

### 第 2 周：证书 MVP

| 优先级 | 动作 | 产出 | 验收标准 |
|---|---|---|---|
| P0 | 设计免费证书 | PNG，有 ThaiType 水印 | 完成测试后可下载 |
| P0 | 设计高清证书 | PDF，无水印 | 支付后可下载 |
| P0 | 增加证书验证 ID | 每张证书有唯一编号 | 证书页显示编号 |
| P1 | 增加二维码 | 指向成绩验证页 | 手机扫码可打开验证页 |
| P1 | 写证书销售文案 | 完成页提示 | 点击率可追踪 |

建议文案：

> Great job! You typed Thai at {{WPM}} WPM with {{ACCURACY}} accuracy. Download a verified certificate to save and share your result.

### 第 3 周：Pro MVP 功能

| 优先级 | 动作 | 产出 | 验收标准 |
|---|---|---|---|
| P0 | 去广告权益 | Pro 用户不显示广告 | 登录 Pro 后广告隐藏 |
| P0 | 历史成绩 | 保存每次测试 WPM/准确率 | 用户可查看最近成绩 |
| P0 | 错误字符统计 | 记录 missed keys | 完成页显示 Top mistakes |
| P1 | 自定义练习增强 | Pro 可保存自定义文本 | 可复用练习文本 |
| P1 | 进度趋势图 | 简单折线图 | 显示最近 7/30 次成绩 |

### 第 4 周：支付与上线

| 优先级 | 动作 | 产出 | 验收标准 |
|---|---|---|---|
| P0 | 接入支付 | Stripe/Paddle/Lemon Squeezy | 能完成测试支付 |
| P0 | 设置价格 | 年付 + 终身 | Pricing 页显示清晰 |
| P0 | 权限校验 | Pro 功能仅会员可用 | 未付费用户看到升级提示 |
| P0 | 上线首版 | ThaiType Pro v1 | 真实用户可购买 |
| P1 | 退款和支持说明 | FAQ | 用户知道如何联系支持 |

---

## 三、推荐功能规格

### 3.1 Pricing 页面结构

页面标题：

> Improve your Thai typing faster with ThaiType Pro

套餐：

#### Free

- Basic Thai typing practice
- Basic leaderboard
- Standard certificate with watermark
- Ads supported

#### Pro — Recommended

- No ads
- Unlimited typing history
- Mistake analysis
- Custom practice texts
- Progress charts
- High-resolution certificates
- Daily goals

价格：

- $24.99/year
- $49 lifetime

#### Classroom — Coming Soon

- Create classes
- Assign typing practice
- Track student progress
- Export results
- Join waitlist

### 3.2 完成页结构

完成页应包含：

1. 成绩卡片：WPM、Accuracy、Missed、Duration
2. 对比：Best score / Last score / Improvement
3. 错误分析：Most missed keys
4. 下一步建议：Practice weak keys
5. 证书 CTA：Download verified certificate
6. Pro CTA：Save your progress with Pro
7. 分享 CTA：Share result

### 3.3 Pro 权限边界

| 功能 | Free | Pro |
|---|---|---|
| 基础练习 | ✅ | ✅ |
| 排行榜 | ✅ | ✅ |
| 广告 | ✅ | ❌ |
| 历史记录 | 最近 3 次 | 无限 |
| 错误分析 | 简单展示 | 完整分析 |
| 自定义文本 | 临时使用 | 保存和复用 |
| 证书 | 水印 PNG | 高清 PDF / 无水印 |
| 进度图表 | ❌ | ✅ |
| 每日目标 | ❌ | ✅ |

---

## 四、埋点事件清单

必须先埋点，否则无法判断商业化是否有效。

### 4.1 练习事件

| 事件名 | 触发时机 | 关键参数 |
|---|---|---|
| practice_started | 用户开始输入 | mode, duration, device |
| practice_completed | 测试完成 | wpm, accuracy, duration, mode |
| practice_restarted | 点击重新开始 | mode |
| keyboard_hint_toggled | 显示/隐藏提示 | state |

### 4.2 商业事件

| 事件名 | 触发时机 | 关键参数 |
|---|---|---|
| pro_cta_clicked | 点击 Go Pro | location |
| pricing_viewed | 访问价格页 | referrer |
| checkout_started | 开始支付 | plan |
| purchase_completed | 支付成功 | plan, amount |
| certificate_clicked | 点击证书下载 | wpm, accuracy |
| certificate_purchase_started | 开始购买证书 | certificate_type |
| certificate_purchase_completed | 购买成功 | amount |

### 4.3 教师版验证事件

| 事件名 | 触发时机 | 关键参数 |
|---|---|---|
| classroom_waitlist_viewed | 查看教师版区域 | source |
| classroom_waitlist_joined | 留邮箱 | role, organization |
| teacher_contact_clicked | 点击联系 | channel |

---

## 五、SEO 执行清单

### 第 1 批内容页面

| 页面 | 目标关键词 | CTA |
|---|---|---|
| /thai-keyboard-layout | Thai keyboard layout | Start practice |
| /kedmanee-keyboard-layout | Kedmanee keyboard | Practice Kedmanee |
| /how-to-type-thai-on-windows | how to type Thai on Windows | Try typing test |
| /how-to-type-thai-on-mac | how to type Thai on Mac | Try typing test |
| /thai-typing-practice | Thai typing practice | Start free practice |
| /thai-typing-test | Thai typing test | Start 1-minute test |
| /thai-typing-certificate | Thai typing certificate | Get certificate |
| /thai-typing-speed | Thai typing speed WPM | Test your WPM |
| /thai-typing-for-teachers | Thai typing for teachers | Join classroom waitlist |
| /learn-thai-typing | learn Thai typing | Start beginner path |

### 每篇页面基本结构

1. H1 包含关键词
2. 300–800 字实用内容
3. 图片或键盘布局说明
4. FAQ 3–5 个问题
5. 内链到练习页
6. CTA 按钮
7. Schema：FAQPage 或 HowTo

---

## 六、教师版验证脚本

### 6.1 目标渠道

- Reddit: r/learnthai
- Facebook 泰语学习群
- italki / Preply 老师
- 大学泰语课程老师
- 语言学校官网邮箱
- YouTube 泰语教学频道

### 6.2 外联私信模板

英文版：

> Hi, I built ThaiType, a free Thai typing practice tool for learners. I’m testing a classroom version that lets teachers assign Thai typing practice and track students’ WPM and accuracy. Would this be useful for your students? I’d love to offer free early access in exchange for feedback.

中文版理解：

> 我做了一个免费的泰语打字练习工具，现在准备做教师版，可以让老师布置练习、查看学生 WPM 和准确率。如果你教泰语，我希望邀请你免费试用并给反馈。

### 6.3 访谈问题

1. 你的学生现在是否需要练习泰语输入？
2. 你现在如何检查他们的输入能力？
3. 如果有班级排行榜和成绩导出，你会用吗？
4. 你最需要看哪些数据：WPM、准确率、错字、练习时间？
5. 你愿意为这个工具付费吗？如果愿意，合理价格是多少？
6. 你更愿意按老师付费，还是按学生数付费？

---

## 七、支付与套餐建议

### 第一版只上三个产品

| 产品 | 价格 | 目的 |
|---|---:|---|
| Verified Certificate | $2.99 | 测试即时付费意愿 |
| ThaiType Pro Annual | $24.99/年 | 核心订阅收入 |
| ThaiType Pro Lifetime | $49 一次性 | 提高早期现金转化 |

暂时不要上太多套餐，否则用户选择成本高。

### 支付工具建议

| 工具 | 适合情况 | 备注 |
|---|---|---|
| Stripe | 有 Stripe 可用主体 | 灵活、开发成熟 |
| Paddle | 面向全球数字产品 | 可处理税务，适合 SaaS |
| Lemon Squeezy | 小团队快速上线 | 适合数字产品和授权 |
| PayPal | 覆盖部分国际用户 | 可作为补充 |

---

## 八、每周管理看板

建议每周一查看以下数据：

| 模块 | 指标 | 目标 |
|---|---|---:|
| 流量 | 总访问用户 | 环比增长 |
| 练习 | practice_started | 访问到开始 >40% |
| 练习 | practice_completed | 开始到完成 >50% |
| 商业 | pro_cta_clicked | 完成用户中 >3% |
| 商业 | certificate_clicked | 完成用户中 >10% |
| 商业 | purchase_completed | 持续出现付费 |
| 留存 | 7 日复访 | >10% |
| SEO | Search Console clicks | 环比增长 |
| 教师版 | waitlist_joined | 每周新增 |

---

## 九、90 天里程碑

### 30 天

- 完成商业化入口
- 证书 MVP 上线
- Pricing 页面上线
- Pro 第一版上线
- 有完整数据埋点

### 60 天

- Pro 会员功能完善
- 发布至少 10 个 SEO 页面
- 开始获得自然搜索增长
- 有第一批付费用户
- 完成教师版需求访谈

### 90 天

- Classroom MVP 上线
- 3–5 位老师试用
- 明确教师版付费意愿
- 形成 Free / Pro / Certificate / Classroom 的商业闭环

---

## 十、Go / No-Go 决策标准

### 证书功能

继续投入条件：

- 完成页证书点击率 >10%
- 证书购买转化率 >1%

若低于标准：

- 优化证书设计和文案
- 降低价格到 $1.99
- 增加可验证二维码和分享价值

### Pro 会员

继续投入条件：

- Pricing 页访问到购买 >1%
- Pro CTA 点击率 >3%
- Pro 用户 7 日留存高于免费用户

若低于标准：

- 调整权益，把错误分析和历史成绩做得更明显
- 增加终身版
- 在完成页展示“你本周进步了多少”的预览

### Classroom

继续投入条件：

- 20 个以上老师/机构加入等待名单
- 3 个以上真实班级愿意试用
- 老师明确愿意为成绩追踪或导出付费

若低于标准：

- 暂缓完整开发
- 只保留自定义练习和成绩分享链接
- 继续做个人 Pro 和 SEO

---

## 十一、建议立即创建的任务列表

### 产品任务

- [ ] 设计 Pricing 页面
- [ ] 设计完成页商业化模块
- [ ] 设计证书模板
- [ ] 定义 Free / Pro 权限
- [ ] 设计历史成绩页面
- [ ] 设计错误分析模块

### 开发任务

- [ ] 接入分析工具
- [ ] 增加商业事件埋点
- [ ] 增加用户成绩保存
- [ ] 增加 Pro 权限判断
- [ ] 接入支付
- [ ] 生成 PDF 证书
- [ ] 创建证书验证页面

### 增长任务

- [ ] 写 10 个 SEO 页面
- [ ] 配置 Search Console
- [ ] 增加 FAQ Schema
- [ ] 制作 Thai keyboard layout 图片
- [ ] 建立教师版等待名单
- [ ] 外联 20 位老师

### 运营任务

- [ ] 每周查看转化数据
- [ ] 记录用户反馈
- [ ] 维护 FAQ
- [ ] 处理退款和支持邮箱
- [ ] 收集证书使用场景

---

## 十二、最终执行建议

从明天开始，最优先做这 5 件事：

1. **上线 Pricing 页面。** 哪怕支付还没接，也先验证点击。
2. **完成页加入证书和 Pro CTA。** 这是最高意图页面。
3. **埋点。** 没有数据就无法判断方向。
4. **做付费证书 MVP。** 最快验证收入。
5. **建立 Classroom waitlist。** 为 B2B 收入提前收集线索。

这套行动指南的核心不是“做很多功能”，而是用最短路径验证：用户是否愿意为泰语打字训练的结果付费。

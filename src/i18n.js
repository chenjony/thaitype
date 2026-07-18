export const SUPPORTED_LOCALES = ['en', 'zh-CN', 'zh-TW', 'th', 'ru']

const LABELS = { en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文', th: 'ไทย', ru: 'Русский' }

export function detectLocale() {
  const saved = localStorage.getItem('thaitype-locale')
  if (SUPPORTED_LOCALES.includes(saved)) return saved
  const lang = String(navigator.languages?.[0] || navigator.language || 'en').toLowerCase()
  if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') || lang.startsWith('zh-mo') || lang.includes('hant')) return 'zh-TW'
  if (lang.startsWith('zh')) return 'zh-CN'
  if (lang.startsWith('th')) return 'th'
  if (lang.startsWith('ru')) return 'ru'
  return 'en'
}

export const locale = detectLocale()

const COPY = {
  'zh-CN': {
    'Free custom practice is limited to 50 characters.':'免费版自定义练习最多 50 个字符。',
    'Untimed':'不限时','Kedmanee Practice':'Kedmanee 练习','space':'空格','⚠️ Please switch your system keyboard to Thai (Kedmanee Layout)':'⚠️ 请将系统键盘切换为泰语（Kedmanee 布局）','App sections':'应用栏目','Letter zone':'字母分区','Test duration':'测试时长','Thai font style':'泰文字体样式','Language':'语言','Close':'关闭',
    'Keyboard Guide':'键盘指南','About':'关于我们','VIP':'VIP','For Business':'企业服务','Sound On':'声音：开','Sound Off':'声音：关','Restart':'重新开始','Sign In':'登录','Sign Out':'退出','Practice':'练习','Global Ranking':'全球排行榜','Personal Best':'个人最佳','All-time high · ≥90% accuracy':'历史最高 · 准确率 ≥90%','Recent Test':'最近测试','Last completed session':'最近完成的一次练习','Letters':'字母','Words':'单词','Custom':'自定义','Zone Training':'分区训练','Home Row':'基准行','Top Row':'上排','Bottom Row':'下排','Full Keyboard':'全键盘','Repeat':'重复','Standard (Keyboard Print)':'标准字体（键帽印刷）','Modern (Loopless)':'现代字体（无圈体）','Time':'时间','Finish':'完成','Accuracy':'准确率','Missed':'错键','Start Practice':'开始练习','Start typing — timer begins on first keystroke':'开始输入——首次按键后开始计时','Show English Key Hints':'显示英文按键提示','Hide English Key Hints':'隐藏英文按键提示','Hide Keyboard':'隐藏键盘','Show Keyboard':'显示键盘','Top 50 · Personal best (≥90% accuracy)':'前 50 名 · 个人最佳（准确率 ≥90%）','Player':'用户','Acc':'准确率','Date':'日期','Loading…':'加载中…','Products':'产品','Free Practice':'免费练习','ThaiType VIP':'ThaiType VIP','Free Thai typing practice for everyone.':'面向所有人的免费泰语打字练习。','Privacy':'隐私政策','Sign in to ThaiType':'登录 ThaiType','Save scores, track personal bests, and climb the global ranking. Guests can still practice freely.':'保存成绩、追踪个人最佳并参与全球排名。游客仍可免费练习。','Continue with Google':'使用 Google 继续','Continue with Facebook':'使用 Facebook 继续','Session Complete':'练习完成','Most missed keys':'最常错的按键','Download Certificate Image':'下载证书图片','Try Again':'再试一次','See your progress with ThaiType VIP':'使用 ThaiType VIP 查看进步','Full history, weak-key insights, trends and verified certificates.':'完整历史、薄弱按键分析、趋势和可验证证书。','Perfect — no misses!':'太棒了——没有错误！','Press':'按下','Space':'空格','Shift':'Shift','Time\'s Up':'时间到','Time\'s Up!':'时间到！','Nice work!':'做得很好！','Timer Complete':'计时完成','Connect Supabase to enable the global leaderboard.':'连接 Supabase 后启用全球排行榜。','No ranked scores yet. Be the first!':'暂无排名成绩，成为第一个吧！'
  },
  'zh-TW': {
    'Free custom practice is limited to 50 characters.':'免費版自訂練習最多 50 個字元。',
    'Untimed':'不限時','Kedmanee Practice':'Kedmanee 練習','space':'空白鍵','⚠️ Please switch your system keyboard to Thai (Kedmanee Layout)':'⚠️ 請將系統鍵盤切換為泰語（Kedmanee 配置）','App sections':'應用程式分區','Letter zone':'字母分區','Test duration':'測試時間','Thai font style':'泰文字型樣式','Language':'語言','Close':'關閉',
    'Keyboard Guide':'鍵盤指南','About':'關於我們','VIP':'VIP','For Business':'企業服務','Sound On':'聲音：開','Sound Off':'聲音：關','Restart':'重新開始','Sign In':'登入','Sign Out':'登出','Practice':'練習','Global Ranking':'全球排行榜','Personal Best':'個人最佳','All-time high · ≥90% accuracy':'歷史最高 · 準確率 ≥90%','Recent Test':'最近測試','Last completed session':'最近完成的一次練習','Letters':'字母','Words':'單字','Custom':'自訂','Zone Training':'分區訓練','Home Row':'基準列','Top Row':'上排','Bottom Row':'下排','Full Keyboard':'全鍵盤','Repeat':'重複','Standard (Keyboard Print)':'標準字體（鍵帽印刷）','Modern (Loopless)':'現代字體（無圈體）','Time':'時間','Finish':'完成','Accuracy':'準確率','Missed':'錯鍵','Start Practice':'開始練習','Start typing — timer begins on first keystroke':'開始輸入——首次按鍵後開始計時','Show English Key Hints':'顯示英文按鍵提示','Hide English Key Hints':'隱藏英文按鍵提示','Hide Keyboard':'隱藏鍵盤','Show Keyboard':'顯示鍵盤','Top 50 · Personal best (≥90% accuracy)':'前 50 名 · 個人最佳（準確率 ≥90%）','Player':'使用者','Acc':'準確率','Date':'日期','Loading…':'載入中…','Products':'產品','Free Practice':'免費練習','ThaiType VIP':'ThaiType VIP','Free Thai typing practice for everyone.':'提供給所有人的免費泰語打字練習。','Privacy':'隱私政策','Sign in to ThaiType':'登入 ThaiType','Save scores, track personal bests, and climb the global ranking. Guests can still practice freely.':'儲存成績、追蹤個人最佳並參與全球排名。訪客仍可免費練習。','Continue with Google':'使用 Google 繼續','Continue with Facebook':'使用 Facebook 繼續','Session Complete':'練習完成','Most missed keys':'最常錯的按鍵','Download Certificate Image':'下載證書圖片','Try Again':'再試一次','See your progress with ThaiType VIP':'使用 ThaiType VIP 查看進步','Full history, weak-key insights, trends and verified certificates.':'完整歷史、弱項按鍵分析、趨勢和可驗證證書。','Perfect — no misses!':'太棒了——沒有錯誤！','Press':'按下','Space':'空白鍵','Shift':'Shift','Time\'s Up':'時間到','Time\'s Up!':'時間到！','Nice work!':'做得很好！','Timer Complete':'計時完成','Connect Supabase to enable the global leaderboard.':'連接 Supabase 後啟用全球排行榜。','No ranked scores yet. Be the first!':'尚無排名成績，成為第一位吧！'
  },
  th: {
    'Free custom practice is limited to 50 characters.':'การฝึกแบบกำหนดเองของแผนฟรีจำกัดที่ 50 อักขระ',
    'Untimed':'ไม่จับเวลา','Kedmanee Practice':'ฝึก Kedmanee','space':'เว้นวรรค','⚠️ Please switch your system keyboard to Thai (Kedmanee Layout)':'⚠️ โปรดเปลี่ยนแป้นพิมพ์ระบบเป็นภาษาไทย (Kedmanee)','App sections':'ส่วนของแอป','Letter zone':'โซนตัวอักษร','Test duration':'ระยะเวลาทดสอบ','Thai font style':'รูปแบบอักษรไทย','Language':'ภาษา','Close':'ปิด',
    'Keyboard Guide':'คู่มือแป้นพิมพ์','About':'เกี่ยวกับเรา','VIP':'VIP','For Business':'สำหรับองค์กร','Sound On':'เปิดเสียง','Sound Off':'ปิดเสียง','Restart':'เริ่มใหม่','Sign In':'เข้าสู่ระบบ','Sign Out':'ออกจากระบบ','Practice':'ฝึกพิมพ์','Global Ranking':'อันดับโลก','Personal Best':'สถิติส่วนตัว','All-time high · ≥90% accuracy':'สถิติสูงสุด · ความแม่นยำ ≥90%','Recent Test':'การทดสอบล่าสุด','Last completed session':'เซสชันล่าสุดที่เสร็จสิ้น','Letters':'ตัวอักษร','Words':'คำ','Custom':'กำหนดเอง','Zone Training':'ฝึกตามโซน','Home Row':'แถวเหย้า','Top Row':'แถวบน','Bottom Row':'แถวล่าง','Full Keyboard':'ทั้งแป้นพิมพ์','Repeat':'ทำซ้ำ','Standard (Keyboard Print)':'มาตรฐาน (ตัวอักษรบนแป้น)','Modern (Loopless)':'สมัยใหม่ (ไม่มีหัว)','Time':'เวลา','Finish':'เสร็จสิ้น','Accuracy':'ความแม่นยำ','Missed':'พิมพ์ผิด','Start Practice':'เริ่มฝึก','Start typing — timer begins on first keystroke':'เริ่มพิมพ์ — ตัวจับเวลาจะเริ่มเมื่อกดปุ่มแรก','Show English Key Hints':'แสดงคำใบ้ปุ่มอังกฤษ','Hide English Key Hints':'ซ่อนคำใบ้ปุ่มอังกฤษ','Hide Keyboard':'ซ่อนแป้นพิมพ์','Show Keyboard':'แสดงแป้นพิมพ์','Top 50 · Personal best (≥90% accuracy)':'50 อันดับแรก · สถิติส่วนตัว (ความแม่นยำ ≥90%)','Player':'ผู้เล่น','Acc':'แม่นยำ','Date':'วันที่','Loading…':'กำลังโหลด…','Products':'ผลิตภัณฑ์','Free Practice':'ฝึกฟรี','ThaiType VIP':'ThaiType VIP','Free Thai typing practice for everyone.':'ฝึกพิมพ์ภาษาไทยฟรีสำหรับทุกคน','Privacy':'ความเป็นส่วนตัว','Sign in to ThaiType':'เข้าสู่ระบบ ThaiType','Save scores, track personal bests, and climb the global ranking. Guests can still practice freely.':'บันทึกคะแนน ติดตามสถิติ และไต่อันดับโลก ผู้เยี่ยมชมยังฝึกได้ฟรี','Continue with Google':'ดำเนินการต่อด้วย Google','Continue with Facebook':'ดำเนินการต่อด้วย Facebook','Session Complete':'ฝึกเสร็จแล้ว','Most missed keys':'ปุ่มที่พลาดบ่อยที่สุด','Download Certificate Image':'ดาวน์โหลดภาพใบรับรอง','Try Again':'ลองอีกครั้ง','See your progress with ThaiType VIP':'ดูพัฒนาการด้วย ThaiType VIP','Full history, weak-key insights, trends and verified certificates.':'ประวัติทั้งหมด วิเคราะห์ปุ่มที่อ่อน แนวโน้ม และใบรับรองที่ตรวจสอบได้','Perfect — no misses!':'ยอดเยี่ยม — ไม่มีข้อผิดพลาด!','Press':'กด','Space':'เว้นวรรค','Shift':'Shift','Time\'s Up':'หมดเวลา','Time\'s Up!':'หมดเวลา!','Nice work!':'ทำได้ดีมาก!','Timer Complete':'ครบเวลา','Connect Supabase to enable the global leaderboard.':'เชื่อมต่อ Supabase เพื่อเปิดใช้อันดับโลก','No ranked scores yet. Be the first!':'ยังไม่มีคะแนนในอันดับ มาเป็นคนแรกกัน!'
  },
  ru: {
    'Free custom practice is limited to 50 characters.':'В бесплатном плане свой текст ограничен 50 символами.',
    'Untimed':'Без таймера','Kedmanee Practice':'Практика Kedmanee','space':'пробел','⚠️ Please switch your system keyboard to Thai (Kedmanee Layout)':'⚠️ Переключите системную клавиатуру на тайскую раскладку Kedmanee','App sections':'Разделы приложения','Letter zone':'Зона букв','Test duration':'Длительность теста','Thai font style':'Стиль тайского шрифта','Language':'Язык','Close':'Закрыть',
    'Keyboard Guide':'Руководство по клавиатуре','About':'О нас','VIP':'VIP','For Business':'Для бизнеса','Sound On':'Звук включён','Sound Off':'Звук выключен','Restart':'Начать заново','Sign In':'Войти','Sign Out':'Выйти','Practice':'Практика','Global Ranking':'Мировой рейтинг','Personal Best':'Личный рекорд','All-time high · ≥90% accuracy':'Лучший результат · точность ≥90%','Recent Test':'Последний тест','Last completed session':'Последняя завершённая сессия','Letters':'Буквы','Words':'Слова','Custom':'Свой текст','Zone Training':'Тренировка зон','Home Row':'Основной ряд','Top Row':'Верхний ряд','Bottom Row':'Нижний ряд','Full Keyboard':'Вся клавиатура','Repeat':'Повтор','Standard (Keyboard Print)':'Стандартный шрифт','Modern (Loopless)':'Современный шрифт','Time':'Время','Finish':'Завершить','Accuracy':'Точность','Missed':'Ошибки','Start Practice':'Начать практику','Start typing — timer begins on first keystroke':'Начните печатать — таймер запустится с первого нажатия','Show English Key Hints':'Показать английские подсказки','Hide English Key Hints':'Скрыть английские подсказки','Hide Keyboard':'Скрыть клавиатуру','Show Keyboard':'Показать клавиатуру','Top 50 · Personal best (≥90% accuracy)':'Топ-50 · личный рекорд (точность ≥90%)','Player':'Игрок','Acc':'Точность','Date':'Дата','Loading…':'Загрузка…','Products':'Продукты','Free Practice':'Бесплатная практика','ThaiType VIP':'ThaiType VIP','Free Thai typing practice for everyone.':'Бесплатная практика тайской печати для всех.','Privacy':'Конфиденциальность','Sign in to ThaiType':'Войти в ThaiType','Save scores, track personal bests, and climb the global ranking. Guests can still practice freely.':'Сохраняйте результаты, отслеживайте рекорды и поднимайтесь в мировом рейтинге. Гости могут практиковаться бесплатно.','Continue with Google':'Продолжить с Google','Continue with Facebook':'Продолжить с Facebook','Session Complete':'Сессия завершена','Most missed keys':'Самые частые ошибки','Download Certificate Image':'Скачать изображение сертификата','Try Again':'Попробовать снова','See your progress with ThaiType VIP':'Следите за прогрессом с ThaiType VIP','Full history, weak-key insights, trends and verified certificates.':'Полная история, анализ слабых клавиш, динамика и проверяемые сертификаты.','Perfect — no misses!':'Идеально — без ошибок!','Press':'Нажмите','Space':'Пробел','Shift':'Shift','Time\'s Up':'Время вышло','Time\'s Up!':'Время вышло!','Nice work!':'Отличная работа!','Timer Complete':'Время завершено','Connect Supabase to enable the global leaderboard.':'Подключите Supabase, чтобы включить мировой рейтинг.','No ranked scores yet. Be the first!':'В рейтинге пока нет результатов. Будьте первым!'
  },
}

Object.assign(COPY['zh-CN'], {
  'Welcome to ThaiType':'欢迎使用 ThaiType','Create Account':'创建账户','Username or email':'用户名或邮箱','Password':'密码','Forgot password?':'忘记密码？','Username':'用户名','Display name':'显示名称','Email':'邮箱','Country':'国家/地区','Select country':'选择国家/地区','Send Reset Link':'发送重置链接','Back to sign in':'返回登录','or continue with':'或使用以下方式继续','Continue with WeChat':'使用微信继续','Continue with LINE':'使用 LINE 继续','Profile Settings':'个人设置','Profile photo':'头像','Save Profile':'保存资料','New password':'新密码','Update Password':'更新密码','Settings':'设置'
})
Object.assign(COPY['zh-TW'], {
  'Welcome to ThaiType':'歡迎使用 ThaiType','Create Account':'建立帳戶','Username or email':'使用者名稱或電子郵件','Password':'密碼','Forgot password?':'忘記密碼？','Username':'使用者名稱','Display name':'顯示名稱','Email':'電子郵件','Country':'國家／地區','Select country':'選擇國家／地區','Send Reset Link':'傳送重設連結','Back to sign in':'返回登入','or continue with':'或使用以下方式繼續','Continue with WeChat':'使用微信繼續','Continue with LINE':'使用 LINE 繼續','Profile Settings':'個人設定','Profile photo':'頭像','Save Profile':'儲存資料','New password':'新密碼','Update Password':'更新密碼','Settings':'設定'
})
Object.assign(COPY.th, {
  'Welcome to ThaiType':'ยินดีต้อนรับสู่ ThaiType','Create Account':'สร้างบัญชี','Username or email':'ชื่อผู้ใช้หรืออีเมล','Password':'รหัสผ่าน','Forgot password?':'ลืมรหัสผ่าน?','Username':'ชื่อผู้ใช้','Display name':'ชื่อที่แสดง','Email':'อีเมล','Country':'ประเทศ','Select country':'เลือกประเทศ','Send Reset Link':'ส่งลิงก์รีเซ็ต','Back to sign in':'กลับไปเข้าสู่ระบบ','or continue with':'หรือดำเนินการต่อด้วย','Continue with WeChat':'ดำเนินการต่อด้วย WeChat','Continue with LINE':'ดำเนินการต่อด้วย LINE','Profile Settings':'ตั้งค่าโปรไฟล์','Profile photo':'รูปโปรไฟล์','Save Profile':'บันทึกโปรไฟล์','New password':'รหัสผ่านใหม่','Update Password':'อัปเดตรหัสผ่าน','Settings':'ตั้งค่า'
})
Object.assign(COPY.ru, {
  'Welcome to ThaiType':'Добро пожаловать в ThaiType','Create Account':'Создать аккаунт','Username or email':'Имя пользователя или email','Password':'Пароль','Forgot password?':'Забыли пароль?','Username':'Имя пользователя','Display name':'Отображаемое имя','Email':'Email','Country':'Страна','Select country':'Выберите страну','Send Reset Link':'Отправить ссылку','Back to sign in':'Вернуться ко входу','or continue with':'или продолжить через','Continue with WeChat':'Продолжить с WeChat','Continue with LINE':'Продолжить с LINE','Profile Settings':'Настройки профиля','Profile photo':'Фото профиля','Save Profile':'Сохранить профиль','New password':'Новый пароль','Update Password':'Обновить пароль','Settings':'Настройки'
})

export function t(text) {
  return COPY[locale]?.[text] || text
}

function translateElement(root) {
  if (locale === 'en') return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  for (const node of nodes) {
    const raw = node.nodeValue
    const trimmed = raw.trim()
    const translated = COPY[locale]?.[trimmed]
    if (translated) node.nodeValue = raw.replace(trimmed, translated)
  }
  root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach((el) => {
    for (const attr of ['placeholder', 'title', 'aria-label']) {
      const value = el.getAttribute(attr)
      if (value && COPY[locale]?.[value]) el.setAttribute(attr, COPY[locale][value])
    }
  })
}

export function initI18n(root = document.body) {
  document.documentElement.lang = locale
  const meta = {
    'zh-CN':['泰语打字测试与练习 | 掌握 Kedmanee 键盘','免费练习泰语 Kedmanee 打字，测试速度与准确率，使用可视化键盘、分区训练和全球排行榜。'],
    'zh-TW':['泰語打字測試與練習 | 掌握 Kedmanee 鍵盤','免費練習泰語 Kedmanee 打字，測試速度與準確率，使用視覺化鍵盤、分區訓練和全球排行榜。'],
    th:['ทดสอบและฝึกพิมพ์ภาษาไทย | แป้นพิมพ์ Kedmanee','ฝึกพิมพ์ไทย Kedmanee ฟรี ทดสอบความเร็วและความแม่นยำ พร้อมแป้นพิมพ์แบบภาพ การฝึกตามโซน และอันดับโลก'],
    ru:['Тест и практика тайской печати | Клавиатура Kedmanee','Бесплатная практика тайской печати Kedmanee: скорость, точность, визуальная клавиатура, зоны и мировой рейтинг.'],
  }[locale]
  if (meta) {
    document.title = meta[0]
    const description = document.querySelector('meta[name="description"]')
    if (description) description.content = meta[1]
  }
  translateElement(root)
  const observer = new MutationObserver((changes) => {
    for (const change of changes) {
      change.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) translateElement(node)
        if (node.nodeType === Node.TEXT_NODE && COPY[locale]?.[node.nodeValue.trim()]) {
          const raw = node.nodeValue
          node.nodeValue = raw.replace(raw.trim(), COPY[locale][raw.trim()])
        }
      })
    }
  })
  observer.observe(root, { childList: true, subtree: true })
}

export function languageSelect() {
  return `<select class="language-select" id="language-select" aria-label="Language">${SUPPORTED_LOCALES.map((code) => `<option value="${code}"${code === locale ? ' selected' : ''}>${LABELS[code]}</option>`).join('')}</select>`
}

export function bindLanguageSelect() {
  document.getElementById('language-select')?.addEventListener('change', (event) => {
    localStorage.setItem('thaitype-locale', event.target.value)
    window.location.reload()
  })
}

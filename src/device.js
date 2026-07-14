/**
 * Detect phones / tablets so we can show a keyboard-requirement gate.
 * Combines UA heuristics, coarse pointer, and viewport width.
 */
export function isMobileOrTablet() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false

  const ua = navigator.userAgent || ''
  const uaMatch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  // iPadOS 13+ may report as Mac; treat touch Macs with coarse pointer as tablets
  const iPadOsDesktopUa =
    navigator.platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number'
      ? navigator.maxTouchPoints > 1
      : false

  const narrowViewport = window.innerWidth < 1024
  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches &&
    narrowViewport

  return uaMatch || iPadOsDesktopUa || narrowViewport || coarsePointer
}

/** Normalize navigator.language into a supported gate locale. */
export function detectGateLocale() {
  const raw =
    (typeof navigator !== 'undefined' &&
      (navigator.languages?.[0] || navigator.language || navigator.userLanguage)) ||
    'en'
  const lang = String(raw).toLowerCase().replace('_', '-')

  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('th')) return 'th'
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('vi')) return 'vi'
  return 'en'
}

const GATE_COPY = {
  en: {
    lang: 'en',
    title: 'Physical keyboard recommended',
    body: 'For the best ThaiType experience, please use a computer or a mobile device with a physical keyboard. Thai Kedmanee practice needs real key travel for muscle-memory training.',
    soft: 'If you already have a physical keyboard connected, tap confirm below to continue. You can still browse without one — but typing practice will not work on a touch-only screen.',
    confirm: 'I have a physical keyboard',
    continueWithout: 'Continue without a keyboard',
  },
  zh: {
    lang: 'zh-CN',
    title: '建议使用实体键盘',
    body: '为了获得最好的使用体验，请使用电脑，或带有实体键盘的移动设备访问我们的网站。泰语 Kedmanee 盲打练习需要真实按键，才能建立肌肉记忆。',
    soft: '若您已连接实体键盘，请点击下方确认后继续。没有实体键盘也可以进入网站浏览，但触屏无法进行打字练习。',
    confirm: '我已连接实体键盘',
    continueWithout: '没有键盘，仍要进入',
  },
  th: {
    lang: 'th',
    title: 'แนะนำให้ใช้คีย์บอร์ดจริง',
    body: 'เพื่อประสบการณ์ที่ดีที่สุด กรุณาใช้คอมพิวเตอร์ หรืออุปกรณ์พกพาที่ต่อคีย์บอร์ดจริง ThaiType ออกแบบมาสำหรับฝึกพิมพ์ไทยแบบ Kedmanee ด้วยปุ่มจริง เพื่อสร้างความจำกล้ามเนื้อ',
    soft: 'หากคุณเชื่อมต่อคีย์บอร์ดแล้ว ให้กดยืนยันด้านล่างเพื่อเข้าใช้งาน คุณยังเข้าชมเว็บได้แม้ไม่มีคีย์บอร์ด แต่การฝึกพิมพ์จะใช้ไม่ได้บนหน้าจอสัมผัสอย่างเดียว',
    confirm: 'ฉันมีคีย์บอร์ดจริงแล้ว',
    continueWithout: 'เข้าต่อโดยไม่มีคีย์บอร์ด',
  },
  ja: {
    lang: 'ja',
    title: '物理キーボードのご利用を推奨',
    body: '最高の体験のため、パソコン、または物理キーボード付きのモバイル端末でご利用ください。タイ語 Kedmanee のブラインドタッチ練習には、実際のキー入力が必要です。',
    soft: '物理キーボードを接続済みの方は、下の確認ボタンから続行できます。キーボードがなくてもサイトは閲覧できますが、タッチ画面だけではタイピング練習はできません。',
    confirm: '物理キーボードを接続済み',
    continueWithout: 'キーボードなしで続行',
  },
  ko: {
    lang: 'ko',
    title: '물리 키보드 사용을 권장합니다',
    body: '최상의 경험을 위해 컴퓨터 또는 물리 키보드가 연결된 모바일 기기에서 이용해 주세요. 태국어 Kedmanee 타자 연습은 실제 키 입력이 필요합니다.',
    soft: '물리 키보드를 이미 연결했다면 아래 확인을 눌러 계속하세요. 키보드 없이도 사이트는 볼 수 있지만, 터치만으로는 타자 연습을 할 수 없습니다.',
    confirm: '물리 키보드를 연결했습니다',
    continueWithout: '키보드 없이 계속',
  },
  vi: {
    lang: 'vi',
    title: 'Nên dùng bàn phím vật lý',
    body: 'Để có trải nghiệm tốt nhất, hãy dùng máy tính hoặc thiết bị di động có bàn phím vật lý. Luyện gõ tiếng Thái Kedmanee cần phím thật để xây dựng trí nhớ cơ bắp.',
    soft: 'Nếu đã kết nối bàn phím vật lý, hãy xác nhận bên dưới để tiếp tục. Bạn vẫn có thể vào xem khi không có bàn phím — nhưng luyện gõ sẽ không dùng được trên màn hình cảm ứng.',
    confirm: 'Tôi đã kết nối bàn phím vật lý',
    continueWithout: 'Tiếp tục không có bàn phím',
  },
}

export function getDeviceGateCopy(locale = detectGateLocale()) {
  return GATE_COPY[locale] || GATE_COPY.en
}

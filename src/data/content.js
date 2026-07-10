import { LETTER_ZONES } from '../data/keyboard.js'

/** Common Thai consonants & vowels for Letters mode (full keyboard) */
export const THAI_LETTERS = [
  'ก',
  'ข',
  'ค',
  'ง',
  'จ',
  'ฉ',
  'ช',
  'ซ',
  'ญ',
  'ด',
  'ต',
  'ถ',
  'ท',
  'น',
  'บ',
  'ป',
  'ผ',
  'ฝ',
  'พ',
  'ฟ',
  'ภ',
  'ม',
  'ย',
  'ร',
  'ล',
  'ว',
  'ศ',
  'ษ',
  'ส',
  'ห',
  'อ',
  'ฮ',
  'ะ',
  'า',
  'ิ',
  'ี',
  'ึ',
  'ื',
  'ุ',
  'ู',
  'เ',
  'แ',
  'โ',
  'ใ',
  'ไ',
  'ำ',
  '่',
  '้',
  '๊',
  '๋',
]

/** High-frequency Thai words & short phrases */
export const THAI_WORDS = [
  'สวัสดี',
  'ขอบคุณ',
  'ยินดีต้อนรับ',
  'ภาษาไทย',
  'อาหาร',
  'น้ำ',
  'บ้าน',
  'โรงเรียน',
  'เพื่อน',
  'ครอบครัว',
  'ความสุข',
  'รัก',
  'ดีใจ',
  'สวยงาม',
  'อร่อย',
  'เช้า',
  'เย็น',
  'กลางคืน',
  'วันจันทร์',
  'วันศุกร์',
  'ประเทศไทย',
  'กรุงเทพ',
  'เชียงใหม่',
  'ภูเก็ต',
  'ทะเล',
  'ภูเขา',
  'ดอกไม้',
  'หนังสือ',
  'คอมพิวเตอร์',
  'พิมพ์ดีด',
  'ฝึกฝน',
  'เรียนรู้',
  'เข้าใจ',
  'พูดคุย',
  'เดินทาง',
  'ทำงาน',
  'พักผ่อน',
  'สุขภาพ',
  'อากาศ',
  'ฝนตก',
  'แดดออก',
  'ลมเย็น',
  'กาแฟ',
  'ชาเขียว',
  'ผลไม้',
  'มะม่วง',
  'ทุเรียน',
  'ส้มตำ',
  'ผัดไทย',
  'ต้มยำ',
]

export const THAI_SENTENCES = [
  'สวัสดีครับ ยินดีที่ได้รู้จัก',
  'วันนี้อากาศดีมากเลย',
  'ฉันชอบเรียนภาษาไทย',
  'กรุงเทพเป็นเมืองที่สวยงาม',
  'อาหารไทยมีรสชาติอร่อย',
  'การพิมพ์ดีดต้องฝึกฝนทุกวัน',
  'ขอบคุณสำหรับความช่วยเหลือ',
  'ขอให้มีความสุขและสุขภาพดี',
  'พรุ่งนี้เราจะไปเที่ยวทะเล',
  'หนังสือเล่มนี้สนุกมาก',
]

function pick(arr, n) {
  const copy = [...arr]
  const out = []
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

function poolForZone(zoneId = 'full') {
  const zone = LETTER_ZONES[zoneId] || LETTER_ZONES.full
  if (!zone.chars || zone.chars.length === 0) return THAI_LETTERS
  return zone.chars
}

/**
 * @param {number} count
 * @param {'home'|'top'|'bottom'|'full'} [zoneId='full']
 */
export function generateLettersText(count = 24, zoneId = 'full') {
  const pool = poolForZone(zoneId)
  const chars = []
  for (let i = 0; i < count; i++) {
    chars.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return chars.join(' ')
}

/**
 * @param {number} wordCount
 * @param {number} [multiplier=1] consecutive repeats per word
 */
export function generateWordsText(wordCount = 12, multiplier = 1) {
  const n = Math.max(1, Math.min(10, Number(multiplier) || 1))

  // Sentence mode only when no repetition (keeps natural phrasing)
  if (n === 1 && Math.random() > 0.45) {
    return pick(THAI_SENTENCES, 2 + Math.floor(Math.random() * 2)).join(' ')
  }

  const words = pick(THAI_WORDS, wordCount)
  const expanded = []
  for (const w of words) {
    for (let i = 0; i < n; i++) expanded.push(w)
  }
  return expanded.join(' ')
}

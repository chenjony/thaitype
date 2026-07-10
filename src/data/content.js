/** Common Thai consonants & vowels for Letters mode */
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

export function generateLettersText(count = 24) {
  const chars = []
  for (let i = 0; i < count; i++) {
    chars.push(THAI_LETTERS[Math.floor(Math.random() * THAI_LETTERS.length)])
  }
  return chars.join(' ')
}

export function generateWordsText(wordCount = 12) {
  const useSentences = Math.random() > 0.45
  if (useSentences) {
    return pick(THAI_SENTENCES, 2 + Math.floor(Math.random() * 2)).join(' ')
  }
  return pick(THAI_WORDS, wordCount).join(' ')
}

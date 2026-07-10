/**
 * Kedmanee layout: physical key code → { normal, shift }
 * Labels follow the standard Thai Kedmanee keyboard.
 */
export const KEDMANEE = {
  Backquote: { normal: '_', shift: '%' },
  Digit1: { normal: 'ๅ', shift: '+' },
  Digit2: { normal: '/', shift: '๑' },
  Digit3: { normal: '-', shift: '๒' },
  Digit4: { normal: 'ภ', shift: '๓' },
  Digit5: { normal: 'ถ', shift: '๔' },
  Digit6: { normal: 'ุ', shift: 'ู' },
  Digit7: { normal: 'ึ', shift: '฿' },
  Digit8: { normal: 'ค', shift: '๕' },
  Digit9: { normal: 'ต', shift: '๖' },
  Digit0: { normal: 'จ', shift: '๗' },
  Minus: { normal: 'ข', shift: '๘' },
  Equal: { normal: 'ช', shift: '๙' },

  KeyQ: { normal: 'ๆ', shift: '๐' },
  KeyW: { normal: 'ไ', shift: '"' },
  KeyE: { normal: 'ำ', shift: 'ฎ' },
  KeyR: { normal: 'พ', shift: 'ฑ' },
  KeyT: { normal: 'ะ', shift: 'ธ' },
  KeyY: { normal: 'ั', shift: 'ํ' },
  KeyU: { normal: 'ี', shift: '๊' },
  KeyI: { normal: 'ร', shift: 'ณ' },
  KeyO: { normal: 'น', shift: 'ฯ' },
  KeyP: { normal: 'ย', shift: 'ญ' },
  BracketLeft: { normal: 'บ', shift: 'ฐ' },
  BracketRight: { normal: 'ล', shift: ',' },
  Backslash: { normal: 'ฃ', shift: 'ฅ' },

  KeyA: { normal: 'ฟ', shift: 'ฤ' },
  KeyS: { normal: 'ห', shift: 'ฆ' },
  KeyD: { normal: 'ก', shift: 'ฏ' },
  KeyF: { normal: 'ด', shift: 'โ' },
  KeyG: { normal: 'เ', shift: 'ฌ' },
  KeyH: { normal: '้', shift: '็' },
  KeyJ: { normal: '่', shift: '๋' },
  KeyK: { normal: 'า', shift: 'ษ' },
  KeyL: { normal: 'ส', shift: 'ศ' },
  Semicolon: { normal: 'ว', shift: 'ซ' },
  Quote: { normal: 'ง', shift: '.' },

  KeyZ: { normal: 'ผ', shift: '(' },
  KeyX: { normal: 'ป', shift: ')' },
  KeyC: { normal: 'แ', shift: 'ฉ' },
  KeyV: { normal: 'อ', shift: 'ฮ' },
  KeyB: { normal: 'ิ', shift: 'ฺ' },
  KeyN: { normal: 'ื', shift: '์' },
  KeyM: { normal: 'ท', shift: '?' },
  Comma: { normal: 'ม', shift: 'ฒ' },
  Period: { normal: 'ใ', shift: 'ฬ' },
  Slash: { normal: 'ฝ', shift: 'ฦ' },

  Space: { normal: ' ', shift: ' ' },
}

export const KEYBOARD_ROWS = [
  [
    'Backquote',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
  ],
  [
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyR',
    'KeyT',
    'KeyY',
    'KeyU',
    'KeyI',
    'KeyO',
    'KeyP',
    'BracketLeft',
    'BracketRight',
    'Backslash',
  ],
  [
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyJ',
    'KeyK',
    'KeyL',
    'Semicolon',
    'Quote',
  ],
  [
    'KeyZ',
    'KeyX',
    'KeyC',
    'KeyV',
    'KeyB',
    'KeyN',
    'KeyM',
    'Comma',
    'Period',
    'Slash',
  ],
  ['Space'],
]

/** Map Thai character → physical key code (prefer unshifted) */
export function buildCharToCodeMap() {
  const map = new Map()
  for (const [code, chars] of Object.entries(KEDMANEE)) {
    if (!map.has(chars.normal)) map.set(chars.normal, code)
    if (!map.has(chars.shift)) map.set(chars.shift, code)
  }
  return map
}

export const CHAR_TO_CODE = buildCharToCodeMap()

/** Characters that live on the Shift layer of Kedmanee (not the unshifted glyph). */
export function buildShiftCharSet() {
  const set = new Set()
  for (const chars of Object.values(KEDMANEE)) {
    if (chars.shift !== chars.normal) set.add(chars.shift)
  }
  return set
}

export const SHIFT_CHARS = buildShiftCharSet()

export function charRequiresShift(ch) {
  return SHIFT_CHARS.has(ch)
}

/** Physical QWERTY label shown on each key (English bridge hints) */
export const CODE_TO_QWERTY = {
  Backquote: '`',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Digit0: '0',
  Minus: '-',
  Equal: '=',
  KeyQ: 'Q',
  KeyW: 'W',
  KeyE: 'E',
  KeyR: 'R',
  KeyT: 'T',
  KeyY: 'Y',
  KeyU: 'U',
  KeyI: 'I',
  KeyO: 'O',
  KeyP: 'P',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  KeyA: 'A',
  KeyS: 'S',
  KeyD: 'D',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  Semicolon: ';',
  Quote: "'",
  KeyZ: 'Z',
  KeyX: 'X',
  KeyC: 'C',
  KeyV: 'V',
  KeyB: 'B',
  KeyN: 'N',
  KeyM: 'M',
  Comma: ',',
  Period: '.',
  Slash: '/',
  Space: 'Space',
  ShiftLeft: 'Shift',
  ShiftRight: 'Shift',
}

/** Letter-mode zone training pools (unshifted Kedmanee glyphs per row) */
function glyphsFromCodes(codes, { includeShift = false } = {}) {
  const out = []
  for (const code of codes) {
    const entry = KEDMANEE[code]
    if (!entry) continue
    if (entry.normal && entry.normal !== ' ') out.push(entry.normal)
    if (includeShift && entry.shift && entry.shift !== entry.normal) out.push(entry.shift)
  }
  return [...new Set(out)]
}

export const LETTER_ZONES = {
  home: {
    id: 'home',
    label: 'Home Row',
    // 基准行: ฟ ห ก ด เ ้ ่ า (+ ส ว ง for full home-row muscle memory)
    chars: glyphsFromCodes(KEYBOARD_ROWS[2]),
  },
  top: {
    id: 'top',
    label: 'Top Row',
    chars: glyphsFromCodes(KEYBOARD_ROWS[1]),
  },
  bottom: {
    id: 'bottom',
    label: 'Bottom Row',
    chars: glyphsFromCodes(KEYBOARD_ROWS[3]),
  },
  full: {
    id: 'full',
    label: 'Full Keyboard',
    chars: null, // use THAI_LETTERS in content.js
  },
}

export function qwertyLabelForChar(ch) {
  const code = CHAR_TO_CODE.get(ch)
  if (!code) return null
  const label = CODE_TO_QWERTY[code]
  if (!label) return null
  const needShift = charRequiresShift(ch)
  return needShift ? `Shift + ${label}` : label
}
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

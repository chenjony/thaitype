import { THAI_COMMON_WORDS } from './words.js'
import { ROWS, CHAR_TO_KEY } from './keyboard.js'

const TONES = new Set(['่','้','๊','๋'])
const VOWELS = new Set(['ะ','ั','า','ำ','ิ','ี','ึ','ื','ุ','ู','เ','แ','โ','ใ','ไ'])
const position = new Map(ROWS.flatMap((row,r)=>row.map((code,c)=>[code,{r,c}])))

export function diagnose(expected, actual) {
  const wanted = CHAR_TO_KEY.get(expected), entered = CHAR_TO_KEY.get(actual)
  if (wanted?.code === entered?.code && wanted?.shift !== entered?.shift) return 'shift'
  if (TONES.has(expected) && TONES.has(actual)) return 'tone'
  if (VOWELS.has(expected) && VOWELS.has(actual)) return 'vowel'
  if (wanted && entered) {
    const a=position.get(wanted.code), b=position.get(entered.code)
    if (a&&b&&Math.abs(a.r-b.r)<=1&&Math.abs(a.c-b.c)<=1) return 'adjacent'
  }
  return 'substitution'
}

export function summarizeAttempts(attempts) {
  const chars={}, diagnoses={}
  for (const item of attempts) {
    if (!item.expected || /\s/.test(item.expected)) continue
    const stat=chars[item.expected]||(chars[item.expected]={attempts:0,errors:0,totalLatency:0})
    stat.attempts++
    stat.totalLatency+=Math.max(0,item.latency||0)
    if (!item.correct) {
      stat.errors++
      const type=diagnose(item.expected,item.actual)
      diagnoses[type]=(diagnoses[type]||0)+1
    }
  }
  return {chars,diagnoses}
}

export function mergeSkillModel(model, session) {
  const next=structuredClone(model||{})
  for (const [char,stat] of Object.entries(session.chars)) {
    const total=next[char]||(next[char]={attempts:0,errors:0,totalLatency:0})
    total.attempts+=stat.attempts
    total.errors+=stat.errors
    total.totalLatency+=stat.totalLatency
  }
  return next
}

export function weakestCharacters(model, limit=5) {
  return Object.entries(model||{}).map(([char,s])=>({char,attempts:s.attempts,errors:s.errors,errorRate:s.errors/s.attempts,latency:s.totalLatency/s.attempts,score:(s.errors/s.attempts)*1000+(s.totalLatency/s.attempts)})).sort((a,b)=>b.score-a.score).slice(0,limit)
}

export function adaptiveText(focusChars, count=30) {
  const focus=new Set(focusChars)
  const matching=THAI_COMMON_WORDS.filter(word=>[...word].some(char=>focus.has(char)))
  const pool=matching.length?matching:THAI_COMMON_WORDS
  return Array.from({length:count},(_,i)=>pool[Math.floor(Math.random()*pool.length)]).join(' ')
}

export function keyLabel(char) {
  const key=CHAR_TO_KEY.get(char)
  if (!key) return char
  return `${key.shift?'Shift + ':''}${key.code.replace(/^Key/,'').replace(/^Digit/,'')}`
}

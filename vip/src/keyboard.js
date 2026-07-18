export const KEDMANEE={
Backquote:['_','%'],Digit1:['ๅ','+'],Digit2:['/','๑'],Digit3:['-','๒'],Digit4:['ภ','๓'],Digit5:['ถ','๔'],Digit6:['ุ','ู'],Digit7:['ึ','฿'],Digit8:['ค','๕'],Digit9:['ต','๖'],Digit0:['จ','๗'],Minus:['ข','๘'],Equal:['ช','๙'],
KeyQ:['ๆ','๐'],KeyW:['ไ','"'],KeyE:['ำ','ฎ'],KeyR:['พ','ฑ'],KeyT:['ะ','ธ'],KeyY:['ั','ํ'],KeyU:['ี','๊'],KeyI:['ร','ณ'],KeyO:['น','ฯ'],KeyP:['ย','ญ'],BracketLeft:['บ','ฐ'],BracketRight:['ล',','],Backslash:['ฃ','ฅ'],
KeyA:['ฟ','ฤ'],KeyS:['ห','ฆ'],KeyD:['ก','ฏ'],KeyF:['ด','โ'],KeyG:['เ','ฌ'],KeyH:['้','็'],KeyJ:['่','๋'],KeyK:['า','ษ'],KeyL:['ส','ศ'],Semicolon:['ว','ซ'],Quote:['ง','.'],
KeyZ:['ผ','('],KeyX:['ป',')'],KeyC:['แ','ฉ'],KeyV:['อ','ฮ'],KeyB:['ิ','ฺ'],KeyN:['ื','์'],KeyM:['ท','?'],Comma:['ม','ฒ'],Period:['ใ','ฬ'],Slash:['ฝ','ฦ'],Space:[' ',' ']
}
export const ROWS=[['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal'],['KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote'],['KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash'],['Space']]
export const CHAR_TO_KEY=new Map(Object.entries(KEDMANEE).flatMap(([code,chars])=>chars.map((char,shift)=>[char,{code,shift:Boolean(shift&&chars[1]!==chars[0])}])))

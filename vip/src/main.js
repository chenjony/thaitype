import './style.css'
import './practice-feedback.css'
import { copy as c, practiceCopy as p, dashboardCopy as d, coachCopy as coach, selector, bind } from './i18n.js'
import { generateVipWords } from './words.js'
import { KEDMANEE, ROWS, CHAR_TO_KEY } from './keyboard.js'
import { summarizeAttempts, mergeSkillModel, weakestCharacters, adaptiveText, keyLabel } from './coach.js'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

const HISTORY_KEY = 'thaitype-vip-history'
const GOAL_KEY = 'thaitype-vip-goal'
const SKILL_KEY = 'thaitype-vip-skill-model'
const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
let skillModel = JSON.parse(localStorage.getItem(SKILL_KEY) || '{}')
let mode = 'words', target = '', startedAt = 0, previousTyped = '', lastInputAt = 0, attempts = []
let keyHintsEnabled = localStorage.getItem('thaitype-vip-key-hints') !== '0'
let audioFeedbackEnabled = localStorage.getItem('thaitype-vip-audio') !== '0'

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#dashboard">Thai<span>Type</span><em>VIP</em></a>
    <nav>${d.nav.map((name,i)=>`<button data-view="${['dashboard','practice','history','insights','certificates'][i]}" class="${i===0?'active':''}">${name}</button>`).join('')}</nav>
    <div class="account">${selector()}<button class="avatar" title="${d.settings}">CY</button></div>
  </header>
  <main>
    <section class="view active" id="dashboard">
      <div class="welcome"><div><div class="eyebrow">${c.eye}</div><h1>${d.welcome}</h1><p>${d.welcomeText}</p></div><button class="button primary" data-go="practice">${d.start}</button></div>
      <div class="metric-grid">
        <article><small>${d.best}</small><strong id="dash-best">—</strong><span>${d.bestNote}</span></article>
        <article><small>${d.accuracy}</small><strong id="dash-accuracy">—</strong><span>${d.accuracyNote}</span></article>
        <article><small>${d.sessions}</small><strong id="dash-sessions">0</strong><span>${d.sessionsNote}</span></article>
        <article><small>${d.streak}</small><strong id="dash-streak">0</strong><span>${d.days}</span></article>
      </div>
      <div class="dashboard-grid">
        <article class="goal-card"><div><small>${d.dailyGoal}</small><h2><span id="goal-done">0</span> / <span id="goal-target">3</span> ${d.sessionsLabel}</h2></div><input id="goal-range" type="range" min="1" max="10" value="3"><div class="progress"><i id="goal-progress"></i></div></article>
        <article><small>${d.recent}</small><div id="recent-list" class="compact-list"></div></article>
      </div>
      <article class="trend-card"><div><small>${d.trend}</small><h2>${d.lastSeven}</h2></div><div class="chart" id="chart"></div></article>
    </section>

    <section class="view" id="practice">
      <div class="section-head"><div><div class="eyebrow">${p.eye}</div><h1>${p.title}</h1></div><span class="vip-benefit">${d.noLimits}</span></div>
      <div class="practice-lab">
        <div class="practice-controls">
          <div class="mode-switch"><button class="active" data-mode="words">${p.words}</button><button data-mode="custom">${p.custom}</button></div>
          <label id="word-count-label">${p.wordCount}<input id="word-count" type="number" min="10" max="500" step="10" value="100"></label>
          <label>${p.voice}<select id="voice-select"></select></label>
          <label>${p.theme}<select id="theme-select">${p.themes.map((name,i)=>`<option value="${['emerald','midnight','sunset','ocean'][i]}">${name}</option>`).join('')}</select></label>
        </div>
        <textarea id="custom-source" placeholder="${p.customPlaceholder}" hidden></textarea>
        <div class="practice-actions"><button class="button primary" id="generate">${p.start}</button><button class="button" id="speak">${p.speak}</button><button class="button" id="toggle-hints"></button><button class="button" id="toggle-audio"></button></div>
        <div class="ime-warning" id="ime-warning" role="alert" aria-live="assertive" hidden>${p.imeWarning}</div>
        <div class="target-text typing-prompt" id="target">${p.ready}</div>
        <textarea id="typing" placeholder="${p.input}" disabled></textarea>
        <div class="practice-stats"><span>${p.progress}: <strong id="progress-value">0 / 0</strong></span><span>${p.accuracy}: <strong id="accuracy-value">100%</strong></span><span>WPM: <strong id="wpm-value">0</strong></span></div>
        <div class="vip-keyboard" id="keyboard" data-theme="emerald">${ROWS.map(row=>`<div>${row.map(code=>`<kbd data-code="${code}" class="${code==='Space'?'space-key':''}">${code==='Space'?'Space':KEDMANEE[code][0]}</kbd>`).join('')}</div>`).join('')}</div>
      </div>
    </section>

    <section class="view" id="history"><div class="section-head"><div><div class="eyebrow">${d.historyEye}</div><h1>${d.historyTitle}</h1></div><button class="button" id="export-history">${d.export}</button></div><div class="table-wrap"><table><thead><tr><th>${d.date}</th><th>${d.mode}</th><th>WPM</th><th>${d.accuracy}</th><th>${d.duration}</th></tr></thead><tbody id="history-body"></tbody></table></div></section>
    <section class="view" id="insights"><div class="section-head"><div><div class="eyebrow">${d.insightsEye}</div><h1>${d.insightsTitle}</h1></div></div><div class="insight-grid"><article><small>${d.weakKeys}</small><div class="weak-keys" id="weak-keys"></div></article><article><small>${d.recommendation}</small><h2 id="recommendation">${d.keepPractising}</h2><button class="button primary" id="practice-weak">${d.practiceWeak}</button></article></div></section>
    <section class="view" id="certificates"><div class="section-head"><div><div class="eyebrow">${d.certEye}</div><h1>${d.certTitle}</h1><p>${d.certText}</p></div></div><div class="certificate-stage"><div class="certificate-preview"><img src="/assets/thaitype-vip-certificate.png" alt="ThaiType VIP verified certificate"><div class="certificate-copy"><small>THAI TYPING ACHIEVEMENT</small><h2 id="certificate-preview-name">VIP Member</h2><p id="certificate-preview-score">${d.certPlaceholder}</p><span id="certificate-preview-id"></span></div></div><div class="certificate-options"><label>${coach.recipientName}<input id="certificate-name" maxlength="80" placeholder="${coach.namePlaceholder}"></label><article><strong>${coach.digitalTitle}</strong><p>${coach.digitalText}</p><a class="button primary" id="download-certificate" aria-disabled="true">${coach.downloadFree}</a><small id="certificate-file-status"></small></article><article class="paper-option"><div><strong>${coach.paperTitle}</strong><span>฿299</span></div><p>${coach.paperText}</p><small>${coach.thailandOnly}</small><button class="button" id="order-paper" disabled>${coach.orderPaper}</button></article></div></div></section>
  </main>
  <footer><span>ThaiType VIP · ${d.memberWorkspace}</span><a href="https://thaitypes.com">${c.nav[0]}</a></footer>
  <div class="coach-backdrop" id="coach-result" hidden><section class="coach-result" role="dialog" aria-modal="true" aria-labelledby="coach-title"><div class="eyebrow">${coach.reportEye}</div><h2 id="coach-title">${coach.reportTitle}</h2><div class="coach-score"><strong id="coach-wpm">0</strong><span>WPM</span><strong id="coach-accuracy">0%</strong><span>${p.accuracy}</span></div><div class="coach-grid"><article><small>${coach.why}</small><div id="coach-diagnoses"></div></article><article><small>${coach.next}</small><h3 id="coach-recommendation"></h3><div id="coach-focus" class="coach-focus"></div></article></div><div class="coach-actions"><button class="button primary" id="fix-mistakes">${coach.fix}</button><button class="button" id="close-coach">${coach.dashboard}</button></div></section></div>
  <div class="coach-backdrop" id="paper-order" hidden><section class="coach-result order-dialog" role="dialog" aria-modal="true" aria-labelledby="order-title"><button class="order-close" id="close-order" aria-label="Close">×</button><div class="eyebrow">${coach.paperEyebrow}</div><h2 id="order-title">${coach.paperTitle} · ฿299</h2><div id="checkout-stage"><p>${coach.checkoutText}</p><ul><li>${coach.shippingThailand}</li><li>${coach.addressAfterPayment}</li><li>${coach.orderEmail}</li></ul><p class="order-message" id="checkout-message"></p><button class="button primary" id="start-checkout">${coach.payShipping}</button></div><form id="shipping-form" hidden><p>${coach.paymentVerified}</p><label>${coach.recipientName}<input id="shipping-name" required maxlength="80"></label><label>${coach.phone}<input id="shipping-phone" required inputmode="tel" pattern="[0-9+ -]{8,20}"></label><label>${coach.address}<textarea id="shipping-address" required maxlength="500"></textarea></label><div class="address-row"><label>${coach.province}<input id="shipping-province" required maxlength="80"></label><label>${coach.postal}<input id="shipping-postal" required inputmode="numeric" pattern="[0-9]{5}" maxlength="5"></label></div><label>${coach.country}<input value="Thailand" disabled></label><p class="order-message" id="order-message"></p><button class="button primary" type="submit">${coach.submitOrder}</button></form></section></div>`

bind()
const $ = (selector) => document.querySelector(selector)
document.querySelectorAll('[data-view],[data-go]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view||button.dataset.go)))
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));scrollTo({top:0,behavior:'smooth'})}

document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b===button));$('#custom-source').hidden=mode!=='custom';$('#word-count-label').hidden=mode!=='words'}))
$('#theme-select').addEventListener('change',e=>$('#keyboard').dataset.theme=e.target.value)
$('#generate').addEventListener('click',()=>{const count=Math.max(10,Math.min(500,Number($('#word-count').value)||100));$('#word-count').value=count;startPractice(mode==='words'?generateVipWords(count):$('#custom-source').value.replace(/\s+/g,' ').trim(),mode)})
function startPractice(text,nextMode=mode){if(!text)return $('#custom-source').focus();mode=nextMode;target=text;$('#typing').value='';previousTyped='';attempts=[];$('#typing').disabled=false;startedAt=Date.now();lastInputAt=performance.now();clearImeWarning();renderFeedback();showView('practice');$('#typing').focus();updateStats()}
function isThaiInputCharacter(char){if(!char)return true;const code=char.codePointAt(0);return /\s/.test(char)||(code>=0x0e00&&code<=0x0e7f)||Object.values(KEDMANEE).flat().includes(char)}
function showImeWarning(){const warning=$('#ime-warning');warning.hidden=false;warning.classList.remove('shake');void warning.offsetWidth;warning.classList.add('shake');$('#keyboard').classList.add('layout-error')}
function clearImeWarning(){if(!$('#ime-warning').hidden){$('#ime-warning').hidden=true;$('#keyboard').classList.remove('layout-error')}}
$('#typing').addEventListener('keydown',event=>{if(event.metaKey||event.ctrlKey||event.altKey||event.key.length!==1)return;const layer=event.shiftKey?1:0,layoutOutput=KEDMANEE[event.code]?.[layer];if(!isThaiInputCharacter(event.key)||(layoutOutput&&layoutOutput!==event.key&&/^[\x21-\x7e]$/.test(event.key))){event.preventDefault();showImeWarning()}else clearImeWarning()})
$('#typing').addEventListener('beforeinput',event=>{if(event.inputType.startsWith('delete')||event.data==null)return;if([...event.data].some(char=>!isThaiInputCharacter(char))){event.preventDefault();showImeWarning()}})
$('#typing').addEventListener('input',()=>{const typed=$('#typing').value,now=performance.now();if([...typed].some(char=>!isThaiInputCharacter(char))){$('#typing').value=previousTyped;showImeWarning();return}clearImeWarning();if(typed.length>previousTyped.length){for(let i=previousTyped.length;i<typed.length;i++)attempts.push({expected:target[i],actual:typed[i],correct:typed[i]===target[i],latency:i===previousTyped.length?now-lastInputAt:0});lastInputAt=now}if(audioFeedbackEnabled&&typed.length===previousTyped.length+1&&typed.at(-1)===target[typed.length-1])speakCharacter(typed.at(-1));previousTyped=typed;updateStats();renderFeedback();if(typed.length>=target.length)finishPractice()})

function calculate(){const typed=$('#typing').value;let correct=0;const misses={};for(let i=0;i<typed.length;i++){if(typed[i]===target[i])correct++;else if(target[i]&&!/\s/.test(target[i]))misses[target[i]]=(misses[target[i]]||0)+1}const minutes=Math.max((Date.now()-startedAt)/60000,1/60);return{correct,accuracy:typed.length?Math.round(correct/typed.length*100):100,wpm:Math.round((correct/5)/minutes),misses}}
function updateStats(){const s=calculate();$('#progress-value').textContent=`${Math.min($('#typing').value.length,target.length)} / ${target.length}`;$('#accuracy-value').textContent=`${s.accuracy}%`;$('#wpm-value').textContent=s.wpm}
function escapeHtml(value){return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function renderFeedback(){const typed=$('#typing').value;$('#target').innerHTML=Array.from(target).map((char,index)=>{const shown=char===' '?'&nbsp;':escapeHtml(char);if(index<typed.length)return`<span class="prompt-char ${typed[index]===char?'typed-correct':'typed-wrong'}">${shown}</span>`;return`<span class="prompt-char ${index===typed.length?'next-char':'pending-char'}">${shown}</span>`}).join('');document.querySelectorAll('#keyboard kbd').forEach(key=>key.classList.remove('next-key','shift-key'));if(!keyHintsEnabled)return;const next=CHAR_TO_KEY.get(target[typed.length]);if(next){document.querySelector(`[data-code="${next.code}"]`)?.classList.add('next-key');if(next.shift)document.querySelector(`[data-code="${next.code}"]`)?.classList.add('shift-key')}}
function finishPractice(){const s=calculate(),session=summarizeAttempts(attempts);skillModel=mergeSkillModel(skillModel,session);localStorage.setItem(SKILL_KEY,JSON.stringify(skillModel));const result={date:new Date().toISOString(),mode,wpm:s.wpm,accuracy:s.accuracy,duration:Math.round((Date.now()-startedAt)/1000),misses:s.misses,diagnoses:session.diagnoses};history.unshift(result);history.splice(100);localStorage.setItem(HISTORY_KEY,JSON.stringify(history));$('#typing').disabled=true;renderAll();showCoachResult(result)}

const speech=window.speechSynthesis
function loadVoices(){const voices=speech?.getVoices().filter(v=>v.lang.toLowerCase().startsWith('th'))||[];$('#voice-select').innerHTML=`<option value="">${p.defaultVoice}</option>${voices.map(v=>`<option value="${v.voiceURI}">${v.name}</option>`).join('')}`}
loadVoices();speech?.addEventListener?.('voiceschanged',loadVoices)
function speakCharacter(char){if(!char||/\s/.test(char)||!speech)return;const u=new SpeechSynthesisUtterance(char);u.lang='th-TH';u.rate=1.15;u.voice=speech.getVoices().find(v=>v.voiceURI===$('#voice-select').value)||null;speech.cancel();speech.speak(u)}
$('#speak').addEventListener('click',()=>{const word=target.slice($('#typing').value.length).trimStart().split(/\s+/)[0];if(!word||!speech)return;const u=new SpeechSynthesisUtterance(word);u.lang='th-TH';u.voice=speech.getVoices().find(v=>v.voiceURI===$('#voice-select').value)||null;speech.cancel();speech.speak(u)})
function syncToggles(){$('#toggle-hints').textContent=keyHintsEnabled?p.hideHints:p.showHints;$('#toggle-audio').textContent=audioFeedbackEnabled?p.audioOn:p.audioOff;$('#toggle-hints').classList.toggle('active-toggle',keyHintsEnabled);$('#toggle-audio').classList.toggle('active-toggle',audioFeedbackEnabled)}
$('#toggle-hints').addEventListener('click',()=>{keyHintsEnabled=!keyHintsEnabled;localStorage.setItem('thaitype-vip-key-hints',keyHintsEnabled?'1':'0');syncToggles();renderFeedback()})
$('#toggle-audio').addEventListener('click',()=>{audioFeedbackEnabled=!audioFeedbackEnabled;localStorage.setItem('thaitype-vip-audio',audioFeedbackEnabled?'1':'0');if(!audioFeedbackEnabled)speech?.cancel();syncToggles()})
syncToggles()

function focusCharacters() { return weakestCharacters(skillModel,5).map(item=>item.char) }
function launchAdaptivePractice() {
  const focus=focusCharacters()
  if (!focus.length) return showView('practice')
  document.querySelectorAll('[data-mode]').forEach(button=>button.classList.remove('active'))
  startPractice(adaptiveText(focus,Math.min(50,Number($('#word-count').value)||30)),'adaptive')
  $('#coach-result').hidden=true
}
function showCoachResult(result) {
  const weak=weakestCharacters(skillModel,5)
  const reasons=Object.entries(result.diagnoses||{}).sort((a,b)=>b[1]-a[1])
  $('#coach-wpm').textContent=result.wpm
  $('#coach-accuracy').textContent=`${result.accuracy}%`
  $('#coach-diagnoses').innerHTML=reasons.length?reasons.map(([type,count])=>`<div class="diagnosis"><span>${coach.diagnoses[type]}</span><strong>${count}</strong></div>`).join(''):`<p>${coach.clean}</p>`
  $('#coach-recommendation').textContent=weak.length?`${coach.focus} ${weak.slice(0,3).map(item=>item.char).join(' · ')}`:coach.keepGoing
  $('#coach-focus').innerHTML=weak.map(item=>`<kbd>${item.char}<small>${keyLabel(item.char)} · ${Math.round(item.errorRate*100)}%</small></kbd>`).join('')
  $('#fix-mistakes').hidden=!weak.length
  $('#coach-result').hidden=false
}
$('#fix-mistakes').addEventListener('click',launchAdaptivePractice)
$('#practice-weak').addEventListener('click',launchAdaptivePractice)
$('#close-coach').addEventListener('click',()=>{$('#coach-result').hidden=true;showView('dashboard')})

function qualifyingResult(){return history.filter(item=>item.accuracy>=90).sort((a,b)=>b.wpm-a.wpm)[0]||null}
function certificateId(result){if(!result)return'';let hash=2166136261;for(const char of `${result.date}-${result.wpm}-${result.accuracy}`){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}return`TTV-${new Date(result.date).getFullYear()}-${(hash>>>0).toString(36).toUpperCase().padStart(7,'0')}`}
function updateCertificate(){const result=qualifyingResult(),name=$('#certificate-name').value.trim()||'VIP Member',eligible=Boolean(result&&$('#certificate-name').value.trim());$('#certificate-preview-name').textContent=name;$('#certificate-preview-score').textContent=result?`${result.wpm} WPM · ${result.accuracy}% ${p.accuracy}`:d.certPlaceholder;$('#certificate-preview-id').textContent=result?certificateId(result):'';$('#order-paper').disabled=!eligible;scheduleCertificatePdf()}
$('#certificate-name').value=localStorage.getItem('thaitype-certificate-name')||''
$('#certificate-name').addEventListener('input',()=>{localStorage.setItem('thaitype-certificate-name',$('#certificate-name').value.trim());updateCertificate()})

let certificatePdfUrl='',certificatePdfTimer=0,certificatePdfGeneration=0
function centeredX(font,text,size,width=900){return(width-font.widthOfTextAtSize(text,size))/2}
async function createCertificatePdf(){
  const result=qualifyingResult(),name=$('#certificate-name').value.trim()||'VIP Member',id=result?certificateId(result):'TTV-PREVIEW'
  const pdf=await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const page=pdf.addPage([900,600])
  const [imageBytes,thaiFontBytes]=await Promise.all([
    fetch('/assets/thaitype-vip-certificate.png?v=2').then(response=>response.arrayBuffer()),
    fetch('/fonts/NotoSansThai.ttf').then(response=>response.arrayBuffer()),
  ])
  const background=await pdf.embedPng(imageBytes),nameFont=await pdf.embedFont(thaiFontBytes,{subset:true})
  const regular=await pdf.embedFont(StandardFonts.TimesRoman),bold=await pdf.embedFont(StandardFonts.TimesRomanBold),italic=await pdf.embedFont(StandardFonts.TimesRomanItalic),mono=await pdf.embedFont(StandardFonts.Courier)
  const green=rgb(.055,.17,.13),muted=rgb(.34,.40,.37)
  page.drawImage(background,{x:0,y:0,width:900,height:600})
  const title='CERTIFICATE OF THAI TYPING ACHIEVEMENT'
  page.drawText(title,{x:centeredX(bold,title,14),y:387,size:14,font:bold,color:green,characterSpacing:2})
  const intro='This certificate is proudly presented to'
  page.drawText(intro,{x:centeredX(italic,intro,14),y:350,size:14,font:italic,color:muted})
  page.drawText(name,{x:centeredX(nameFont,name,34),y:296,size:34,font:nameFont,color:green})
  page.drawLine({start:{x:250,y:283},end:{x:650,y:283},thickness:.7,color:rgb(.6,.52,.36)})
  const achievement='for verified achievement in Thai Kedmanee typing'
  page.drawText(achievement,{x:centeredX(regular,achievement,15),y:253,size:15,font:regular,color:muted})
  const score=result?`${result.wpm} WPM   -   ${result.accuracy}% ACCURACY`:'QUALIFYING SCORE PENDING'
  page.drawText(score,{x:centeredX(bold,score,20),y:205,size:20,font:bold,color:green})
  const date=result?new Date(result.date).toLocaleDateString('en-GB'):'Preview'
  page.drawText(date,{x:centeredX(regular,date,12),y:164,size:12,font:regular,color:muted})
  page.drawText(`CERTIFICATE ID  ${id}`,{x:70,y:67,size:9,font:mono,color:muted})
  pdf.setTitle(`ThaiType VIP Certificate - ${name}`);pdf.setSubject('Verified Thai Kedmanee typing achievement');pdf.setCreator('ThaiType VIP')
  return pdf.save()
}
function scheduleCertificatePdf(){clearTimeout(certificatePdfTimer);const generation=++certificatePdfGeneration,link=$('#download-certificate');link.setAttribute('aria-disabled','true');link.removeAttribute('href');$('#certificate-file-status').textContent=coach.preparingPdf||'Preparing PDF…';certificatePdfTimer=setTimeout(()=>prepareCertificatePdf(generation),180)}
async function prepareCertificatePdf(generation){try{const bytes=await createCertificatePdf();if(generation!==certificatePdfGeneration)return;const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));if(certificatePdfUrl)URL.revokeObjectURL(certificatePdfUrl);certificatePdfUrl=url;const result=qualifyingResult(),link=$('#download-certificate');link.href=url;link.download=result?`ThaiType-VIP-${certificateId(result)}.pdf`:'ThaiType-VIP-Certificate-Preview.pdf';link.setAttribute('aria-disabled','false');$('#certificate-file-status').textContent=coach.pdfReady||'PDF ready'}catch(error){console.error(error);$('#certificate-file-status').textContent=coach.pdfFailed||'PDF generation failed'}}

const orderApi=String(import.meta.env.VITE_CERTIFICATE_ORDER_API||'/api').replace(/\/$/,'')
let verifiedPaymentRef=''
function openOrder(){if(!qualifyingResult())return;$('#paper-order').hidden=false;$('#shipping-form').hidden=true;$('#checkout-stage').hidden=false;$('#checkout-message').textContent=''}
$('#order-paper').addEventListener('click',openOrder)
$('#close-order').addEventListener('click',()=>{$('#paper-order').hidden=true})
async function requestJson(url,options){const response=await fetch(url,{...options,headers:{'content-type':'application/json',...(options?.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||`HTTP ${response.status}`);return data}
$('#start-checkout').addEventListener('click',async()=>{const message=$('#checkout-message');message.textContent='';try{const result=qualifyingResult();const data=await requestJson(`${orderApi}/certificate-checkout`,{method:'POST',body:JSON.stringify({certificateId:certificateId(result),recipientName:$('#certificate-name').value.trim(),amount:299,currency:'THB',successUrl:`${location.origin}${location.pathname}?certificate_payment_ref={PAYMENT_REFERENCE}`})});if(!data.checkoutUrl)throw new Error('Missing checkout URL');location.href=data.checkoutUrl}catch(error){console.error(error);message.textContent=coach.checkoutUnavailable}})
async function verifyReturnedPayment(){const ref=new URLSearchParams(location.search).get('certificate_payment_ref');if(!ref)return;try{const data=await requestJson(`${orderApi}/certificate-orders/verify?payment_ref=${encodeURIComponent(ref)}`);if(!data.paid||data.amount!==299||data.currency!=='THB')throw new Error('Payment not verified');verifiedPaymentRef=ref;$('#paper-order').hidden=false;$('#checkout-stage').hidden=true;$('#shipping-form').hidden=false;$('#shipping-name').value=$('#certificate-name').value.trim()}catch(error){console.error(error);$('#paper-order').hidden=false;$('#checkout-message').textContent=coach.checkoutUnavailable}finally{window.history.replaceState({},'',location.pathname)}}
$('#shipping-form').addEventListener('submit',async event=>{event.preventDefault();if(!verifiedPaymentRef)return;const message=$('#order-message');message.textContent='';try{const result=qualifyingResult();await requestJson(`${orderApi}/certificate-orders`,{method:'POST',body:JSON.stringify({paymentRef:verifiedPaymentRef,certificateId:certificateId(result),score:{wpm:result.wpm,accuracy:result.accuracy,date:result.date},recipient:{name:$('#shipping-name').value.trim(),phone:$('#shipping-phone').value.trim(),address:$('#shipping-address').value.trim(),province:$('#shipping-province').value.trim(),postalCode:$('#shipping-postal').value.trim(),country:'TH'}})});message.textContent=coach.orderSuccess;event.currentTarget.querySelector('button[type=submit]').disabled=true}catch(error){console.error(error);message.textContent=coach.orderFailed}})
verifyReturnedPayment()

$('#goal-range').value=localStorage.getItem(GOAL_KEY)||3
$('#goal-range').addEventListener('input',e=>{localStorage.setItem(GOAL_KEY,e.target.value);renderAll()})
$('#export-history').addEventListener('click',()=>{const csv=['date,mode,wpm,accuracy,duration',...history.map(x=>`${x.date},${x.mode},${x.wpm},${x.accuracy},${x.duration}`)].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='thaitype-vip-history.csv';a.click();URL.revokeObjectURL(a.href)})

function renderAll(){const best=Math.max(0,...history.map(x=>x.wpm));const avg=history.length?Math.round(history.reduce((n,x)=>n+x.accuracy,0)/history.length):0;$('#dash-best').textContent=best?`${best} WPM`:'—';$('#dash-accuracy').textContent=avg?`${avg}%`:'—';$('#dash-sessions').textContent=history.length;const today=new Date().toDateString(),done=history.filter(x=>new Date(x.date).toDateString()===today).length,goal=Number($('#goal-range').value);$('#goal-done').textContent=done;$('#goal-target').textContent=goal;$('#goal-progress').style.width=`${Math.min(100,done/goal*100)}%`;$('#recent-list').innerHTML=history.slice(0,3).map(x=>`<div><span>${new Date(x.date).toLocaleDateString()}</span><strong>${x.wpm} WPM · ${x.accuracy}%</strong></div>`).join('')||`<p>${d.noSessions}</p>`;$('#chart').innerHTML=history.slice(0,7).reverse().map(x=>`<i style="height:${Math.max(8,x.wpm/(best||1)*100)}%"><span>${x.wpm}</span></i>`).join('')||`<p>${d.noSessions}</p>`;$('#history-body').innerHTML=history.map(x=>`<tr><td>${new Date(x.date).toLocaleString()}</td><td>${x.mode}</td><td>${x.wpm}</td><td>${x.accuracy}%</td><td>${x.duration}s</td></tr>`).join('')||`<tr><td colspan="5">${d.noSessions}</td></tr>`;const weak=weakestCharacters(skillModel,8);$('#weak-keys').innerHTML=weak.map(item=>`<kbd>${item.char}<small>${Math.round(item.errorRate*100)}% · ${Math.round(item.latency)}ms</small></kbd>`).join('')||`<p>${d.noMistakes}</p>`;$('#recommendation').textContent=weak.length?`${d.focusOn} ${weak.slice(0,3).map(item=>item.char).join(' · ')}`:d.keepPractising;updateCertificate()}
renderAll()

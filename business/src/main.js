import './style.css'
import {copy as c,selector,bind} from './i18n.js'

const cards=c.caps.map(([title,text],i)=>`<article class="card"><span>0${i+1} /</span><h3>${title}</h3><p>${text}</p></article>`).join('')
const fits=c.fits.map(([title,text])=>`<article class="fit"><h3>${title}</h3><p>${text}</p></article>`).join('')
const options=items=>items.map((item,i)=>`<option value="${i?item:''}">${item}</option>`).join('')

document.querySelector('#app').innerHTML=`
<header class="shell"><a class="brand" href="#top">ThaiType <span>Business</span></a><nav><a href="#capabilities">${c.nav[0]}</a><a href="#insights">${c.nav[1]}</a><a href="#organizations">${c.nav[2]}</a><a href="/portal.html">Console</a><a class="nav-cta" href="#trial">${c.nav[3]}</a>${selector()}</nav></header>
<main id="top">
  <section class="hero shell"><div class="hero-copy"><div class="eyebrow">${c.eye}</div><h1>${c.h1}</h1><p>${c.lead}</p><div class="actions"><a class="button dark" href="#trial">${c.primary}</a><a class="button light" href="#capabilities">${c.secondary}</a></div><div class="trust">${c.trust.map(([n,t])=>`<span><b>${n}</b>${t}</span>`).join('')}</div></div>
  <div class="dashboard" id="insights"><div class="dash-head"><div><small>${c.overview}</small><strong>Bangkok Language Center</strong></div><span class="status">● ${c.synced}</span></div><div class="metrics">${c.metrics.map(([t,n,d])=>`<div><small>${t}</small><b>${n}</b><em>${d}</em></div>`).join('')}</div><div class="chart"><div><span>${c.trend}</span><span>04.08 — 05.26</span></div><div class="bars">${[35,48,44,59,55,71,84,78].map(n=>`<i style="height:${n}%"></i>`).join('')}</div></div></div></section>
  <section class="capabilities shell" id="capabilities"><div class="section-head"><h2>${c.capTitle}</h2><p>${c.capText}</p></div><div class="cards">${cards}</div></section>
  <section class="organizations" id="organizations"><div class="shell"><div class="section-head inverse"><h2>${c.fitTitle}</h2><span>ThaiType Business · 01</span></div><div class="fit-grid">${fits}</div></div></section>
  <section class="recruitment shell"><div class="recruit-copy"><div class="eyebrow">${c.recruitment.eye}</div><h2>${c.recruitment.title}</h2><p>${c.recruitment.lead}</p><a class="button dark" href="#trial">${c.recruitment.cta} <span>→</span></a></div><div class="recruit-points">${c.recruitment.points.map(([title,text],i)=>`<article><span>0${i+1}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join('')}</div></section>
  <section class="trial shell" id="trial"><div class="trial-copy"><div class="eyebrow">${c.formEye}</div><h2>${c.formTitle}</h2><p>${c.formLead}</p><a href="mailto:business@thaitypes.com">business@thaitypes.com</a></div>
  <form id="trial-form"><label>${c.fields[0]}<input name="name" autocomplete="name" required></label><label>${c.fields[1]}<input name="email" type="email" autocomplete="email" required></label><label>${c.fields[2]}<input name="organization" autocomplete="organization" required></label><label>${c.fields[3]}<input name="country" autocomplete="country-name" required></label><label>${c.fields[4]}<select name="role" required>${options(c.roles)}</select></label><label>${c.fields[5]}<select name="size" required>${options(c.sizes)}</select></label><label class="wide">${c.fields[6]}<textarea name="need" rows="4" required></textarea></label><div class="wide form-foot"><p>${c.privacy}</p><button class="button dark" type="submit">${c.submit} <span>→</span></button></div></form>
  <div class="success" id="success" role="status" hidden><b>${c.success}</b><p>${c.successText}</p><small>${c.fallback}</small></div></section>
</main>
<footer class="shell"><span>© 2026 ThaiType Business · Bangkok, Thailand</span><div><a href="https://thaitypes.com">${c.free}</a><a href="https://thaitypes.com/about/">${c.about}</a></div></footer>`

bind()
document.querySelector('#trial-form').addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));const body=Object.entries(data).map(([key,value])=>`${key}: ${value}`).join('\n');location.href=`mailto:business@thaitypes.com?subject=${encodeURIComponent(`ThaiType Business request · ${data.organization}`)}&body=${encodeURIComponent(body)}`;event.currentTarget.hidden=true;document.querySelector('#success').hidden=false})

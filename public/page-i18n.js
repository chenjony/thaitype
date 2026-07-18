const supported = ['en', 'zh-CN', 'zh-TW', 'th', 'ru']
const labels = { en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文', th: 'ไทย', ru: 'Русский' }

export function detectPageLocale() {
  const saved = localStorage.getItem('thaitype-locale')
  if (supported.includes(saved)) return saved
  const lang = String(navigator.languages?.[0] || navigator.language || 'en').toLowerCase()
  if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') || lang.startsWith('zh-mo') || lang.includes('hant')) return 'zh-TW'
  if (lang.startsWith('zh')) return 'zh-CN'
  if (lang.startsWith('th')) return 'th'
  if (lang.startsWith('ru')) return 'ru'
  return 'en'
}

export function setupPageI18n(translations) {
  const locale = detectPageLocale()
  const copy = translations[locale] || translations.en || {}
  document.documentElement.lang = locale
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = copy[element.dataset.i18n]
    if (value != null) element.textContent = value
  })
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = copy[element.dataset.i18nHtml]
    if (value != null) element.innerHTML = value
  })
  if (copy.title) document.title = copy.title
  const description = document.querySelector('meta[name="description"]')
  if (description && copy.description) description.content = copy.description

  const host = document.querySelector('[data-language-host]') || document.body
  const select = document.createElement('select')
  select.className = 'page-language-select'
  select.setAttribute('aria-label', 'Language')
  select.innerHTML = supported.map((code) => `<option value="${code}"${code === locale ? ' selected' : ''}>${labels[code]}</option>`).join('')
  select.addEventListener('change', () => {
    localStorage.setItem('thaitype-locale', select.value)
    location.reload()
  })
  host.appendChild(select)
}

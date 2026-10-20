/* Thal University Bhakkar - site script
   Renders the shared header/footer and every page from /api/data (data/data.json). */
(() => {
  'use strict';

  /* ---------- Icons (Lucide, inline SVG) ---------- */
  const ICONS = {
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    'volume-2': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    square: '<rect width="14" height="14" x="5" y="5" rx="2"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'graduation-cap': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
    'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    sigma: '<path d="M18 7V4H6l6 8-6 8h12v-3"/>',
    atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    wheat: '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'heart-pulse': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.building}</svg>`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pkr = (n) => 'Rs ' + Number(n).toLocaleString('en-PK');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const deptUrl = (slug) => `/pages/department.html?d=${encodeURIComponent(slug)}`;
  const dateParts = (iso) => { const d = new Date(iso + 'T00:00:00'); return { day: d.getDate(), mon: d.toLocaleString('en-GB', { month: 'short' }), yr: d.getFullYear() }; };
  const IMG = {
    campus: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=70',
    students: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=70',
    lecture: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=70',
    grad: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=70',
    vc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=70'
  };

  /* ---------- Data ---------- */
  let DATA = null;
  async function getData() {
    if (DATA) return DATA;
    const r = await fetch('/api/data');
    if (!r.ok) throw new Error('data');
    DATA = await r.json();
    return DATA;
  }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('tub-theme', t); } catch (e) { /* storage may be blocked */ }
    const b = $('#theme-btn');
    if (b) { b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon'); b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
  }

  /* ---------- Layout ---------- */
  const NAV = [
    ['Home', '/'], ['About', '/pages/about.html'], ['Departments', '/pages/departments.html'], ['Admissions', '/pages/admissions.html'],
    ['Fees', '/pages/fees.html'], ['Transport', '/pages/transport.html'], ['Campus Life', '/pages/info.html'], ['Contact', '/pages/contact.html']
  ];
  const isActive = (href) => {
    const p = location.pathname.replace(/\/index\.html$/, '/');
    if (href === '/') return p === '/';
    if (href.endsWith('departments.html') && p.endsWith('department.html')) return true;
    return p.endsWith(href.replace('/pages', ''));
  };

  function buildLayout(d) {
    const u = d.university;
    const links = (cls) => NAV.map(([l, h]) => `<a href="${h}" ${isActive(h) ? 'aria-current="page"' : ''}>${l}</a>`).join('');
    $('#site-header').innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <header class="site-header is-top" id="hdr"><div class="wrap">
        <a class="brand" href="/" aria-label="${esc(u.name)} home"><img src="/images/logo.svg" alt="" width="40" height="40"><div><b>Thal University</b><span>Bhakkar</span></div></a>
        <nav class="nav" aria-label="Main">${links()}</nav>
        <div class="header-actions">
          <button class="icon-btn" id="theme-btn" type="button"></button>
          <a class="btn btn-gold btn-sm hide-sm" href="/pages/admissions.html">Apply now</a>
          <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false">${icon('menu')}</button>
        </div></div></header>
      <div class="drawer" id="drawer"><div class="drawer-bg" data-close></div>
        <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div class="drawer-top"><b style="font-family:var(--font-head);font-size:1.2rem">Menu</b><button class="icon-btn" type="button" data-close aria-label="Close menu">${icon('x')}</button></div>
          ${links()}<a class="btn btn-primary" style="margin-top:12px;justify-content:center" href="/pages/admissions.html">Apply now</a>
        </div></div>`;

    const feat = d.departments.slice(0, 6);
    $('#site-footer').innerHTML = `
      <footer class="site-footer"><div class="wrap">
        <div class="cols">
          <div><a class="brand" href="/" style="color:#fff"><img src="/images/logo.svg" alt="" width="40" height="40"><div><b>Thal University</b><span>Bhakkar</span></div></a>
            <p style="margin-top:14px;font-size:.93rem;max-width:32ch">${esc(u.tagline)} Higher education for Bhakkar, Layyah, Mianwali and the Thal region.</p>
            <div class="socials">
              <a href="${esc(u.social.facebook)}" aria-label="Facebook" target="_blank" rel="noopener">${icon('facebook')}</a>
              <a href="${esc(u.social.instagram)}" aria-label="Instagram" target="_blank" rel="noopener">${icon('instagram')}</a>
              <a href="${esc(u.social.youtube)}" aria-label="YouTube" target="_blank" rel="noopener">${icon('youtube')}</a>
            </div></div>
          <div><h4>Explore</h4>${NAV.slice(1).map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</div>
          <div><h4>Departments</h4>${feat.map((x) => `<a href="${deptUrl(x.slug)}">${esc(x.name)}</a>`).join('')}<a href="/pages/departments.html">All ${d.departments.length} departments</a></div>
          <div><h4>Contact</h4>
            <div class="contact-line">${icon('map-pin')}<span>${esc(u.address)}</span></div>
            <div class="contact-line">${icon('phone')}<span>${esc(u.phone)}</span></div>
            <div class="contact-line">${icon('mail')}<span>${esc(u.email)}</span></div>
            <div class="contact-line">${icon('clock')}<span>${esc(u.hours)}</span></div></div>
        </div>
        <div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} ${esc(u.name)}. All rights reserved.</span><span>Admissions: ${esc(u.admissionsEmail)}</span></div>
      </div></footer>`;

    setTheme(document.documentElement.dataset.theme || 'light');
    $('#theme-btn').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

    const drawer = $('#drawer'), mb = $('#menu-btn');
    const toggle = (open) => { drawer.classList.toggle('open', open); mb.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
    mb.addEventListener('click', () => toggle(true));
    drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target.closest('a')) toggle(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });

    const hdr = $('#hdr');
    const onScroll = () => { const s = window.scrollY > 24; hdr.classList.toggle('is-solid', s); hdr.classList.toggle('is-top', !s); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Shared pieces ---------- */
  const pageHero = (title, text, crumbs = []) => `
    <section class="page-hero"><div class="wrap">
      <div class="crumbs"><a href="/">Home</a>${crumbs.map(([l, h]) => `<span>/</span>${h ? `<a href="${h}">${esc(l)}</a>` : `<span>${esc(l)}</span>`}`).join('')}</div>
      <h1>${esc(title)}</h1>${text ? `<p>${esc(text)}</p>` : ''}</div></section>`;

  const deptTile = (x) => `
    <a class="dept-tile" href="${deptUrl(x.slug)}">
      <span class="ic">${icon(x.icon)}</span><h3>${esc(x.name)}</h3><p>${esc(x.short)}</p>
      <span class="meta">${x.programs.length} program${x.programs.length > 1 ? 's' : ''} &middot; ${x.faculty.length} faculty listed</span></a>`;

  const feeTable = (x) => {
    const sum = (k) => x.fees.reduce((a, f) => a + f[k], 0);
    return `<div class="table-wrap"><table class="t"><caption class="sr-only" style="position:absolute;left:-9999px">Semester-wise fee of ${esc(x.name)}</caption>
      <thead><tr><th scope="col">Semester</th><th scope="col" class="num">Admission / registration fee</th><th scope="col" class="num">Tuition fee</th><th scope="col" class="num">Total</th></tr></thead>
      <tbody>${x.fees.map((f) => `<tr><td>Semester ${f.semester}</td><td class="num">${pkr(f.admission)}</td><td class="num">${pkr(f.tuition)}</td><td class="num"><b>${pkr(f.total)}</b></td></tr>`).join('')}</tbody>
      <tfoot><tr><td>All 8 semesters</td><td class="num">${pkr(sum('admission'))}</td><td class="num">${pkr(sum('tuition'))}</td><td class="num">${pkr(sum('total'))}</td></tr></tfoot></table></div>`;
  };

  const askBtn = (q, label) => `<button class="btn btn-outline btn-sm" type="button" data-ask="${esc(q)}">${icon('message-circle')} ${esc(label)}</button>`;

  /* ---------- Pages ---------- */
  const PAGES = {};

  PAGES.home = (d) => {
    const u = d.university, a = d.admissions;
    const last = a.dates.find((x) => /last date to apply/i.test(x.event));
    const featured = ['computer-science', 'software-engineering', 'business-administration', 'agriculture', 'law', 'education'].map((s) => d.departments.find((x) => x.slug === s)).filter(Boolean);
    const st = u.stats;
    return `
    <section class="hero"><div class="wrap hero-grid">
      <div class="reveal-hero">
        <p style="color:var(--gold);font-weight:600;margin-bottom:14px">Bhakkar, Punjab &middot; Est. ${u.established}</p>
        <h1>${esc(u.name)}</h1>
        <p class="lead">${esc(u.tagline)} Fifteen departments, hostels, university vans from six towns and scholarships for students who need them.</p>
        <div class="hero-cta"><a class="btn btn-gold" href="/pages/admissions.html">Admissions ${icon('arrow-right')}</a><a class="btn btn-outline" href="/pages/departments.html">Explore departments</a></div>
      </div>
      <div class="arch reveal-hero"><div class="arch-frame"><img src="${IMG.campus}" alt="Main academic building of the university campus" width="840" height="1050" fetchpriority="high"></div>
        ${last ? `<div class="arch-note"><b>${esc(last.date)}</b>Last date to apply for Spring 2027 admissions.</div>` : ''}</div>
    </div></section>

    <section class="stats" aria-label="University in numbers"><div class="wrap">
      ${[['students', 'Students'], ['faculty', 'Faculty members'], ['departments', 'Departments'], ['programs', 'Programs']].map(([k, l]) => `<div class="stat"><b data-count="${st[k]}">${st[k].toLocaleString('en-PK')}</b><span>${l}</span></div>`).join('')}
    </div></section>

    <section class="section"><div class="wrap split">
      <div class="photo reveal"><img src="${IMG.students}" alt="Students walking together on campus" loading="lazy" width="1000" height="750"></div>
      <div class="stack reveal"><h2 style="font-size:clamp(1.7rem,3.4vw,2.5rem)">A university close to home, built for the Thal</h2>
        <p class="muted prose">${esc(d.about.history[0])}</p><p class="muted prose">${esc(d.about.history[1])}</p>
        <a class="link-arrow" href="/pages/about.html">Read our story ${icon('arrow-right')}</a></div>
    </div></section>

    <section class="section alt"><div class="wrap">
      <div class="section-head"><div><h2>Where would you like to study?</h2><p>Each department page lists programs, teachers with their subjects, semester-wise fees and activities.</p></div><a class="link-arrow" href="/pages/departments.html">See all ${d.departments.length} departments ${icon('arrow-right')}</a></div>
      <div class="grid g3 reveal">${featured.map(deptTile).join('')}</div>
    </div></section>

    <section class="section"><div class="wrap grid g2" style="gap:56px">
      <div class="reveal"><div class="section-head" style="margin-bottom:20px"><h2 style="font-size:1.8rem">Announcements</h2></div>
        ${d.news.map((n) => { const p = dateParts(n.date); return `<article class="news-item"><div class="date-box"><b>${p.day}</b><span>${p.mon} ${p.yr}</span></div><div><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></div></article>`; }).join('')}</div>
      <div class="reveal"><div class="section-head" style="margin-bottom:20px"><h2 style="font-size:1.8rem">Upcoming events</h2></div>
        ${d.events.map((n) => { const p = dateParts(n.date); return `<article class="event-item"><div class="date-box"><b>${p.day}</b><span>${p.mon} ${p.yr}</span></div><div><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p><div class="where">${icon('map-pin')} ${esc(n.place)}</div></div></article>`; }).join('')}</div>
    </div></section>

    <section class="section alt"><div class="wrap">
      <div class="section-head"><div><h2>What our graduates say</h2></div></div>
      <div class="grid g3 reveal">${d.testimonials.map((t) => `<figure class="quote" style="margin:0"><p>&ldquo;${esc(t.quote)}&rdquo;</p><footer><b>${esc(t.name)}</b>${esc(t.program)}</footer></figure>`).join('')}</div>
    </div></section>

    <section class="section"><div class="wrap"><div class="cta-band reveal">
      <div><h2>Spring 2027 admissions are open</h2><p>Check eligibility, documents and dates, then apply online or at the admissions office.</p></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-gold" href="/pages/admissions.html">How to apply</a><a class="btn btn-outline" href="/pages/fees.html" style="color:#fff">View fees</a></div>
    </div></div></section>`;
  };

  PAGES.about = (d) => {
    const a = d.about;
    return `${pageHero('About the university', 'Our story, our purpose and the facilities that support student life.', [['About']])}
    <section class="section"><div class="wrap split">
      <div class="stack"><h2 style="font-size:2rem">Our history</h2>${a.history.map((p) => `<p class="muted prose">${esc(p)}</p>`).join('')}</div>
      <div class="photo"><img src="${IMG.campus}" alt="University campus building" loading="lazy" width="1000" height="750"></div>
    </div></section>
    <section class="section alt"><div class="wrap grid g2">
      <div class="card"><h2 style="font-size:1.6rem;margin-bottom:12px">Vision</h2><p class="muted">${esc(a.vision)}</p></div>
      <div class="card"><h2 style="font-size:1.6rem;margin-bottom:12px">Mission</h2><p class="muted">${esc(a.mission)}</p></div>
    </div></section>
    <section class="section"><div class="wrap split flip">
      <div class="photo" style="aspect-ratio:4/5;max-width:380px;justify-self:center"><img src="${IMG.vc}" alt="Portrait of the Vice Chancellor" loading="lazy" width="700" height="875"></div>
      <div class="stack"><h2 style="font-size:2rem">Message from the Vice Chancellor</h2>
        ${a.vc.message.map((p) => `<p class="muted prose">${esc(p)}</p>`).join('')}
        <p><b style="font-family:var(--font-head);font-size:1.2rem">${esc(a.vc.name)}</b><br><span class="muted">${esc(a.vc.title)}, ${esc(d.university.name)}</span></p></div>
    </div></section>
    <section class="section alt" id="facilities"><div class="wrap">
      <div class="section-head"><div><h2>Campus facilities</h2><p>Everything a student needs from first lecture to last prayer of the day.</p></div></div>
      <div class="grid g3">${a.facilities.map((f) => `<article class="fac-card reveal"><div class="photo"><img src="${esc(f.img)}" alt="${esc(f.name)}" loading="lazy" width="900" height="560"></div><div class="body"><h3>${icon(f.icon)} ${esc(f.name)}</h3><p>${esc(f.desc)}</p></div></article>`).join('')}</div>
    </div></section>`;
  };

  PAGES.departments = (d) => `
    ${pageHero('Departments', `${d.departments.length} departments offering undergraduate and postgraduate programs.`, [['Departments']])}
    <section class="section"><div class="wrap">
      <div class="field" style="max-width:420px;margin-bottom:28px"><label for="dq">Search departments</label><input id="dq" type="search" placeholder="Type a name, e.g. Law" autocomplete="off"></div>
      <div class="grid g3" id="dgrid">${d.departments.map(deptTile).join('')}</div>
      <p id="dempty" class="muted" hidden>No department matches your search.</p>
    </div></section>`;
  PAGES.departments.after = (d) => {
    const q = $('#dq'), grid = $('#dgrid');
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase(); let n = 0;
      $$('.dept-tile', grid).forEach((t, i) => { const hit = d.departments[i].name.toLowerCase().includes(v) || d.departments[i].programs.some((p) => p.name.toLowerCase().includes(v)); t.hidden = !hit; if (hit) n++; });
      $('#dempty').hidden = n > 0;
    });
  };

  PAGES.department = (d) => {
    const slug = new URLSearchParams(location.search).get('d');
    const idx = d.departments.findIndex((x) => x.slug === slug);
    if (idx < 0) return `${pageHero('Department not found', 'We could not find that department.', [['Departments', '/pages/departments.html']])}<section class="section"><div class="wrap"><a class="btn btn-primary" href="/pages/departments.html">Back to all departments</a></div></section>`;
    const x = d.departments[idx], prev = d.departments[(idx + d.departments.length - 1) % d.departments.length], next = d.departments[(idx + 1) % d.departments.length];
    document.title = `${x.name} | ${d.university.name}`;
    const groups = {}; x.activities.forEach((a) => { (groups[a.type] = groups[a.type] || []).push(a); });
    return `
    ${pageHero(`Department of ${x.name}`, x.short, [['Departments', '/pages/departments.html'], [x.name]])}
    <nav class="subnav" aria-label="Department sections"><div class="wrap"><a href="#overview">Overview</a><a href="#faculty">Faculty</a><a href="#fees">Fees</a><a href="#activities">Activities</a></div></nav>

    <section class="section" id="overview"><div class="wrap grid g2" style="gap:48px">
      <div class="stack"><h2 style="font-size:2rem">Overview</h2><p class="muted prose">${esc(x.overview)}</p><p><b>Chairperson:</b> ${esc(x.head)}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${askBtn(`${x.name} department fee`, 'Ask about fees')}${askBtn(`Who teaches in the ${x.name} department?`, 'Ask about teachers')}</div></div>
      <div><h3 style="font-size:1.3rem;margin-bottom:14px">Programs offered</h3>
        <div class="table-wrap"><table class="t" style="min-width:0"><thead><tr><th scope="col">Program</th><th scope="col">Duration</th></tr></thead><tbody>${x.programs.map((p) => `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.duration)}</td></tr>`).join('')}</tbody></table></div></div>
    </div></section>

    <section class="section alt" id="faculty"><div class="wrap">
      <div class="section-head"><div><h2>Faculty and subjects</h2><p>Each teacher is listed with the subjects assigned this year.</p></div></div>
      <div class="grid g3">${x.faculty.map((t) => `<article class="card teacher"><div style="display:flex;gap:14px;align-items:center"><div class="avatar" aria-hidden="true">${esc(t.name.replace(/^(Dr\.|Mr\.|Ms\.|Prof\.)\s+/, '').charAt(0))}</div><div><h3>${esc(t.name)}</h3><div class="role">${esc(t.designation)}</div></div></div>
        <div class="qual"><b>Qualification:</b> ${esc(t.qualification)}</div>
        <div><div style="font-size:.85rem;font-weight:600;margin-bottom:8px">Subjects assigned</div><div class="chips">${t.subjects.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div></article>`).join('')}</div>
    </div></section>

    <section class="section" id="fees"><div class="wrap">
      <div class="section-head"><div><h2>Semester-wise fee</h2><p>${esc(x.programs[0].name)}, in Pakistani rupees.</p></div><a class="link-arrow" href="/pages/fees.html?d=${x.slug}">Scholarships and installments ${icon('arrow-right')}</a></div>
      ${feeTable(x)}<p class="muted" style="margin-top:12px;font-size:.88rem">${esc(d.feeNote)}</p>
    </div></section>

    <section class="section alt" id="activities"><div class="wrap">
      <div class="section-head"><div><h2>Seminars, societies and other activities</h2></div></div>
      <div>${Object.entries(groups).map(([type, list]) => `<div class="act-group"><h3>${esc(type)}${list.length > 1 ? 's' : ''}</h3><ul>${list.map((a) => `<li><b>${esc(a.title)}</b><span>${esc(a.description)}</span></li>`).join('')}</ul></div>`).join('')}</div>
    </div></section>

    <section class="section" style="padding-top:40px"><div class="wrap" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">
      <a class="link-arrow" href="${deptUrl(prev.slug)}"><span style="transform:rotate(180deg);display:inline-flex">${icon('arrow-right')}</span> ${esc(prev.name)}</a>
      <a class="link-arrow" href="${deptUrl(next.slug)}">${esc(next.name)} ${icon('arrow-right')}</a></div></section>`;
  };
  PAGES.department.after = () => {
    const links = $$('.subnav a'), secs = links.map((a) => $(a.getAttribute('href')));
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-35% 0px -60% 0px' });
    secs.forEach((s) => s && io.observe(s));
  };

  PAGES.fees = (d) => `
    ${pageHero('Fee structure', 'Semester-wise fees for every department, scholarships and the installment policy.', [['Fees']])}
    <section class="section"><div class="wrap">
      <div class="field" style="max-width:420px;margin-bottom:24px"><label for="fdept">Select department</label>
        <select id="fdept">${d.departments.map((x) => `<option value="${x.slug}">${esc(x.name)}</option>`).join('')}</select></div>
      <div id="ftable" aria-live="polite"></div>
      <p class="muted" style="margin-top:12px;font-size:.88rem">${esc(d.feeNote)}</p>
    </div></section>
    <section class="section alt"><div class="wrap">
      <div class="section-head"><div><h2>All departments at a glance</h2><p>First semester total includes the one-time admission fee.</p></div></div>
      <div class="table-wrap"><table class="t"><thead><tr><th scope="col">Department</th><th scope="col" class="num">Semester 1 total</th><th scope="col" class="num">Semester 2 total</th><th scope="col" class="num">Semester 8 total</th></tr></thead>
        <tbody>${d.departments.map((x) => `<tr><td><a href="${deptUrl(x.slug)}" style="text-decoration:none;font-weight:600">${esc(x.name)}</a></td><td class="num">${pkr(x.fees[0].total)}</td><td class="num">${pkr(x.fees[1].total)}</td><td class="num">${pkr(x.fees[7].total)}</td></tr>`).join('')}</tbody></table></div>
    </div></section>
    <section class="section"><div class="wrap grid g2" style="gap:48px">
      <div id="scholarships"><h2 style="font-size:1.8rem;margin-bottom:18px">Scholarships and financial aid</h2>
        <div class="stack">${d.scholarships.map((s) => `<div class="card" style="padding:18px 20px"><h3 style="font-family:var(--font-body);font-size:1.02rem;letter-spacing:0">${esc(s.name)}</h3><p class="muted" style="font-size:.9rem;margin-top:4px">${esc(s.eligibility)}</p><p style="margin-top:6px"><span class="chip chip-gold">${esc(s.benefit)}</span></p></div>`).join('')}</div></div>
      <div id="installments"><h2 style="font-size:1.8rem;margin-bottom:18px">Installment policy</h2>
        <ul class="check-list">${d.installments.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>
        <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">${askBtn('Fee installment policy', 'Ask about installments')}<a class="btn btn-outline btn-sm" href="/pages/transport.html#challan">Van challan</a></div></div>
    </div></section>`;
  PAGES.fees.after = (d) => {
    const sel = $('#fdept'), out = $('#ftable');
    const show = () => { const x = d.departments.find((y) => y.slug === sel.value); out.innerHTML = feeTable(x); const u = new URL(location.href); u.searchParams.set('d', x.slug); history.replaceState(null, '', u); };
    const want = new URLSearchParams(location.search).get('d'); if (want && d.departments.some((y) => y.slug === want)) sel.value = want;
    sel.addEventListener('change', show); show();
  };

  PAGES.transport = (d) => {
    const t = d.transport;
    return `
    ${pageHero('Transport and van challan', 'University vans connect the campus with Bhakkar city and nearby towns.', [['Transport']])}
    <section class="section"><div class="wrap">
      <div class="section-head"><div><h2>Van routes</h2><p>Pickup points with morning timings, return times and fees per route.</p></div></div>
      <div class="grid g3">${t.routes.map((r) => `<article class="card route reveal"><h3>${icon('bus')} ${esc(r.name)}</h3><div class="muted" style="font-size:.88rem">${r.distanceKm} km from campus &middot; return ${esc(r.returnTimes.join(' and '))}</div>
        <ul aria-label="Pickup points for ${esc(r.name)}">${r.pickups.map((p) => `<li><span>${esc(p.name)}</span><b>${esc(p.time)}</b></li>`).join('')}</ul>
        <div class="fees"><div><b>${pkr(r.monthly)}</b><span>per month</span></div><div><b>${pkr(semFee(t, r))}</b><span>per semester</span></div></div></article>`).join('')}</div>
      <ul class="check-list" style="margin-top:32px;max-width:70ch">${t.notes.map((n) => `<li>${icon('check')}<span>${esc(n)}</span></li>`).join('')}</ul>
    </div></section>

    <section class="section alt" id="challan"><div class="wrap">
      <div class="section-head"><div><h2>Generate your van challan</h2><p>Fill in your details, check the amount and print three copies for the bank, the university and yourself.</p></div></div>
      <form class="card" id="cform" novalidate>
        <div class="form-grid">
          <div class="field"><label for="c-name">Student name</label><input id="c-name" required autocomplete="name"><span class="form-error" id="e-name"></span></div>
          <div class="field"><label for="c-roll">Roll number</label><input id="c-roll" required placeholder="e.g. CS-23-001"><span class="form-error" id="e-roll"></span></div>
          <div class="field"><label for="c-dept">Department</label><select id="c-dept">${d.departments.map((x) => `<option>${esc(x.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="c-route">Route</label><select id="c-route">${t.routes.map((r) => `<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="c-type">Payment for</label><select id="c-type"><option value="monthly">One month</option><option value="semester">Full semester (${t.semesterMonths} months, ${t.semesterDiscountPercent}% off)</option></select></div>
          <div class="field"><label for="c-month" id="c-month-l">Month</label><select id="c-month"></select></div>
          <div class="field"><label for="c-amt">Amount (PKR)</label><input id="c-amt" readonly></div>
          <div class="field"><label for="c-due">Due date</label><input id="c-due" readonly></div>
        </div>
        <div style="margin-top:22px;display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-primary" type="submit">Generate challan</button></div>
      </form>
      <div id="challan-out" style="margin-top:32px" hidden>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px"><h3 style="font-size:1.4rem">Your challan</h3>
          <button class="btn btn-gold" type="button" id="c-print">${icon('printer')} Print / Download PDF</button></div>
        <p class="muted" style="font-size:.88rem;margin-bottom:14px">In the print window choose &ldquo;Save as PDF&rdquo; as the destination to download it.</p>
        <div id="challan-print"><div class="challan-copies" id="challan-copies"></div></div>
      </div>
    </div></section>`;
  };
  const semFee = (t, r) => Math.round((r.monthly * t.semesterMonths * (100 - t.semesterDiscountPercent)) / 100 / 100) * 100;

  PAGES.transport.after = (d) => {
    const t = d.transport, $id = (i) => document.getElementById(i);
    const now = new Date();
    const months = [...Array(7)].map((_, i) => { const m = new Date(now.getFullYear(), now.getMonth() + i, 1); return { y: m.getFullYear(), m: m.getMonth(), label: m.toLocaleString('en-GB', { month: 'long', year: 'numeric' }) }; });
    $id('c-month').innerHTML = months.map((m, i) => `<option value="${i}">${m.label}</option>`).join('');
    const fmt = (dt) => dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const calc = () => {
      const r = t.routes.find((x) => x.id === $id('c-route').value), sem = $id('c-type').value === 'semester';
      const m = months[+$id('c-month').value];
      $id('c-month-l').textContent = sem ? 'Semester starting' : 'Month';
      $id('c-amt').value = pkr(sem ? semFee(t, r) : r.monthly);
      $id('c-due').value = fmt(new Date(m.y, m.m, t.dueDay));
      return { r, sem, m, amount: sem ? semFee(t, r) : r.monthly };
    };
    ['c-route', 'c-type', 'c-month'].forEach((i) => $id(i).addEventListener('change', calc)); calc();

    $id('cform').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $id('c-name').value.trim(), roll = $id('c-roll').value.trim();
      $id('e-name').textContent = name ? '' : 'Enter your full name.';
      $id('e-roll').textContent = roll ? '' : 'Enter your roll number.';
      if (!name || !roll) return;
      const { r, sem, m, amount } = calc();
      const no = `TUB-${m.y}${String(m.m + 1).padStart(2, '0')}-${r.id.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const period = sem ? `Semester starting ${m.label} (${t.semesterMonths} months)` : m.label;
      const b = t.bank;
      const sheet = (copy) => `<div class="challan-sheet"><h4>${esc(d.university.name)}</h4><div class="sub">Transport Fee Challan</div><span class="tag">${copy}</span>
        <dl><dt>Challan no.</dt><dd>${esc(no)}</dd><dt>Issue date</dt><dd>${fmt(new Date())}</dd><dt>Student</dt><dd>${esc(name)}</dd><dt>Roll no.</dt><dd>${esc(roll)}</dd><dt>Department</dt><dd>${esc($id('c-dept').value)}</dd><dt>Route</dt><dd>${esc(r.name)}</dd><dt>Period</dt><dd>${esc(period)}</dd><dt>Due date</dt><dd>${esc($id('c-due').value)}</dd></dl>
        <div class="amount">Amount payable: ${pkr(amount)}</div>
        <div class="bank"><b>Deposit at:</b> ${esc(b.bank)}, ${esc(b.branch)}<br>Account title: ${esc(b.accountTitle)}<br>Account no.: ${esc(b.accountNo)}<br>IBAN: ${esc(b.iban)}<br>Late payment fine of Rs 200 after due date.</div>
        <div class="sign"><span>Depositor signature</span><span>Bank stamp</span></div></div>`;
      $id('challan-copies').innerHTML = ['Student copy', 'Bank copy', 'University copy'].map(sheet).join('');
      const out = $id('challan-out'); out.hidden = false; out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $id('c-print').addEventListener('click', () => window.print());
  };

  PAGES.admissions = (d) => {
    const a = d.admissions;
    return `
    ${pageHero('Admissions', 'Spring 2027 admissions: eligibility, process, documents and dates.', [['Admissions']])}
    <section class="section"><div class="wrap grid g2" style="gap:56px">
      <div><h2 style="font-size:1.9rem;margin-bottom:20px">Important dates</h2>
        <div class="table-wrap"><table class="t" style="min-width:0"><tbody>${a.dates.map((x) => `<tr><td>${esc(x.event)}</td><td><b>${esc(x.date)}</b></td></tr>`).join('')}</tbody></table></div></div>
      <div><h2 style="font-size:1.9rem;margin-bottom:20px">Eligibility</h2>
        <div class="stack">${a.eligibility.map((e) => `<div><b>${esc(e.level)}</b><p class="muted" style="font-size:.93rem">${esc(e.text)}</p></div>`).join('')}</div></div>
    </div></section>
    <section class="section alt"><div class="wrap grid g2" style="gap:56px;align-items:start">
      <div><h2 style="font-size:1.9rem;margin-bottom:24px">How to apply</h2>
        <ol class="timeline">${a.steps.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol></div>
      <div><h2 style="font-size:1.9rem;margin-bottom:24px">Required documents</h2>
        <ul class="check-list">${a.documents.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
    </div></section>
    <section class="section"><div class="wrap" style="max-width:860px">
      <h2 style="font-size:1.9rem;margin-bottom:20px">Frequently asked questions</h2>
      <div>${a.faq.map((f) => `<details class="faq"><summary>${esc(f.q)}${icon('chevron-down')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
      <div style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-primary" href="/pages/contact.html">Contact admissions office</a>${askBtn('Admission process', 'Ask the assistant')}</div>
    </div></section>`;
  };

  PAGES.info = (d) => {
    const i = d.info;
    const list = (arr) => `<ul class="check-list">${arr.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
    const secs = [
      ['hostel', 'Hostel', `<p class="muted prose" style="margin-bottom:18px">${esc(i.hostel.intro)}</p>${list(i.hostel.items)}<div class="table-wrap" style="margin-top:20px;max-width:560px"><table class="t" style="min-width:0"><tbody>${i.hostel.fees.map((f) => `<tr><td>${esc(f.label)}</td><td><b>${esc(f.value)}</b></td></tr>`).join('')}</tbody></table></div>`],
      ['library', 'Library', `<p class="muted prose" style="margin-bottom:18px">${esc(i.library.intro)}</p>${list(i.library.items)}<p style="margin-top:16px"><b>Hours:</b> ${esc(i.library.hours)}</p>`],
      ['scholarships', 'Scholarships and financial aid', `<div class="grid g2">${d.scholarships.map((s) => `<div class="card" style="padding:18px 20px"><h3 style="font-family:var(--font-body);font-size:1.02rem;letter-spacing:0">${esc(s.name)}</h3><p class="muted" style="font-size:.9rem;margin-top:4px">${esc(s.eligibility)}</p><p style="margin-top:6px"><span class="chip chip-gold">${esc(s.benefit)}</span></p></div>`).join('')}</div>`],
      ['societies', 'Student societies', `<div class="grid g2">${i.societies.map((s) => `<div class="card" style="padding:18px 20px"><b>${esc(s.name)}</b><p class="muted" style="font-size:.92rem">${esc(s.desc)}</p></div>`).join('')}</div>`],
      ['sports', 'Sports', `<p class="muted prose" style="margin-bottom:14px">${esc(i.sports.intro)}</p><div class="chips" style="margin-bottom:14px">${i.sports.items.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div><p>${esc(i.sports.facilities)}</p>`],
      ['exams', 'Exams and datesheet', `<p class="muted prose" style="margin-bottom:16px">${esc(i.exams.intro)}</p><div class="table-wrap" style="margin-bottom:20px"><table class="t"><thead><tr><th scope="col">Exam</th><th scope="col">Dates</th><th scope="col">Datesheet</th></tr></thead><tbody>${i.exams.datesheet.map((x) => `<tr><td><b>${esc(x.term)}</b></td><td>${esc(x.dates)}</td><td>${esc(x.note)}</td></tr>`).join('')}</tbody></table></div>${list(i.exams.rules)}`],
      ['calendar', 'Academic calendar', `<div class="table-wrap"><table class="t" style="min-width:0"><tbody>${i.calendar.map((x) => `<tr><td style="white-space:nowrap"><b>${esc(x.date)}</b></td><td>${esc(x.event)}</td></tr>`).join('')}</tbody></table></div>`],
      ['rules', 'Rules and regulations', list(i.rules)],
      ['downloads', 'Downloads', `<div class="grid g2">${i.downloads.map((x) => `<a class="card" style="padding:18px 20px;display:flex;gap:14px;align-items:center;text-decoration:none" href="/downloads/${esc(x.file)}" download>${icon('file-text')}<span style="flex:1"><b>${esc(x.title)}</b><br><span class="muted" style="font-size:.88rem">${esc(x.desc)}</span></span>${icon('download')}</a>`).join('')}</div>`]
    ];
    return `${pageHero('Campus life and student services', 'Hostel, library, scholarships, societies, sports, exams, calendar, rules and downloads.', [['Campus Life']])}
    <section class="section"><div class="wrap side-layout">
      <nav class="side-nav" aria-label="On this page">${secs.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join('')}</nav>
      <div>${secs.map(([id, t, body]) => `<section class="info-block" id="${id}"><h2>${esc(t)}</h2>${body}</section>`).join('')}</div>
    </div></section>`;
  };

  PAGES.contact = (d) => {
    const u = d.university;
    const row = (ic, label, val, href) => `<div class="card" style="display:flex;gap:14px;align-items:flex-start;padding:20px"><span style="color:var(--accent);margin-top:2px">${icon(ic)}</span><div><b>${label}</b><div class="muted">${href ? `<a href="${href}" style="text-decoration:none">${esc(val)}</a>` : esc(val)}</div></div></div>`;
    return `${pageHero('Contact us', 'Visit the campus, call the office or send us a message.', [['Contact']])}
    <section class="section"><div class="wrap grid g2" style="gap:40px;align-items:start">
      <div class="stack">
        ${row('map-pin', 'Address', u.address)}${row('phone', 'Phone', u.phone, 'tel:' + u.phone.replace(/\s/g, ''))}${row('mail', 'General enquiries', u.email, 'mailto:' + u.email)}${row('mail', 'Admissions', u.admissionsEmail, 'mailto:' + u.admissionsEmail)}${row('clock', 'Office hours', u.hours)}
        <div style="display:flex;gap:10px"><a class="icon-btn" style="border-color:var(--line)" href="${esc(u.social.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a><a class="icon-btn" style="border-color:var(--line)" href="${esc(u.social.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a><a class="icon-btn" style="border-color:var(--line)" href="${esc(u.social.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a></div>
      </div>
      <form class="card" id="mform" novalidate><h2 style="font-size:1.5rem;margin-bottom:16px">Send a message</h2>
        <div class="stack">
          <div class="field"><label for="m-name">Your name</label><input id="m-name" required autocomplete="name"></div>
          <div class="field"><label for="m-email">Your email</label><input id="m-email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="m-sub">Subject</label><input id="m-sub" required></div>
          <div class="field"><label for="m-msg">Message</label><textarea id="m-msg" rows="5" required></textarea></div>
          <span class="form-error" id="m-err" role="alert"></span>
          <button class="btn btn-primary" type="submit" style="justify-self:start">${icon('send')} Send message</button>
          <p class="muted" style="font-size:.82rem">This opens your email app with the message ready to send.</p>
        </div></form>
    </div></section>
    <section class="section alt" style="padding-top:0;background:none"><div class="wrap"><div class="photo" style="aspect-ratio:16/7;min-height:320px"><iframe title="Map showing ${esc(u.name)}" src="https://maps.google.com/maps?q=Thal%20University%20Bhakkar&output=embed" style="border:0;width:100%;height:100%" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div></section>`;
  };
  PAGES.contact.after = (d) => {
    $('#mform').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (i) => document.getElementById(i).value.trim();
      if (!v('m-name') || !/^\S+@\S+\.\S+$/.test(v('m-email')) || !v('m-sub') || !v('m-msg')) { $('#m-err').textContent = 'Please fill in every field with a valid email address.'; return; }
      $('#m-err').textContent = '';
      const body = `${v('m-msg')}\n\nFrom: ${v('m-name')} (${v('m-email')})`;
      location.href = `mailto:${d.university.email}?subject=${encodeURIComponent(v('m-sub'))}&body=${encodeURIComponent(body)}`;
    });
  };

  /* ---------- Effects ---------- */
  function runCounters() {
    const els = $$('[data-count]'); if (!els.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const run = (el) => {
      const end = +el.dataset.count, t0 = performance.now(), dur = 1400;
      const step = (t) => { const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString('en-PK'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .6 });
    els.forEach((el) => io.observe(el));
  }
  function runReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach((el) => io.observe(el));
  }

  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && !t.dataset.failed) { t.dataset.failed = '1'; t.classList.add('is-broken'); if (t.parentElement) t.parentElement.classList.add('img-fallback'); }
  }, true);

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ask]');
    if (b && window.TUBChat) window.TUBChat.ask(b.dataset.ask);
  });

  /* ---------- Boot ---------- */
  async function boot() {
    const page = document.body.dataset.page;
    const app = $('#app');
    try {
      const d = await getData();
      buildLayout(d);
      const render = PAGES[page];
      app.innerHTML = render(d);
      if (!document.title.includes(d.university.name)) document.title = `${document.title} | ${d.university.name}`;
      if (render.after) render.after(d);
      runCounters(); runReveal();
      if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => t.scrollIntoView(), 50); }
    } catch (err) {
      console.error(err);
      app.innerHTML = '<div class="page-loading"><div style="text-align:center;padding:24px"><h1 style="font-size:1.6rem;margin-bottom:8px">The page could not load</h1><p>Please start the server with <code>npm start</code> and open <code>http://localhost:3000</code>, then refresh.</p></div></div>';
    }
  }

  window.TUB = { getData, icon, esc };
  boot();
})();

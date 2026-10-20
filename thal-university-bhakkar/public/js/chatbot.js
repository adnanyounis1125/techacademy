/* Thal University Bhakkar - floating assistant
   Talks only to this site's own endpoints: /api/chat, /api/stt, /api/tts. No API keys exist in the browser. */
(() => {
  'use strict';

  const STORE = 'tub-chat-v1';
  const AUTO_KEY = 'tub-chat-autospeak';
  const CHIPS = ['Admission process', 'CS department fee', 'Van routes', 'Hostel info'];
  const GREETING = 'Assalam o Alaikum! I am the Thal University assistant. Ask me about departments, teachers, fees, van routes, admissions or hostels. آپ اردو میں بھی پوچھ سکتے ہیں۔';
  const ic = (p) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const P = {
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    stop: '<rect width="14" height="14" x="5" y="5" rx="2"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    spk: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>'
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isUrdu = (s) => /[\u0600-\u06FF]/.test(s);
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/^\s*[-*]\s+/gm, '&bull; ').replace(/\n/g, '<br>');

  let msgs = [];
  let busy = false, recorder = null, stream = null, recTimer = null, audio = null, audioBtn = null;
  let autoSpeak = true;
  try { msgs = JSON.parse(sessionStorage.getItem(STORE) || '[]'); autoSpeak = localStorage.getItem(AUTO_KEY) !== '0'; } catch (e) { msgs = []; }

  const root = document.createElement('div');
  root.innerHTML = `
    <button class="chat-fab" id="cb-fab" type="button" aria-label="Open the university assistant" aria-haspopup="dialog">${ic(P.chat)}</button>
    <section class="chat-win" id="cb-win" role="dialog" aria-label="Thal University assistant" aria-hidden="true">
      <div class="chat-head"><img src="/images/logo.svg" alt="" width="36" height="36">
        <div class="t"><b>University assistant</b><span>Urdu and English &middot; Thal University only</span></div>
        <button class="icon-btn" id="cb-auto" type="button" aria-pressed="false" aria-label="Auto-speak replies" title="Auto-speak replies">${ic(P.spk)}</button>
        <button class="icon-btn" id="cb-clear" type="button" aria-label="Clear chat" title="Clear chat">${ic(P.trash)}</button>
        <button class="icon-btn" id="cb-close" type="button" aria-label="Close chat">${ic(P.x)}</button></div>
      <div class="chat-body" id="cb-body" role="log" aria-live="polite"></div>
      <div class="chat-chips" id="cb-chips">${CHIPS.map((c) => `<button type="button">${esc(c)}</button>`).join('')}</div>
      <form class="chat-form" id="cb-form">
        <button class="round mic" id="cb-mic" type="button" aria-label="Speak your question">${ic(P.mic)}</button>
        <textarea id="cb-input" rows="1" placeholder="Type your question..." aria-label="Your message" maxlength="500"></textarea>
        <button class="round send" id="cb-send" type="submit" aria-label="Send message">${ic(P.send)}</button>
      </form>
      <div class="chat-foot">Answers come from the university data. Please confirm important details with the office.</div>
    </section>`;
  document.body.appendChild(root);

  const $ = (id) => document.getElementById(id);
  const fab = $('cb-fab'), win = $('cb-win'), body = $('cb-body'), input = $('cb-input'), sendBtn = $('cb-send'), micBtn = $('cb-mic'), autoBtn = $('cb-auto');

  /* ---------- Rendering ---------- */
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40))); } catch (e) { /* ignore */ } }
  function scroll() { body.scrollTop = body.scrollHeight; }

  function msgHTML(m) {
    const ur = isUrdu(m.content);
    const spk = m.role === 'bot' && !m.err ? `<button class="speak" type="button" aria-label="Read this reply aloud" title="Read aloud">${ic(P.spk)}</button>` : '';
    return `<div class="msg ${m.role}${m.err ? ' err' : ''}"><div class="bubble${ur ? ' ur' : ''}" dir="auto"${ur ? ' lang="ur"' : ''}>${rich(m.content)}</div><div class="meta"><span>${fmtTime(m.time)}</span>${spk}</div></div>`;
  }
  function renderAll() {
    if (!msgs.length) msgs.push({ role: 'bot', content: GREETING, time: new Date().toISOString(), greet: true });
    body.innerHTML = msgs.map(msgHTML).join('');
    scroll();
  }
  function add(role, content, extra = {}) {
    const m = { role, content, time: new Date().toISOString(), ...extra };
    msgs.push(m);
    body.insertAdjacentHTML('beforeend', msgHTML(m));
    scroll(); save();
    return m;
  }
  function typing(on) {
    const old = $('cb-typing'); if (old) old.remove();
    if (on) { body.insertAdjacentHTML('beforeend', '<div class="msg bot" id="cb-typing" aria-label="Assistant is typing"><div class="bubble typing"><i></i><i></i><i></i></div></div>'); scroll(); }
  }
  function setBusy(v) { busy = v; sendBtn.disabled = v; }

  /* ---------- Sending ---------- */
  async function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    add('user', text);
    input.value = ''; autosize();
    setBusy(true); typing(true);
    const history = msgs.filter((m) => !m.greet && !m.err).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      const j = await r.json().catch(() => ({}));
      typing(false);
      if (!r.ok || !j.reply) { add('bot', j.error || 'Sorry, something went wrong. Please try again.', { err: true }); return; }
      const m = add('bot', j.reply);
      if (autoSpeak) speak(body.querySelector('.msg.bot:last-child .speak'), m.content);
    } catch (e) {
      typing(false);
      add('bot', 'I could not reach the server. Please check your internet connection and try again.', { err: true });
    } finally { setBusy(false); input.focus(); }
  }

  /* ---------- Voice output ---------- */
  function stopAudio() {
    if (audio) { audio.pause(); audio = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioBtn) { audioBtn.classList.remove('loading'); audioBtn.innerHTML = ic(P.spk); audioBtn = null; }
  }
  async function speak(btn, text) {
    if (!btn) return;
    if (audioBtn === btn) { stopAudio(); return; }
    stopAudio();
    audioBtn = btn;
    if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
      const utterance = new SpeechSynthesisUtterance(text);
      const urdu = /[\u0600-\u06FF]/.test(text);
      const lang = urdu ? 'ur-PK' : 'en-PK';
      const voices = window.speechSynthesis.getVoices();
      utterance.lang = lang;
      const languageVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(urdu ? 'ur' : 'en'));
      const femaleVoice = /\b(female|woman|zira|aria|jenny|samantha|sara|susan|hazel|ava|victoria|karen|nida)\b/i;
      utterance.voice = languageVoices.find((voice) => femaleVoice.test(voice.name)) || languageVoices[0] || null;
      utterance.pitch = 1.1;
      btn.classList.add('loading');
      utterance.onstart = () => { btn.classList.remove('loading'); btn.innerHTML = ic(P.stop); };
      utterance.onend = () => stopAudio();
      utterance.onerror = () => stopAudio();
      window.speechSynthesis.speak(utterance);
      return;
    }

    btn.classList.add('loading');
    try {
      const r = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || 'Voice reply is not available right now.'); }
      const url = URL.createObjectURL(await r.blob());
      if (audioBtn !== btn) { URL.revokeObjectURL(url); return; }
      audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); stopAudio(); };
      audio.onerror = () => { URL.revokeObjectURL(url); stopAudio(); add('bot', 'The voice reply could not be played in this browser.', { err: true }); };
      btn.classList.remove('loading'); btn.innerHTML = ic(P.stop);
      await audio.play();
    } catch (e) {
      stopAudio();
      const msg = e && e.name === 'NotAllowedError' ? 'Your browser blocked audio. Tap the speaker button again to play.' : (e.message || 'Voice reply is not available right now.');
      add('bot', msg, { err: true });
    }
  }

  /* ---------- Voice input ---------- */
  function pickMime() {
    const list = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    return list.find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || '';
  }
  function micUI(rec) {
    micBtn.classList.toggle('rec', rec);
    micBtn.innerHTML = ic(rec ? P.stop : P.mic);
    micBtn.setAttribute('aria-label', rec ? 'Stop recording' : 'Speak your question');
    input.placeholder = rec ? 'Listening... tap the red button to stop' : 'Type your question...';
  }
  function releaseMic() { clearTimeout(recTimer); if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } recorder = null; micUI(false); }

  async function toggleMic() {
    if (recorder) { recorder.stop(); return; }
    if (busy) return;
    if (!navigator.mediaDevices || !window.MediaRecorder) { add('bot', 'Voice input is not supported in this browser. Please type your question instead.', { err: true }); return; }
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) {
      const m = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'Microphone access was blocked. Allow the microphone in your browser settings and try again, or type your question.'
        : e && e.name === 'NotFoundError' ? 'No microphone was found on this device. Please type your question.'
        : 'The microphone could not be started. Please type your question.';
      add('bot', m, { err: true }); return;
    }
    const mime = pickMime(), chunks = [];
    try { recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); }
    catch (e) { releaseMic(); add('bot', 'Voice input is not supported in this browser. Please type your question instead.', { err: true }); return; }
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = async () => {
      const type = (recorder && recorder.mimeType) || mime || 'audio/webm';
      releaseMic();
      const blob = new Blob(chunks, { type });
      if (blob.size < 1500) { add('bot', 'I did not catch that. Tap the microphone and speak for a little longer.', { err: true }); return; }
      setBusy(true); typing(true);
      try {
        const fd = new FormData();
        fd.append('audio', blob, 'speech.' + (type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : 'webm'));
        const r = await fetch('/api/stt', { method: 'POST', body: fd });
        const j = await r.json().catch(() => ({}));
        typing(false); setBusy(false);
        if (!r.ok || !j.text) { add('bot', j.error || 'Could not understand the audio. Please try again or type your question.', { err: true }); return; }
        send(j.text);
      } catch (e) { typing(false); setBusy(false); add('bot', 'Could not send the recording. Please check your connection and try again.', { err: true }); }
    };
    recorder.start(); micUI(true);
    recTimer = setTimeout(() => { if (recorder) recorder.stop(); }, 60000);
  }

  /* ---------- Window state ---------- */
  function open() { win.classList.add('open'); win.setAttribute('aria-hidden', 'false'); fab.classList.add('hidden'); setTimeout(() => input.focus(), 250); }
  function close() { win.classList.remove('open'); win.setAttribute('aria-hidden', 'true'); fab.classList.remove('hidden'); stopAudio(); if (recorder) recorder.stop(); fab.focus(); }
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; }

  fab.addEventListener('click', open);
  $('cb-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && win.classList.contains('open')) close(); });
  $('cb-clear').addEventListener('click', () => { stopAudio(); msgs = []; save(); renderAll(); });
  autoBtn.setAttribute('aria-pressed', String(autoSpeak));
  autoBtn.title = autoSpeak ? 'Auto-speak replies is on' : 'Auto-speak replies is off';
  autoBtn.addEventListener('click', () => {
    autoSpeak = !autoSpeak; autoBtn.setAttribute('aria-pressed', String(autoSpeak));
    autoBtn.title = autoSpeak ? 'Auto-speak replies is on' : 'Auto-speak replies is off';
    try { localStorage.setItem(AUTO_KEY, autoSpeak ? '1' : '0'); } catch (e) { /* ignore */ }
    if (!autoSpeak) stopAudio();
  });
  micBtn.addEventListener('click', toggleMic);
  $('cb-form').addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });
  $('cb-chips').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) send(b.textContent); });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('.speak'); if (!b) return;
    const all = [...body.querySelectorAll('.msg.bot')], el = b.closest('.msg');
    const botMsgs = msgs.filter((m) => m.role === 'bot' && !m.err);
    const idx = all.filter((n) => !n.classList.contains('err') && n.id !== 'cb-typing').indexOf(el);
    if (botMsgs[idx]) speak(b, botMsgs[idx].content);
  });

  renderAll();
  window.TUBChat = { open, close, ask: (q) => { open(); send(q); } };
})();

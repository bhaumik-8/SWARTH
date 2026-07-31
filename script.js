/* =========================================================
   Maitree ❤ Cutie — an interactive love story
   Built by BHAUMIK.8
   ========================================================= */
(() => {
  'use strict';

  /* ---------- tiny helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pick = (arr) => arr[randInt(0, arr.length - 1)];
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ---------- elements ---------- */
  const appRoot         = $('appRoot');
  const bgTextField      = $('bgTextField');
  const heartsLayer      = $('heartsLayer');
  const sceneLoading     = $('scene-loading');
  const sceneWelcome     = $('scene-welcome');
  const sceneQuestion    = $('scene-question');
  const sceneCat         = $('scene-cat');
  const sceneFinal       = $('scene-final');
  const startBtn         = $('startBtn');
  const yesBtn           = $('yesBtn');
  const noBtn            = $('noBtn');
  const noToast          = $('noToast');
  const celebration      = $('celebration');
  const burstLayer       = $('burst');
  const catBokehField    = $('catBokehField');
  const finalBokehField  = $('finalBokehField');
  const catStage         = $('catStage');
  const finalStage       = $('finalStage');
  const floatingMessage  = $('floatingMessage');
  const bgMusic          = $('bgMusic');
  const soundHint        = $('soundHint');

  const scenes = [sceneLoading, sceneWelcome, sceneQuestion, sceneCat, sceneFinal];
  function showScene(target){
    scenes.forEach((s) => s.classList.toggle('active', s === target));
  }

  /* ---------- ambient floating background text ---------- */
  const BG_WORDS = ['Cutie', 'Maitree', '∞', 'Cutie', 'Maitree', '∞'];
  function buildBackgroundText(){
    const count = window.innerWidth < 600 ? 10 : 16;
    for (let i = 0; i < count; i++){
      const span = document.createElement('span');
      const isMark = i % 7 === 6; // sneak the watermark in, rarely, very faint
      span.textContent = isMark ? 'BHAUMIK.8' : pick(BG_WORDS);
      span.style.left = rand(-4, 94) + 'vw';
      span.style.top = rand(0, 130) + 'vh';
      span.style.fontSize = (isMark ? rand(0.7, 1.05) : rand(1.4, 4.2)) + 'rem';
      span.style.opacity = isMark ? 0.045 : rand(0.045, 0.11);
      span.style.setProperty('--rot', rand(-8, 8) + 'deg');
      span.style.animationDuration = rand(26, 52) + 's';
      span.style.animationDelay = '-' + rand(0, 40) + 's';
      bgTextField.appendChild(span);
    }
  }

  /* ---------- floating hearts ---------- */
  const HEART_GLYPHS = ['❤️', '💕', '💗', '💓', '✨'];
  function spawnHeart(opts = {}){
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = opts.glyph || pick(HEART_GLYPHS);
    el.style.left = (opts.left ?? rand(4, 96)) + 'vw';
    el.style.fontSize = rand(opts.minSize || 14, opts.maxSize || 28) + 'px';
    el.style.setProperty('--dur', rand(opts.minDur || 5, opts.maxDur || 9) + 's');
    el.style.setProperty('--drift', rand(-60, 60) + 'px');
    el.style.setProperty('--spin', rand(-160, 160) + 'deg');
    el.style.setProperty('--scale', rand(0.8, 1.3).toFixed(2));
    heartsLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
    setTimeout(() => el.remove(), 12000); // safety net
  }

  let ambientHeartTimer = null;
  function startAmbientHearts(rateMs){
    stopAmbientHearts();
    ambientHeartTimer = setInterval(() => spawnHeart(), rateMs);
  }
  function stopAmbientHearts(){
    if (ambientHeartTimer){ clearInterval(ambientHeartTimer); ambientHeartTimer = null; }
  }

  /* ---------- bokeh light blobs for the immersive scenes ---------- */
  function buildBokeh(field, palette){
    field.innerHTML = '';
    for (let i = 0; i < 4; i++){
      const b = document.createElement('div');
      b.className = 'bokeh';
      const size = rand(140, 320);
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = rand(-10, 90) + 'vw';
      b.style.top = rand(-5, 85) + 'vh';
      b.style.background = pick(palette);
      b.style.setProperty('--bx', rand(-40, 40) + 'px');
      b.style.setProperty('--by', rand(-40, 40) + 'px');
      b.style.animationDuration = rand(10, 20) + 's';
      b.style.animationDelay = '-' + rand(0, 10) + 's';
      field.appendChild(b);
    }
  }

  /* ---------- parallax (desktop mouse + mobile touch) ---------- */
  function handleParallax(clientX, clientY){
    const px = (clientX / window.innerWidth - 0.5) * 2;
    const py = (clientY / window.innerHeight - 0.5) * 2;
    const card = document.querySelector('.scene.active .glass-card');
    if (card) card.style.transform = `translate(${px * 7}px, ${py * 5}px)`;
    if (sceneCat.classList.contains('active')) catStage.style.transform = `translate(${px * 10}px, ${py * 8}px)`;
    if (sceneFinal.classList.contains('active')) finalStage.style.transform = `translate(${px * 12}px, ${py * 9}px)`;
  }

  /* ---------- the NO button: must never be pressed ---------- */
  const NO_MESSAGES = [
    '😂 Nice try Cutie!',
    '❤️ Only YES works.',
    '🤭 Catch me first.',
    '😜 Nope...',
    '💕 Destiny already chose YES.'
  ];
  const MOVE_TYPES = ['slide-left', 'slide-right', 'slide-up', 'slide-down', 'bounce', 'rotate', 'teleport', 'shrink', 'diagonal'];

  let lastMsgIndex = -1;
  let toastTimer = null;
  function showNoToast(){
    let idx = randInt(0, NO_MESSAGES.length - 1);
    if (idx === lastMsgIndex) idx = (idx + 1) % NO_MESSAGES.length;
    lastMsgIndex = idx;
    noToast.textContent = NO_MESSAGES[idx];
    const rect = noBtn.getBoundingClientRect();
    noToast.style.top = clamp(rect.top - 46, 10, window.innerHeight - 40) + 'px';
    noToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => noToast.classList.remove('show'), 1300);
  }

  function positionNoInitial(){
    const yr = yesBtn.getBoundingClientRect();
    const nw = noBtn.offsetWidth || 118;
    const nh = noBtn.offsetHeight || 54;
    let left = yr.right + 22;
    let top = yr.top + (yr.height - nh) / 2;
    if (left + nw > window.innerWidth - 16){
      left = yr.left;
      top = yr.bottom + 18;
    }
    noBtn.style.left = clamp(left, 16, window.innerWidth - nw - 16) + 'px';
    noBtn.style.top = clamp(top, 16, window.innerHeight - nh - 16) + 'px';
  }

  let lastEvade = 0;
  function evadeNo(){
    const now = performance.now();
    if (now - lastEvade < 220) return;
    lastEvade = now;

    noBtn.classList.remove('teleport');
    const rect = noBtn.getBoundingClientRect();
    const vwid = window.innerWidth, vhei = window.innerHeight;
    const margin = 14;
    const bw = rect.width || 118, bh = rect.height || 54;
    const withinX = (v) => clamp(v, margin, vwid - bw - margin);
    const withinY = (v) => clamp(v, margin, vhei - bh - margin);
    let x = rect.left, y = rect.top;

    switch (pick(MOVE_TYPES)){
      case 'slide-left':
        x = withinX(rect.left - rand(150, 260)); y = withinY(rect.top + rand(-50, 50));
        break;
      case 'slide-right':
        x = withinX(rect.left + rand(150, 260)); y = withinY(rect.top + rand(-50, 50));
        break;
      case 'slide-up':
        x = withinX(rect.left + rand(-50, 50)); y = withinY(rect.top - rand(120, 220));
        break;
      case 'slide-down':
        x = withinX(rect.left + rand(-50, 50)); y = withinY(rect.top + rand(120, 220));
        break;
      case 'diagonal':
        x = withinX(rect.left + (Math.random() < 0.5 ? -1 : 1) * rand(150, 240));
        y = withinY(rect.top + (Math.random() < 0.5 ? -1 : 1) * rand(120, 200));
        break;
      case 'bounce':
        x = withinX(rect.left + rand(-170, 170)); y = withinY(rect.top + rand(-170, 170));
        noBtn.style.transform = 'translateY(-20px) rotate(0deg)';
        setTimeout(() => { noBtn.style.transform = 'translateY(0) rotate(0deg)'; }, 180);
        break;
      case 'rotate':
        x = withinX(rect.left + rand(-190, 190)); y = withinY(rect.top + rand(-150, 150));
        noBtn.style.transform = `rotate(${rand(-32, 32)}deg)`;
        setTimeout(() => { noBtn.style.transform = 'rotate(0deg)'; }, 380);
        break;
      case 'teleport':
        x = rand(margin, vwid - bw - margin); y = rand(margin + 50, vhei - bh - margin - 50);
        noBtn.classList.add('teleport');
        break;
      case 'shrink':
        noBtn.classList.add('shrink');
        x = rand(margin, vwid - bw - margin); y = rand(margin + 50, vhei - bh - margin - 50);
        setTimeout(() => {
          noBtn.style.left = x + 'px'; noBtn.style.top = y + 'px';
          requestAnimationFrame(() => noBtn.classList.remove('shrink'));
        }, 170);
        showNoToast();
        return;
    }
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    showNoToast();
  }

  function isQuestionActive(){ return sceneQuestion.classList.contains('active'); }

  function proximityCheck(clientX, clientY, threshold){
    if (!isQuestionActive()) return;
    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (Math.hypot(clientX - cx, clientY - cy) < threshold) evadeNo();
  }

  let mmScheduled = false, lastMX = 0, lastMY = 0;
  document.addEventListener('mousemove', (e) => {
    lastMX = e.clientX; lastMY = e.clientY;
    if (mmScheduled) return;
    mmScheduled = true;
    requestAnimationFrame(() => {
      proximityCheck(lastMX, lastMY, 95);
      handleParallax(lastMX, lastMY);
      mmScheduled = false;
    });
  });
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    proximityCheck(t.clientX, t.clientY, 120);
    handleParallax(t.clientX, t.clientY);
  }, { passive: true });

  noBtn.addEventListener('mouseenter', () => { if (isQuestionActive()) evadeNo(); });
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); evadeNo(); }, { passive: false });
  noBtn.addEventListener('click', (e) => { e.preventDefault(); evadeNo(); });

  /* ---------- YES + celebration ---------- */
  function burstHearts(){
    burstLayer.innerHTML = '';
    for (let i = 0; i < 34; i++){
      const el = document.createElement('span');
      el.className = 'burst-heart';
      el.textContent = pick(['❤️', '💗', '💕', '✨', '💖']);
      const angle = rand(0, Math.PI * 2);
      const dist = rand(90, window.innerWidth < 500 ? 220 : 320);
      el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      el.style.setProperty('--rot', rand(-180, 180) + 'deg');
      el.style.setProperty('--scale', rand(0.6, 1.3).toFixed(2));
      el.style.setProperty('--size', rand(16, 30) + 'px');
      el.style.setProperty('--dur', rand(0.9, 1.6) + 's');
      el.style.animationDelay = rand(0, 0.25) + 's';
      burstLayer.appendChild(el);
    }
  }

  yesBtn.addEventListener('click', () => {
    celebration.classList.add('active');
    burstHearts();
    appRoot.classList.add('zooming');
    setTimeout(() => appRoot.classList.remove('zooming'), 1100);
    setTimeout(() => {
      celebration.classList.remove('active');
      enterCatScene();
    }, 2500);
  });

  /* ---------- cat scene — exactly 8 seconds ---------- */
  let catHeartTimer = null;
  function enterCatScene(){
    showScene(sceneCat);
    buildBokeh(catBokehField, [
      'radial-gradient(circle,#ff9ecb,transparent 70%)',
      'radial-gradient(circle,#c48bff,transparent 70%)'
    ]);
    catHeartTimer = setInterval(() => spawnHeart({ minDur: 3, maxDur: 5 }), 450);
    setTimeout(() => {
      clearInterval(catHeartTimer);
      enterFinalScene();
    }, 2000);
  }

  /* ---------- final scene — forever ---------- */
  const ROMANTIC_MESSAGES = [
    'You became my favorite coincidence ❤️',
    'Every smile of yours feels like home.',
    'You make ordinary days unforgettable.',
    'You are my favorite notification.',
    'Life became prettier after you.',
    'Forever sounds beautiful with you.',
    'You + Me = ∞',
    'My favorite place is wherever you are.',
    'Thank you for existing.',
    "You're my favorite hello."
  ];
  let msgTimer = null, msgIndex = -1;
  function showNextMessage(){
    floatingMessage.classList.remove('show');
    setTimeout(() => {
      msgIndex = (msgIndex + 1) % ROMANTIC_MESSAGES.length;
      floatingMessage.textContent = ROMANTIC_MESSAGES[msgIndex];
      floatingMessage.classList.add('show');
    }, 550);
  }

  function tryPlayMusic(){
    const p = bgMusic.play();
    if (p && p.catch){
      p.catch(() => {
        soundHint.classList.add('show');
        const resume = () => {
          bgMusic.play().then(() => soundHint.classList.remove('show')).catch(() => {});
        };
        document.addEventListener('touchend', resume, { once: true });
        document.addEventListener('click', resume, { once: true });
      });
    }
  }
  // Safety net alongside the native `loop` attribute — replays ONLY the audio, forever.
  bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  });

  function enterFinalScene(){
    showScene(sceneFinal);
    buildBokeh(finalBokehField, [
      'radial-gradient(circle,#ff8fca,transparent 70%)',
      'radial-gradient(circle,#c48bff,transparent 70%)',
      'radial-gradient(circle,#ffd9a3,transparent 70%)'
    ]);
    tryPlayMusic();
    showNextMessage();
    msgTimer = setInterval(showNextMessage, 4600);
    startAmbientHearts(700);
  }

  /* ---------- welcome → question ---------- */
  startBtn.addEventListener('click', () => {
    showScene(sceneQuestion);
    requestAnimationFrame(positionNoInitial);
  });

  window.addEventListener('resize', () => { if (isQuestionActive()) positionNoInitial(); });

  /* ---------- boot ---------- */
  buildBackgroundText();
  setTimeout(() => showScene(sceneWelcome), 2200);

})();

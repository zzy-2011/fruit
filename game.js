(() => {
  'use strict';
  const cv = document.getElementById('game'); const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const scoreEl = document.getElementById('score'), livesEl = document.getElementById('lives');
  const overlay = document.getElementById('overlay'), ovTitle = document.getElementById('ov-title'), ovSub = document.getElementById('ov-sub');
  const BW = 80, BH = 18;
  const FRUITS = ['🍎', '🍊', '🍇', '🍓', '🍉', '🍌', '💣'];
  let basket, items, score, lives, over, spawnTimer, keys;

  function reset() { basket = { x: W / 2 - BW / 2, y: H - 40 }; items = []; score = 0; lives = 3; over = false; spawnTimer = 0; keys = {}; scoreEl.textContent = '0'; livesEl.textContent = '3'; overlay.classList.add('hidden'); }
  function spawn() { const isBomb = Math.random() < 0.15; items.push({ x: 20 + Math.random() * (W - 40), y: -20, vy: 2 + Math.random() * 2.2, sym: isBomb ? '💣' : FRUITS[Math.floor(Math.random() * (FRUITS.length - 1))], bomb: isBomb }); }
  function update() {
    if (over) return;
    if (keys['ArrowLeft'] || keys['a']) basket.x -= 8;
    if (keys['ArrowRight'] || keys['d']) basket.x += 8;
    basket.x = Math.max(0, Math.min(W - BW, basket.x));
    spawnTimer++; if (spawnTimer > 35) { spawnTimer = 0; spawn(); }
    for (const it of items) {
      it.y += it.vy;
      if (it.y > basket.y - 10 && it.y < basket.y + BH && it.x > basket.x && it.x < basket.x + BW) {
        it.dead = true;
        if (it.bomb) { lives--; livesEl.textContent = lives; if (lives <= 0) { over = true; ovTitle.textContent = '游戏结束'; ovSub.textContent = '得分 ' + score; overlay.classList.remove('hidden'); } }
        else { score += 10; scoreEl.textContent = score; }
      } else if (it.y > H + 20) {
        it.dead = true; if (!it.bomb) { lives--; livesEl.textContent = lives; if (lives <= 0) { over = true; ovTitle.textContent = '游戏结束'; ovSub.textContent = '得分 ' + score; overlay.classList.remove('hidden'); } }
      }
    }
    items = items.filter(i => !i.dead);
  }
  function draw() {
    ctx.fillStyle = '#1a1c3a'; ctx.fillRect(0, 0, W, H);
    ctx.font = '26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const it of items) ctx.fillText(it.sym, it.x, it.y);
    ctx.fillStyle = '#6c7bff'; ctx.fillRect(basket.x, basket.y, BW, BH);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(basket.x, basket.y, BW, 4);
  }
  window.addEventListener('keydown', e => { keys[e.key] = true; if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) e.preventDefault(); });
  window.addEventListener('keyup', e => { keys[e.key] = false; });
  function pointer(e) { const rect = cv.getBoundingClientRect(); const px = (e.clientX - rect.left) / rect.width * W; basket.x = Math.max(0, Math.min(W - BW, px - BW / 2)); }
  cv.addEventListener('mousemove', pointer);
  cv.addEventListener('touchmove', e => { const t = e.touches[0]; const rect = cv.getBoundingClientRect(); const px = (t.clientX - rect.left) / rect.width * W; basket.x = Math.max(0, Math.min(W - BW, px - BW / 2)); }, { passive: true });
  document.getElementById('new').addEventListener('click', reset);
  document.getElementById('ov-btn').addEventListener('click', reset);
  function loop() { update(); draw(); requestAnimationFrame(loop); }
  reset(); requestAnimationFrame(loop);
})();

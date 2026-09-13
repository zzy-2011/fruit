(() => {
  'use strict';
  const cv = document.getElementById('game'); const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const scoreEl = document.getElementById('score'), levelEl = document.getElementById('level');
  const overlay = document.getElementById('overlay'), ovTitle = document.getElementById('ov-title'), ovSub = document.getElementById('ov-sub');
  const CELL = 40, COLS = 10, ROWS = 12, R = 17;
  const COLORS = ['#ff5c7a', '#4fd1ff', '#43d97a', '#ffd23f', '#b15cff'];
  let grid, sx, sy, cur, next, aim, flying, over, score, level;

  function rc(r, c) { return r * COLS + c; }
  function reset() {
    grid = Array(ROWS * COLS).fill(-1);
    for (let r = 0; r < 5; r++) for (let c = 0; c < COLS; c++) grid[rc(r, c)] = Math.floor(Math.random() * COLORS.length);
    sx = W / 2; sy = H - 30; cur = Math.floor(Math.random() * COLORS.length); next = Math.floor(Math.random() * COLORS.length);
    aim = -Math.PI / 2; flying = null; over = false; score = 0; level = 1;
    scoreEl.textContent = '0'; levelEl.textContent = '1'; overlay.classList.add('hidden');
  }
  function cellX(r, c) { return c * CELL + CELL / 2; }
  function cellY(r) { return r * CELL + CELL / 2 + 8; }
  function neighbors(r, c) {
    const res = [];
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dr, dc]) => { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) res.push([nr, nc]); });
    return res;
  }
  function snap(bx, by, color) {
    let r = Math.round((by - 8 - CELL / 2) / CELL), c = Math.round((bx - CELL / 2) / CELL);
    r = Math.max(0, Math.min(ROWS - 1, r)); c = Math.max(0, Math.min(COLS - 1, c));
    if (grid[rc(r, c)] !== -1) {
      let best = null, bd = 1e9;
      for (const [nr, nc] of neighbors(r, c)) if (grid[rc(nr, nc)] === -1) { const d = Math.hypot(cellX(nr, nc) - bx, cellY(nr) - by); if (d < bd) { bd = d; best = [nr, nc]; } }
      if (!best) return;
      [r, c] = best;
    }
    grid[rc(r, c)] = color;
    resolve(r, c, color);
  }
  function resolve(r, c, color) {
    const grp = [[r, c]]; const seen = new Set([rc(r, c)]); const st = [[r, c]];
    while (st.length) { const [y, x] = st.pop(); for (const [nr, nc] of neighbors(y, x)) { const i = rc(nr, nc); if (!seen.has(i) && grid[i] === color) { seen.add(i); grp.push([nr, nc]); st.push([nr, nc]); } } }
    if (grp.length >= 3) { grp.forEach(([y, x]) => grid[rc(y, x)] = -1); score += grp.length * 10; scoreEl.textContent = score; dropFloaters(); }
    if (grid.every(v => v === -1)) { level++; levelEl.textContent = level; for (let rr = 0; rr < 5; rr++) for (let cc = 0; cc < COLS; cc++) grid[rc(rr, cc)] = Math.floor(Math.random() * COLORS.length); }
    if (over || grid.slice(ROWS - 2).some(v => v !== -1)) { over = true; ovTitle.textContent = '游戏结束'; ovSub.textContent = '得分 ' + score; overlay.classList.remove('hidden'); }
  }
  function dropFloaters() {
    const seen = new Set(); const stk = [];
    for (let c = 0; c < COLS; c++) if (grid[rc(0, c)] !== -1) { seen.add(rc(0, c)); stk.push([0, c]); }
    while (stk.length) { const [y, x] = stk.pop(); for (const [nr, nc] of neighbors(y, x)) { const i = rc(nr, nc); if (!seen.has(i) && grid[i] !== -1) { seen.add(i); stk.push([nr, nc]); } } }
    for (let i = 0; i < grid.length; i++) if (grid[i] !== -1 && !seen.has(i)) { grid[i] = -1; score += 20; }
    scoreEl.textContent = score;
  }
  function update() {
    if (over) return;
    if (flying) {
      flying.x += flying.vx; flying.y += flying.vy;
      if (flying.x < R) { flying.x = R; flying.vx *= -1; }
      if (flying.x > W - R) { flying.x = W - R; flying.vx *= -1; }
      if (flying.y < cellY(0)) { snap(flying.x, cellY(0), cur); flying = null; cur = next; next = Math.floor(Math.random() * COLORS.length); return; }
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (grid[rc(r, c)] !== -1 && Math.hypot(cellX(r, c) - flying.x, cellY(r) - flying.y) < CELL * 0.85) { snap(flying.x, flying.y, cur); flying = null; cur = next; next = Math.floor(Math.random() * COLORS.length); return; }
    }
  }
  function fire() {
    if (over || flying) return;
    const vx = Math.cos(aim) * 7, vy = Math.sin(aim) * 7;
    flying = { x: sx, y: sy, vx, vy };
  }
  function draw() {
    ctx.fillStyle = '#1a1c3a'; ctx.fillRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (grid[rc(r, c)] !== -1) { ctx.fillStyle = COLORS[grid[rc(r, c)]]; ctx.beginPath(); ctx.arc(cellX(r, c), cellY(r), R, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(cellX(r, c) - 4, cellY(r) - 4, 4, 0, Math.PI * 2); ctx.fill(); }
    if (flying) { ctx.fillStyle = COLORS[cur]; ctx.beginPath(); ctx.arc(flying.x, flying.y, R, 0, Math.PI * 2); ctx.fill(); }
    // 瞄准线
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(aim) * 60, sy + Math.sin(aim) * 60); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = COLORS[cur]; ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('下一个', 8, H - 10); ctx.fillStyle = COLORS[next]; ctx.beginPath(); ctx.arc(46, H - 14, 10, 0, Math.PI * 2); ctx.fill();
  }
  function aimAt(e) { const rect = cv.getBoundingClientRect(); const px = (e.clientX - rect.left) / rect.width * W, py = (e.clientY - rect.top) / rect.height * H; aim = Math.atan2(py - sy, px - sx); if (aim > -0.15) aim = -0.15; if (aim < -Math.PI + 0.15) aim = -Math.PI + 0.15; }
  cv.addEventListener('mousemove', aimAt);
  cv.addEventListener('touchmove', e => { const t = e.touches[0]; aimAt(t); }, { passive: true });
  cv.addEventListener('click', e => { aimAt(e); fire(); });
  cv.addEventListener('touchend', e => { const t = e.changedTouches[0]; aimAt(t); fire(); }, { passive: true });
  document.getElementById('new').addEventListener('click', reset);
  document.getElementById('ov-btn').addEventListener('click', reset);
  function loop() { update(); draw(); requestAnimationFrame(loop); }
  reset(); requestAnimationFrame(loop);
})();

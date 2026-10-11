// Canvas effects, kept out of the React tree: plain functions over a <canvas>.

const dprOf = () => Math.min(window.devicePixelRatio || 1, innerWidth < 768 ? 1.5 : 2); // phones redraw these often; 1.5x is plenty for hairlines

/** Size a canvas's backing store to its CSS box. Returns the CSS size. */
function fit(canvas: HTMLCanvasElement) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const r = dprOf();
  if (canvas.width !== Math.round(w * r) || canvas.height !== Math.round(h * r)) {
    canvas.width = Math.round(w * r);
    canvas.height = Math.round(h * r);
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(r, 0, 0, r, 0, 0);
  return { ctx, w, h };
}

/* ---------- Contour lines: iso-lines of a slow four-sine field (marching squares) ---------- */

const LINE_SCALE = 3.8;
const LINE_COUNT = 2.5;
const WAVE_AMOUNT = 0.37;
const WAVE_SPEED = 0.55;

const field = (x: number, y: number, t: number) => {
  let f = Math.sin(x + t * 0.6) * 0.5;
  f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
  f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
  f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
  return f * 0.5 + 0.5;
};

export function contours(canvas: HTMLCanvasElement, color: string, cells = 96) {
  const start = performance.now();
  let values = new Float32Array(0);

  return (now = performance.now()) => {
    const { ctx, w, h } = fit(canvas);
    if (!w || !h) return;
    const t = ((now - start) / 1000) * WAVE_SPEED;
    const cols = w >= h ? cells : Math.max(8, Math.round((cells * w) / h));
    const rows = Math.max(8, Math.round((cols * h) / w));
    const sx = w / cols;
    const sy = h / rows;
    const aspect = w / h;
    const n = (cols + 1) * (rows + 1);
    if (values.length !== n) values = new Float32Array(n);

    for (let j = 0; j <= rows; j++)
      for (let i = 0; i <= cols; i++) {
        const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE;
        const ny = ((j / rows) * 2 - 1) * LINE_SCALE;
        const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT;
        const qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
        values[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
      }

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const seg = (p: number[], q: number[]) => (ctx.moveTo(p[0], p[1]), ctx.lineTo(q[0], q[1]));
    for (let level = 0.5; level < LINE_COUNT; level += 1)
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const a = values[j * (cols + 1) + i];
          const b = values[j * (cols + 1) + i + 1];
          const c = values[(j + 1) * (cols + 1) + i + 1];
          const d = values[(j + 1) * (cols + 1) + i];
          const k = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
          if (k === 0 || k === 15) continue;
          const x0 = i * sx;
          const y0 = j * sy;
          const top = [x0 + sx * ((level - a) / (b - a)), y0];
          const right = [x0 + sx, y0 + sy * ((level - b) / (c - b))];
          const bottom = [x0 + sx * ((level - d) / (c - d)), y0 + sy];
          const left = [x0, y0 + sy * ((level - a) / (d - a))];
          switch (k) {
            case 1: case 14: seg(left, bottom); break;
            case 2: case 13: seg(bottom, right); break;
            case 3: case 12: seg(left, right); break;
            case 4: case 11: seg(top, right); break;
            case 6: case 9: seg(top, bottom); break;
            case 7: case 8: seg(left, top); break;
            case 5: seg(left, top); seg(bottom, right); break;
            case 10: seg(left, bottom); seg(top, right); break;
          }
        }
    ctx.stroke();
  };
}

/* ---------- Pixel dissolve: the previous section's colour breaks into tiles and burns off ---------- */

const CELL = 28;
const SOLID_UNTIL = 0.16;
const LIFT = 2;
const ACCENT_SHARE = 0.05;

// Deterministic per-cell hash, so the pattern is stable across resizes and frames.
const noise = (x: number, y: number) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

export function dissolve(canvas: HTMLCanvasElement, surface: string, accent: string) {
  return (progress: number) => {
    const { ctx, w, h } = fit(canvas);
    ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    const lift = progress * LIFT;
    for (let y = 0; y < rows; y++) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= SOLID_UNTIL;
      const fade = Math.min(1, Math.max(0, 1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL)));
      if (!solid && fade <= 0) break;
      for (let x = 0; x < cols; x++) {
        if (!solid && ((x + y) % 2 !== 0 || noise(x, y) > fade)) continue;
        ctx.fillStyle = !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : surface;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  };
}

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  // ponytail: one cheap self-check of the hash's range; the canvas output is verified by eye in the browser.
  for (let i = 0; i < 50; i++) console.assert(noise(i, i * 7) >= 0 && noise(i, i * 7) <= 1, 'dissolve noise out of range');
}

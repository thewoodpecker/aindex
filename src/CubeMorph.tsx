import { useEffect, useRef } from "react";
import { CUBE_GEO } from "./cubeGeo";

type Poly = number[][];
type Pt3 = [number, number, number];
type Box = [number, number, number, number, number, number];
type Geo = {
  R: Poly[];
  bang: Poly[];
  P: Poly[];
  win: Poly[];
  door: number[];
};

const G = CUBE_GEO as unknown as Geo;

export function CubeMorph({ className, playEvery }: { className?: string; playEvery?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    return mountCubeMorph(canvas, playEvery);
  }, [playEvery]);

  return <canvas ref={ref} className={className ? `cube-morph ${className}` : "cube-morph"} aria-hidden="true" />;
}

function mountCubeMorph(cv: HTMLCanvasElement, playEvery?: number) {
  const maybe = cv.getContext("2d");
  if (!maybe) {
    return;
  }
  const ctx: CanvasRenderingContext2D = maybe;

  const C = Math.cos(Math.PI / 6);
  const D2R = Math.PI / 180;
  const TURN = 1.2;
  const HOLD = 2.0;
  const T = TURN + HOLD;
  const LEAD = 0.45;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ioCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  const ioQuint = (x: number) => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2);
  const inCubic = (x: number) => x * x * x;
  const outBack = (s = 1.70158) => (x: number) => {
    const c3 = s + 1;
    return 1 + c3 * (x - 1) ** 3 + s * (x - 1) ** 2;
  };
  const arr = (a: number, delay: number, dur: number, e: (x: number) => number) =>
    a <= delay ? 0 : a >= delay + dur ? 1 : e((a - delay) / dur);
  const dep = (d: number, delay: number, dur: number) =>
    d <= delay ? 1 : d >= delay + dur ? 0 : 1 - inCubic((d - delay) / dur);

  const rotZ = (p: number[], deg: number): Pt3 => {
    const r = deg * D2R;
    const c = Math.cos(r);
    const s = Math.sin(r);
    const x = p[0] - 50;
    const y = p[1] - 50;
    return [50 + x * c - y * s, 50 + x * s + y * c, p[2]];
  };
  const SIDE = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const faceBasis = (i: number) => {
    const [nx, ny] = SIDE[i];
    const U = [ny, -nx, 0];
    const O = [50 + nx * 50 - U[0] * 50, 50 + ny * 50 - U[1] * 50, 100];
    return { n: [nx, ny, 0] as Pt3, U, O };
  };
  const fpt = (b: ReturnType<typeof faceBasis>, s: number, t: number, dpt = 0): Pt3 => [
    b.O[0] + b.U[0] * s + b.n[0] * dpt,
    b.O[1] + b.U[1] * s + b.n[1] * dpt,
    b.O[2] - t,
  ];
  const scalePoly = (poly: Poly, cx: number, cy: number, k: number) =>
    poly.map(([s, t]) => [cx + (s - cx) * k, cy + (t - cy) * k]);
  const bboxC = (polys: Poly[]) => {
    let a = 1e9;
    let b = 1e9;
    let c = -1e9;
    let d = -1e9;
    for (const p of polys) {
      for (const [s, t] of p) {
        a = Math.min(a, s);
        b = Math.min(b, t);
        c = Math.max(c, s);
        d = Math.max(d, t);
      }
    }
    return [(a + c) / 2, (b + d) / 2];
  };
  const glyph = (polys: Poly[], k: number, dt = 0) => {
    if (k <= 0.001) {
      return [];
    }
    const [cx, cy] = bboxC(polys);
    return polys.map((p) => scalePoly(p, cx, cy, k).map(([s, t]) => [s, t + dt]));
  };
  const rectP = (s0: number, t0: number, s1: number, t1: number) => [
    [s0, t0],
    [s1, t0],
    [s1, t1],
    [s0, t1],
  ];

  const TOP = "#FFFFFF";
  const grey = (k: number) => {
    const clamped = Math.max(-0.6, Math.min(1.6, k));
    const g = 255 * (0.3 + 0.3 * clamped);
    const v = Math.round(Math.max(0, Math.min(255, g)));
    return `rgb(${v},${v},${v})`;
  };
  const shadeFor = (n: number[]) => {
    if (n[2] > 0.5) {
      return TOP;
    }
    return grey(Math.atan2(n[1], n[0]) / D2R / 90);
  };

  const VIEW = { s: 1, ox: 0, oy: 0 };
  let TH = 0;
  const W = (p: number[]) => rotZ(p, TH);
  const proj = (p: number[]) => {
    const w = W(p);
    return [VIEW.ox + (w[0] - w[1]) * C * VIEW.s, VIEW.oy + ((w[0] + w[1]) / 2 - w[2]) * VIEW.s];
  };
  const wn = (n: number[]) => {
    const r = TH * D2R;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [n[0] * c - n[1] * s, n[0] * s + n[1] * c, n[2]];
  };
  const visible = (n: number[]) => {
    const w = wn(n);
    return w[0] + w[1] + w[2] > 1e-4;
  };
  const pathPoly = (pts: number[][]) => {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.closePath();
  };

  const LOGOS = [
    {
      L: G.R,
      right(a: number, d: number) {
        const e = arr(a, 0.05, 0.75, outBack(1.1));
        const k = dep(d, 0, 0.4);
        if (e <= 0 || k <= 0) {
          return { holes: [] as Poly[] };
        }
        return { holes: glyph(G.bang, k, -(1 - e) * 95) };
      },
      boxes(a: number, d: number) {
        void a;
        void d;
        return [] as Box[];
      },
    },
    {
      L: G.R,
      right(a: number, d: number) {
        const holes: Poly[] = [];
        G.win.forEach((w, i) => {
          const row = Math.floor(i / 3);
          const k = arr(a, 0.1 + (2 - row) * 0.12, 0.38, outBack(1.6)) * dep(d, row * 0.06, 0.26);
          if (k > 0.001) {
            const [cx, cy] = bboxC([w]);
            holes.push(scalePoly(w, cx, cy, k));
          }
        });
        const ang = 88 * arr(a, 0.35, 0.75, ioCubic) * (d > 0 ? 1 - ioCubic(clamp(d / 0.4)) : 1);
        return { holes, door: ang > 0.3 ? ang : 0 };
      },
      boxes(a: number, d: number) {
        const h1 = arr(a, 0.45, 0.55, outBack(1.8)) * dep(d, 0.05, 0.3);
        const h2 = arr(a, 0.62, 0.6, outBack(1.6)) * dep(d, 0, 0.3);
        const o: Box[] = [];
        if (h1 > 0.01) {
          o.push([52, 82, 18, 44, 100, 100 + 16 * h1]);
        }
        if (h2 > 0.01) {
          o.push([22, 28, 22, 28, 100, 100 + 46 * h2]);
        }
        return o;
      },
    },
    {
      L: G.P,
      right(a: number, d: number) {
        void a;
        void d;
        return { holes: [] as Poly[] };
      },
      boxes(a: number, d: number) {
        const o: Box[] = [];
        [64, 26].forEach((y0, i) => {
          const b = arr(a, 0.08 + i * 0.07, 0.55, outBack(2.4)) * dep(d, i * 0.04, 0.26);
          if (b > 0.01) {
            o.push([100, 100 + 40 * b, y0, y0 + 8, 30, 74]);
          }
        });
        return o;
      },
    },
  ];

  function drawSide(fi: number, holes: Poly[], door: number) {
    const b = faceBasis(fi);
    if (!visible(b.n)) {
      return;
    }
    const quad = [
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100],
    ].map(([s, t]) => proj(fpt(b, s, t)));
    ctx.save();
    ctx.beginPath();
    pathPoly(quad);
    ctx.clip();
    ctx.beginPath();
    pathPoly(quad);
    for (const h of holes) {
      pathPoly(h.map(([s, t]) => proj(fpt(b, s, t))));
    }
    if (door) {
      const [s0, t0, s1, t1] = G.door;
      pathPoly(rectP(s0, t0, s1, t1).map(([s, t]) => proj(fpt(b, s, t))));
    }
    const col = shadeFor(wn(b.n));
    ctx.fillStyle = col;
    ctx.fill("evenodd");
    ctx.restore();
    ctx.beginPath();
    pathPoly(quad);
    ctx.strokeStyle = col;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    if (door) {
      const [s0, t0, s1, t1] = G.door;
      const w = s1 - s0;
      const r = door * D2R;
      const dq = rectP(s0, t0, s1, t1).map(([s, t]) => proj(fpt(b, s, t)));
      const se = s0 + w * Math.cos(r);
      const de = -w * Math.sin(r);
      const slab = [
        [s0, t0, 0],
        [se, t0, de],
        [se, t1, de],
        [s0, t1, 0],
      ].map(([s, t, dd]) => proj(fpt(b, s, t, dd)));
      const U = b.U;
      const n = b.n;
      const ln = [n[0] * Math.cos(r) + U[0] * Math.sin(r), n[1] * Math.cos(r) + U[1] * Math.sin(r), 0];
      ctx.save();
      ctx.beginPath();
      pathPoly(dq);
      ctx.clip();
      ctx.beginPath();
      pathPoly(slab);
      ctx.fillStyle = shadeFor(wn(ln));
      ctx.fill();
      ctx.restore();
    }
  }

  function drawBox(bx: Box) {
    const [x0, x1, y0, y1, z0, z1] = bx;
    const F: [Pt3, Pt3[]][] = [
      [
        [1, 0, 0],
        [
          [x1, y0, z1],
          [x1, y1, z1],
          [x1, y1, z0],
          [x1, y0, z0],
        ],
      ],
      [
        [-1, 0, 0],
        [
          [x0, y0, z1],
          [x0, y1, z1],
          [x0, y1, z0],
          [x0, y0, z0],
        ],
      ],
      [
        [0, 1, 0],
        [
          [x0, y1, z1],
          [x1, y1, z1],
          [x1, y1, z0],
          [x0, y1, z0],
        ],
      ],
      [
        [0, -1, 0],
        [
          [x0, y0, z1],
          [x1, y0, z1],
          [x1, y0, z0],
          [x0, y0, z0],
        ],
      ],
      [
        [0, 0, 1],
        [
          [x0, y0, z1],
          [x1, y0, z1],
          [x1, y1, z1],
          [x0, y1, z1],
        ],
      ],
    ];
    for (const [n, pts] of F) {
      if (!visible(n)) {
        continue;
      }
      ctx.beginPath();
      pathPoly(pts.map(proj));
      ctx.fillStyle = shadeFor(wn(n));
      ctx.fill();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  }

  const toLocal = (bx: Box, m: number): Box => {
    const a = rotZ([bx[0], bx[2], 0], -m * 90);
    const b = rotZ([bx[1], bx[3], 0], -m * 90);
    return [Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), bx[4], bx[5]];
  };
  const mod = (a: number, b: number) => ((a % b) + b) % b;

  function state(tau: number) {
    const n = Math.floor(tau / T);
    const u = tau - n * T;
    const turning = u < TURN;
    const p = clamp(u / TURN);
    TH = REDUCED ? n * 90 : (n - 1) * 90 + 90 * ioQuint(p);
    const side: Record<number, { holes: Poly[]; door: number }> = {};
    const add = (fi: number, h: { holes?: Poly[]; door?: number }) => {
      const face = mod(fi, 4);
      side[face] = side[face] || { holes: [], door: 0 };
      side[face].holes.push(...(h.holes || []));
      if (h.door) {
        side[face].door = h.door;
      }
    };
    const boxes: Box[] = [];
    const cur = mod(n, 3);
    const prv = mod(n - 1, 3);
    const aC = REDUCED ? 99 : u - TURN;
    const dC = REDUCED ? 0 : Math.max(0, u - (T - LEAD));
    if (turning && !REDUCED) {
      const dP = u + LEAD;
      add(n - 1, { holes: glyph(LOGOS[prv].L, 1) });
      add(n, LOGOS[prv].right(99, dP));
      LOGOS[prv].boxes(99, dP).forEach((b) => boxes.push(toLocal(b, n - 1)));
      add(n, { holes: glyph(LOGOS[cur].L, p <= 0.06 ? 0 : p >= 0.6 ? 1 : outBack(1.4)((p - 0.06) / 0.54)) });
    } else {
      add(n, { holes: glyph(LOGOS[cur].L, 1) });
    }
    add(n + 1, LOGOS[cur].right(aC, dC));
    LOGOS[cur].boxes(aC, dC).forEach((b) => boxes.push(toLocal(b, n)));
    return { side, boxes };
  }

  function render(tau: number) {
    const st = state(tau);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineJoin = "miter";
    const top: Pt3[] = [
      [0, 0, 100],
      [100, 0, 100],
      [100, 100, 100],
      [0, 100, 100],
    ];
    ctx.beginPath();
    pathPoly(top.map(proj));
    ctx.fillStyle = TOP;
    ctx.fill();
    ctx.strokeStyle = TOP;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    for (let fi = 0; fi < 4; fi++) {
      const s = st.side[fi] || { holes: [], door: 0 };
      drawSide(fi, s.holes, s.door);
    }
    const depth = (b: Box) => {
      const w = W([(b[0] + b[1]) / 2, (b[2] + b[3]) / 2, (b[4] + b[5]) / 2]);
      return w[0] + w[1] + w[2];
    };
    st.boxes.sort((a, b) => depth(a) - depth(b)).forEach(drawBox);
  }

  function resize() {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    VIEW.s = cv.width / 280;
    VIEW.ox = cv.width / 2;
    VIEW.oy = cv.height * (158 / 280);
  }

  const restTau = 2 * T + TURN + 0.9;
  let last = playEvery ? restTau : TURN;
  resize();
  render(last);

  const observer = new ResizeObserver(() => {
    resize();
    render(last);
  });
  observer.observe(cv);

  let frame = 0;
  let fade = 0;
  let step = 0;
  let playStart: number | null = null;
  if (REDUCED) {
    if (!playEvery) {
      step = window.setInterval(() => {
        cv.style.opacity = "0";
        fade = window.setTimeout(() => {
          last += T;
          render(last);
          cv.style.opacity = "1";
        }, 250);
      }, 3200);
    }
  } else if (playEvery) {
    const loopDur = 3 * T;
    const play = (ts: number) => {
      if (playStart === null) {
        playStart = ts;
      }
      const elapsed = (ts - playStart) / 1000;
      if (elapsed >= loopDur) {
        playStart = null;
        last = restTau;
        render(last);
        step = window.setTimeout(() => {
          frame = requestAnimationFrame(play);
        }, playEvery * 1000);
        return;
      }
      last = restTau + elapsed;
      render(last);
      frame = requestAnimationFrame(play);
    };
    step = window.setTimeout(() => {
      frame = requestAnimationFrame(play);
    }, playEvery * 1000);
  } else {
    let t0: number | null = null;
    const loop = (ts: number) => {
      if (t0 === null) {
        t0 = ts;
      }
      last = TURN + (ts - t0) / 1000;
      render(last);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
  }

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    window.clearInterval(step);
    window.clearTimeout(step);
    window.clearTimeout(fade);
  };
}

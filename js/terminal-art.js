// Terminal ASCII Hare (Bunny) & Glyph Art Engine
// Adapted from Hallmark Terminal theme for Viral Parmar Portfolio
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dotfile strings printed into the glyph cells
  const DOT = `export ANALYST=ViralParmar
export PATH="$HOME/.local/bin:$HOME/go/bin:$PATH"
alias audit='python3 -m po_copilot.audit'
alias sppl='curl -s https://sppl-erp.internal/api/telemetry'
alias linq='curl -s https://linq-hrms.internal/api/punch-coupling'
alias gxp='python3 -m gxp_reviewer --strict --alcoa'
[user] name = "Viral Parmar" email = "parmarviral397@gmail.com"
[gxp] 21cfrPart11 = enforced auditTrail = immutable
[alcoa] attributable = true legible = true contemporaneous = true
[sppl] stories = 178 completion = 0.957 qaQuarantine = active
[linq] stories = 176 delivery = 1.000 biometricSync = direct
[copilot] tests = 28 duration = "0.895s" wal = true
`.replace(/\s+/g, '');

  const NOISE = '!#$%&*+-./:;<=>?@[]^_{|}~0123456789abcdefghijklmnopqrstuvwxyz';

  const fontReady = document.fonts ? document.fonts.load('500 12px "Martian Mono"') : Promise.resolve();

  const getThemeRamp = () => {
    const css = getComputedStyle(document.documentElement);
    // Check if glyph tokens exist, otherwise generate dynamically from accent/ink
    const custom0 = css.getPropertyValue('--glyph-0').trim();
    if (custom0) {
      return Array.from({ length: 8 }, (_, i) => css.getPropertyValue(`--glyph-${i}`).trim());
    }
    // Dynamic fallback matching current theme
    const accent = css.getPropertyValue('--color-accent').trim() || '#34d399';
    return [
      'oklch(30% 0.06 146)',
      'oklch(38% 0.08 145)',
      'oklch(47% 0.11 144)',
      'oklch(57% 0.14 143)',
      'oklch(67% 0.17 142)',
      'oklch(77% 0.19 142)',
      'oklch(86% 0.20 141)',
      'oklch(94% 0.12 138)'
    ];
  };

  const getHotColor = () => {
    const css = getComputedStyle(document.documentElement);
    return css.getPropertyValue('--color-accent').trim() || 'oklch(87% 0.2 142)';
  };

  const initArt = (box, H, { align = 'end', delay = 0 } = {}) => {
    const cv = box.querySelector('canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const cells = [];
    let k = 0;

    H.lv.forEach((row, y) => {
      [...row].forEach((c, x) => {
        const v = +c;
        if (v) cells.push({ x, y, v, ch: DOT[k++ % DOT.length], at: 0, heat: 0 });
      });
    });

    const grid = new Map(cells.map((c) => [c.y * H.cols + c.x, c]));
    let cw = 0, ch = 0, ox = 0, oy = 0, fs = 0, t0 = 0, raf = 0;
    let ramp = getThemeRamp();
    let hot = getHotColor();

    const size = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cw = Math.min(r.width / H.cols, r.height / (H.rows * H.ratio));
      ch = cw * H.ratio;
      fs = cw * 1.62;
      ox = align === 'end' ? r.width - cw * H.cols : align === 'center' ? (r.width - cw * H.cols) / 2 : 0;
      oy = r.height - ch * H.rows;

      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      cv.style.width = r.width + 'px';
      cv.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    };

    const fonts = Array.from({ length: 9 }, (_, v) => `${v > 6 ? 700 : 500} ${(0.62 + 0.38 * Math.min(1, v / 6)) * 1}px "Martian Mono", monospace`);
    const setFont = (v) => {
      ctx.font = fonts[v].replace(/^(\d+) ([\d.]+)px/, (m, w, s) => `${w} ${(s * fs).toFixed(2)}px`);
    };

    const draw = (now) => {
      raf = 0;
      const t = now - t0;
      let busy = false, last = -1;
      ctx.clearRect(0, 0, cv.width, cv.height);

      for (const c of cells) {
        const px = ox + c.x * cw + cw / 2;
        const py = oy + c.y * ch + ch / 2;

        if (t < c.at) {
          busy = true;
          continue;
        }

        const lvl = c.heat > 0.04 || t < c.at + 260 ? 8 : c.v;
        if (lvl !== last) {
          setFont(lvl);
          last = lvl;
        }

        if (t < c.at + 260) {
          busy = true;
          ctx.fillStyle = ramp[Math.min(7, c.v + 1)];
          ctx.fillText(NOISE[(Math.random() * NOISE.length) | 0], px, py);
          continue;
        }

        if (c.heat > 0.04) {
          busy = true;
          ctx.fillStyle = c.heat > 0.5 ? hot : ramp[Math.min(7, c.v + 2)];
          ctx.fillText(c.heat > 0.25 ? NOISE[(Math.random() * NOISE.length) | 0] : c.ch, px, py);
          c.heat *= 0.9;
          continue;
        }

        c.heat = 0;
        ctx.fillStyle = ramp[c.v - 1];
        ctx.fillText(c.ch, px, py);
      }

      if (busy) raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      ramp = getThemeRamp();
      hot = getHotColor();
      box.classList.add('is-live');
      size();
      cells.forEach((c) => {
        c.at = still ? -1e6 : delay + c.y * (1100 / H.rows) + Math.random() * 420;
      });
      t0 = performance.now();
      kick();
    };

    // Re-render when theme changes
    const observer = new MutationObserver(() => {
      ramp = getThemeRamp();
      hot = getHotColor();
      kick();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        if (box.classList.contains('is-live')) {
          size();
          kick();
        }
      }).observe(box);
    } else {
      addEventListener('resize', () => {
        size();
        kick();
      });
    }

    if (!still) {
      box.addEventListener('pointermove', (e) => {
        const r = cv.getBoundingClientRect();
        const gx = (e.clientX - r.left - ox) / cw;
        const gy = (e.clientY - r.top - oy) / ch;
        const R = 7;
        for (let y = Math.floor(gy - R / 2); y <= gy + R / 2; y++) {
          for (let x = Math.floor(gx - R); x <= gx + R; x++) {
            const c = grid.get(y * H.cols + x);
            if (!c) continue;
            const d = Math.hypot((x - gx) / R, (y - gy) / (R / 2));
            if (d < 1) c.heat = Math.max(c.heat, 1 - d);
          }
        }
        kick();
      });
    }

    // Trigger pulse externally
    box.pulseHare = () => {
      cells.forEach((c) => {
        if (Math.random() < 0.25) c.heat = 1.0;
      });
      kick();
    };

    return start;
  };

  const setupAll = () => {
    document.querySelectorAll('[data-art]').forEach((box) => {
      const artName = box.dataset.art;
      const data = window.ART && window.ART[artName];
      if (!data) return;
      const align = box.dataset.artAlign || (artName === 'mark' ? 'start' : 'end');
      const start = initArt(box, data, { align });

      if (artName === 'hare' || !('IntersectionObserver' in window)) {
        fontReady.then(start, start);
      } else {
        new IntersectionObserver((entries, obs) => {
          if (entries[0].isIntersecting) {
            obs.disconnect();
            fontReady.then(start, start);
          }
        }, { threshold: 0.2 }).observe(box);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAll);
  } else {
    setupAll();
  }
})();

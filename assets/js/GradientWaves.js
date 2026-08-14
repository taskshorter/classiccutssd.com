/**
 * GradientWaves — React Bits component ported to vanilla JS + ogl
 * Mounts behind the Classic Cuts About / Mission section.
 */
import { Renderer, Program, Mesh, Triangle } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const detailToSteps = detail => {
  if (detail === 'low') return 40.0;
  if (detail === 'high') return 110.0;
  return 70.0;
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform float uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse > 0.5) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  // Soften the hard horizon edge instead of a binary sky/wave cut
  t = smoothstep(0.0, 0.55, t);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = t * uOpacity;
  // Extra vertical soften so the top of the wave band eases into the section bg
  float screenY = gl_FragCoord.y / max(iResolution.y, 1.0);
  alpha *= smoothstep(0.08, 0.42, screenY);
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

function mountGradientWaves(container, options = {}) {
  if (!container) return () => {};

  const reduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return () => {};

  const cfg = {
    horizonColor: options.horizonColor || '#0a0a0a',
    waveColor: options.waveColor || '#6e6e6e',
    crestColor: options.crestColor || '#f2f2f2',
    speed: options.speed != null ? options.speed : 0.35,
    amplitude: options.amplitude != null ? options.amplitude : 2.2,
    waveScale: options.waveScale != null ? options.waveScale : 0.55,
    waveRatio: options.waveRatio != null ? options.waveRatio : 0.9,
    swell: options.swell != null ? options.swell : 32,
    turbulence: options.turbulence != null ? options.turbulence : 18,
    tilt: options.tilt != null ? options.tilt : 1.11,
    zoom: options.zoom != null ? options.zoom : 1.0,
    height: options.height != null ? options.height : 5.5,
    fogDepth: options.fogDepth != null ? options.fogDepth : 15,
    detail: options.detail || 'medium',
    brightness: options.brightness != null ? options.brightness : 0.95,
    opacity: options.opacity != null ? options.opacity : 0.9,
    mouseInteraction: options.mouseInteraction !== false,
    parallaxStrength: options.parallaxStrength != null ? options.parallaxStrength : 0.45,
    grain: options.grain !== false,
    grainIntensity: options.grainIntensity != null ? options.grainIntensity : 0.04,
  };

  let enableMouse = cfg.mouseInteraction;

  const renderer = new Renderer({
    webgl: 2,
    alpha: true,
    depth: false,
    premultipliedAlpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  });

  const gl = renderer.gl;
  if (!gl || !renderer.isWebgl2) {
    console.error('[GradientWaves] WebGL2 is required but unavailable');
    return () => {};
  }
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const h = hexToRgb(cfg.horizonColor);
  const w = hexToRgb(cfg.waveColor);
  const cr = hexToRgb(cfg.crestColor);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    cullFace: false,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uSpeed: { value: cfg.speed },
      uAmplitude: { value: cfg.amplitude },
      uWaveScale: { value: cfg.waveScale },
      uWaveRatio: { value: cfg.waveRatio },
      uSwell: { value: cfg.swell },
      uTurbulence: { value: cfg.turbulence },
      uTilt: { value: cfg.tilt },
      uZoom: { value: cfg.zoom },
      uHeight: { value: cfg.height },
      uFogDepth: { value: cfg.fogDepth },
      uSteps: { value: detailToSteps(cfg.detail) },
      uBrightness: { value: cfg.brightness },
      uOpacity: { value: cfg.opacity },
      uGrain: { value: cfg.grain ? 1.0 : 0.0 },
      uGrainIntensity: { value: cfg.grainIntensity },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uParallax: { value: cfg.parallaxStrength },
      uEnableMouse: { value: cfg.mouseInteraction ? 1.0 : 0.0 },
      uHorizonColor: { value: new Float32Array(h) },
      uWaveColor: { value: new Float32Array(w) },
      uCrestColor: { value: new Float32Array(cr) },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  const setSize = () => {
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height);
    const res = program.uniforms.iResolution.value;
    res[0] = gl.drawingBufferWidth;
    res[1] = gl.drawingBufferHeight;
    renderer.render({ scene: mesh });
  };

  const ro = new ResizeObserver(setSize);
  ro.observe(container);
  setSize();

  const currentMouse = [0.5, 0.5];
  const targetMouse = [0.5, 0.5];

  const onPointerMove = e => {
    const rect = canvas.getBoundingClientRect();
    targetMouse[0] = (e.clientX - rect.left) / Math.max(rect.width, 1);
    targetMouse[1] = 1.0 - (e.clientY - rect.top) / Math.max(rect.height, 1);
  };
  const onPointerLeave = () => {
    targetMouse[0] = 0.5;
    targetMouse[1] = 0.5;
  };
  // Listen on section so parallax works even though canvas is behind content
  const pointerTarget = container.closest('#about') || container;
  pointerTarget.addEventListener('pointermove', onPointerMove);
  pointerTarget.addEventListener('pointerleave', onPointerLeave);

  let raf = 0;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  const t0 = performance.now();

  const loop = t => {
    program.uniforms.iTime.value = (t - t0) * 0.001;
    const tx = enableMouse ? targetMouse[0] : 0.5;
    const ty = enableMouse ? targetMouse[1] : 0.5;
    currentMouse[0] += 0.05 * (tx - currentMouse[0]);
    currentMouse[1] += 0.05 * (ty - currentMouse[1]);
    program.uniforms.uMouse.value[0] = currentMouse[0];
    program.uniforms.uMouse.value[1] = currentMouse[1];
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  };

  const tryStart = () => {
    if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
  };
  const tryStop = () => {
    if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      isVisible ? tryStart() : tryStop();
    },
    { threshold: 0 }
  );
  io.observe(container);

  const onVisibility = () => {
    isPageVisible = !document.hidden;
    isPageVisible ? tryStart() : tryStop();
  };
  document.addEventListener('visibilitychange', onVisibility);

  tryStart();

  return () => {
    tryStop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    pointerTarget.removeEventListener('pointermove', onPointerMove);
    pointerTarget.removeEventListener('pointerleave', onPointerLeave);
    try {
      container.removeChild(canvas);
    } catch (_) {}
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
  };
}

function initAboutWaves() {
  const el = document.getElementById('cc-gradient-waves');
  if (!el) return;

  try {
    mountGradientWaves(el, {
      // Greyscale waves — black / grey / white
      horizonColor: '#0a0a0a',
      waveColor: '#6e6e6e',
      crestColor: '#f2f2f2',
      speed: 0.4,
      amplitude: 2.8,
      waveScale: 0.58,
      waveRatio: 0.9,
      swell: 35,
      turbulence: 20,
      tilt: 0.78,
      zoom: 0.88,
      height: 2.4,
      fogDepth: 28,
      detail: 'medium',
      brightness: 1.15,
      opacity: 1.0,
      mouseInteraction: true,
      parallaxStrength: 0.5,
      grain: true,
      grainIntensity: 0.05,
    });
  } catch (err) {
    console.error('[GradientWaves] failed to mount', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutWaves);
} else {
  initAboutWaves();
}

export { mountGradientWaves };

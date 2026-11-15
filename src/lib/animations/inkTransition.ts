import { prefersReducedMotion } from "./config";

/**
 * Procedural Harmonic Fractal Noise for Ink Polygon Boundary
 * Produces organic, irregular fluid tendrils and liquid splatter fingers
 * matching the WebGL 2 parameters: Tendrils 2.50, Noise Scale 2.50
 */
export function generateInkPolygon(
  cx: number,
  cy: number,
  radius: number,
  tendrils = 2.5,
  time = 0,
  points = 72
): string {
  if (radius <= 0.001) {
    const centerPoint = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    const emptyPoints = new Array(points).fill(centerPoint);
    return `polygon(${emptyPoints.join(", ")})`;
  }

  const coords: string[] = [];

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;

    // Harmonic multi-frequency noise to simulate viscous fluid fingering
    const n1 = Math.sin(angle * 3.0 + time * 1.5) * 0.18;
    const n2 = Math.cos(angle * 5.0 - time * 1.8 + 0.8) * 0.14;
    const n3 = Math.sin(angle * 8.0 + time * 2.2 + 2.1) * 0.10;
    const n4 = Math.cos(angle * 13.0 - time * 2.6 + 3.4) * 0.07;
    const n5 = Math.sin(angle * 21.0 + 1.2) * 0.04;

    const noiseSum = n1 + n2 + n3 + n4 + n5;
    // Scale radial distortion with tendril parameter (value: 2.50)
    const distortion = 1.0 + noiseSum * (tendrils * 0.42);
    const r = Math.max(0.05, radius * distortion);

    const px = (cx + Math.cos(angle) * r).toFixed(1);
    const py = (cy + Math.sin(angle) * r).toFixed(1);
    coords.push(`${px}px ${py}px`);
  }

  return `polygon(${coords.join(", ")})`;
}

/**
 * WebGL 2 Shader Sources
 */
const VERT_SHADER_SOURCE = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG_SHADER_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_origin;
uniform float u_progress;
uniform float u_tendrils;
uniform float u_noiseScale;
uniform float u_edgeSoftness;
uniform float u_driftSpeed;
uniform float u_time;
uniform vec3 u_inkColor;
uniform vec3 u_edgeColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz - vec2(i1.x, i1.y).xyxy;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
  for (int i = 0; i < 4; i++) {
    f += amp * snoise(p);
    p = rot * p * 2.04 + vec2(11.3);
    amp *= 0.5;
  }
  return f;
}

float warpedFbm(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.08),
    fbm(p + vec2(5.2, 1.3) + t * 0.09)
  );
  vec2 r = vec2(
    fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.1),
    fbm(p + 3.2 * q + vec2(8.3, 2.8) + t * 0.12)
  );
  return fbm(p + 3.5 * r);
}

void main() {
  vec2 pixelPos = gl_FragCoord.xy;
  vec2 originGl = vec2(u_origin.x, u_resolution.y - u_origin.y);
  
  float dist = length(pixelPos - originGl);
  float maxDist = length(max(u_origin, u_resolution - u_origin)) * 1.38 + 120.0;
  float radius = u_progress * maxDist;
  
  vec2 noiseUv = (pixelPos / max(u_resolution.x, u_resolution.y)) * (u_noiseScale * 3.2);
  float t = u_time * u_driftSpeed;
  
  float noiseVal = warpedFbm(noiseUv, t);
  float tendrilDist = noiseVal * (u_tendrils * 105.0 * smoothstep(0.0, 0.22, u_progress));
  
  float effectiveDist = dist - tendrilDist;
  float softness = max(u_edgeSoftness, 1.4);
  
  float inkAlpha = 1.0 - smoothstep(radius - softness, radius + softness, effectiveDist);
  
  if (inkAlpha <= 0.001) {
    discard;
  }
  
  // Signature electric orange ember edge (#ff633d)
  float edgeGlow = smoothstep(radius - softness * 5.5, radius, effectiveDist) *
                   (1.0 - smoothstep(radius, radius + softness * 2.5, effectiveDist)) * 0.85;
                   
  vec3 col = mix(u_inkColor, u_edgeColor, edgeGlow);
  float finishFade = 1.0 - smoothstep(0.97, 1.0, u_progress);
  
  fragColor = vec4(col, inkAlpha * finishFade);
}
`;

class InkTransitionEngine {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private isAnimating = false;
  private animFrameId: number | null = null;

  public init(): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    if (this.gl && this.program) return true;

    let canvas = document.getElementById("ink-transition-canvas") as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "ink-transition-canvas";
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.zIndex = "999999";
      canvas.style.pointerEvents = "none";
      canvas.style.display = "none";
      document.body.appendChild(canvas);
    }
    this.canvas = canvas;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      return false;
    }

    this.gl = gl;

    // Compile Shaders
    const vertShader = this.compileShader(gl, gl.VERTEX_SHADER, VERT_SHADER_SOURCE);
    const fragShader = this.compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER_SOURCE);

    if (!vertShader || !fragShader) return false;

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return false;
    }

    this.program = program;

    // Fullscreen Quad Geometry
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.vao = vao;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform Locations
    this.uniforms = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_origin: gl.getUniformLocation(program, "u_origin"),
      u_progress: gl.getUniformLocation(program, "u_progress"),
      u_tendrils: gl.getUniformLocation(program, "u_tendrils"),
      u_noiseScale: gl.getUniformLocation(program, "u_noiseScale"),
      u_edgeSoftness: gl.getUniformLocation(program, "u_edgeSoftness"),
      u_driftSpeed: gl.getUniformLocation(program, "u_driftSpeed"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_inkColor: gl.getUniformLocation(program, "u_inkColor"),
      u_edgeColor: gl.getUniformLocation(program, "u_edgeColor"),
    };

    return true;
  }

  private compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  public play(originX: number, originY: number, nextTheme: "dark" | "light", duration = 850): Promise<void> {
    return new Promise((resolve) => {
      if (prefersReducedMotion() || !this.init() || !this.canvas || !this.gl || !this.program) {
        return resolve();
      }

      if (this.isAnimating && this.animFrameId !== null) {
        cancelAnimationFrame(this.animFrameId);
      }

      this.isAnimating = true;
      const gl = this.gl;
      const canvas = this.canvas;
      canvas.style.display = "block";

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(this.program);
      gl.bindVertexArray(this.vao);

      // Set target colors
      const inkColor =
        nextTheme === "light"
          ? [0.99, 0.99, 0.99] // Light paper background
          : [0.035, 0.039, 0.055]; // Cinematic Dark #090a0e

      // Brand signature electric orange #ff633d
      const edgeColor = [1.0, 0.388, 0.239];

      gl.uniform2f(this.uniforms.u_resolution ?? null, canvas.width, canvas.height);
      gl.uniform2f(this.uniforms.u_origin ?? null, originX * dpr, originY * dpr);
      gl.uniform1f(this.uniforms.u_tendrils ?? null, 2.50);
      gl.uniform1f(this.uniforms.u_noiseScale ?? null, 2.50);
      gl.uniform1f(this.uniforms.u_edgeSoftness ?? null, 1.4 * dpr);
      gl.uniform1f(this.uniforms.u_driftSpeed ?? null, 1.00);
      gl.uniform3fv(this.uniforms.u_inkColor ?? null, inkColor);
      gl.uniform3fv(this.uniforms.u_edgeColor ?? null, edgeColor);

      const startTime = performance.now();

      const render = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1.0);

        // Smooth cubic-bezier acceleration matching liquid flow
        const progress =
          rawProgress < 0.5
            ? 4 * rawProgress * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        gl.uniform1f(this.uniforms.u_progress ?? null, progress);
        gl.uniform1f(this.uniforms.u_time ?? null, elapsed * 0.001);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (rawProgress < 1.0) {
          this.animFrameId = requestAnimationFrame(render);
        } else {
          this.isAnimating = false;
          gl.clear(gl.COLOR_BUFFER_BIT);
          canvas.style.display = "none";
          resolve();
        }
      };

      this.animFrameId = requestAnimationFrame(render);
    });
  }
}

export const inkTransitionEngine = new InkTransitionEngine();

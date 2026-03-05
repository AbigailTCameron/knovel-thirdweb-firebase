"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ArrowRight, ChevronDown, PenLine } from "lucide-react";

function SpaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface Particle {
      x: number;
      y: number;
      r: number;
      baseR: number;
      vx: number;
      vy: number;
      hue: number;
      sat: number;
      light: number;
      alpha: number;
      baseAlpha: number;
      pulse: number;
      pulseSpeed: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      w = cvs.offsetWidth;
      h = cvs.offsetHeight;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const count = Math.floor((w * h) / 4000);
      particles = Array.from({ length: count }, () => {
        const baseR =
          Math.random() < 0.08
            ? 2.5 + Math.random() * 3
            : Math.random() < 0.3
            ? 1.2 + Math.random() * 1.8
            : 0.4 + Math.random() * 1;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: baseR,
          baseR,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          hue: 260 + Math.random() * 60,
          sat: 50 + Math.random() * 40,
          light: 55 + Math.random() * 30,
          alpha: 0.15 + Math.random() * 0.55,
          baseAlpha: 0.15 + Math.random() * 0.55,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.015,
        };
      });
    };

    resize();
    seed();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });

    const onMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1, y: -1 };
    };
    cvs.addEventListener("mousemove", onMove);
    cvs.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulseFactor = 0.7 + 0.3 * Math.sin(p.pulse);
        let currentAlpha = p.baseAlpha * pulseFactor;
        let currentR = p.baseR * (0.85 + 0.15 * Math.sin(p.pulse));

        // mouse interaction -- glow when near
        if (mx >= 0 && my >= 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const t = 1 - dist / 150;
            currentAlpha = Math.min(1, currentAlpha + t * 0.5);
            currentR += t * 2;
          }
        }

        // glow for larger particles
        if (p.baseR > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentR * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${
            p.light
          }%, ${currentAlpha * 0.08})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${currentAlpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      cvs.removeEventListener("mousemove", onMove);
      cvs.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function HeroSection({}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030308]">
      {/* Space particles */}
      <SpaceParticles />

      {/* Nebula glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[20%] -translate-x-1/2"
          style={{
            width: 1000,
            height: 600,
            background:
              "radial-gradient(ellipse, hsla(280,70%,45%,0.12) 0%, hsla(270,60%,35%,0.04) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[15%] top-[60%]"
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(ellipse, hsla(260,80%,50%,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[10%] top-[30%]"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(ellipse, hsla(300,70%,50%,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Badge */}
        <div
          className={`mb-8 transition-all duration-700 ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-sm font-medium text-purple-200/90 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
            </span>
            Social Publishing Platform
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`max-w-5xl font-mono text-8xl font-bold leading-[1.08] tracking-tight text-[#f5f5f5] transition-all duration-700 delay-150 sm:text-6xl md:text-7xl lg:text-8xl ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="block text-balance">Discover books</span>
          <span className="block text-balance">
            through{" "}
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #a855f7, #c084fc, #d946ef, #a855f7)",
                backgroundSize: "300% 300%",
                animation: "gradShift 5s ease infinite",
              }}
            >
              people.
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`mt-6 max-w-2xl text-lg leading-relaxed text-[#7f7f8c] transition-all duration-700 delay-300 sm:text-xl ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Knovel is a social publishing platform where writers publish, readers
          discover, and communities grow around stories.
        </p>

        {/* CTAs */}
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-[450ms] ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Button
            size="lg"
            className="group relative gap-2 overflow-hidden rounded-xl border-0 px-8 py-6 text-base font-semibold text-white shadow-2xl shadow-purple-600/30"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #c026d3)",
              backgroundSize: "200% 200%",
              animation: "gradShift 4s ease infinite",
            }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <PenLine className="relative h-4 w-4" />
            <span className="relative">Start Writing</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="group gap-2 rounded-xl border-purple-500/25 bg-purple-500/5 px-8 py-6 text-base font-semibold text-[#f5f5f5] backdrop-blur-md transition-all hover:border-purple-400/50 hover:bg-purple-500/10"
          >
            Explore Stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-700 delay-[600ms] ${
          show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7f7f8c]">
          Scroll to turn
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-purple-400/70" />
      </div>

      <style jsx>{`
        @keyframes gradShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;

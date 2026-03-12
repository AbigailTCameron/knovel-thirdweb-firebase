"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

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
      const count = Math.floor((w * h) / 1800);
      particles = Array.from({ length: count }, () => {
        const baseR =
          Math.random() < 0.04
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
          hue: 240 + Math.random() * 100,
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
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [time, setTime] = useState("");

  const handleMouseMove = (e: MouseEvent) => {
    setOffsetX((e.clientX / window.innerWidth) * 250 - 50);
    setOffsetY((e.clientY / window.innerHeight) * 250 - 50);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const formatTime = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    const timeout = window.setTimeout(() => {
      setTime(formatTime());
    }, 0);

    const interval = window.setInterval(() => {
      setTime(formatTime());
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030308]">
      <SpaceParticles />

      {/* Layered radial glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Main purple orb */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, hsla(275, 80%, 55%, 0.18) 0%, hsla(290, 70%, 45%, 0.06) 40%, transparent 70%)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />
        {/* Fuchsia accent */}
        <div
          className="absolute right-[15%] top-[20%]"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, hsla(310, 80%, 60%, 0.10) 0%, transparent 60%)",
            animation: "drift-1 8s ease-in-out infinite",
          }}
        />
        {/* Blue accent */}
        <div
          className="absolute bottom-[15%] left-[10%]"
          style={{
            width: "450px",
            height: "450px",
            background:
              "radial-gradient(circle, hsla(240, 80%, 60%, 0.08) 0%, transparent 60%)",
            animation: "drift-2 10s ease-in-out infinite",
          }}
        />
        {/* Top gradient vignette */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, hsla(275, 50%, 8%, 1), transparent)",
          }}
        />
        {/* Bottom gradient vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(to top, hsla(275, 50%, 8%, 1), transparent)",
          }}
        />
      </div>

      {/* Time widget - Avax style, top-left floating */}
      <div
        className={`absolute left-8 top-28 z-20 lg:hidden flex-col items-start gap-1 flex transition-all duration-1000 delay-[800ms] translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
        }`}
      >
        <span className="font-mono text-3xl font-light tracking-wider text-[#f5f5f5]/80">
          {time}
        </span>
        <span className="text-xs text-[#7f7f8c]">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div
        className="relative z-10 flex flex-col px-6 items-center transition-transform duration-400 ease-out"
        style={{
          transform: `translate(${offsetX / 20}px, ${offsetY /
            20}px) rotateX(${offsetY / 50}deg) rotateY(${offsetX / 50}deg)`,
        }}
      ></div>

      <div
        className="relative z-10 flex flex-col space-y-16 px-6 largetall:space-y-8 xs:space-y-4 items-center transition-transform duration-400 ease-out"
        style={{
          transform: `translate(${offsetX / 10}px, ${offsetY / 10}px)`,
        }}
      >
        <h1
          className={`max-w-5xl text-9xl text-center font-black leading-[1.08] tracking-tight text-[#f5f5f5] transition-all duration-700 delay-150 sm:text-6xl md:text-7xl translate-y-0 opacity-100`}
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

        <p
          className={`mt-6 font-mono font-semibold max-w-2xl text-xl leading-relaxed text-center text-[#7f7f8c] transition-all duration-700 delay-300 sm:text-xl translate-y-0 opacity-100`}
        >
          Knovel is a social publishing platform where writers publish, readers
          discover, and communities grow around stories.
        </p>

        <div className="mt-8 relative z-10">
          <a
            href="/explore"
            className="group inline-flex items-center gap-3 rounded-full border border-[#27272a] bg-[#141414] px-5 py-2.5 text-sm font-medium text-[#fafafa] hover:bg-[#1a1a2e] transition-colors"
          >
            Get started
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fafafa] text-[#0a0a0a] transition-transform group-hover:translate-x-0.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33337 8H12.6667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.66671 4L12.6667 8L8.66671 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-700 delay-[700ms] translate-y-0 opacity-100`}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7f7f8c]">
          Scroll through
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-purple-400/70" />
      </div>
    </div>
  );
}

export default HeroSection;

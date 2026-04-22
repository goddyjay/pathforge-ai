/**
 * The PathForge mark: three paths forking from a single origin to three
 * destinations. Reads as a decision tree / roadmap — matches the product's
 * core value prop (simulate multiple futures from one starting point).
 *
 * Variants:
 *   - token  (default): white paths on a gradient rounded tile — use in
 *                       navbars, favicons, app icons.
 *   - color            : the mark itself is gradient, no tile — use on hero
 *                       sections or print.
 *   - mono             : single color via `currentColor` — for print, legal
 *                       footers, inverted backgrounds.
 *
 * Pass `animate={true}` to have the paths "draw in" on mount (welcome screen).
 */
export function BrandMark({ variant = "token", size = 32, animate = false, className = "" }) {
  if (variant === "color") return <ColorMark size={size} animate={animate} className={className} />;
  if (variant === "mono") return <MonoMark size={size} animate={animate} className={className} />;
  return <TokenMark size={size} animate={animate} className={className} />;
}

/** Paths drawn inside a 32×32 viewBox. Shared across variants. */
function PathsInside({ stroke, fill, animate = false }) {
  const lineProps = animate
    ? {
        strokeDasharray: 40,
        strokeDashoffset: 40,
        style: { animation: "pf-draw 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s forwards" },
      }
    : {};
  const dotProps = (delay) =>
    animate
      ? {
          style: {
            opacity: 0,
            transform: "scale(0.5)",
            transformOrigin: "center",
            animation: `pf-pop 0.4s cubic-bezier(0.2, 1.2, 0.4, 1) ${delay}s forwards`,
          },
        }
      : {};
  return (
    <>
      {/* Three forking paths from the origin. */}
      <g
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M16 26 C 14.5 22.5, 10 21, 7.5 13.5" {...lineProps} />
        <path d="M16 26 V 12" {...lineProps} />
        <path d="M16 26 C 17.5 22.5, 22 21, 24.5 13.5" {...lineProps} />
      </g>
      {/* Origin + destination nodes. Center destination is slightly larger to
          cue "chosen path". */}
      <circle cx="16" cy="26.5" r="1.9" fill={fill} {...dotProps(0)} />
      <circle cx="7.5" cy="11.8" r="2.1" fill={fill} {...dotProps(0.9)} />
      <circle cx="16" cy="10.6" r="2.6" fill={fill} {...dotProps(1.0)} />
      <circle cx="24.5" cy="11.8" r="2.1" fill={fill} {...dotProps(1.1)} />
      {animate && (
        <style>{`
          @keyframes pf-draw { to { stroke-dashoffset: 0; } }
          @keyframes pf-pop {
            0% { opacity: 0; transform: scale(0.5); }
            60% { opacity: 1; transform: scale(1.15); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      )}
    </>
  );
}

function TokenMark({ size, animate, className }) {
  const radius = Math.max(6, Math.round(size * 0.27));
  return (
    <div
      className={`relative overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "linear-gradient(140deg, #6366f1 0%, #4f46e5 45%, #7c3aed 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.22), 0 8px 18px -6px rgba(99,102,241,0.6)",
      }}
    >
      {/* top highlight sheen */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <PathsInside stroke="#ffffff" fill="#ffffff" animate={animate} />
      </svg>
    </div>
  );
}

function ColorMark({ size, animate, className }) {
  const id = "pf-grad";
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="PathForge"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="32" x2="0" y2="0">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="0.5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <PathsInside stroke={`url(#${id})`} fill={`url(#${id})`} animate={animate} />
    </svg>
  );
}

function MonoMark({ size, animate, className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="PathForge"
    >
      <PathsInside stroke="currentColor" fill="currentColor" animate={animate} />
    </svg>
  );
}

/**
 * Wordmark: mark + "PathForge" display type with the accent period.
 * Use on hero sections and anywhere you'd show the full brand.
 */
export function BrandWordmark({ size = "md", variant = "token", showAi = true }) {
  const isLg = size === "lg";
  const markSize = isLg ? 44 : size === "sm" ? 28 : 36;
  const wordSize = isLg ? "text-[28px]" : size === "sm" ? "text-[17px]" : "text-[22px]";
  const aiSize = isLg ? "text-[11px]" : "text-[10px]";
  return (
    <div className="inline-flex items-center gap-2.5">
      <BrandMark variant={variant} size={markSize} />
      <div className="leading-none">
        <div className={`display font-extrabold tracking-extra-tight text-white ${wordSize}`}>
          PathForge<span className="text-brand-300">.</span>
        </div>
        {showAi && (
          <div
            className={`${aiSize} mt-1 uppercase tracking-[0.25em] text-slate-400 font-semibold`}
          >
            AI · Life Simulator
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Back-compat shim so existing `<Brand size="sm|md" />` call sites keep
 * working while rendering the new token mark.
 */
export function Brand({ size = "md" }) {
  const px = size === "sm" ? 32 : 40;
  return <BrandMark variant="token" size={px} />;
}

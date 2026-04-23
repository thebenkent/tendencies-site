"use client";

import { useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Brand tokens — mirror the rest of the Tendencies site.
// Keep inline so components stay drop-in without a theme provider.
// -----------------------------------------------------------------------------
export const T = {
  bg: "#080808",
  surface: "#0f0f0f",
  text: "#f5f5f0",
  textMuted: "rgba(255,255,255,0.56)",
  textDim: "rgba(255,255,255,0.42)",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.18)",
  lime: "#b8f400",
  font: "Helvetica, Arial, sans-serif",
};

// -----------------------------------------------------------------------------
export function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

// -----------------------------------------------------------------------------
export function SectionLabel({
  children,
  color = T.lime,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        fontFamily: T.font,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        marginBottom: "12px",
      }}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
export function PrimaryButton({
  href,
  children,
  onClick,
  ariaLabel,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "48px",
    padding: "0 26px",
    borderRadius: "999px",
    background: T.lime,
    color: "#080808",
    textDecoration: "none",
    fontFamily: T.font,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
  };

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
      ((e.currentTarget as HTMLElement).style.opacity = "0.86"),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) =>
      ((e.currentTarget as HTMLElement).style.opacity = "1"),
  };

  if (href) {
    return (
      <a href={href} style={baseStyle} aria-label={ariaLabel} {...handlers}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={baseStyle}
      aria-label={ariaLabel}
      {...handlers}
    >
      {children}
    </button>
  );
}

// -----------------------------------------------------------------------------
export function SecondaryButton({
  href,
  children,
  onClick,
  ariaLabel,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "48px",
    padding: "0 24px",
    borderRadius: "999px",
    border: `1px solid ${T.borderStrong}`,
    color: "#ffffff",
    textDecoration: "none",
    fontFamily: T.font,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    background: "transparent",
    cursor: "pointer",
    transition: "border-color 0.2s ease, background 0.2s ease",
  };

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.borderColor =
        "rgba(255,255,255,0.32)";
      (e.currentTarget as HTMLElement).style.background =
        "rgba(255,255,255,0.03)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.borderColor = T.borderStrong;
      (e.currentTarget as HTMLElement).style.background = "transparent";
    },
  };

  if (href) {
    return (
      <a href={href} style={baseStyle} aria-label={ariaLabel} {...handlers}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={baseStyle}
      aria-label={ariaLabel}
      {...handlers}
    >
      {children}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Image frame with optional corner label — reused by hero + gallery.
// -----------------------------------------------------------------------------
export function FramedImage({
  src,
  alt,
  label,
  aspect = "5/4",
  brightness = 0.92,
}: {
  src: string;
  alt: string;
  label?: string;
  aspect?: "5/4" | "4/5" | "1/1";
  brightness?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: aspect.replace("/", " / "),
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        background: T.surface,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `brightness(${brightness})`,
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(8,8,8,0.86)",
            color: T.text,
            border: `1px solid rgba(255,255,255,0.12)`,
            fontFamily: T.font,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "7px 10px",
          }}
        >
          • {label}
        </div>
      )}
    </div>
  );
}

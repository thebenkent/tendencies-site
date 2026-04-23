"use client";

import { T } from "./shared";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontFamily: T.font,
        fontSize: "10px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: T.textDim,
        marginBottom: "24px",
      }}
    >
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={c.label}>
            {c.href && !isLast ? (
              <a
                href={c.href}
                style={{
                  color: T.textDim,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = T.text)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = T.textDim)
                }
              >
                {c.label}
              </a>
            ) : (
              <span style={{ color: isLast ? T.text : T.textDim }}>
                {c.label}
              </span>
            )}
            {!isLast && (
              <span
                style={{
                  margin: "0 10px",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

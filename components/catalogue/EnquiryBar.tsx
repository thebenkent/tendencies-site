"use client";

import { useEffect, useRef, useState } from "react";
import { PrimaryButton, SecondaryButton, T, useIsMobile } from "./shared";
import type { Product } from "@/lib/products/types";

/**
 * Sticky bottom bar. Appears after the hero sentinel leaves the viewport.
 * Does NOT appear immediately on page load — that feels pushy.
 */
export function EnquiryBar({
  product,
  sentinelRef,
  onShortlist,
}: {
  product: Product;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onShortlist?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();
  const ownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "0px 0px -40% 0px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return (
    <div
      ref={ownRef}
      aria-hidden={!visible}
      style={{
        position: "fixed",
        bottom: visible ? "20px" : "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        width: isMobile ? "calc(100% - 24px)" : "auto",
        maxWidth: "720px",
        background: "rgba(8,8,8,0.92)",
        border: `1px solid ${T.borderStrong}`,
        borderRadius: "999px",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: isMobile ? "10px 12px" : "10px 14px 10px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        justifyContent: "space-between",
        transition: "bottom 0.36s ease",
        zIndex: 50,
        pointerEvents: visible ? "auto" : "none",
        boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
      }}
    >
      {!isMobile && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: T.font,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: T.textDim,
            }}
          >
            Enquiring about
          </span>
          <span
            style={{
              fontFamily: T.font,
              fontSize: "13px",
              fontWeight: 700,
              color: T.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.title}
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flex: isMobile ? 1 : "0 0 auto",
          justifyContent: "space-between",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <SecondaryButton onClick={onShortlist} ariaLabel="Add to shortlist">
          + Shortlist
        </SecondaryButton>
        <PrimaryButton
          href={`/start-a-project?product=${product.slug}`}
          ariaLabel={`Enquire about ${product.title}`}
        >
          Enquire
        </PrimaryButton>
      </div>
    </div>
  );
}

"use client";

const FONT = "Helvetica, Arial, sans-serif";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "40px",
        padding: "0 18px",
        background: "#b8f400",
        color: "#000",
        border: "none",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: FONT,
        cursor: "pointer",
        borderRadius: "4px",
      }}
    >
      Print / Save PDF
    </button>
  );
}

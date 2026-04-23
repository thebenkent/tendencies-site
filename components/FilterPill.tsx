"use client";

type FilterPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function FilterPill({
  label,
  active = false,
  onClick,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        padding: "0 12px",
        borderRadius: "999px",
        border: active
          ? "1px solid #b8f400"
          : "1px solid rgba(255,255,255,0.18)",
        background: active ? "#b8f400" : "transparent",
        color: active ? "#080808" : "#ffffff",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </button>
  );
}
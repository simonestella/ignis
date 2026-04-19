import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #E8650A 0%, #FF9847 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 96,
          lineHeight: 1,
        }}
      >
        🌋
      </span>
      <span
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: 4,
        }}
      >
        IGNIS
      </span>
    </div>,
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const alt = "Ótica Hikari — O florescer de um novo olhar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "#f3efe5",
          background: "#080806",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 560,
            right: -80,
            top: 35,
            border: "2px solid rgba(252,198,14,.5)",
            borderRadius: "50%",
            boxShadow: "0 0 0 42px rgba(252,198,14,.035)",
          }}
        />
        <div
          style={{
            width: "100%",
            padding: "70px 78px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, color: "#fcc60e", fontSize: 27 }}>
            <span style={{ fontSize: 54 }}>光</span>
            <span style={{ letterSpacing: 4, fontFamily: "Arial, sans-serif", fontSize: 18, fontWeight: 700 }}>ÓTICA HIKARI · ARAGUAÍNA</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <span style={{ fontSize: 92, lineHeight: 0.94, letterSpacing: -4 }}>O florescer</span>
            <span style={{ color: "#fcc60e", fontSize: 92, lineHeight: 0.94, letterSpacing: -4, fontStyle: "italic" }}>de um novo olhar.</span>
          </div>
          <div style={{ display: "flex", fontFamily: "Arial, sans-serif", fontSize: 20, color: "rgba(243,239,229,.7)" }}>
            Óculos solares e receituários no Centro de Araguaína.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

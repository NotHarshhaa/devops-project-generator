import { ImageResponse } from "next/og";

export const alt = "DevOps Project Generator | Production Cloud Infrastructure & CI/CD Scaffolder";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080c14",
          padding: "54px 64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo Brand Mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "16px",
                backgroundColor: "#0e1526",
                border: "1.5px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                <path
                  d="M 32 32 C 25 21, 13 21, 13 32 C 13 43, 25 43, 32 32 C 39 21, 51 21, 51 32 C 51 43, 39 43, 32 32 Z"
                  stroke="#06b6d4"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="13" cy="32" r="3.5" fill="#22d3ee" />
                <circle cx="51" cy="32" r="3.5" fill="#818cf8" />
                <circle cx="32" cy="32" r="3" fill="#ffffff" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#f8fafc",
                }}
              >
                DEVOPS ARCHITECT
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#06b6d4",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                V2.1.0 · PRODUCTION PLATFORM
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.35)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#22d3ee",
                fontFamily: "monospace",
              }}
            >
              100% IN-BROWSER SCAFFOLDER
            </span>
          </div>
        </div>

        {/* Center Hero Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "58px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#ffffff",
            }}
          >
            <span>Scaffold Production</span>
            <span
              style={{
                background: "linear-gradient(90deg, #06b6d4, #38bdf8, #818cf8)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              DevOps Infrastructure.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              lineHeight: 1.45,
              color: "#94a3b8",
              maxWidth: "850px",
            }}
          >
            Generate complete cloud architectures with OpenTofu &amp; Terraform, Kubernetes Gateway API, ArgoCD GitOps, OpenTelemetry, and FinOps Infracost in seconds.
          </div>
        </div>

        {/* Bottom Feature Tags & Metadata */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {["OpenTofu 1.8+", "Kubernetes 1.30", "ArgoCD GitOps", "OTel Collector", "FinOps Infracost", "CIS / SOC2"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "#cbd5e1",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              fontFamily: "monospace",
              color: "#64748b",
            }}
          >
            MIT LICENSE · HARSHHAA
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

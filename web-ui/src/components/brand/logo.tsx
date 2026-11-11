import React from "react";

interface DevOpsLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export function DevOpsLogo({
  className = "",
  size = 36,
  withText = false,
}: DevOpsLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="DevOps Project Generator Logo"
      >
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#080e1a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="devops-gradient" x1="12" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <linearGradient id="accent-cyan" x1="10" y1="28" x2="20" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="accent-purple" x1="44" y1="28" x2="54" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Background Container */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="15"
          fill="url(#logo-bg)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Ambient Subtle Core Glow */}
        <circle cx="32" cy="32" r="16" fill="#06b6d4" opacity="0.12" filter="url(#glow)" />

        {/* DevOps Infinity Loop Track (Glow Layer) */}
        <path
          d="M 32 32 C 25 21, 13 21, 13 32 C 13 43, 25 43, 32 32 C 39 21, 51 21, 51 32 C 51 43, 39 43, 32 32 Z"
          stroke="url(#devops-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />

        {/* DevOps Infinity Loop Track (Crisp Foreground) */}
        <path
          d="M 32 32 C 25 21, 13 21, 13 32 C 13 43, 25 43, 32 32 C 39 21, 51 21, 51 32 C 51 43, 39 43, 32 32 Z"
          stroke="url(#devops-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Node 1: Left Loop Apex (Deploy / Cloud Node) */}
        <circle cx="13" cy="32" r="4" fill="url(#accent-cyan)" />
        <circle cx="13" cy="32" r="1.8" fill="#ffffff" />

        {/* Node 2: Right Loop Apex (Code / Pipeline Node) */}
        <circle cx="51" cy="32" r="4" fill="url(#accent-purple)" />
        <circle cx="51" cy="32" r="1.8" fill="#ffffff" />

        {/* Node 3: Center Intersection Nexus (Kubernetes / Engine Node) */}
        <circle cx="32" cy="32" r="3.2" fill="#ffffff" filter="url(#glow)" />
        <circle cx="32" cy="32" r="1.6" fill="#06b6d4" />
      </svg>

      {withText && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold tracking-tight text-foreground leading-none">
            DEVOPS ARCHITECT
          </span>
          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-wider uppercase mt-1">
            Production Cloud Scaffolder
          </span>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";

export interface GergaLogoProps {
  variant?: "full" | "emblem" | "combined" | "inline" | "text";
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  showBackground?: boolean;
  showSubtitle?: boolean;
  theme?: "light" | "dark" | "plum" | "gold";
}

export default function GergaLogo({
  variant = "combined",
  size = "md",
  className = "",
  showBackground = false,
  showSubtitle = true,
  theme = "light",
}: GergaLogoProps) {
  // Theme color definitions
  // plum: signature plum purple #472248 background with off-white line
  // light: off-white line/text for dark backgrounds
  // dark: dark line/text for light backgrounds
  // gold: luxury gold tone #d4af37
  let strokeColor = "#FAF5EF"; // default off-white cream
  let textColor = "#FAF5EF";
  let subtitleColor = "#C4B5BE";
  let bgClass = "";

  if (theme === "dark") {
    strokeColor = "#2A182B";
    textColor = "#2A182B";
    subtitleColor = "#665268";
  } else if (theme === "gold") {
    strokeColor = "#d4af37";
    textColor = "#d4af37";
    subtitleColor = "#8e998f";
  } else if (theme === "plum" || showBackground) {
    bgClass = "bg-[#472248]";
    strokeColor = "#FAF5EF";
    textColor = "#FAF5EF";
    subtitleColor = "#D5C4D6";
  }

  // Dimension scaling
  let iconDimensions = { width: 44, height: 44 };
  let fullDimensions = { width: 120, height: 120 };

  if (typeof size === "number") {
    iconDimensions = { width: size, height: size };
    fullDimensions = { width: size, height: size };
  } else {
    switch (size) {
      case "sm":
        iconDimensions = { width: 32, height: 32 };
        fullDimensions = { width: 80, height: 80 };
        break;
      case "md":
        iconDimensions = { width: 44, height: 44 };
        fullDimensions = { width: 120, height: 120 };
        break;
      case "lg":
        iconDimensions = { width: 64, height: 64 };
        fullDimensions = { width: 180, height: 180 };
        break;
      case "xl":
        iconDimensions = { width: 96, height: 96 };
        fullDimensions = { width: 260, height: 260 };
        break;
    }
  }

  // SVG Temple & Fig Emblem
  const EmblemSvg = ({ width, height }: { width: number; height: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Outer Pediment Roof Triangle */}
      <path
        d="M 60 120 L 200 50 L 340 120"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Pediment Line */}
      <path
        d="M 80 120 L 200 66 L 320 120"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Entablature Horizontal Beams */}
      <line x1="50" y1="120" x2="350" y2="120" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="134" x2="350" y2="134" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="146" x2="332" y2="146" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />

      {/* Columns Top Capitals (Abacus/Echinus) */}
      <rect x="75" y="146" width="36" height="10" rx="1" fill={strokeColor} />
      <rect x="125" y="146" width="36" height="10" rx="1" fill={strokeColor} />
      <rect x="239" y="146" width="36" height="10" rx="1" fill={strokeColor} />
      <rect x="289" y="146" width="36" height="10" rx="1" fill={strokeColor} />

      {/* Column Shafts */}
      {/* Left Outer Column */}
      <line x1="82" y1="156" x2="82" y2="242" stroke={strokeColor} strokeWidth="5" />
      <line x1="104" y1="156" x2="104" y2="242" stroke={strokeColor} strokeWidth="5" />
      {/* Left Inner Column */}
      <line x1="132" y1="156" x2="132" y2="242" stroke={strokeColor} strokeWidth="5" />
      <line x1="154" y1="156" x2="154" y2="242" stroke={strokeColor} strokeWidth="5" />
      {/* Right Inner Column */}
      <line x1="246" y1="156" x2="246" y2="242" stroke={strokeColor} strokeWidth="5" />
      <line x1="268" y1="156" x2="268" y2="242" stroke={strokeColor} strokeWidth="5" />
      {/* Right Outer Column */}
      <line x1="296" y1="156" x2="296" y2="242" stroke={strokeColor} strokeWidth="5" />
      <line x1="318" y1="156" x2="318" y2="242" stroke={strokeColor} strokeWidth="5" />

      {/* Column Horizontal Ring Grooves */}
      <line x1="80" y1="184" x2="106" y2="184" stroke={strokeColor} strokeWidth="4" />
      <line x1="130" y1="184" x2="156" y2="184" stroke={strokeColor} strokeWidth="4" />
      <line x1="244" y1="184" x2="270" y2="184" stroke={strokeColor} strokeWidth="4" />
      <line x1="294" y1="184" x2="320" y2="184" stroke={strokeColor} strokeWidth="4" />

      <line x1="80" y1="214" x2="106" y2="214" stroke={strokeColor} strokeWidth="4" />
      <line x1="130" y1="214" x2="156" y2="214" stroke={strokeColor} strokeWidth="4" />
      <line x1="244" y1="214" x2="270" y2="214" stroke={strokeColor} strokeWidth="4" />
      <line x1="294" y1="214" x2="320" y2="214" stroke={strokeColor} strokeWidth="4" />

      {/* Column Bases */}
      <rect x="75" y="242" width="36" height="10" rx="1" fill={strokeColor} />
      <rect x="125" y="242" width="36" height="10" rx="1" fill={strokeColor} />
      <rect x="239" y="242" width="36" height="10" rx="1" fill={strokeColor} />
      <rect x="289" y="242" width="36" height="10" rx="1" fill={strokeColor} />

      {/* Central Sanctuary - Fig Fruit Icon */}
      {/* Fig Outer Silhouette contour */}
      <path
        d="M 200 154 C 192 175 158 190 158 220 C 158 244 176 252 200 252 C 224 252 242 244 242 220 C 242 190 208 175 200 154 Z"
        stroke={strokeColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Fig Stem top curve */}
      <path
        d="M 200 154 C 198 148 201 144 204 142"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Fig Ribs / Striations */}
      <path
        d="M 200 158 C 200 190 200 225 200 252"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 200 162 C 190 188 177 210 176 244"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 200 162 C 182 192 166 212 165 234"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 200 162 C 210 188 223 210 224 244"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 200 162 C 218 192 234 212 235 234"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Stylobate / Base Steps */}
      <line x1="60" y1="252" x2="340" y2="252" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
      <line x1="52" y1="264" x2="348" y2="264" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
      <line x1="42" y1="276" x2="358" y2="276" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );

  // Full Brand Card (Exact replica of the prompt image)
  if (variant === "full") {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl shadow-2xl transition-all ${
          showBackground || theme === "plum" ? "bg-[#472248]" : bgClass
        } ${className}`}
        style={{
          aspectRatio: "1/1",
          width: typeof size === "number" ? `${size}px` : undefined,
        }}
      >
        <EmblemSvg width={fullDimensions.width} height={fullDimensions.height * 0.75} />
        <div className="mt-4 flex flex-col items-center">
          <span
            className="font-serif tracking-[0.35em] text-center font-light uppercase"
            style={{
              color: textColor,
              fontSize: typeof size === "number" ? `${size * 0.16}px` : "1.85rem",
              lineHeight: 1.1,
            }}
          >
            GERGA
          </span>
          {showSubtitle && (
            <span
              className="text-[9px] sm:text-[11px] tracking-[0.3em] uppercase font-sans mt-2 font-medium"
              style={{ color: subtitleColor }}
            >
              Aegean Agriculture
            </span>
          )}
        </div>
      </div>
    );
  }

  // Emblem Only
  if (variant === "emblem") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemSvg width={iconDimensions.width} height={iconDimensions.height} />
      </div>
    );
  }

  // Text Only
  if (variant === "text") {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span
          className="font-serif font-bold tracking-[0.25em] uppercase"
          style={{ color: textColor }}
        >
          GERGA
        </span>
        {showSubtitle && (
          <span
            className="text-[9px] tracking-[0.25em] uppercase font-mono"
            style={{ color: subtitleColor }}
          >
            Aegean Agriculture
          </span>
        )}
      </div>
    );
  }

  // Inline (Icon on left, Text on right - perfect for Header/Navbar)
  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="p-1 rounded-lg transition-transform group-hover:scale-105">
          <EmblemSvg width={iconDimensions.width} height={iconDimensions.height} />
        </div>
        <div className="flex flex-col leading-tight">
          <span
            className="font-serif font-bold text-lg sm:text-xl tracking-[0.25em] uppercase transition-colors group-hover:text-[#d4af37]"
            style={{ color: textColor }}
          >
            GERGA
          </span>
          {showSubtitle && (
            <span
              className="text-[8px] sm:text-[9.5px] tracking-[0.25em] uppercase font-mono transition-colors"
              style={{ color: subtitleColor }}
            >
              Aegean Agriculture
            </span>
          )}
        </div>
      </div>
    );
  }

  // Combined (Default: Emblem on top, Text below, transparent background)
  return (
    <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
      <EmblemSvg width={iconDimensions.width * 1.5} height={iconDimensions.height * 1.2} />
      <span
        className="font-serif font-light tracking-[0.3em] uppercase mt-2 text-base sm:text-lg"
        style={{ color: textColor }}
      >
        GERGA
      </span>
      {showSubtitle && (
        <span
          className="text-[8px] sm:text-[9.5px] tracking-[0.25em] uppercase font-sans mt-1"
          style={{ color: subtitleColor }}
        >
          Aegean Agriculture
        </span>
      )}
    </div>
  );
}

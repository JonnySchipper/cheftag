"use client";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="32" fill="#7b2182" />
      <path
        d="M32 12c-3 0-5.5 1-7 3l-2 3h18l-2-3c-1.5-2-4-3-7-3z"
        fill="#FAB400"
      />
      <rect x="19" y="19" width="26" height="3" rx="1.5" fill="#FAB400" />
      <path
        d="M21 24h22c1 0 2 .8 2 1.8v18.4c0 1-.9 1.8-2 1.8H21c-1.1 0-2-.8-2-1.8V25.8c0-1 .9-1.8 2-1.8z"
        fill="white"
        fillOpacity="0.95"
      />
      <rect x="24" y="28" width="16" height="2" rx="1" fill="#7b2182" opacity="0.5" />
      <rect x="24" y="33" width="12" height="2" rx="1" fill="#7b2182" opacity="0.3" />
      <rect x="24" y="38" width="14" height="2" rx="1" fill="#7b2182" opacity="0.3" />
      <circle cx="48" cy="16" r="8" fill="#FAB400" />
      <path
        d="M45 16.5l2 2 4-4"
        stroke="#7b2182"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoWithText({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span
        className="text-lg font-bold tracking-tight"
        style={{ color: "#7b2182" }}
      >
        Cheftag
      </span>
    </div>
  );
}

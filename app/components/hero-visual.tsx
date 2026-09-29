export function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          <linearGradient id="wash" x1="700" y1="40" x2="1400" y2="860" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0b6e6a" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#7aa89a" stopOpacity="0.22" />
            <stop offset="1" stopColor="#d9cfc0" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="flow" x1="520" y1="620" x2="1380" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0b6e6a" />
            <stop offset="0.55" stopColor="#4f9286" />
            <stop offset="1" stopColor="#c8b9a2" />
          </linearGradient>
          <linearGradient id="barSoft" x1="860" y1="280" x2="1320" y2="720" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
          <filter id="blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        <ellipse
          className="animate-sheen"
          cx="1080"
          cy="380"
          rx="420"
          ry="300"
          fill="url(#wash)"
          filter="url(#blur)"
        />

        <g className="animate-drift" style={{ transformOrigin: "70% 45%" }}>
          <path
            className="animate-draw"
            d="M620 680C760 560 870 470 980 430C1120 380 1200 520 1320 470C1380 445 1420 380 1460 300"
            stroke="url(#flow)"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M640 720C790 610 900 540 1020 510C1160 470 1240 590 1360 560"
            stroke="#0b6e6a"
            strokeOpacity="0.18"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <rect x="880" y="250" width="54" height="220" rx="12" fill="url(#barSoft)" />
          <rect x="960" y="310" width="54" height="160" rx="12" fill="#0b6e6a" fillOpacity="0.55" />
          <rect x="1040" y="200" width="54" height="270" rx="12" fill="#7aa89a" fillOpacity="0.65" />
          <rect x="1120" y="360" width="54" height="110" rx="12" fill="#d9cfc0" fillOpacity="0.8" />
          <rect x="1200" y="280" width="54" height="190" rx="12" fill="#0b6e6a" fillOpacity="0.35" />

          <circle cx="1320" cy="470" r="14" fill="#085550" />
          <circle cx="980" cy="430" r="10" fill="#0b6e6a" />
        </g>
      </svg>
    </div>
  );
}

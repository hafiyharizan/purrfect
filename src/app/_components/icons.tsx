export function LineCat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 116" fill="none" aria-hidden="true">
      <path
        d="M32 94c-14-9-20-23-18-41 2-19 10-33 24-42l11 15 16-12c17 10 27 27 29 50 10-8 20-9 29-3 8 7 8 19 1 27-7 8-20 10-35 4-14 18-39 20-57 2Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 48c0 4-3 7-7 7s-7-3-7-7m42 0c0 4-3 7-7 7s-7-3-7-7M49 69c8 6 17 6 26 0M92 80c10 7 20 8 28 1M22 79c-9 8-15 18-18 29"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SittingCat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" aria-hidden="true">
      <path
        d="M36 32c-2-10 1-18 6-24l12 12c4-1 8-1 12 0l12-12c5 6 8 14 6 24 6 10 8 22 8 36 0 28-14 44-32 44S28 96 28 68c0-14 2-26 8-36Z"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M47 44c2 2 5 2 7 0m12 0c2 2 5 2 7 0M55 55h10M52 62c5 4 11 4 16 0"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M92 108c14 2 22-6 19-19M46 112v12m28-12v12"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SleepingCat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 100" fill="none" aria-hidden="true">
      <path
        d="M24 68c0-24 22-42 54-42 30 0 56 16 56 40 0 16-12 26-30 26H52c-17 0-28-10-28-24Z"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M96 28l7-13 9 11m8 2 9-10 5 13"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M103 52c3 3 7 3 10 0m14 0c3 3 7 3 10 0M26 76c9 10 26 13 39 7"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FlowerSprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 110" fill="none" aria-hidden="true">
      <path d="M45 108c-4-26-2-48 8-70M45 108c2-20-2-38-14-52" stroke="#b7d3b0" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M38 74c-8-1-13-6-15-13 8-1 14 2 17 9M56 60c8-2 12-8 13-15-8 0-14 4-16 11" fill="#cfe3c8" />
      <g fill="#f3b7d3">
        <ellipse cx="53" cy="26" rx="7" ry="11" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(72 53 26)" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(144 53 26)" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(216 53 26)" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(288 53 26)" />
      </g>
      <circle cx="53" cy="26" r="5" fill="#e8a0c4" />
      <g fill="#d9c4ec">
        <ellipse cx="28" cy="46" rx="5" ry="8" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(72 28 46)" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(144 28 46)" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(216 28 46)" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(288 28 46)" />
      </g>
      <circle cx="28" cy="46" r="3.6" fill="#b493d8" />
    </svg>
  );
}

function Flower({
  x,
  y,
  scale = 1,
  petal,
  center,
}: {
  x: number;
  y: number;
  scale?: number;
  petal: string;
  center: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill={petal}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="0" cy="-13" rx="7.5" ry="12" transform={`rotate(${angle})`} />
        ))}
      </g>
      <circle r="5.4" fill={center} />
    </g>
  );
}

export function FloralCluster({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 210 220" fill="none" aria-hidden="true">
      <g opacity="0.85" stroke="#bcd7b4" strokeWidth="3" strokeLinecap="round">
        <path d="M104 214c-6-42 0-78 18-108" />
        <path d="M104 214c2-30-8-58-28-80" />
      </g>
      <g opacity="0.9">
        <path d="M92 150c-16-2-26-12-30-27 16-1 29 7 33 23Z" fill="#cfe3c8" />
        <path d="M120 120c15-7 22-19 21-34-14 3-25 13-27 29Z" fill="#d7e8d0" />
        <path d="M82 182c-13-3-20-11-22-24 12 0 22 7 25 19Z" fill="#c7dfbf" />
      </g>
      <circle cx="158" cy="104" r="7" fill="#f2bcd6" />
      <circle cx="52" cy="150" r="6" fill="#dcc6ee" />
      <circle cx="150" cy="150" r="5" fill="#f7cfe0" />
      <Flower x={128} y={62} scale={1.5} petal="#f4b4d2" center="#e785ba" />
      <Flower x={70} y={96} scale={1.15} petal="#dcc6ee" center="#b493d8" />
      <Flower x={116} y={126} scale={0.95} petal="#f8d2e2" center="#ec9fc6" />
    </svg>
  );
}

export function FoodBowlIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 34h30l-4 14c-1 3-3 5-6 5h-10c-3 0-5-2-6-5l-4-14Z" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 34h36" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M20 26c0-3 3-5 7-5s7 2 7 5M46 42h10l-2 8c-1 2-2 3-4 3h-1" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 20c3-4 8-4 10 0-2 4-7 4-10 0Zm10 0 4-3m-4 3 4 3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LitterScoopIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="32" width="32" height="18" rx="5" stroke="currentColor" strokeWidth="3.2" />
      <path d="M16 41h.1m8 4h.1m6-5h.1" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 34 56 16m-14 8 8 6c3 2 7-1 6-5l-2-7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function YarnIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="27" cy="36" r="15" stroke="currentColor" strokeWidth="3.2" />
      <path d="M14 30c8-4 18-4 26 0M13 41c9 4 19 4 27 0M27 21c-5 9-5 21 0 30" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M42 36c8 0 12 4 12 9s-5 8-9 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function PhotoIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="20" width="48" height="32" rx="7" stroke="currentColor" strokeWidth="3.2" />
      <path d="M22 20l4-7h12l4 7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="36" r="9" stroke="currentColor" strokeWidth="3.2" />
      <path d="M47 28h.1" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
    </svg>
  );
}

export function BroomIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M40 8 26 30" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M17 44c2-8 5-12 9-14l10 7c-1 5-4 9-10 13l-11 6c-2 1-3-1-2-3l4-9Z" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 46l-4 7m10-4-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M48 34h.1m4 10h.1m-8 8h.1" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

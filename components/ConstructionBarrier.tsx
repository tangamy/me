export default function ConstructionBarrier({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id="stripes"
          x="0" y="0"
          width="22" height="22"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="11" height="22" fill="#F59E0B" />
          <rect x="11" width="11" height="22" fill="#FFFBEB" />
        </pattern>
        <clipPath id="plank1"><rect x="10" y="68" width="300" height="36" rx="5" /></clipPath>
        <clipPath id="plank2"><rect x="10" y="118" width="300" height="36" rx="5" /></clipPath>
      </defs>

      {/* Warning light */}
      <ellipse cx="160" cy="46" rx="14" ry="14" fill="#F59E0B" />
      <ellipse cx="160" cy="46" rx="7" ry="7" fill="#FCD34D" />
      <line x1="160" y1="60" x2="160" y2="68" stroke="#5A6E7A" strokeWidth="3" />

      {/* Top plank */}
      <rect x="10" y="68" width="300" height="36" rx="5" fill="url(#stripes)" clipPath="url(#plank1)" />
      <rect x="10" y="68" width="300" height="36" rx="5" stroke="#5A6E7A" strokeWidth="2" />

      {/* Bottom plank */}
      <rect x="10" y="118" width="300" height="36" rx="5" fill="url(#stripes)" clipPath="url(#plank2)" />
      <rect x="10" y="118" width="300" height="36" rx="5" stroke="#5A6E7A" strokeWidth="2" />

      {/* Left A-frame legs */}
      <line x1="72" y1="154" x2="42" y2="222" stroke="#5A6E7A" strokeWidth="10" strokeLinecap="round" />
      <line x1="72" y1="154" x2="102" y2="222" stroke="#5A6E7A" strokeWidth="10" strokeLinecap="round" />
      <line x1="42" y1="222" x2="102" y2="222" stroke="#5A6E7A" strokeWidth="6" strokeLinecap="round" />

      {/* Right A-frame legs */}
      <line x1="248" y1="154" x2="218" y2="222" stroke="#5A6E7A" strokeWidth="10" strokeLinecap="round" />
      <line x1="248" y1="154" x2="278" y2="222" stroke="#5A6E7A" strokeWidth="10" strokeLinecap="round" />
      <line x1="218" y1="222" x2="278" y2="222" stroke="#5A6E7A" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  variant: "30g" | "50g";
  className?: string;
  imageUrl?: string;
};

// Soft illustrated tin used when no real product photo has been uploaded yet.
export function TinIllustration({ variant, className, imageUrl }: Props) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Ark Matcha ${variant} tin`}
        className={className}
        loading="lazy"
      />
    );
  }

  const isCream = variant === "30g";
  const body = isCream ? "#F3EBDD" : "#1F3326";
  const ink = isCream ? "#1F3326" : "#F3EBDD";
  const shadow = isCream ? "#E2D7C2" : "#152619";
  const lid = isCream ? "#E8DFD0" : "#162217";

  return (
    <svg
      viewBox="0 0 240 320"
      className={className}
      role="img"
      aria-label={`Ark Matcha ${variant} ceremonial tin illustration`}
    >
      <defs>
        <radialGradient id={`gloss-${variant}`} cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="120" cy="305" rx="90" ry="8" fill="#000" opacity="0.08" />
      {/* tin body */}
      <rect x="40" y="70" width="160" height="220" rx="14" fill={body} />
      <rect x="40" y="70" width="160" height="220" rx="14" fill={`url(#gloss-${variant})`} />
      <rect x="40" y="70" width="160" height="220" rx="14" fill="none" stroke={shadow} strokeWidth="1.5" />
      {/* lid */}
      <rect x="32" y="46" width="176" height="36" rx="8" fill={lid} />
      <rect x="32" y="46" width="176" height="36" rx="8" fill="none" stroke={shadow} strokeWidth="1.5" />
      {/* top sticker covers lid entirely */}
      <rect x="36" y="50" width="168" height="28" rx="6" fill={body} />
      <text
        x="120"
        y="68"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="13"
        fill={ink}
        letterSpacing="2"
      >
        ARK MATCHA
      </text>
      {/* front label */}
      <g transform="translate(120 175)" textAnchor="middle" fill={ink} fontFamily="Fraunces, serif">
        <text fontSize="11" letterSpacing="3" y="-50">CEREMONIAL</text>
        <text fontSize="32" y="-15" fontWeight="500">Ark</text>
        <text fontSize="14" y="8" fontStyle="italic">matcha</text>
        {/* whisk + bowl line art */}
        <g stroke={ink} strokeWidth="1.2" fill="none" transform="translate(-30 20)">
          <path d="M0 30 Q30 50 60 30 L55 38 Q30 55 5 38 Z" />
          <line x1="22" y1="0" x2="22" y2="28" />
          <line x1="30" y1="0" x2="30" y2="28" />
          <line x1="38" y1="0" x2="38" y2="28" />
          <line x1="26" y1="-2" x2="26" y2="28" />
          <line x1="34" y1="-2" x2="34" y2="28" />
        </g>
        <text fontSize="9" letterSpacing="2" y="100">NET WT. {variant === "30g" ? "30g / 1.06 oz" : "50g / 1.76 oz"}</text>
        <text fontSize="8" letterSpacing="2" y="115" opacity="0.8">MADE IN JAPAN</text>
      </g>
    </svg>
  );
}

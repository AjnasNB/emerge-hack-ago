'use client';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreGauge({ score, size = 160, label }: ScoreGaugeProps) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const viewBox = 140;

  const getColor = (s: number) => {
    if (s >= 80)
      return {
        stroke: 'url(#score-gradient-green)',
        glow: 'rgba(34, 197, 94, 0.3)',
        text: 'text-emerald-400',
        label: 'Excellent',
      };
    if (s >= 60)
      return {
        stroke: 'url(#score-gradient-amber)',
        glow: 'rgba(245, 158, 11, 0.3)',
        text: 'text-amber-400',
        label: 'Good',
      };
    if (s >= 40)
      return {
        stroke: 'url(#score-gradient-orange)',
        glow: 'rgba(249, 115, 22, 0.3)',
        text: 'text-orange-400',
        label: 'Needs Work',
      };
    return {
      stroke: 'url(#score-gradient-red)',
      glow: 'rgba(239, 68, 68, 0.3)',
      text: 'text-red-400',
      label: 'Critical',
    };
  };

  const color = getColor(score);
  const scaledFont = Math.max(size / 4, 24);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 0 ${size / 8}px ${color.glow})`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="score-gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="score-gradient-amber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="score-gradient-orange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="score-gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={viewBox / 2}
            cy={viewBox / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-800"
            strokeWidth="8"
            opacity="0.5"
          />

          {/* Score arc */}
          <circle
            cx={viewBox / 2}
            cy={viewBox / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="animate-score-fill"
            style={{ '--score-offset': offset } as React.CSSProperties}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold tracking-tight ${color.text}`}
            style={{ fontSize: scaledFont }}
          >
            {score}
          </span>
          <span className="text-xs text-slate-500 font-medium -mt-1">/ 100</span>
        </div>
      </div>
      {label !== undefined ? (
        <span className={`text-sm font-semibold ${color.text}`}>{label}</span>
      ) : (
        <span className={`text-sm font-bold uppercase tracking-wider ${color.text}`}>
          {color.label}
        </span>
      )}
    </div>
  );
}

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
    if (s >= 80) return { stroke: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', text: 'text-emerald-600 dark:text-emerald-400' };
    if (s >= 60) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'text-amber-600 dark:text-amber-400' };
    if (s >= 40) return { stroke: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', text: 'text-orange-600 dark:text-orange-400' };
    return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'text-red-600 dark:text-red-400' };
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Needs Work';
    return 'Critical';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={viewBox / 2}
            cy={viewBox / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth="10"
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
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color.text}`}>
            {score}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            / 100
          </span>
        </div>
      </div>
      {label !== undefined ? (
        <span className={`text-sm font-semibold ${color.text}`}>{label}</span>
      ) : (
        <span className={`text-sm font-semibold ${color.text}`}>{getLabel(score)}</span>
      )}
    </div>
  );
}

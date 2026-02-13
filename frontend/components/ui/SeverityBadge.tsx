'use client';

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high';
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    low: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    high: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };

  const dots = {
    low: 'bg-blue-400',
    medium: 'bg-amber-400',
    high: 'bg-red-400 animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${styles[severity]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[severity]}`} />
      {severity}
    </span>
  );
}

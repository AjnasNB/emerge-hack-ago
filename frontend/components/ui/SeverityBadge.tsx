'use client';

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high';
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    low: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20',
    medium: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-400/20',
    high: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${styles[severity]}`}
    >
      {severity.toUpperCase()}
    </span>
  );
}

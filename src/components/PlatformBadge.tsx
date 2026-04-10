import type { Platform } from '../types';
import { PLATFORM_CONFIG } from '../types';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
}

export default function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${sizeClasses}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

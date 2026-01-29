import React from 'react';
import { AttendanceStatus } from '../../types';

interface BadgeProps {
  status: AttendanceStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  let colorClass = 'bg-stone-100 text-stone-600 border-stone-200';
  let label = status;

  switch (status) {
    case AttendanceStatus.PRESENT:
    case 'COMPLETED':
    case 'APPROVED':
    case 'Active':
      colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200'; // Success
      break;
    case AttendanceStatus.ABSENT:
    case 'REJECTED':
      colorClass = 'bg-accent-50 text-accent-700 border-accent-100'; // Muted Red
      break;
    case AttendanceStatus.DECLARED:
    case 'SCHEDULED':
      colorClass = 'bg-primary-50 text-primary-700 border-primary-100'; // Muted Orange
      label = status === AttendanceStatus.DECLARED ? 'DECLARED' : label;
      break;
    case AttendanceStatus.EXCUSED:
      colorClass = 'bg-secondary-100 text-secondary-800 border-secondary-200'; // Soft Yellow
      break;
    case AttendanceStatus.NOT_DECLARED:
      colorClass = 'bg-stone-100 text-stone-500 border-stone-200';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wide uppercase' : 'px-2.5 py-1 text-xs font-semibold tracking-wide uppercase';

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClass} ${sizeClass}`}>
      {label.replace('_', ' ')}
    </span>
  );
};
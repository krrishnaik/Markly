import React from 'react';
import { AttendanceStatus } from '../../types';

interface BadgeProps {
  status: AttendanceStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
  let label = status;

  switch (status) {
    case AttendanceStatus.PRESENT:
    case 'COMPLETED':
    case 'APPROVED':
    case 'Active':
      colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200'; 
      break;
    case AttendanceStatus.ABSENT:
    case 'REJECTED':
      colorClass = 'bg-red-50 text-red-700 border-red-200'; 
      break;
    case AttendanceStatus.DECLARED:
    case 'SCHEDULED':
      colorClass = 'bg-primary-50 text-primary-700 border-primary-200';
      label = status === AttendanceStatus.DECLARED ? 'DECLARED' : label;
      break;
    case AttendanceStatus.EXCUSED:
      colorClass = 'bg-amber-50 text-amber-700 border-amber-200'; 
      break;
    case AttendanceStatus.NOT_DECLARED:
      colorClass = 'bg-slate-100 text-slate-500 border-slate-200';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wide uppercase' : 'px-2.5 py-1 text-xs font-semibold tracking-wide uppercase';

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClass} ${sizeClass}`}>
      {label.replace('_', ' ')}
    </span>
  );
};
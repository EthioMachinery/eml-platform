"use client";

import React from "react";

export interface MachineryIconProps {
  size?: number;
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Tracked digging machine: cab + articulated boom/dipper/bucket arm */
export function ExcavatorIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <rect x="2" y="16.5" width="9" height="3" rx="1" />
      <circle cx="4.5" cy="20.5" r="1.1" />
      <circle cx="8.5" cy="20.5" r="1.1" />
      <rect x="3" y="10" width="6.5" height="6.5" rx="1" />
      <polyline points="8.5,11.5 15,5 19,9 16,13" />
      <path d="M16 13 L19.5 13 L19.5 15.3 L15 15.3 Z" />
    </svg>
  );
}

/** Wheeled loader: cab/body on large wheels with a low front scoop */
export function LoaderIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="17.5" cy="18" r="2.6" />
      <rect x="8.5" y="8" width="8" height="7.5" rx="1" />
      <path d="M8.5 14.5 L3 14.5 L3.6 17.2 L6.7 17.2 L8.5 14.5 Z" />
    </svg>
  );
}

/** Bulldozer: tracked chassis with a flat front blade */
export function DozerIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <rect x="2" y="16.5" width="14" height="3" rx="1" />
      <circle cx="4.5" cy="20.5" r="1.1" />
      <circle cx="13.5" cy="20.5" r="1.1" />
      <rect x="6" y="10" width="8" height="6.5" rx="1" />
      <line x1="16" y1="13.5" x2="19.5" y2="13.5" />
      <path d="M19.5 11.5 L21.3 11.5 L21.3 16.8 L19.5 16.8 Z" />
    </svg>
  );
}

/** Mobile crane: wheeled base, vertical mast, diagonal boom and hook */
export function CraneIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <rect x="3" y="17" width="9" height="3" rx="1" />
      <circle cx="5.5" cy="21" r="1.1" />
      <circle cx="9.5" cy="21" r="1.1" />
      <line x1="6.5" y1="17" x2="6.5" y2="4" />
      <line x1="6.5" y1="4" x2="19.5" y2="9" />
      <line x1="19.5" y1="9" x2="19.5" y2="15.3" />
      <circle cx="19.5" cy="16.5" r="1.1" />
    </svg>
  );
}

/** Motor grader: long low chassis on wheels with an angled blade underneath */
export function GraderIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <circle cx="5" cy="18.5" r="2.1" />
      <circle cx="19" cy="18.5" r="2.1" />
      <line x1="3" y1="12.5" x2="21" y2="12.5" />
      <rect x="8" y="8" width="6.5" height="4.5" rx="1" />
      <path d="M8.5 15.5 L15.5 15.5 L14.5 18.3 L9.5 18.3 Z" />
    </svg>
  );
}

/** Road roller: two large compaction drums joined by a low frame */
export function RollerIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <circle cx="6" cy="16.5" r="4" />
      <circle cx="18" cy="16.5" r="3.2" />
      <rect x="8.5" y="9.5" width="8" height="6" rx="1" />
    </svg>
  );
}

/** Dump truck: cab plus a tilted rear bed */
export function DumpTruckIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <circle cx="6.5" cy="18.5" r="2.1" />
      <circle cx="17.5" cy="18.5" r="2.1" />
      <rect x="2.5" y="12.5" width="6" height="5" rx="1" />
      <path d="M8.5 8 L20.5 8 L20.5 15.5 L8.5 15.5 Z" />
      <line x1="8.5" y1="8" x2="20.5" y2="12" />
    </svg>
  );
}

/** Industrial generator: boxed unit with a power bolt */
export function GeneratorIcon({ size = 40, className }: MachineryIconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <rect x="3" y="8" width="16" height="10.5" rx="1.2" />
      <circle cx="7.5" cy="13.2" r="2" />
      <path d="M14.5 10.3 L12.5 14 L15 14 L13 17.7" />
    </svg>
  );
}
"use client";

import React from "react";

interface WheelSegmentProps {
  index: number;
  totalSegments: number;
  color: string;
  label: string;
  value: number;
  radius: number;
}

export function WheelSegment({
  index,
  totalSegments,
  color,
  label,
  value,
  radius,
}: WheelSegmentProps) {
  const angle = 360 / totalSegments;
  const rotate = angle * index;
  const skew = 90 - angle;

  // Calculate path for the segment slice
  // We use a slightly larger radius for the background to avoid gaps
  const pathData = `
    M 0 0
    L ${radius} 0
    A ${radius} ${radius} 0 0 1 ${radius * Math.cos((angle * Math.PI) / 180)} ${
    radius * Math.sin((angle * Math.PI) / 180)
  }
    L 0 0
  `;

  return (
    <g transform={`rotate(${rotate})`}>
      <path d={pathData} fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <g
        transform={`rotate(${angle / 2}) translate(${radius * 0.75}, 0) rotate(90)`}
      >
        <text
          x="0"
          y="0"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold uppercase tracking-wider select-none"
          style={{ fontSize: "10px", fontWeight: 800 }}
        >
          {label}
        </text>
        <text
          x="0"
          y="14"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-black select-none"
          style={{ fontSize: "14px" }}
        >
          {value}
        </text>
      </g>
    </g>
  );
}

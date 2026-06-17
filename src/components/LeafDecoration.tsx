import React from 'react';

interface LeafProps {
  className?: string;
  rotation?: number;
  flip?: boolean;
}

export const LeafDecoration: React.FC<LeafProps> = ({ className = '', rotation = 0, flip = false }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-16 h-16 pointer-events-none select-none transition-transform duration-1000 ${className}`}
      style={{
        transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}`,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))',
      }}
    >
      {/* Elegantly styled watercolor leaf pathways with gradient offsets */}
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a9270" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#a3b899" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#cdb17b" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#556c4d" />
          <stop offset="100%" stopColor="#896e4f" />
        </linearGradient>
      </defs>
      
      {/* Decorative elegant hand-drawn styled leaf */}
      <g>
        {/* Main Stem */}
        <path
          d="M 10,90 Q 30,70 90,10"
          fill="none"
          stroke="url(#stemGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Leaf 1 (Top right) */}
        <path
          d="M 90,10 C 85,25 65,35 50,25 C 55,10 75,5 90,10 Z"
          fill="url(#leafGrad)"
          stroke="#4b5d44"
          strokeWidth="0.5"
        />
        {/* Inner vein */}
        <path d="M 90,10 Q 75,18 50,25" fill="none" stroke="#6d8363" strokeWidth="0.8" />

        {/* Leaf 2 (Middle left) */}
        <path
          d="M 45,55 C 30,55 20,40 30,30 C 45,30 50,45 45,55 Z"
          fill="url(#leafGrad)"
          stroke="#4b5d44"
          strokeWidth="0.5"
        />
        <path d="M 45,55 Q 35,42 30,30" fill="none" stroke="#6d8363" strokeWidth="0.8" />

        {/* Leaf 3 (Middle right) */}
        <path
          d="M 65,35 C 70,50 60,65 50,55 C 45,45 55,30 65,35 Z"
          fill="url(#leafGrad)"
          stroke="#4b5d44"
          strokeWidth="0.5"
        />
        <path d="M 65,35 Q 58,45 50,55" fill="none" stroke="#6d8363" strokeWidth="0.8" />

        {/* Leaf 4 (Bottom left) */}
        <path
          d="M 25,75 C 12,70 15,55 25,50 C 35,55 35,70 25,75 Z"
          fill="url(#leafGrad)"
          stroke="#4b5d44"
          strokeWidth="0.5"
        />
        <path d="M 25,75 Q 22,62 25,50" fill="none" stroke="#6d8363" strokeWidth="0.8" />
      </g>
    </svg>
  );
};

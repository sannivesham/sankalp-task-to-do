import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = true }) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Emblem */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-sankalp-burgundy to-sankalp-maroon shadow-md text-sankalp-gold border border-sankalp-gold/30 shrink-0"
        style={{ width: iconSize, height: iconSize }}
        aria-hidden="true"
      >
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          className="w-4/5 h-4/5"
        >
          {/* Subtle gold halo ring */}
          <circle 
            cx="32" 
            cy="32" 
            r="26" 
            stroke="#D2A33A" 
            strokeOpacity="0.4" 
            strokeWidth="1.5" 
            strokeDasharray="3 3" 
          />

          {/* Flowing 'S' line */}
          <path 
            d="M42 20C38 16 26 16 23 23C20 30 42 29 39 41C36 50 25 50 18 45" 
            stroke="#D2A33A" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Decisive completion checkmark */}
          <path 
            d="M26 35L35 43L50 23" 
            stroke="#FAF6EF" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Gold bindu / resolution accent */}
          <circle cx="45" cy="18" r="2.5" fill="#D2A33A" />
        </svg>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-brand font-bold tracking-wide text-sankalp-maroon dark:text-sankalp-ivory leading-tight text-xl sm:text-2xl">
            Sankalp
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-sankalp-burgundy/10 text-sankalp-burgundy dark:bg-sankalp-gold/15 dark:text-sankalp-gold border border-sankalp-burgundy/20 dark:border-sankalp-gold/30">
            Task To Do
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-sankalp-maroon/70 dark:text-sankalp-rose/70 font-medium truncate mt-0.5">
            Make a plan. Keep your promise. Get it done.
          </span>
        )}
      </div>
    </div>
  );
};

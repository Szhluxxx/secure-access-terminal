import { useEffect, useState } from 'react';

interface ScannerProps {
  isScanning: boolean;
  onScanComplete?: () => void;
}

const Scanner = ({ isScanning, onScanComplete }: ScannerProps) => {
  const [dots, setDots] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random dots for the scanner display
    const newDots = Array.from({ length: 8 }, () => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      delay: Math.random() * 2,
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px hsl(145 100% 50%))' }}
      >
        <defs>
          {/* Scanner sweep gradient */}
          <linearGradient id="scanner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="hsl(145 100% 50% / 0.3)" />
            <stop offset="100%" stopColor="hsl(145 100% 50% / 0.1)" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          className="scanner-ring"
          strokeWidth="1"
        />
        
        {/* Inner rings */}
        <circle
          cx="100"
          cy="100"
          r="75"
          className="scanner-ring"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />
        <circle
          cx="100"
          cy="100"
          r="55"
          className="scanner-ring"
          strokeWidth="0.5"
          strokeDasharray="2 6"
        />
        <circle
          cx="100"
          cy="100"
          r="35"
          className="scanner-ring"
          strokeWidth="0.5"
        />

        {/* Cross lines */}
        <line
          x1="100"
          y1="5"
          x2="100"
          y2="195"
          stroke="hsl(145 100% 50% / 0.3)"
          strokeWidth="0.5"
        />
        <line
          x1="5"
          y1="100"
          x2="195"
          y2="100"
          stroke="hsl(145 100% 50% / 0.3)"
          strokeWidth="0.5"
        />

        {/* Rotating sweep */}
        {isScanning && (
          <path
            d="M 100 100 L 100 5 A 95 95 0 0 1 195 100 Z"
            className="scanner-sweep"
            filter="url(#glow)"
          />
        )}

        {/* Random data points */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x + 10}
            cy={dot.y + 10}
            r="2"
            className="scanner-dot"
            style={{ animationDelay: `${dot.delay}s` }}
          />
        ))}

        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="4"
          fill="hsl(145 100% 50%)"
          filter="url(#glow)"
        />
      </svg>

      {/* Status text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs terminal-glow-subtle uppercase tracking-widest">
        {isScanning ? 'SCANNING...' : 'STANDBY'}
      </div>
    </div>
  );
};

export default Scanner;

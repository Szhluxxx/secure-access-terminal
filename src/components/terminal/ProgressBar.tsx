import { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({ progress, label, showPercentage = true }: ProgressBarProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth animation for progress
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs uppercase tracking-wider">
          {label && <span className="terminal-glow-subtle">{label}</span>}
          {showPercentage && (
            <span className="terminal-glow font-display">{Math.round(displayProgress)}%</span>
          )}
        </div>
      )}
      <div className="progress-bar box-glow">
        <div
          className="progress-bar-fill"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

import { useEffect, useState } from 'react';

interface WarningMessageProps {
  message: string;
  visible?: boolean;
}

const WarningMessage = ({ message, visible = true }: WarningMessageProps) => {
  const [isFlashing, setIsFlashing] = useState(true);

  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      className={`
        text-destructive text-center py-2 px-4 border border-destructive
        uppercase tracking-widest text-sm font-display
        transition-opacity duration-100
        ${isFlashing ? 'opacity-100 warning-glow' : 'opacity-50'}
      `}
      style={{
        background: 'hsl(350 100% 50% / 0.1)',
      }}
    >
      ⚠ {message} ⚠
    </div>
  );
};

export default WarningMessage;

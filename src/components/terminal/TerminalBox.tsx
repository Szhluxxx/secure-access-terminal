import { ReactNode, CSSProperties } from 'react';

interface TerminalBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'warning';
  style?: CSSProperties;
}

const TerminalBox = ({ title, children, className = '', variant = 'default', style }: TerminalBoxProps) => {
  const boxClasses = variant === 'warning' 
    ? 'border-destructive warning-box-glow' 
    : 'border-primary box-glow';

  return (
    <div className={`terminal-box ${boxClasses} ${className}`} style={style}>
      {title && (
        <div className={`terminal-header ${variant === 'warning' ? 'text-destructive' : ''}`}>
          {'>'} {title}
        </div>
      )}
      <div className="space-y-1 text-sm">
        {children}
      </div>
    </div>
  );
};

export default TerminalBox;

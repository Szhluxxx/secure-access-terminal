import { useEffect, useState, useCallback } from 'react';
import Scanner from '@/components/terminal/Scanner';
import ProgressBar from '@/components/terminal/ProgressBar';
import TerminalBox from '@/components/terminal/TerminalBox';
import WarningMessage from '@/components/terminal/WarningMessage';
import TypewriterText from '@/components/terminal/TypewriterText';
import CRTOverlay from '@/components/terminal/CRTOverlay';

const Index = () => {
  const [bootSequence, setBootSequence] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Terminal info data
  const terminalInfo = {
    terminalId: 'SCP-TERM-7734-ALPHA',
    clearanceLevel: 'LEVEL 4 - TOP SECRET',
    location: 'SITE-19 / SECTOR-7G',
    operator: '[REDACTED]',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  // Boot sequence animation
  useEffect(() => {
    const bootSteps = [
      { delay: 500, step: 1 },   // Show header
      { delay: 1500, step: 2 },  // Show scanner
      { delay: 2000, step: 3 },  // Start scanning
      { delay: 2500, step: 4 },  // Show terminal info
    ];

    bootSteps.forEach(({ delay, step }) => {
      setTimeout(() => setBootSequence(step), delay);
    });

    // Start scan after boot
    setTimeout(() => {
      setIsScanning(true);
    }, 3000);
  }, []);

  // Scan progress animation
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setConnectionEstablished(true);
          
          // Show warning after connection
          setTimeout(() => setShowWarning(true), 500);
          // Show content after warning
          setTimeout(() => setShowContent(true), 1500);
          
          return 100;
        }
        // Random increment for realistic scan feel
        return prev + Math.random() * 3 + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Play beep sound effect
  const playBeep = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    } catch (e) {
      // Audio context not supported
    }
  }, []);

  useEffect(() => {
    if (connectionEstablished) {
      playBeep();
    }
  }, [connectionEstablished, playBeep]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-flicker">
      <CRTOverlay />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main Header */}
        {bootSequence >= 1 && (
          <header className="text-center space-y-4 animate-fade-in-up">
            <div className="animated-border inline-block px-8 py-4">
              <h1 
                className="text-2xl md:text-4xl lg:text-5xl font-display font-bold terminal-glow glitch uppercase tracking-wider"
                data-text="SCP FOUNDATION"
              >
                SCP FOUNDATION
              </h1>
              <p className="text-sm md:text-base terminal-glow-subtle tracking-[0.3em] mt-2">
                SECURE. CONTAIN. PROTECT.
              </p>
            </div>
          </header>
        )}

        {/* Connection Status */}
        {connectionEstablished && (
          <div className="text-center animate-fade-in-up">
            <p className="text-lg md:text-xl terminal-glow font-display tracking-wider">
              {'>'} CONNECTION SUCCESSFULLY ESTABLISHED {'<'}
            </p>
          </div>
        )}

        {/* Scanner and Progress Section */}
        <div className="flex flex-col items-center space-y-6 animate-fade-in-up animate-delay-200">
          {bootSequence >= 2 && (
            <Scanner isScanning={isScanning} />
          )}
          
          {bootSequence >= 3 && (
            <div className="w-full max-w-md">
              <ProgressBar
                progress={Math.min(scanProgress, 100)}
                label="BIOMETRIC SCAN"
              />
              <div className="mt-2 text-xs text-center terminal-glow-subtle uppercase tracking-wider">
                {isScanning ? (
                  <TypewriterText 
                    text="ANALYZING BIOMETRIC SIGNATURE..." 
                    speed={30}
                  />
                ) : scanProgress >= 100 ? (
                  'SCAN COMPLETE - ACCESS GRANTED'
                ) : (
                  'AWAITING SCAN INITIATION'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Warning Message */}
        {showWarning && (
          <div className="animate-fade-in-up">
            <WarningMessage message="UNAUTHORIZED ACCESS WILL BE PROSECUTED" />
          </div>
        )}

        {/* Terminal Info */}
        {bootSequence >= 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up animate-delay-300">
            <TerminalBox title="TERMINAL ID">
              <p className="font-display">{terminalInfo.terminalId}</p>
            </TerminalBox>
            <TerminalBox title="CLEARANCE LEVEL">
              <p className="font-display text-primary">{terminalInfo.clearanceLevel}</p>
            </TerminalBox>
            <TerminalBox title="LOCATION">
              <p className="font-display">{terminalInfo.location}</p>
            </TerminalBox>
            <TerminalBox title="TIMESTAMP">
              <p className="font-display text-xs">{terminalInfo.timestamp}</p>
            </TerminalBox>
          </div>
        )}

        {/* Main Content Sections */}
        {showContent && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up animate-delay-400">
            <TerminalBox title="1. PERSONALAKTE" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <p>{'>'} NAME: [DATEN GESCHWÄRZT]</p>
              <p>{'>'} RANG: FORSCHUNGSLEITER</p>
              <p>{'>'} ABTEILUNG: EINDÄMMUNG</p>
              <p>{'>'} STATUS: AKTIV</p>
              <p className="text-muted-foreground mt-2 text-xs">
                LETZTE AKTIVITÄT: VOR 2 STUNDEN
              </p>
            </TerminalBox>

            <TerminalBox title="2. AKTUELLER STATUS" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <p className="text-primary">{'>'} ANLAGE: OPERATIV</p>
              <p>{'>'} EINDÄMMUNG: 98.7% STABIL</p>
              <p>{'>'} SICHERHEITSLEVEL: ERHÖHT</p>
              <p>{'>'} PERSONAL VOR ORT: 247</p>
              <p className="text-destructive mt-2 text-xs animate-pulse">
                ⚠ 2 ANOMALIEN UNTER BEOBACHTUNG
              </p>
            </TerminalBox>

            <TerminalBox title="3. SYSTEMHINWEISE" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <p>{'>'} PROTOKOLL KETER-7 AKTIV</p>
              <p>{'>'} BACKUP-SYSTEME: ONLINE</p>
              <p>{'>'} NÄCHSTE WARTUNG: 72:00:00</p>
              <p>{'>'} NOTFALLPLAN: BEREIT</p>
              <p className="text-muted-foreground mt-2 text-xs">
                ALLE SYSTEME NOMINAL
              </p>
            </TerminalBox>

            <TerminalBox title="4. LETZTE ZUGRIFFE" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <p>{'>'} 08:34 - DR. ████████</p>
              <p>{'>'} 09:12 - AGENT MÜLLER</p>
              <p>{'>'} 11:45 - [ZUGRIFF VERWEIGERT]</p>
              <p>{'>'} 14:22 - O5-██</p>
            </TerminalBox>

            <TerminalBox title="5. AKTIVE WARNUNGEN" variant="warning" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              <p className="text-destructive">{'>'} SCP-███: AKTIVITÄT ERHÖHT</p>
              <p className="text-destructive">{'>'} SEKTOR 4: QUARANTÄNE</p>
              <p className="text-muted-foreground">{'>'} SCP-999: STABIL</p>
              <p className="text-muted-foreground">{'>'} SCP-173: EINGEDÄMMT</p>
            </TerminalBox>

            <TerminalBox title="6. SCHNELLZUGRIFF" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              <p className="hover:text-accent cursor-pointer transition-colors">{'>'} [F1] DATENBANK</p>
              <p className="hover:text-accent cursor-pointer transition-colors">{'>'} [F2] KOMMUNIKATION</p>
              <p className="hover:text-accent cursor-pointer transition-colors">{'>'} [F3] SICHERHEIT</p>
              <p className="hover:text-accent cursor-pointer transition-colors">{'>'} [F4] NOTFALL</p>
            </TerminalBox>
          </div>
        )}

        {/* Footer */}
        {showContent && (
          <footer className="text-center space-y-2 pt-8 border-t border-primary/30 animate-fade-in-up animate-delay-500">
            <p className="text-xs terminal-glow-subtle tracking-widest">
              {'>'} KLASSIFIZIERT - NUR FÜR AUTORISIERTES PERSONAL {'<'}
            </p>
            <p className="text-xs text-muted-foreground">
              SCP FOUNDATION | SITE-19 | SEKTOR 7G | TERMINAL {terminalInfo.terminalId}
            </p>
            <p className="text-xs text-muted-foreground typing-cursor">
              EINGABE ERWARTET
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;

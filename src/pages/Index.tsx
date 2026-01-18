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
    clearanceLevel: 'LEVEL 5 - O5 COUNCIL',
    location: 'SITE-19 / SECTOR-7G',
    operator: 'E-06 "THE ARCANA"',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up animate-delay-400">
            <TerminalBox title="1. OOC INFORMATIONEN" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <p>{'>'} ALTER: 17 JAHRE</p>
              <p>{'>'} RP-ERFAHRUNG: MEHRERE GMOD SERVER</p>
              <p className="text-muted-foreground mt-2 text-xs">
                ERFAHRUNG: VERIFIZIERT
              </p>
            </TerminalBox>

            <TerminalBox title="2. IC INFORMATIONEN" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <p className="text-primary">{'>'} PETER MANN (D-KLASSE)</p>
              <p>{'>'} CODENAME: "MOSSAD" (MTF PVT)</p>
              <p className="text-muted-foreground mt-2 text-xs">
                IDENTITÄT BESTÄTIGT
              </p>
            </TerminalBox>

            <TerminalBox title="3. EIGNUNG FÜR DIE ROLLE" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <p>{'>'} INTERESSE AN STRUKTURIERTEN JOBS</p>
              <p>{'>'} SACHLICHE ENTSCHEIDUNGSFINDUNG</p>
              <p>{'>'} ERFAHRUNG AUS RP-SERVERN</p>
              <p>{'>'} ANPASSUNG AN KOMPLEXE SITUATIONEN</p>
            </TerminalBox>

            <TerminalBox title="4. ERFAHRUNG IM BEREICH" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <p>{'>'} SCP-RP SERVER</p>
              <p>{'>'} SERIOUS RP</p>
              <p>{'>'} SEMI-SERIOUS RP</p>
              <p>{'>'} HARDCORE & MIDCORE RP</p>
              <p className="text-muted-foreground mt-2 text-xs">
                ROLLENSTRUKTUREN BEKANNT
              </p>
            </TerminalBox>

            <TerminalBox title="5. ZEITLICHE VERFÜGBARKEIT" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              <p className="text-primary">{'>'} NACH SCHULENDE: VERFÜGBAR</p>
              <p>{'>'} REGELMÄSSIGE AKTIVITÄT: GARANTIERT</p>
              <p className="text-muted-foreground mt-2 text-xs">
                STATUS: AKTIV
              </p>
            </TerminalBox>

            <TerminalBox title="6. BESTEHENDE WHITELISTS" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              <p>{'>'} AKTUELLE WHITELIST-JOBS: KEINE</p>
              <p className="text-muted-foreground mt-2 text-xs">
                FREIE KAPAZITÄT VORHANDEN
              </p>
            </TerminalBox>

            <TerminalBox title="7. ROLLENSPEZIFISCHE FRAGEN (ETHIKER)" className="opacity-0 animate-fade-in-up md:col-span-2" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
              <p>{'>'} AUFGABE: MASSNAHMEN NACHVOLLZIEHBAR GESTALTEN</p>
              <p>{'>'} MORAL: HANDLUNGEN KRITISCH HINTERFRAGEN</p>
              <p>{'>'} BALANCE: SICHERHEIT, NOTWENDIGKEIT, VERANTWORTUNG</p>
              <p className="text-muted-foreground mt-2 text-xs">
                ETHIK-PROTOKOLLE VERSTANDEN
              </p>
            </TerminalBox>

            <TerminalBox title="8. RP-STORY: E-06 THE ARCANA" className="opacity-0 animate-fade-in-up md:col-span-2" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
              <p className="text-primary mb-2">{'>'} SUBJEKT: TAKESHI NOSTRA</p>
              <p>{'>'} URSPRUNG: HOCHBEGABTER FORSCHER</p>
              <p>{'>'} SPEZIALISIERUNG: EMOTIONEN, WAHRNEHMUNG, VERHALTENSMUSTER</p>
              <p>{'>'} WENDEPUNKT: EXPERIMENT MIT ANGST-VERSTÄRKENDEM SCP</p>
              <p>{'>'} ERGEBNIS: SCHWERE PSYCHISCHE SCHÄDEN BEI KOLLEGEN</p>
              <p>{'>'} AKTION: DOKUMENTATION ETHISCHER FEHLENTSCHEIDUNGEN</p>
              <p className="text-accent mt-2">{'>'} REKRUTIERUNG DURCH ETHIK-KOMITEE</p>
              <p>{'>'} NEUE IDENTITÄT: E-06 "THE ARCANA"</p>
              <p>{'>'} AUSBILDUNG: ETHISCHE THEORIE, PSYCHOLOGIE, MACHTDYNAMIK</p>
              <p className="text-primary mt-2">{'>'} MAXIME: FORTSCHRITT DARF NIEMALS ÜBER MENSCHLICHKEIT SIEGEN</p>
            </TerminalBox>

            <TerminalBox title="9. WUNSCHNUMMER" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
              <p className="text-primary text-lg">{'>'} [E-06]</p>
              <p className="text-muted-foreground mt-2 text-xs">
                DESIGNATION ANGEFORDERT
              </p>
            </TerminalBox>

            <TerminalBox title="10. SCHLUSSWORT" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
              <p>{'>'} MOTIVATION: AKTIVES, STRUKTURIERTES RP</p>
              <p>{'>'} ANGEBOT: DOKUMENTE VIA DC VERFÜGBAR</p>
              <p className="text-primary mt-2 text-xs">
                BEWERBUNG ABGESCHLOSSEN
              </p>
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

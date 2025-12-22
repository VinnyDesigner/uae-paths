import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, MapPin, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: Home, description: 'Return to homepage' },
  { name: 'Smart Map', path: '/map', icon: MapPin, description: 'Interactive map explorer' },
  { name: 'About', path: '/about', icon: Info, description: 'Learn about this project' },
];

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
  topOffset?: number;
}

export function MobileNavSheet({ isOpen, onClose, topOffset = 0 }: MobileNavSheetProps) {
  const location = useLocation();
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff < 0 && sheetRef.current) {
      // Swiping up - allow normal scroll
      return;
    }
    
    if (diff > 0 && sheetRef.current && sheetRef.current.scrollTop === 0) {
      // Swiping down from top - apply transform
      sheetRef.current.style.transform = `translateY(${Math.min(diff, 150)}px)`;
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 200ms ease-out';
      
      if (diff > 80) {
        // Swipe threshold met - close
        sheetRef.current.style.transform = 'translateY(100%)';
        setTimeout(onClose, 200);
      } else {
        // Reset position
        sheetRef.current.style.transform = 'translateY(0)';
      }
    }
    
    startY.current = 0;
    currentY.current = 0;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - tap to dismiss */}
      <div 
        className="md:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[40] animate-fade-in"
        style={{ top: topOffset }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sheet Panel */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "md:hidden fixed left-0 right-0 z-[45] bg-card border-b border-border",
          "rounded-b-2xl shadow-2xl",
          "max-h-[70vh] overflow-y-auto overscroll-contain",
          "transform transition-transform duration-[250ms] ease-out",
          isOpen ? "animate-slide-down" : ""
        )}
        style={{ top: topOffset }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2 bg-card">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border/50">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200",
                  "min-h-[56px] w-full group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary/50 hover:bg-secondary text-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary-foreground/20" 
                    : "bg-background group-hover:bg-primary/10"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.name}</div>
                  <div className={cn(
                    "text-xs truncate",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </div>
                </div>
                {!isActive && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                )}
                {isActive && (
                  <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded-full font-medium">
                    Current
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer safe area */}
        <div className="h-4" />
      </div>
    </>
  );
}

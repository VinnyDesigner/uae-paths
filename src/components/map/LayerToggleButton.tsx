import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

interface LayerToggleButtonProps {
  visible: boolean;
  color?: string; // Deprecated - kept for backward compatibility but not used
  className?: string;
}

/**
 * Unified selection toggle button
 * Always uses primary color for selection state - never category colors
 */
export function LayerToggleButton({ visible, className }: LayerToggleButtonProps) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
        visible
          ? "bg-primary/10 shadow-sm"
          : "bg-muted/30 group-hover:bg-muted/50",
        className
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          visible
            ? "bg-primary border-transparent scale-100"
            : "bg-transparent border-muted-foreground/30 scale-95 group-hover:scale-100 group-hover:border-muted-foreground/50"
        )}
      >
        {visible ? (
          <Check className="w-3.5 h-3.5 text-white animate-scale-in" />
        ) : (
          <Circle className="w-3 h-3 text-muted-foreground/40" />
        )}
      </div>
    </div>
  );
}

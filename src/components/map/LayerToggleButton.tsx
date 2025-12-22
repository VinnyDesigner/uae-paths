import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

interface LayerToggleButtonProps {
  visible: boolean;
  color: string;
  className?: string;
}

export function LayerToggleButton({ visible, color, className }: LayerToggleButtonProps) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
        visible
          ? "shadow-sm"
          : "bg-muted/30 group-hover:bg-muted/50",
        className
      )}
      style={{
        backgroundColor: visible ? `${color}20` : undefined,
      }}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          visible
            ? "border-transparent scale-100"
            : "border-muted-foreground/30 scale-95 group-hover:scale-100 group-hover:border-muted-foreground/50"
        )}
        style={{
          backgroundColor: visible ? color : 'transparent',
        }}
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

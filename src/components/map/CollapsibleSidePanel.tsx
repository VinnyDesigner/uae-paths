import { useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CollapsibleSidePanelProps {
  children: ReactNode;
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

const STORAGE_KEY = 'smartmap-panel-collapsed';

// Icon buttons for collapsed rail
interface RailButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

function RailButton({ icon: Icon, label, onClick, isActive }: RailButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
            "hover:bg-primary/10 active:scale-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isActive && "bg-primary/10 text-primary"
          )}
          aria-label={label}
        >
          <Icon className="w-5 h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function CollapsibleSidePanel({ 
  children, 
  className,
  onCollapseChange 
}: CollapsibleSidePanelProps) {
  // Initialize from session storage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  // Persist collapse state to session storage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, String(isCollapsed));
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleRailClick = () => {
    setIsCollapsed(false);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        data-sidebar-panel
        className={cn(
          "hidden lg:flex flex-col absolute top-4 left-4 bottom-4",
          "bg-white/50 dark:bg-card/40 backdrop-blur-xl",
          "border border-white/40 dark:border-white/10",
          "rounded-2xl shadow-2xl z-40 pointer-events-auto",
          "transition-all duration-250 ease-out",
          isCollapsed ? "w-16" : "w-80",
          className
        )}
        role="complementary"
        aria-label="Map controls panel"
        aria-expanded={!isCollapsed}
      >
        {/* Collapse Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleCollapse}
              className={cn(
                "absolute -right-3 top-16 z-50",
                "w-6 h-12 rounded-full",
                "bg-primary text-primary-foreground",
                "flex items-center justify-center",
                "shadow-lg hover:shadow-xl",
                "hover:scale-105 active:scale-95",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={isCollapsed ? "Expand Panel" : "Collapse Panel"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            {isCollapsed ? "Expand Panel" : "Collapse Panel"}
          </TooltipContent>
        </Tooltip>

        {/* Collapsed State - Icon Rail */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-4 px-2 gap-2 animate-fade-in">
            <RailButton 
              icon={Search} 
              label="Search" 
              onClick={handleRailClick}
            />
            <RailButton 
              icon={Filter} 
              label="Filters" 
              onClick={handleRailClick}
            />
            <RailButton 
              icon={Layers} 
              label="Map Layers" 
              onClick={handleRailClick}
            />
          </div>
        )}

        {/* Expanded State - Full Content */}
        {!isCollapsed && (
          <div className="flex flex-col flex-1 overflow-hidden animate-fade-in">
            {children}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

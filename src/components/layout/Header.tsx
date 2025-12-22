import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Home, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import sdiLogo from '@/assets/sdi-logo.png';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Smart Map', path: '/map', icon: MapPin },
  { name: 'About', path: '/about', icon: Info },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full glass-strong",
      isMapPage ? "h-12 md:h-auto" : ""
    )}>
      <div className="container mx-auto px-3 md:px-4">
        <div className={cn(
          "flex items-center justify-between",
          isMapPage ? "h-12 md:h-16" : "h-16"
        )}>
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={sdiLogo} 
              alt="Abu Dhabi Spatial Data" 
              className={cn(
                "w-auto object-contain",
                isMapPage ? "h-8 md:h-12" : "h-12"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-1 rounded-lg hover:bg-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Restructured with clear zones */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl z-50 animate-fade-in">
          {/* Zone 1: Brand confirmation + Close - Already in header bar */}
          
          {/* Zone 2: Navigation */}
          <nav className="px-4 py-4">
            {/* Navigation Items with clear separation */}
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.name}>
                    {/* Divider before non-first inactive items */}
                    {index > 0 && !isActive && (
                      <div className="h-px bg-border mb-2" />
                    )}
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[48px] w-full",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-secondary bg-secondary/30"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="ml-auto text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>
          
          {/* Bottom safe area padding */}
          <div className="h-2 bg-gradient-to-b from-card to-transparent" />
        </div>
      )}
    </header>
  );
}

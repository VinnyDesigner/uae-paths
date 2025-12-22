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
      // Compact height on mobile for map page
      isMapPage ? "h-12 md:h-auto" : ""
    )}>
      <div className="container mx-auto px-3 md:px-4">
        <div className={cn(
          "flex items-center justify-between",
          isMapPage ? "h-12 md:h-16" : "h-16"
        )}>
          {/* Logo - Smaller on mobile map page */}
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
            className="md:hidden p-2 -mr-1 rounded-lg hover:bg-secondary transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in z-50">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all min-h-[48px]",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

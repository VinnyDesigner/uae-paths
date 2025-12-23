import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Home, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import sdiLogo from '@/assets/sdi-logo.png';
import { MobileNavSheet } from './MobileNavSheet';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Smart Map', path: '/map', icon: MapPin },
  { name: 'About', path: '/about', icon: Info },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMapPage = location.pathname === '/map';
  const isHomePage = location.pathname === '/';
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Measure header height for sheet positioning
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [isMapPage]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header 
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isHomePage 
            ? "bg-transparent backdrop-blur-md border-b border-white/10"
            : "glass-strong",
          isMapPage ? "h-12 md:h-auto" : ""
        )}
      >
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
                  isMapPage ? "h-8 md:h-12" : "h-12",
                  isHomePage ? "brightness-0 invert" : ""
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
                      isHomePage ? [
                        isActive
                          ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      ] : [
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      ]
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
              className={cn(
                "md:hidden p-2 -mr-1 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center",
                isHomePage ? [
                  mobileMenuOpen 
                    ? "bg-white/20 text-white" 
                    : "text-white/80 hover:bg-white/10"
                ] : [
                  mobileMenuOpen 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                ]
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-sheet"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className={cn(
                  "w-5 h-5",
                  isHomePage ? "text-white" : "text-foreground"
                )} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sheet - Positioned below header */}
      <MobileNavSheet 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        topOffset={headerHeight}
      />
    </>
  );
}

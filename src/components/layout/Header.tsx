import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import dgeLogo from '@/assets/dge-logo.png';
import sdiLogo from '@/assets/sdi-logo.png';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Smart Map', path: '/map', icon: MapPin },
  { name: 'About', path: '/about', icon: Info },
];

export function Header() {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <>
      {/* Main Header - Sticky, Blue Glass, Always Visible */}
      <header 
        className={cn(
          "sticky top-0 z-[var(--z-header)] w-full",
          "bg-[linear-gradient(90deg,rgba(8,40,72,0.85),rgba(9,80,120,0.70))]",
          "backdrop-blur-[12px] saturate-[160%]",
          "border-b border-white/12"
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          {/* Desktop Layout (>= 1024px): 3-column grid with centered nav */}
          <div className={cn(
            "hidden lg:grid grid-cols-[auto_1fr_auto] items-center gap-6",
            isMapPage ? "h-16" : "h-[72px]"
          )}>
            {/* DGE Logo - Left (15-20% larger) */}
            <Link to="/" className="flex items-center shrink-0">
              <img 
                src={dgeLogo} 
                alt="Department of Government Enablement" 
                className={cn(
                  "w-auto object-contain",
                  isMapPage ? "h-11" : "h-12"
                )}
              />
            </Link>

            {/* Centered Navigation Pills with glass effect */}
            <nav className="flex items-center justify-center">
              <div className="glass-nav flex items-center p-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap relative",
                        isActive
                          ? [
                            "bg-gradient-to-r from-[#0D385D] via-[#0D385D] to-[#0D385D] text-white",
                            "shadow-[0_8px_24px_-6px_rgba(13,56,93,0.5)]",
                            "before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:opacity-0 before:hover:opacity-100 before:transition-opacity"
                          ]
                          : "text-white/75 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-4 h-4" strokeWidth={2} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* SDI Logo - Right (15-20% larger) */}
            <Link to="/" className="flex items-center justify-end shrink-0">
              <img 
                src={sdiLogo} 
                alt="Abu Dhabi Spatial Data Infrastructure" 
                className={cn(
                  "w-auto object-contain brightness-0 invert",
                  isMapPage ? "h-9" : "h-10"
                )}
              />
            </Link>
          </div>

          {/* Tablet Layout (768px - 1023px): Single row with logos + centered nav */}
          <div className={cn(
            "hidden md:grid lg:hidden grid-cols-[auto_1fr_auto] items-center gap-4",
            isMapPage ? "h-14" : "h-16"
          )}>
            {/* DGE Logo - Left */}
            <Link to="/" className="flex items-center">
              <img 
                src={dgeLogo} 
                alt="Department of Government Enablement" 
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Centered Navigation Pills with glass effect */}
            <nav className="flex items-center justify-center">
              <div className="glass-nav flex items-center p-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap relative",
                        isActive
                          ? [
                            "bg-gradient-to-r from-[#0D385D] via-[#0D385D] to-[#0D385D] text-white",
                            "shadow-[0_6px_20px_-4px_rgba(13,56,93,0.5)]"
                          ]
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-4 h-4" strokeWidth={2} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* SDI Logo - Right */}
            <Link to="/" className="flex items-center justify-end">
              <img 
                src={sdiLogo} 
                alt="Abu Dhabi Spatial Data Infrastructure" 
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>

          {/* Mobile Layout (< 768px): Logos + centered compact nav */}
          <div className={cn(
            "grid md:hidden grid-cols-[auto_1fr_auto] items-center gap-2",
            isMapPage ? "h-14" : "h-16"
          )}>
            {/* DGE Logo - Left */}
            <Link to="/" className="flex items-center">
              <img 
                src={dgeLogo} 
                alt="Department of Government Enablement" 
                className="h-6 w-auto object-contain"
              />
            </Link>

            {/* Centered Navigation Pills - Compact with glass effect */}
            <nav className="flex items-center justify-center overflow-hidden">
              <div className="glass-nav flex items-center p-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 min-h-[36px] relative",
                        isActive
                          ? [
                            "bg-gradient-to-r from-[#0D385D] via-[#0D385D] to-[#0D385D] text-white",
                            "shadow-[0_4px_16px_-4px_rgba(13,56,93,0.5)]"
                          ]
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-4 h-4" strokeWidth={2} />
                      <span className="hidden xs:inline">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* SDI Logo - Right */}
            <Link to="/" className="flex items-center justify-end">
              <img 
                src={sdiLogo} 
                alt="Abu Dhabi Spatial Data Infrastructure" 
                className="h-6 w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

import { useState, useEffect } from 'react';
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
      {/* Main Header */}
      <header 
        className={cn(
          "sticky top-0 z-[1000] w-full",
          "bg-[rgba(6,20,40,0.55)] backdrop-blur-[14px] saturate-[160%]",
          "border-b border-white/10"
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          {/* Desktop Layout (>= 1024px): 3-column grid with centered nav */}
          <div className={cn(
            "hidden lg:grid grid-cols-[auto_1fr_auto] items-center gap-4",
            isMapPage ? "h-14" : "h-[72px]"
          )}>
            {/* DGE Logo - Left */}
            <Link to="/" className="flex items-center shrink-0">
              <img 
                src={dgeLogo} 
                alt="Department of Government Enablement" 
                className={cn(
                  "w-auto object-contain",
                  isMapPage ? "h-7" : "h-8"
                )}
              />
            </Link>

            {/* Centered Navigation Pills */}
            <nav className="flex items-center justify-center">
              <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-[#00D4FF] via-[#2B6CFF] to-[#7C3AED] text-white shadow-lg shadow-[#2B6CFF]/25"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* SDI Logo - Right */}
            <Link to="/" className="flex items-center justify-end shrink-0">
              <img 
                src={sdiLogo} 
                alt="Abu Dhabi Spatial Data Infrastructure" 
                className={cn(
                  "w-auto object-contain brightness-0 invert",
                  isMapPage ? "h-7" : "h-8"
                )}
              />
            </Link>
          </div>

          {/* Tablet Layout (768px - 1023px): Logos only in main header */}
          <div className={cn(
            "hidden md:flex lg:hidden items-center justify-between",
            isMapPage ? "h-12" : "h-14"
          )}>
            {/* DGE Logo - Left */}
            <Link to="/" className="flex items-center">
              <img 
                src={dgeLogo} 
                alt="Department of Government Enablement" 
                className="h-6 w-auto object-contain"
              />
            </Link>

            {/* SDI Logo - Right */}
            <Link to="/" className="flex items-center">
              <img 
                src={sdiLogo} 
                alt="Abu Dhabi Spatial Data Infrastructure" 
                className="h-6 w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>

          {/* Mobile Layout (< 768px): Logos only in main header */}
          <div className={cn(
            "flex md:hidden items-center justify-between",
            isMapPage ? "h-11" : "h-12"
          )}>
            {/* DGE Logo - Left */}
            <Link to="/" className="flex items-center">
              <img 
                src={dgeLogo} 
                alt="Department of Government Enablement" 
                className="h-5 w-auto object-contain"
              />
            </Link>

            {/* SDI Logo - Right */}
            <Link to="/" className="flex items-center">
              <img 
                src={sdiLogo} 
                alt="Abu Dhabi Spatial Data Infrastructure" 
                className="h-5 w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Secondary Nav Bar for Tablet (768px - 1023px) */}
      <div className={cn(
        "hidden md:flex lg:hidden sticky z-[999]",
        "bg-[rgba(6,20,40,0.45)] backdrop-blur-[12px] saturate-[150%]",
        "border-b border-white/8",
        isMapPage ? "top-12" : "top-14"
      )}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center h-12">
            <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#00D4FF] via-[#2B6CFF] to-[#7C3AED] text-white shadow-lg shadow-[#2B6CFF]/25"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Secondary Tab Bar for Mobile (< 768px) */}
      <div className={cn(
        "flex md:hidden sticky z-[999]",
        "bg-[rgba(6,20,40,0.50)] backdrop-blur-[12px] saturate-[150%]",
        "border-b border-white/8",
        isMapPage ? "top-11" : "top-12"
      )}>
        <div className="w-full px-2">
          <nav className="flex items-center justify-center h-[52px] gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[44px]",
                    "transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#00D4FF] via-[#2B6CFF] to-[#7C3AED] text-white shadow-lg shadow-[#2B6CFF]/25"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

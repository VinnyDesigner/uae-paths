import { Link } from 'react-router-dom';
import { MapPin, Heart, GraduationCap, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  variant?: 'light' | 'dark';
}

export function Footer({ variant = 'light' }: FooterProps) {
  const isDark = variant === 'dark';

  return (
    <footer className={cn(
      "relative border-t overflow-hidden",
      isDark 
        ? "bg-footer-immersive border-white/10" 
        : "bg-footer-gradient border-border/20"
    )}>
      {/* Subtle pattern */}
      <div className={cn(
        "absolute inset-0 bg-topo-pattern pointer-events-none",
        isDark ? "opacity-[0.04]" : "opacity-[0.025]"
      )} />
      
      {/* Top glow separator */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent",
        isDark ? "via-cyan-400/30" : "via-[hsl(200_100%_55%/0.25)]"
      )} />

      <div className="container mx-auto px-4 py-14 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105",
                isDark 
                  ? "bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-[0_0_30px_-5px_hsl(188_100%_50%/0.3)]"
                  : "gradient-primary shadow-soft group-hover:shadow-elevated"
              )}>
                <MapPin className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "font-heading font-bold text-lg",
                  isDark ? "text-white" : "text-foreground"
                )}>SDI Smart Map</span>
                <span className={cn(
                  "text-xs font-medium tracking-wide",
                  isDark ? "text-white/40" : "text-muted-foreground/60"
                )}>Abu Dhabi Spatial Data Infrastructure</span>
              </div>
            </Link>
            <p className={cn(
              "text-sm max-w-xs leading-relaxed",
              isDark ? "text-white/50" : "text-muted-foreground/65"
            )}>
              Discover healthcare and education facilities across the UAE with our intelligent, interactive map platform.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className={cn(
              "font-heading font-bold text-sm mb-6 uppercase tracking-wider",
              isDark ? "text-white/80" : "text-foreground"
            )}>Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/map" className={cn(
                  "text-sm transition-colors inline-flex items-center gap-3 group",
                  isDark 
                    ? "text-white/50 hover:text-cyan-400"
                    : "text-muted-foreground/70 hover:text-primary"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    isDark 
                      ? "bg-cyan-400/30 group-hover:bg-cyan-400"
                      : "bg-primary/25 group-hover:bg-primary"
                  )} />
                  Smart Map
                </Link>
              </li>
              <li>
                <Link to="/about" className={cn(
                  "text-sm transition-colors inline-flex items-center gap-3 group",
                  isDark 
                    ? "text-white/50 hover:text-cyan-400"
                    : "text-muted-foreground/70 hover:text-primary"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    isDark 
                      ? "bg-cyan-400/30 group-hover:bg-cyan-400"
                      : "bg-primary/25 group-hover:bg-primary"
                  )} />
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://sdi.gov.abudhabi/sdi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm transition-colors inline-flex items-center gap-3 group",
                    isDark 
                      ? "text-white/50 hover:text-cyan-400"
                      : "text-muted-foreground/70 hover:text-primary"
                  )}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    isDark 
                      ? "bg-cyan-400/30 group-hover:bg-cyan-400"
                      : "bg-primary/25 group-hover:bg-primary"
                  )} />
                  SDI Portal
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Data Themes Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className={cn(
              "font-heading font-bold text-sm mb-6 uppercase tracking-wider",
              isDark ? "text-white/80" : "text-foreground"
            )}>Data Themes</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/map" 
                  className={cn(
                    "text-sm transition-colors inline-flex items-center gap-3 group",
                    isDark 
                      ? "text-white/50 hover:text-blue-400"
                      : "text-muted-foreground/70 hover:text-healthcare"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-soft",
                    isDark 
                      ? "bg-blue-500/15 group-hover:bg-blue-500/25"
                      : "bg-healthcare/8 group-hover:bg-healthcare/15"
                  )}>
                    <Heart className={cn(
                      "w-4 h-4",
                      isDark ? "text-blue-400" : "text-healthcare"
                    )} />
                  </span>
                  Healthcare & Wellness
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className={cn(
                    "text-sm transition-colors inline-flex items-center gap-3 group",
                    isDark 
                      ? "text-white/50 hover:text-cyan-400"
                      : "text-muted-foreground/70 hover:text-education"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-soft",
                    isDark 
                      ? "bg-cyan-500/15 group-hover:bg-cyan-500/25"
                      : "bg-education/8 group-hover:bg-education/15"
                  )}>
                    <GraduationCap className={cn(
                      "w-4 h-4",
                      isDark ? "text-cyan-400" : "text-education"
                    )} />
                  </span>
                  Education
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={cn(
          "mt-14 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4",
          isDark ? "border-white/10" : "border-border/25"
        )}>
          <p className={cn(
            "text-xs font-medium",
            isDark ? "text-white/40" : "text-muted-foreground/55"
          )}>
            © {new Date().getFullYear()} SDI Smart Map • Abu Dhabi Spatial Data Infrastructure
          </p>
          <p className={cn(
            "text-xs flex items-center gap-2",
            isDark ? "text-white/30" : "text-muted-foreground/45"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              isDark ? "bg-cyan-400/50" : "bg-success/50"
            )} />
            UAE Open Data Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}

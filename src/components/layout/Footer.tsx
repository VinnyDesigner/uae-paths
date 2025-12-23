import { Link } from 'react-router-dom';
import { MapPin, Heart, GraduationCap, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Subtle map pattern background */}
      <div className="absolute inset-0 bg-topo-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/95 to-card/90 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 md:py-14 relative">
        {/* Light divider at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand - Wider column */}
          <div className="md:col-span-5 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow duration-300">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-base text-foreground">SDI Smart Map</span>
                <span className="text-[11px] text-muted-foreground/60">Abu Dhabi Spatial Data Infrastructure</span>
              </div>
            </Link>
            <p className="text-muted-foreground/70 text-sm max-w-xs leading-relaxed">
              Discover healthcare and education facilities across the UAE with our interactive smart map.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-heading font-semibold text-sm text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/map" className="text-sm text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  Smart Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://sdi.gov.abudhabi/sdi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  SDI Portal
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Data Themes */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="font-heading font-semibold text-sm text-foreground mb-4">Data Themes</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/map" 
                  className="text-sm text-muted-foreground/70 hover:text-healthcare transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-6 h-6 rounded-lg bg-healthcare/10 flex items-center justify-center group-hover:bg-healthcare/20 transition-colors">
                    <Heart className="w-3.5 h-3.5 text-healthcare" />
                  </span>
                  Healthcare & Wellness
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className="text-sm text-muted-foreground/70 hover:text-education transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-6 h-6 rounded-lg bg-education/10 flex items-center justify-center group-hover:bg-education/20 transition-colors">
                    <GraduationCap className="w-3.5 h-3.5 text-education" />
                  </span>
                  Education
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} SDI Smart Map • Abu Dhabi Spatial Data Infrastructure
          </p>
          <p className="text-xs text-muted-foreground/50 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success/60 animate-pulse" />
            UAE Open Data Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { MapPin, Heart, GraduationCap, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-footer-gradient border-t border-border/20 overflow-hidden">
      {/* Subtle topo pattern */}
      <div className="absolute inset-0 bg-topo-pattern opacity-[0.025] pointer-events-none" />
      
      {/* Top glow separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(200_100%_55%/0.25)] to-transparent" />

      <div className="container mx-auto px-4 py-14 md:py-18 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-300 group-hover:scale-105">
                <MapPin className="w-5.5 h-5.5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-foreground">SDI Smart Map</span>
                <span className="text-xs text-muted-foreground/60 font-medium tracking-wide">Abu Dhabi Spatial Data Infrastructure</span>
              </div>
            </Link>
            <p className="text-muted-foreground/65 text-sm max-w-xs leading-relaxed">
              Discover healthcare and education facilities across the UAE with our intelligent, interactive map platform.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-heading font-bold text-sm text-foreground mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/map" className="text-sm text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/25 group-hover:bg-primary transition-colors" />
                  Smart Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/25 group-hover:bg-primary transition-colors" />
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://sdi.gov.abudhabi/sdi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-3 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/25 group-hover:bg-primary transition-colors" />
                  SDI Portal
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Data Themes Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="font-heading font-bold text-sm text-foreground mb-6 uppercase tracking-wider">Data Themes</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/map" 
                  className="text-sm text-muted-foreground/70 hover:text-healthcare transition-colors inline-flex items-center gap-3 group"
                >
                  <span className="w-8 h-8 rounded-lg bg-healthcare/8 flex items-center justify-center group-hover:bg-healthcare/15 transition-all duration-300 shadow-soft">
                    <Heart className="w-4 h-4 text-healthcare" />
                  </span>
                  Healthcare & Wellness
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className="text-sm text-muted-foreground/70 hover:text-education transition-colors inline-flex items-center gap-3 group"
                >
                  <span className="w-8 h-8 rounded-lg bg-education/8 flex items-center justify-center group-hover:bg-education/15 transition-all duration-300 shadow-soft">
                    <GraduationCap className="w-4 h-4 text-education" />
                  </span>
                  Education
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/25 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/55 font-medium">
            © {new Date().getFullYear()} SDI Smart Map • Abu Dhabi Spatial Data Infrastructure
          </p>
          <p className="text-xs text-muted-foreground/45 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success/50 animate-pulse" />
            UAE Open Data Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}

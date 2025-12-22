import { Link } from 'react-router-dom';
import { MapPin, Heart, GraduationCap, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-sm text-foreground">SDI Smart Map</span>
                <span className="text-[10px] text-muted-foreground/70">Abu Dhabi Spatial Data Infrastructure</span>
              </div>
            </Link>
            <p className="text-muted-foreground/70 text-xs max-w-sm leading-relaxed">
              Discover healthcare and education facilities across the UAE with our interactive smart map.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-medium text-sm text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/map" className="text-xs text-muted-foreground/70 hover:text-primary transition-colors">
                  Smart Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs text-muted-foreground/70 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://sdi.gov.abudhabi/sdi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  SDI Portal <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Themes */}
          <div>
            <h4 className="font-heading font-medium text-sm text-foreground mb-3">Data Themes</h4>
            <ul className="space-y-1.5">
              <li>
                <span className="text-xs text-muted-foreground/70 inline-flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-healthcare" />
                  Healthcare
                </span>
              </li>
              <li>
                <span className="text-xs text-muted-foreground/70 inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-education" />
                  Education
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[10px] text-muted-foreground/60">
            © {new Date().getFullYear()} SDI Smart Map • Abu Dhabi Spatial Data Infrastructure
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            UAE Open Data Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}

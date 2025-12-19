import { Link } from 'react-router-dom';
import { MapPin, Heart, GraduationCap, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-foreground">SDI Smart Map</span>
                <span className="text-xs text-muted-foreground">Abu Dhabi Spatial Data Infrastructure</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Discover healthcare and education facilities across the UAE with our interactive smart map, 
              powered by official SDI OpenData.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/map" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Smart Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://sdi.gov.abudhabi/sdi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  SDI Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Themes */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Data Themes</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Heart className="w-4 h-4 text-healthcare" />
                  Healthcare & Wellness
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-education" />
                  Education
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SDI Smart Map. Data sourced from Abu Dhabi Spatial Data Infrastructure.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for public use • UAE Open Data Initiative
          </p>
        </div>
      </div>
    </footer>
  );
}

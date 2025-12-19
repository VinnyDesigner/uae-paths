import { Link } from "react-router-dom";
import { MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-primary" />
        </div>

        {/* Title */}
        <h1 className="font-heading text-4xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to exploring the map.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/map">
              <MapPin className="w-4 h-4 mr-2" />
              Open Map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

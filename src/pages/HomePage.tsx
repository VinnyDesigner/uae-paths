import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Layers, 
  Heart, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmartSearch } from '@/components/search/SmartSearch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Natural language queries to find facilities quickly',
  },
  {
    icon: Layers,
    title: 'Thematic Layers',
    description: 'Toggle healthcare and education data layers',
  },
  {
    icon: MapPin,
    title: 'Location-Based',
    description: 'Find facilities near you with distance filters',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Fully responsive design for any device',
  },
];

const themes = [
  {
    icon: Heart,
    title: 'Healthcare & Wellness',
    description: 'Hospitals, clinics, pharmacies, ambulance stations and more',
    colorClass: 'healthcare',
    layers: ['Hospitals', 'Clinics', 'Diagnostic Centers', 'Pharmacies', 'Healthcare Centers', 'Ambulance Stations'],
  },
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Schools, nurseries, and professional development centers',
    colorClass: 'education',
    layers: ['Public Schools', 'Private Schools', 'Charter Schools', 'Nurseries', 'POD Centers'],
  },
];

export default function HomePage() {
  const handleSearch = (query: string) => {
    // Navigate to map with search query
    window.location.href = `/map?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6 animate-fade-up">
                <Globe className="w-4 h-4" />
                <span>Abu Dhabi Spatial Data Infrastructure</span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-up delay-100">
                Smart Map for{' '}
                <span className="text-gradient">Daily Life</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
                Find healthcare and education services across the UAE with our interactive, 
                map-based experience powered by official SDI OpenData.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8 animate-fade-up delay-300">
                <SmartSearch onSearch={handleSearch} size="large" />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-400">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/map">
                    <MapPin className="w-5 h-5 mr-2" />
                    Open Smart Map
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/map">
                    <Layers className="w-5 h-5 mr-2" />
                    Browse Public Layers
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
                Built for Everyday Needs
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Access essential services with clarity and speed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Themes Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
                Explore Data Themes
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover healthcare and education facilities through categorized thematic layers
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {themes.map((theme, index) => {
                const isHealthcare = theme.colorClass === 'healthcare';
                return (
                  <div
                    key={theme.title}
                    className={cn(
                      "relative rounded-2xl p-8 overflow-hidden animate-fade-up",
                      isHealthcare ? "bg-healthcare-light" : "bg-education-light"
                    )}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                        isHealthcare ? "gradient-healthcare" : "gradient-education"
                      )}
                    >
                      <theme.icon
                        className={cn(
                          "w-8 h-8",
                          isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                      {theme.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {theme.description}
                    </p>

                    {/* Layers */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {theme.layers.map((layer) => (
                        <span
                          key={layer}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full text-xs font-medium text-foreground border border-border"
                        >
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          {layer}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      variant={isHealthcare ? "healthcare" : "education"}
                      asChild
                    >
                      <Link to="/map">
                        Explore {theme.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Official Government Data
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                All data is sourced from the Abu Dhabi Spatial Data Infrastructure (SDI) OpenData platform, 
                ensuring accuracy and reliability for your daily needs.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/map">
                  Start Exploring
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

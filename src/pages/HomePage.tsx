import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmartSearch } from '@/components/search/SmartSearch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  {
    icon: Heart,
    title: 'Healthcare & Wellness',
    colorClass: 'healthcare',
    chips: ['Hospitals', 'Clinics', 'Pharmacies'],
  },
  {
    icon: GraduationCap,
    title: 'Education',
    colorClass: 'education',
    chips: ['Schools', 'Nurseries', 'POD Centers'],
  },
];

export default function HomePage() {
  const handleSearch = (query: string) => {
    window.location.href = `/map?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Unified Hero + Category Section - Single Viewport Block */}
        <section className="relative min-h-[calc(100vh-var(--header-height))] flex flex-col overflow-hidden">
          {/* Premium Geo Background - Continuous Canvas */}
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-contour-lines" />
          <div className="absolute inset-0 bg-grid-subtle" />
          <div className="absolute inset-0 bg-hero-radial" />
          
          {/* Concentrated glow behind search area */}
          <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-search-glow pointer-events-none animate-glow-pulse" />
          
          {/* Decorative location pin - very subtle */}
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2 opacity-[0.025] pointer-events-none">
            <MapPin className="w-48 h-48 text-primary" strokeWidth={0.5} />
          </div>

          {/* Bottom fade transition to footer */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-hero-bottom-fade pointer-events-none" />

          <div className="container mx-auto px-4 relative flex-1 flex flex-col justify-center py-8 md:py-12 lg:py-16">
            {/* Max width container - unified alignment */}
            <div className="max-w-[800px] mx-auto w-full">
              
              {/* Hero Title - Two-tone with strong hierarchy */}
              <div className="text-center mb-5 md:mb-6 animate-fade-up">
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                  <span className="text-foreground">Smart Map</span>
                  <span className="text-muted-foreground/50 font-semibold"> for Daily Life</span>
                </h1>
                {/* Gradient underline accent */}
                <div className="mt-3 flex justify-center">
                  <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 animate-subtle-pulse" />
                </div>
              </div>

              {/* Subtitle - Refined */}
              <p className="text-center text-sm md:text-base lg:text-lg text-muted-foreground/70 max-w-md mx-auto mb-6 md:mb-8 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* Premium Search Bar */}
              <div className="animate-fade-up delay-200 mb-8 md:mb-10" style={{ overflow: 'visible' }}>
                <div 
                  className={cn(
                    "relative glass-search rounded-2xl md:rounded-[20px]",
                    "transition-all duration-300 ease-out",
                    "p-1.5",
                    "hover:scale-[1.01]"
                  )}
                  style={{ overflow: 'visible' }}
                >
                  <SmartSearch 
                    onSearch={handleSearch} 
                    size="large"
                    placeholder="Search healthcare, schools, or wellness centers…"
                  />
                </div>
                
                {/* Microcopy - subtle helper */}
                <div className="mt-4 text-center animate-fade-up delay-300">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur-sm border border-border/20 rounded-full text-xs text-muted-foreground/60 shadow-soft">
                    <kbd className="font-mono text-[10px] font-medium bg-secondary/70 text-muted-foreground px-1.5 py-0.5 rounded border border-border/40">Enter</kbd>
                    <span>to explore the map</span>
                  </span>
                </div>
              </div>

              {/* Subtle divider before categories */}
              <div className="flex justify-center mb-6 md:mb-8 animate-fade-up delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-border/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-border/50" />
                </div>
              </div>

              {/* Explore By Category - Integrated into Hero */}
              <div className="animate-fade-up delay-400">
                {/* Section Header - Compact */}
                <div className="text-center mb-5">
                  <h2 className="font-heading text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1">
                    Explore by Category
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground/60">
                    Choose a theme to start exploring
                  </p>
                </div>

                {/* Category Cards - Compact container */}
                <div className="glass-section rounded-2xl p-4 md:p-5 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <div
                          key={category.title}
                          className={cn(
                            "relative rounded-xl p-4 md:p-5 transition-all duration-300 border overflow-hidden group cursor-pointer",
                            "shadow-soft hover:shadow-elevated hover:-translate-y-0.5",
                            isHealthcare 
                              ? "bg-gradient-to-br from-healthcare-light/80 via-healthcare-light/50 to-white/40 border-healthcare/10 hover:border-healthcare/20" 
                              : "bg-gradient-to-br from-education-light/80 via-education-light/50 to-white/40 border-education/10 hover:border-education/20"
                          )}
                        >
                          {/* Hover gradient overlay */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400",
                            isHealthcare 
                              ? "bg-gradient-to-br from-healthcare/5 via-transparent to-transparent"
                              : "bg-gradient-to-br from-education/5 via-transparent to-transparent"
                          )} />

                          {/* Icon + Title - Compact row */}
                          <div className="flex items-center gap-3 mb-3 relative">
                            {/* Icon container */}
                            <div
                              className={cn(
                                "w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                                "shadow-soft ring-1 ring-white/40",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare ? "gradient-healthcare" : "gradient-education"
                              )}
                            >
                              <category.icon
                                className={cn(
                                  "w-5 h-5 md:w-5.5 md:h-5.5 drop-shadow-sm",
                                  isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                                )}
                              />
                            </div>
                            <h3 className="font-heading text-sm md:text-base font-bold text-foreground leading-tight">
                              {category.title}
                            </h3>
                          </div>

                          {/* Chips - Smaller refined pills */}
                          <div className="flex flex-wrap gap-1.5 mb-4 relative">
                            {category.chips.map((chip) => (
                              <span
                                key={chip}
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full text-[11px] font-medium",
                                  "bg-white/70 backdrop-blur-sm",
                                  "border shadow-sm transition-colors duration-200",
                                  isHealthcare 
                                    ? "border-healthcare/10 text-healthcare hover:border-healthcare/20" 
                                    : "border-education/10 text-education hover:border-education/20"
                                )}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>

                          {/* CTA Button - Compact */}
                          <Button
                            variant={isHealthcare ? "healthcare" : "education"}
                            size="sm"
                            asChild
                            className={cn(
                              "w-full h-9 transition-all duration-300 group/btn relative",
                              "shadow-soft hover:shadow-elevated font-semibold text-sm"
                            )}
                          >
                            <Link to="/map">
                              <span>Explore Map</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
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
        {/* Hero Section - Premium Geo UI with Map-Themed Background */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
          {/* Layered Geo Background - Refined */}
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-location-rings" />
          <div className="absolute inset-0 bg-grid-pattern" />
          <div className="absolute inset-0 bg-radial-glow" />
          
          {/* Concentrated glow behind search area */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-search-glow pointer-events-none animate-glow-pulse" />
          
          {/* Decorative location pin accent */}
          <div className="absolute left-1/2 top-[20%] -translate-x-1/2 opacity-[0.03] pointer-events-none">
            <MapPin className="w-64 h-64 text-primary animate-float" strokeWidth={0.5} />
          </div>

          <div className="container mx-auto px-4 relative">
            {/* Max width container - aligned with category section */}
            <div className="max-w-[800px] mx-auto text-center">
              
              {/* Two-tone Title with Strong Hierarchy */}
              <div className="mb-6 animate-fade-up">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  <span className="text-foreground">Smart Map</span>
                  <span className="text-muted-foreground/50 font-semibold"> for Daily Life</span>
                </h1>
                {/* Gradient underline accent */}
                <div className="mt-4 flex justify-center">
                  <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 animate-subtle-pulse" />
                </div>
              </div>

              {/* Subtitle - Refined */}
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground/70 max-w-lg mx-auto mb-10 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* Premium Search Bar Container */}
              <div className="animate-fade-up delay-200" style={{ overflow: 'visible' }}>
                <div 
                  className={cn(
                    "relative glass-search rounded-2xl md:rounded-[22px]",
                    "transition-all duration-300 ease-out",
                    "p-1.5 md:p-2",
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
                
                {/* Microcopy - Refined */}
                <div className="mt-5 animate-fade-up delay-300">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/60 backdrop-blur-sm border border-border/30 rounded-full text-xs text-muted-foreground/60 shadow-soft">
                    <kbd className="font-mono text-[10px] font-medium bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">Enter</kbd>
                    <span>to explore the map</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Category - Elevated Section */}
        <section className="relative py-20 md:py-24 lg:py-28 overflow-hidden">
          {/* Background treatment - destination block feel */}
          <div className="absolute inset-0 bg-section-gradient" />
          <div className="absolute inset-0 bg-topo-pattern opacity-50" />
          
          {/* Soft radial accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(210_50%_95%_/_0.5)_0%,_transparent_70%)]" />
          
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-14">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 animate-fade-up">
                Explore by Category
              </h2>
              <p className="text-sm md:text-base text-muted-foreground/70 max-w-md mx-auto mb-6 animate-fade-up delay-100">
                Choose a theme to start exploring public facilities
              </p>
              <div className="flex justify-center animate-fade-up delay-200">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
              </div>
            </div>

            {/* Category Cards Container - Same max-width as search */}
            <div className="max-w-[800px] mx-auto animate-fade-up delay-300">
              <div className="glass-section rounded-3xl p-6 md:p-8 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {categories.map((category) => {
                    const isHealthcare = category.colorClass === 'healthcare';
                    return (
                      <div
                        key={category.title}
                        className={cn(
                          "relative rounded-2xl p-5 md:p-6 transition-all duration-300 border overflow-hidden group cursor-pointer",
                          "shadow-soft hover:shadow-elevated hover:-translate-y-1",
                          isHealthcare 
                            ? "bg-gradient-to-br from-healthcare-light/90 via-healthcare-light/60 to-white/50 border-healthcare/10 hover:border-healthcare/20" 
                            : "bg-gradient-to-br from-education-light/90 via-education-light/60 to-white/50 border-education/10 hover:border-education/20"
                        )}
                      >
                        {/* Hover gradient overlay */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400",
                          isHealthcare 
                            ? "bg-gradient-to-br from-healthcare/5 via-transparent to-transparent"
                            : "bg-gradient-to-br from-education/5 via-transparent to-transparent"
                        )} />

                        {/* Icon + Title */}
                        <div className="flex items-center gap-4 mb-5 relative">
                          {/* Premium icon container */}
                          <div
                            className={cn(
                              "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                              "shadow-soft ring-1 ring-white/40",
                              "transition-all duration-300 group-hover:scale-105 group-hover:shadow-elevated",
                              isHealthcare ? "gradient-healthcare" : "gradient-education"
                            )}
                          >
                            <category.icon
                              className={cn(
                                "w-6 h-6 md:w-7 md:h-7 drop-shadow-sm",
                                isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                              )}
                            />
                          </div>
                          <h3 className="font-heading text-base md:text-lg font-bold text-foreground leading-tight">
                            {category.title}
                          </h3>
                        </div>

                        {/* Chips - Refined pill style */}
                        <div className="flex flex-wrap gap-2 mb-6 relative">
                          {category.chips.map((chip) => (
                            <span
                              key={chip}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                "bg-white/80 backdrop-blur-sm",
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

                        {/* CTA Button - Consistent styling */}
                        <Button
                          variant={isHealthcare ? "healthcare" : "education"}
                          size="default"
                          asChild
                          className={cn(
                            "w-full h-11 transition-all duration-300 group/btn relative",
                            "shadow-soft hover:shadow-elevated font-semibold"
                          )}
                        >
                          <Link to="/map">
                            <span>Explore Map</span>
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
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
import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight,
  MapPin,
  Send,
  Navigation
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
        {/* Hero Section - Geo UI with Map-Themed Background */}
        <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
          {/* Layered Geo Background */}
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-topo-pattern opacity-100" />
          <div className="absolute inset-0 bg-grid-pattern opacity-100" />
          <div className="absolute inset-0 bg-radial-glow" />
          
          {/* Additional radial highlight behind search */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 w-[800px] h-[500px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative">
            {/* Max width aligned with category section */}
            <div className="max-w-[720px] mx-auto text-center">
              {/* Title with strong hierarchy */}
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[52px] font-bold mb-4 animate-fade-up leading-tight">
                <span className="text-foreground">Smart Map</span>
                <span className="text-muted-foreground/60 font-medium"> for Daily Life</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground/70 max-w-md mx-auto mb-8 animate-fade-up delay-100 leading-relaxed">
                Find healthcare and education services across the UAE
              </p>

              {/* Animated accent line */}
              <div className="flex justify-center mb-10 animate-fade-up delay-200">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-subtle-pulse" />
              </div>

              {/* Premium Search Bar - Geo Style */}
              <div className="animate-fade-up delay-300" style={{ overflow: 'visible' }}>
                <div 
                  className={cn(
                    "relative glass-search rounded-[20px] md:rounded-[22px]",
                    "shadow-elevated hover:shadow-glow-lg",
                    "transition-all duration-300",
                    "p-1.5 md:p-2"
                  )}
                  style={{ overflow: 'visible' }}
                >
                  <SmartSearch 
                    onSearch={handleSearch} 
                    size="large"
                    placeholder="Search healthcare, schools, or wellness centers…"
                  />
                </div>
                
                {/* Microcopy */}
                <p className="text-xs text-muted-foreground/50 mt-4 animate-fade-up delay-400 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/60 rounded-full">
                    <kbd className="text-[10px] font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">Enter</kbd>
                    <span>to explore the map</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Category - Premium Geo UI */}
        <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-secondary/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            {/* Section Title */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 animate-fade-up">
                Explore by Category
              </h2>
              <p className="text-sm md:text-base text-muted-foreground/70 max-w-md mx-auto mb-5 animate-fade-up delay-100">
                Choose a theme to start exploring public facilities
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto rounded-full animate-line-grow delay-200" />
            </div>

            {/* Glass container - Same max-width as search (720px) */}
            <div className="max-w-[720px] mx-auto animate-fade-up delay-300">
              <div className="bg-card/50 backdrop-blur-md rounded-3xl p-5 md:p-8 border border-border/20 shadow-elevated">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {categories.map((category) => {
                    const isHealthcare = category.colorClass === 'healthcare';
                    return (
                      <div
                        key={category.title}
                        className={cn(
                          "rounded-2xl p-5 md:p-6 transition-all duration-300 border",
                          "shadow-soft hover:shadow-elevated hover:-translate-y-1",
                          "group cursor-pointer relative overflow-hidden",
                          isHealthcare 
                            ? "bg-gradient-to-br from-healthcare-light/80 to-healthcare-light/40 border-healthcare/10 hover:border-healthcare/25" 
                            : "bg-gradient-to-br from-education-light/80 to-education-light/40 border-education/10 hover:border-education/25"
                        )}
                      >
                        {/* Subtle gradient overlay */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                          isHealthcare 
                            ? "bg-gradient-to-br from-healthcare/5 to-transparent"
                            : "bg-gradient-to-br from-education/5 to-transparent"
                        )} />

                        {/* Icon + Title row */}
                        <div className="flex items-center gap-4 mb-5 relative">
                          {/* Premium icon badge with shadow */}
                          <div
                            className={cn(
                              "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                              "shadow-soft ring-1 ring-white/30",
                              "transition-transform duration-300 group-hover:scale-105",
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

                        {/* Chips - Consistent styling */}
                        <div className="flex flex-wrap gap-2 mb-6 relative">
                          {category.chips.map((chip) => (
                            <span
                              key={chip}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium",
                                "bg-background/70 backdrop-blur-sm",
                                "border shadow-sm",
                                isHealthcare 
                                  ? "border-healthcare/15 text-healthcare" 
                                  : "border-education/15 text-education"
                              )}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button - Consistent height and style */}
                        <Button
                          variant={isHealthcare ? "healthcare" : "education"}
                          size="default"
                          asChild
                          className={cn(
                            "w-full h-11 transition-all duration-300 group/btn relative",
                            "shadow-soft hover:shadow-elevated"
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

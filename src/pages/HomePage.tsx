import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight,
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
        {/* Unified Hero Section - Clean Ambient Design */}
        <section className="relative min-h-[calc(100vh-var(--header-height))] flex flex-col overflow-hidden">
          
          {/* === AMBIENT BACKGROUND LAYERS (z-index 0) === */}
          {/* Base gradient wash */}
          <div className="absolute inset-0 bg-hero-ambient -z-10" />
          
          {/* Soft wave contours - GIS inspired */}
          <div className="absolute inset-0 bg-wave-contours -z-10" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid-subtle -z-10" />
          
          {/* Soft radial glow behind heading - ambient light */}
          <div className="absolute inset-0 bg-heading-glow -z-10" />
          
          {/* Search area glow - concentrated */}
          <div className="absolute inset-0 bg-search-ambient -z-10" />
          
          {/* Decorative accent glows */}
          <div className="absolute inset-0 bg-accent-glow-tl -z-10" />
          <div className="absolute inset-0 bg-accent-glow-br -z-10" />

          {/* Bottom fade transition */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-hero-bottom-fade pointer-events-none" />

          {/* === HERO CONTENT (z-index 1+) === */}
          <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-8 md:py-10 lg:py-12">
            <div className="max-w-[900px] mx-auto w-full">
              
              {/* Hero Heading - Clear hierarchy, no overlap */}
              <div className="text-center mb-5 md:mb-6 animate-fade-up">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight">
                  <span className="text-foreground">Smart Map</span>
                  <br className="sm:hidden" />
                  <span className="text-gradient-blue font-bold"> for Daily Life</span>
                </h1>
              </div>

              {/* Subheading - Calm, readable */}
              <p className="text-center text-sm md:text-base lg:text-lg text-muted-foreground/75 max-w-md mx-auto mb-8 md:mb-10 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === DOMINANT SEARCH BAR === */}
              <div className="animate-fade-up delay-200 mb-8 md:mb-10" style={{ overflow: 'visible' }}>
                <div className="max-w-[720px] mx-auto">
                  <div 
                    className={cn(
                      "relative glass-search rounded-2xl md:rounded-[24px]",
                      "transition-all duration-300 ease-out",
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
                </div>
              </div>

              {/* Subtle divider with glowing dot */}
              <div className="flex justify-center mb-6 md:mb-8 animate-fade-up delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/15" />
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[hsl(190_100%_50%)] to-[hsl(210_100%_55%)] shadow-[0_0_8px_hsl(200_100%_55%/0.4)]" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/15" />
                </div>
              </div>

              {/* === EXPLORE BY CATEGORY - INTEGRATED === */}
              <div className="animate-fade-up delay-400">
                {/* Section Header */}
                <div className="text-center mb-5 md:mb-6">
                  <h2 className="font-heading text-base md:text-lg lg:text-xl font-semibold text-foreground/90">
                    Explore by Category
                  </h2>
                  {/* Glowing divider line */}
                  <div className="flex justify-center mt-2.5">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-[hsl(200_100%_55%/0.4)] to-transparent" />
                  </div>
                </div>

                {/* Category Cards Container - Floating glass panel */}
                <div className="max-w-[760px] mx-auto glass-section rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <div
                          key={category.title}
                          className={cn(
                            "relative rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300 border overflow-hidden group cursor-pointer",
                            "glass-card hover:-translate-y-1",
                            isHealthcare 
                              ? "gradient-healthcare-card border-healthcare/10 hover:border-healthcare/20" 
                              : "gradient-education-card border-education/10 hover:border-education/20"
                          )}
                        >
                          {/* Hover glow overlay */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none",
                            isHealthcare 
                              ? "bg-gradient-to-br from-healthcare/10 via-transparent to-transparent"
                              : "bg-gradient-to-br from-education/10 via-transparent to-transparent"
                          )} />

                          {/* Icon + Title row */}
                          <div className="flex items-center gap-3 mb-3 relative">
                            {/* Elevated icon container with glow */}
                            <div
                              className={cn(
                                "w-12 h-12 md:w-13 md:h-13 rounded-xl flex items-center justify-center flex-shrink-0",
                                "shadow-soft ring-1 ring-white/60",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare 
                                  ? "gradient-healthcare group-hover:shadow-[0_4px_20px_-4px_hsl(208_88%_25%/0.35)]" 
                                  : "gradient-education group-hover:shadow-[0_4px_20px_-4px_hsl(200_100%_50%/0.35)]"
                              )}
                            >
                              <category.icon
                                className={cn(
                                  "w-5 h-5 md:w-6 md:h-6 drop-shadow-sm",
                                  isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                                )}
                              />
                            </div>
                            <h3 className="font-heading text-sm md:text-base font-bold text-foreground leading-tight">
                              {category.title}
                            </h3>
                          </div>

                          {/* Chips - refined pills */}
                          <div className="flex flex-wrap gap-1.5 mb-4 relative">
                            {category.chips.map((chip) => (
                              <span
                                key={chip}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-[11px] font-medium",
                                  "bg-white/90 backdrop-blur-sm",
                                  "border shadow-sm transition-all duration-200",
                                  isHealthcare 
                                    ? "border-healthcare/12 text-healthcare hover:border-healthcare/30 hover:bg-healthcare/5" 
                                    : "border-education/12 text-education hover:border-education/30 hover:bg-education/5"
                                )}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>

                          {/* CTA Button - Gradient styling */}
                          <Button
                            variant={isHealthcare ? "healthcare" : "education"}
                            size="sm"
                            asChild
                            className={cn(
                              "w-full h-10 transition-all duration-300 group/btn relative",
                              "shadow-soft font-semibold text-sm rounded-xl",
                              isHealthcare 
                                ? "hover:shadow-[0_6px_24px_-4px_hsl(208_88%_25%/0.35)]" 
                                : "hover:shadow-[0_6px_24px_-4px_hsl(200_100%_50%/0.35)]"
                            )}
                          >
                            <Link to="/map">
                              <span>Explore Map</span>
                              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
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

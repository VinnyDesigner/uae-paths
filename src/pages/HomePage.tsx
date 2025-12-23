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
        {/* Unified Hero Section - Clean Ambient Design (no gradient blocks over text) */}
        <section className="relative min-h-[calc(100vh-var(--header-height))] flex flex-col overflow-hidden">
          
          {/* === AMBIENT BACKGROUND LAYERS (z-index -10, never overlaps content) === */}
          {/* Base gradient wash - full-width ambient */}
          <div className="absolute inset-0 bg-hero-ambient" style={{ zIndex: -10 }} />
          
          {/* Soft contour lines - GIS/topo inspired */}
          <div className="absolute inset-0 bg-wave-contours" style={{ zIndex: -9 }} />
          
          {/* Subtle grid pattern - map tiles hint */}
          <div className="absolute inset-0 bg-grid-subtle" style={{ zIndex: -8 }} />
          
          {/* Soft radial glow behind heading - ambient light only */}
          <div className="absolute inset-0 bg-heading-glow" style={{ zIndex: -7 }} />
          
          {/* Concentrated search area glow */}
          <div className="absolute inset-0 bg-search-ambient" style={{ zIndex: -6 }} />
          
          {/* Decorative ambient glows (subtle) */}
          <div className="absolute inset-0 bg-accent-glow-tl" style={{ zIndex: -5 }} />
          <div className="absolute inset-0 bg-accent-glow-br" style={{ zIndex: -5 }} />

          {/* Bottom fade transition to footer */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-hero-bottom-fade pointer-events-none" style={{ zIndex: -4 }} />

          {/* === HERO CONTENT (z-index 1+, always above backgrounds) === */}
          <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-6 md:py-8 lg:py-10">
            <div className="max-w-[920px] mx-auto w-full">
              
              {/* Hero Heading - Strong hierarchy, fully readable */}
              <div className="text-center mb-4 md:mb-5 animate-fade-up">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                  <span className="text-[hsl(215_30%_18%)]">Smart Map</span>
                  <br className="sm:hidden" />
                  <span className="text-gradient-blue glow-underline ml-1 sm:ml-2"> for Daily Life</span>
                </h1>
              </div>

              {/* Subheading - Calm, readable, neutral gray-blue */}
              <p className="text-center text-sm md:text-base lg:text-lg text-[hsl(210_15%_45%)] max-w-lg mx-auto mb-7 md:mb-9 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === DOMINANT SEARCH BAR (Primary Visual Focus) === */}
              <div className="animate-fade-up delay-200 mb-7 md:mb-9" style={{ overflow: 'visible' }}>
                <div className="max-w-[760px] mx-auto w-[92%] md:w-[65%]">
                  <div 
                    className={cn(
                      "relative glass-search rounded-2xl md:rounded-[26px]",
                      "transition-all duration-300 ease-out",
                      "p-1.5 md:p-2.5"
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

              {/* === EXPLORE BY CATEGORY - INTEGRATED INTO HERO === */}
              <div className="animate-fade-up delay-300">
                {/* Section Header - smaller than main heading */}
                <div className="text-center mb-4 md:mb-5">
                  <h2 className="font-heading text-sm md:text-base lg:text-lg font-semibold text-[hsl(215_20%_35%)]">
                    Explore by Category
                  </h2>
                  {/* Subtle glowing divider line */}
                  <div className="flex justify-center mt-2">
                    <div className="h-[2px] w-16 md:w-20 rounded-full bg-gradient-to-r from-transparent via-[hsl(200_100%_55%/0.35)] to-transparent" />
                  </div>
                </div>

                {/* Category Cards Container - Soft floating glass panel */}
                <div className="max-w-[720px] mx-auto glass-section rounded-2xl md:rounded-3xl p-3.5 md:p-4 lg:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <div
                          key={category.title}
                          className={cn(
                            "relative rounded-xl md:rounded-2xl p-3.5 md:p-4 transition-all duration-300 border overflow-hidden group cursor-pointer",
                            "glass-card hover:-translate-y-0.5",
                            isHealthcare 
                              ? "gradient-healthcare-card border-[hsl(208_60%_88%/0.5)] hover:border-[hsl(208_60%_80%/0.6)]" 
                              : "gradient-education-card border-[hsl(200_70%_88%/0.5)] hover:border-[hsl(200_70%_80%/0.6)]"
                          )}
                        >
                          {/* Hover glow overlay */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl md:rounded-2xl",
                            isHealthcare 
                              ? "bg-gradient-to-br from-[hsl(208_70%_50%/0.06)] via-transparent to-transparent"
                              : "bg-gradient-to-br from-[hsl(200_100%_55%/0.06)] via-transparent to-transparent"
                          )} />

                          {/* Icon + Title row */}
                          <div className="flex items-center gap-2.5 mb-2.5 relative">
                            {/* Elevated icon container with glow */}
                            <div
                              className={cn(
                                "w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                                "shadow-soft ring-1 ring-white/70",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare 
                                  ? "gradient-healthcare group-hover:shadow-[0_4px_18px_-4px_hsl(208_88%_25%/0.3)]" 
                                  : "gradient-education group-hover:shadow-[0_4px_18px_-4px_hsl(200_100%_50%/0.3)]"
                              )}
                            >
                              <category.icon
                                className={cn(
                                  "w-4.5 h-4.5 md:w-5 md:h-5 drop-shadow-sm",
                                  isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                                )}
                              />
                            </div>
                            <h3 className="font-heading text-sm md:text-base font-bold text-[hsl(215_25%_20%)] leading-tight">
                              {category.title}
                            </h3>
                          </div>

                          {/* Chips - refined pills with soft borders */}
                          <div className="flex flex-wrap gap-1.5 mb-3 relative">
                            {category.chips.map((chip) => (
                              <span
                                key={chip}
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-medium",
                                  "bg-white/95 backdrop-blur-sm",
                                  "border shadow-sm transition-all duration-200",
                                  isHealthcare 
                                    ? "border-[hsl(208_50%_85%/0.7)] text-[hsl(208_70%_30%)] hover:border-[hsl(208_60%_75%)] hover:bg-[hsl(208_50%_97%)]" 
                                    : "border-[hsl(200_60%_85%/0.7)] text-[hsl(200_80%_35%)] hover:border-[hsl(200_70%_75%)] hover:bg-[hsl(200_60%_97%)]"
                                )}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>

                          {/* CTA Button - Gradient styling with arrow animation */}
                          <Button
                            variant={isHealthcare ? "healthcare" : "education"}
                            size="sm"
                            asChild
                            className={cn(
                              "w-full h-9 transition-all duration-300 group/btn relative",
                              "shadow-soft font-semibold text-xs md:text-sm rounded-lg",
                              isHealthcare 
                                ? "hover:shadow-[0_5px_20px_-4px_hsl(208_88%_25%/0.3)]" 
                                : "hover:shadow-[0_5px_20px_-4px_hsl(200_100%_50%/0.3)]"
                            )}
                          >
                            <Link to="/map">
                              <span>Explore Map</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
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

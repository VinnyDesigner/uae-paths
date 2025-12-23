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
        {/* Unified Hero Section - Premium Geo-UI */}
        <section className="relative min-h-[calc(100vh-var(--header-height))] flex flex-col overflow-hidden">
          
          {/* === PREMIUM MAP-INSPIRED BACKGROUND === */}
          {/* Base gradient wash */}
          <div className="absolute inset-0 bg-hero-gradient" />
          
          {/* Flowing contour lines */}
          <div className="absolute inset-0 bg-contour-lines" />
          
          {/* Radial wave rings - centered */}
          <div className="absolute inset-0 bg-radial-waves" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid-subtle" />
          
          {/* Light streaks accent */}
          <div className="absolute inset-0 bg-light-streaks" />
          
          {/* Primary radial glow behind search */}
          <div className="absolute inset-0 bg-hero-radial" />
          
          {/* Concentrated glow behind search bar */}
          <div className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-search-glow pointer-events-none animate-glow-pulse" />
          
          {/* Bright blue accent glow - top right */}
          <div className="absolute top-20 right-[15%] w-[300px] h-[300px] rounded-full bg-[hsl(200_100%_60%/0.06)] blur-3xl pointer-events-none" />
          
          {/* Soft accent glow - bottom left */}
          <div className="absolute bottom-40 left-[10%] w-[250px] h-[250px] rounded-full bg-[hsl(210_100%_55%/0.05)] blur-3xl pointer-events-none" />

          {/* Bottom fade transition */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-hero-bottom-fade pointer-events-none" />

          {/* === HERO CONTENT === */}
          <div className="container mx-auto px-4 relative flex-1 flex flex-col justify-center py-6 md:py-8 lg:py-10">
            <div className="max-w-[820px] mx-auto w-full">
              
              {/* Hero Heading - Strong hierarchy */}
              <div className="text-center mb-4 md:mb-5 animate-fade-up">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
                  <span className="text-foreground">Smart Map</span>
                  <br className="sm:hidden" />
                  <span className="text-gradient-blue font-bold"> for Daily Life</span>
                </h1>
                {/* Animated glow underline */}
                <div className="mt-3 md:mt-4 flex justify-center">
                  <div className="relative h-1 w-24 md:w-32 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(190_100%_50%)] via-[hsl(210_100%_55%)] to-[hsl(240_70%_55%)] animate-subtle-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>

              {/* Subheading */}
              <p className="text-center text-sm md:text-base lg:text-lg text-muted-foreground/70 max-w-lg mx-auto mb-6 md:mb-8 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === PREMIUM SEARCH BAR === */}
              <div className="animate-fade-up delay-200 mb-6 md:mb-8" style={{ overflow: 'visible' }}>
                <div 
                  className={cn(
                    "relative glass-search rounded-2xl md:rounded-[22px]",
                    "transition-all duration-300 ease-out",
                    "p-1.5 md:p-2",
                    "hover:scale-[1.008]"
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

              {/* Subtle divider */}
              <div className="flex justify-center mb-5 md:mb-6 animate-fade-up delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-px bg-gradient-to-r from-transparent to-border/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/25" />
                  <div className="w-10 h-px bg-gradient-to-l from-transparent to-border/40" />
                </div>
              </div>

              {/* === EXPLORE BY CATEGORY - INTEGRATED === */}
              <div className="animate-fade-up delay-400">
                {/* Section Header */}
                <div className="text-center mb-4 md:mb-5">
                  <h2 className="font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-1">
                    Explore by Category
                  </h2>
                  {/* Glowing divider line */}
                  <div className="flex justify-center mt-2">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  </div>
                </div>

                {/* Category Cards Container */}
                <div className="glass-section rounded-2xl md:rounded-3xl p-3 md:p-4 lg:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <div
                          key={category.title}
                          className={cn(
                            "relative rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300 border overflow-hidden group cursor-pointer",
                            "glass-card hover:shadow-elevated hover:-translate-y-1",
                            isHealthcare 
                              ? "gradient-healthcare-card border-healthcare/8 hover:border-healthcare/15" 
                              : "gradient-education-card border-education/8 hover:border-education/15"
                          )}
                        >
                          {/* Hover glow overlay */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none",
                            isHealthcare 
                              ? "bg-gradient-to-br from-healthcare/8 via-transparent to-transparent"
                              : "bg-gradient-to-br from-education/8 via-transparent to-transparent"
                          )} />

                          {/* Icon + Title row */}
                          <div className="flex items-center gap-3 mb-3 relative">
                            {/* Elevated icon container */}
                            <div
                              className={cn(
                                "w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                "shadow-soft ring-1 ring-white/50",
                                "transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-blue",
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

                          {/* Chips - refined pills */}
                          <div className="flex flex-wrap gap-1.5 mb-4 relative">
                            {category.chips.map((chip) => (
                              <span
                                key={chip}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-[11px] font-medium",
                                  "bg-white/80 backdrop-blur-sm",
                                  "border shadow-sm transition-all duration-200",
                                  isHealthcare 
                                    ? "border-healthcare/10 text-healthcare hover:border-healthcare/25 hover:bg-healthcare/5" 
                                    : "border-education/10 text-education hover:border-education/25 hover:bg-education/5"
                                )}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <Button
                            variant={isHealthcare ? "healthcare" : "education"}
                            size="sm"
                            asChild
                            className={cn(
                              "w-full h-10 transition-all duration-300 group/btn relative",
                              "shadow-soft hover:shadow-elevated font-semibold text-sm rounded-xl",
                              isHealthcare ? "shadow-glow-blue/0 hover:shadow-[0_4px_20px_-4px_hsl(208_88%_25%/0.3)]" : "hover:shadow-[0_4px_20px_-4px_hsl(200_100%_50%/0.3)]"
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

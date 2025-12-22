import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight
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
        {/* Hero Section - Search Focused */}
        <section className="relative py-16 md:py-24 lg:py-28 bg-hero-gradient" style={{ overflow: 'visible' }}>
          <div className="absolute inset-0 pointer-events-none bg-plus-pattern opacity-20" />

          <div className="container mx-auto px-4 relative" style={{ overflow: 'visible' }}>
            <div className="max-w-3xl mx-auto text-center" style={{ overflow: 'visible' }}>
              {/* Title with contrast */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-fade-up">
                <span className="text-foreground">Smart Map</span>
                <span className="text-muted-foreground/70 font-medium"> for Daily Life</span>
              </h1>

              {/* Subtitle - Compact */}
              <p className="text-xs md:text-sm text-muted-foreground/70 max-w-sm mx-auto mb-10 animate-fade-up delay-100 leading-relaxed">
                Find healthcare and education services across the UAE
              </p>

              {/* Search Container - Tight spacing */}
              <div className="max-w-2xl mx-auto animate-fade-up delay-200 mb-6" style={{ overflow: 'visible' }}>
                <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-3 md:p-4 shadow-lg border border-border/40" style={{ overflow: 'visible' }}>
                  <SmartSearch onSearch={handleSearch} size="large" />
                </div>
                <p className="text-xs text-muted-foreground/50 mt-3 animate-fade-up delay-300">
                  Press Enter to explore the map
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Category - Premium Visual Section */}
        <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/40 to-secondary/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            {/* Section Title - Premium styling */}
            <div className="text-center mb-10 md:mb-14">
              <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">
                Explore by Category
              </h2>
              <p className="text-sm md:text-base text-muted-foreground/70 max-w-md mx-auto mb-4">
                Choose a theme to start exploring public facilities
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto rounded-full" />
            </div>

            {/* Glass container behind cards */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-background/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/30 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  {categories.map((category) => {
                    const isHealthcare = category.colorClass === 'healthcare';
                    return (
                      <div
                        key={category.title}
                        className={cn(
                          "rounded-2xl p-6 transition-all duration-300 border border-border/20",
                          "shadow-md hover:shadow-xl hover:-translate-y-1",
                          "group cursor-pointer",
                          isHealthcare 
                            ? "bg-healthcare-light hover:border-healthcare/30" 
                            : "bg-education-light hover:border-education/30"
                        )}
                      >
                        {/* Icon + Title row */}
                        <div className="flex items-center gap-4 mb-5">
                          {/* Premium icon badge */}
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                              "shadow-md ring-1 ring-white/20",
                              isHealthcare ? "gradient-healthcare" : "gradient-education"
                            )}
                          >
                            <category.icon
                              className={cn(
                                "w-6 h-6 drop-shadow-sm",
                                isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                              )}
                            />
                          </div>
                          <h3 className="font-heading text-base md:text-lg font-bold text-foreground leading-tight">
                            {category.title}
                          </h3>
                        </div>

                        {/* Chips - Secondary visual */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {category.chips.slice(0, 3).map((chip) => (
                            <span
                              key={chip}
                              className="px-3 py-1.5 bg-background/60 backdrop-blur-sm rounded-full text-xs text-muted-foreground border border-border/30 shadow-sm"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button - Premium polish */}
                        <Button
                          variant={isHealthcare ? "healthcare" : "education"}
                          size="default"
                          asChild
                          className="w-full h-11 transition-all duration-300 hover:shadow-md group/btn"
                        >
                          <Link to="/map">
                            Explore
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

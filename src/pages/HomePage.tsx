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
        <section className="relative py-14 md:py-20 lg:py-24 overflow-hidden bg-hero-gradient">
          <div className="absolute inset-0 pointer-events-none bg-plus-pattern opacity-30" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              {/* Title with contrast */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3 animate-fade-up">
                <span className="text-foreground">Smart Map</span>
                <span className="text-muted-foreground font-medium"> for Daily Life</span>
              </h1>

              {/* Subtitle - Compact */}
              <p className="text-sm md:text-base text-muted-foreground/80 max-w-md mx-auto mb-10 animate-fade-up delay-100 leading-snug">
                Find healthcare and education services across the UAE
              </p>

              {/* Search Bar - Primary Action with helper text */}
              <div className="max-w-2xl mx-auto animate-fade-up delay-200">
                <SmartSearch onSearch={handleSearch} size="large" />
                <p className="text-xs text-muted-foreground/60 mt-3 animate-fade-up delay-300">
                  Press Enter to explore the map
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Category - Refined */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground text-center mb-10">
              Explore by Category
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
              {categories.map((category) => {
                const isHealthcare = category.colorClass === 'healthcare';
                return (
                  <div
                    key={category.title}
                    className={cn(
                      "rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                      isHealthcare ? "bg-healthcare-light" : "bg-education-light"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                          isHealthcare ? "gradient-healthcare" : "gradient-education"
                        )}
                      >
                        <category.icon
                          className={cn(
                            "w-4 h-4",
                            isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                          )}
                        />
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-foreground">
                        {category.title}
                      </h3>
                    </div>

                    {/* Chips - Lighter */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {category.chips.map((chip) => (
                        <span
                          key={chip}
                          className="px-2 py-0.5 bg-background/60 rounded-full text-xs text-muted-foreground"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* CTA - Subtle hover */}
                    <Button
                      variant={isHealthcare ? "healthcare" : "education"}
                      size="sm"
                      asChild
                      className="w-full transition-all duration-200 hover:shadow-sm"
                    >
                      <Link to="/map">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

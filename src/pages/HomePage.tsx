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

              {/* Search Container - Overflow visible for suggestions */}
              <div className="max-w-2xl mx-auto animate-fade-up delay-200 mb-16" style={{ overflow: 'visible' }}>
                <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-3 md:p-4 shadow-lg border border-border/40" style={{ overflow: 'visible' }}>
                  <SmartSearch onSearch={handleSearch} size="large" />
                </div>
                <p className="text-xs text-muted-foreground/50 mt-4 animate-fade-up delay-300">
                  Press Enter to explore the map
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Category - Rich Visual Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
          <div className="container mx-auto px-4">
            {/* Section Title with accent */}
            <div className="text-center mb-12">
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground mb-2">
                Explore by Category
              </h2>
              <div className="w-12 h-0.5 bg-primary/40 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              {categories.map((category) => {
                const isHealthcare = category.colorClass === 'healthcare';
                return (
                  <div
                    key={category.title}
                    className={cn(
                      "rounded-2xl p-5 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-border/30",
                      isHealthcare ? "bg-healthcare-light" : "bg-education-light"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {/* Icon with soft container */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                          isHealthcare ? "gradient-healthcare" : "gradient-education"
                        )}
                      >
                        <category.icon
                          className={cn(
                            "w-5 h-5",
                            isHealthcare ? "text-healthcare-foreground" : "text-education-foreground"
                          )}
                        />
                      </div>
                      <h3 className="font-heading text-sm font-bold text-foreground">
                        {category.title}
                      </h3>
                    </div>

                    {/* Chips - Soft backgrounds with spacing */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {category.chips.slice(0, 3).map((chip) => (
                        <span
                          key={chip}
                          className="px-2.5 py-1 bg-background/70 rounded-full text-xs text-muted-foreground/80 border border-border/20"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* CTA - With arrow animation */}
                    <Button
                      variant={isHealthcare ? "healthcare" : "education"}
                      size="sm"
                      asChild
                      className="w-full transition-all duration-200 hover:shadow-sm group"
                    >
                      <Link to="/map">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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

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
        <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-hero-gradient">
          <div className="absolute inset-0 pointer-events-none bg-plus-pattern opacity-50" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
                Smart Map for <span className="text-accent">Daily Life</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8 animate-fade-up delay-100">
                Find healthcare and education services across the UAE
              </p>

              {/* Search Bar - Primary Action */}
              <div className="max-w-2xl mx-auto animate-fade-up delay-200">
                <SmartSearch onSearch={handleSearch} size="large" />
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Category - Compact */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground text-center mb-8">
              Explore by Category
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {categories.map((category) => {
                const isHealthcare = category.colorClass === 'healthcare';
                return (
                  <div
                    key={category.title}
                    className={cn(
                      "rounded-xl p-5 transition-all hover:shadow-md",
                      isHealthcare ? "bg-healthcare-light" : "bg-education-light"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
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
                      <h3 className="font-heading font-semibold text-foreground">
                        {category.title}
                      </h3>
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {category.chips.map((chip) => (
                        <span
                          key={chip}
                          className="px-2.5 py-1 bg-card rounded-full text-xs font-medium text-muted-foreground border border-border"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      variant={isHealthcare ? "healthcare" : "education"}
                      size="sm"
                      asChild
                      className="w-full"
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

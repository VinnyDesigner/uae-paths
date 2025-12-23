import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
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

const aiSuggestionChips = [
  { text: 'Nearest hospital', icon: '🏥' },
  { text: 'Emergency hospital', icon: '🚑' },
  { text: 'Schools near me', icon: '🎓' },
];

export default function HomePage() {
  const handleSearch = (query: string) => {
    window.location.href = `/map?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* === IMMERSIVE HERO SECTION === */}
        <section className="relative min-h-[calc(100vh-var(--header-height))] flex flex-col overflow-hidden">
          
          {/* === LAYERED IMMERSIVE BACKGROUND === */}
          {/* Base gradient - deep blue → cyan → teal */}
          <div className="absolute inset-0 bg-hero-immersive" />
          
          {/* Indigo glow - left side */}
          <div className="absolute inset-0 bg-indigo-glow-left" />
          
          {/* Teal glow - right side */}
          <div className="absolute inset-0 bg-teal-glow-right" />
          
          {/* Cyan glow - center (behind search) */}
          <div className="absolute inset-0 bg-cyan-glow-center" />
          
          {/* Flowing wave lines - topographic pattern */}
          <div className="absolute inset-0 bg-wave-flow" />
          
          {/* Subtle pulse glow animation */}
          <div className="absolute inset-0 bg-pulse-glow" />
          
          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-noise-overlay pointer-events-none" />

          {/* Bottom fade transition */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-hero-bottom-fade pointer-events-none" />

          {/* === HERO CONTENT === */}
          <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-8 md:py-12">
            <div className="max-w-[960px] mx-auto w-full">
              
              {/* Main Heading */}
              <div className="text-center mb-5 md:mb-6 animate-fade-up">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight">
                  <span className="text-white drop-shadow-lg">Smart Map</span>
                  <br className="sm:hidden" />
                  <span className="text-gradient-blue glow-underline ml-1 sm:ml-3"> for Daily Life</span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-center text-sm md:text-base lg:text-lg text-white/60 max-w-md mx-auto mb-8 md:mb-10 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === PRIMARY SEARCH BAR === */}
              <div className="animate-fade-up delay-200 mb-6 md:mb-8">
                <div className="max-w-[780px] mx-auto w-[95%] md:w-[70%]">
                  <div 
                    className={cn(
                      "relative glass-search-dark rounded-2xl md:rounded-3xl",
                      "transition-all duration-300 ease-out",
                      "p-1.5 md:p-2"
                    )}
                  >
                    <SmartSearch 
                      onSearch={handleSearch} 
                      size="large"
                      placeholder="Search healthcare, schools, or wellness centers…"
                      variant="dark"
                    />
                  </div>
                </div>
              </div>

              {/* AI Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14 animate-fade-up delay-300">
                {aiSuggestionChips.map((chip) => (
                  <button
                    key={chip.text}
                    onClick={() => handleSearch(chip.text)}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-full",
                      "bg-white/8 backdrop-blur-md border border-white/10",
                      "text-white/70 text-xs md:text-sm font-medium",
                      "hover:bg-white/12 hover:border-cyan-400/30 hover:text-white",
                      "transition-all duration-200"
                    )}
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.text}</span>
                  </button>
                ))}
              </div>

              {/* === EXPLORE BY CATEGORY - MERGED INTO HERO === */}
              <div className="animate-fade-up delay-400">
                {/* Section Header */}
                <div className="text-center mb-5 md:mb-6">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-400/70" />
                    <h2 className="font-heading text-sm md:text-base font-semibold text-white/80 tracking-wide">
                      Explore by Category
                    </h2>
                    <Sparkles className="w-4 h-4 text-cyan-400/70" />
                  </div>
                  {/* Animated glowing divider */}
                  <div className="flex justify-center">
                    <div className="h-[2px] w-20 md:w-24 rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-glow-pulse" />
                  </div>
                </div>

                {/* Category Cards Container */}
                <div className="max-w-[780px] mx-auto glass-panel-dark rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <div
                          key={category.title}
                          className={cn(
                            "relative rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300 overflow-hidden group cursor-pointer",
                            "glass-card-dark"
                          )}
                        >
                          {/* Gradient accent overlay on hover */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl md:rounded-2xl",
                            isHealthcare 
                              ? "bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"
                              : "bg-gradient-to-br from-cyan-400/10 via-transparent to-transparent"
                          )} />

                          {/* Icon + Title */}
                          <div className="flex items-center gap-3 mb-3 relative">
                            {/* Glowing icon container */}
                            <div
                              className={cn(
                                "w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare 
                                  ? "bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_0_25px_-5px_hsl(220_80%_50%/0.4)]" 
                                  : "bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-[0_0_25px_-5px_hsl(188_100%_50%/0.4)]"
                              )}
                            >
                              <category.icon
                                className="w-5 h-5 md:w-5.5 md:h-5.5 text-white drop-shadow-md"
                              />
                            </div>
                            <h3 className="font-heading text-base md:text-lg font-bold text-white leading-tight">
                              {category.title}
                            </h3>
                          </div>

                          {/* Pills / Chips */}
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 relative">
                            {category.chips.map((chip) => (
                              <span
                                key={chip}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-medium",
                                  "bg-white/8 backdrop-blur-sm border border-white/10",
                                  "text-white/70 hover:bg-white/12 hover:text-white transition-all duration-200"
                                )}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <Button
                            size="sm"
                            asChild
                            className={cn(
                              "w-full h-10 transition-all duration-300 group/btn relative overflow-hidden",
                              "font-semibold text-xs md:text-sm rounded-xl border-0",
                              isHealthcare 
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-[0_8px_30px_-8px_hsl(220_80%_50%/0.4)]" 
                                : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 shadow-[0_8px_30px_-8px_hsl(188_100%_50%/0.4)]"
                            )}
                          >
                            <Link to="/map" className="flex items-center justify-center gap-2">
                              <span className="text-white">Explore Map</span>
                              <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5" />
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

      <Footer variant="dark" />
    </div>
  );
}

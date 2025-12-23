import { useState } from 'react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (query: string) => {
    window.location.href = `/map?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* === IMMERSIVE HERO SECTION - Fits in one screen === */}
        <section className="relative min-h-[calc(100vh-64px)] flex flex-col overflow-hidden">
          
          {/* === LAYERED IMMERSIVE BACKGROUND === */}
          <div className="absolute inset-0 bg-hero-immersive" />
          <div className="absolute inset-0 bg-indigo-glow-left" />
          <div className="absolute inset-0 bg-teal-glow-right" />
          <div className="absolute inset-0 bg-cyan-glow-center" />
          <div className="absolute inset-0 bg-wave-flow" />
          <div className="absolute inset-0 bg-pulse-glow" />
          <div className="absolute inset-0 bg-noise-overlay pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-hero-bottom-fade pointer-events-none" />

          {/* === HERO CONTENT === */}
          <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-6 md:py-8">
            <div className="max-w-[900px] mx-auto w-full">
              
              {/* Main Heading - Gradient TEXT only on "for Daily Life", NO boxes */}
              <div className="text-center mb-3 animate-fade-up relative z-10">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                  <span 
                    className="text-white drop-shadow-lg"
                    style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}
                  >Smart Map</span>
                  <br className="sm:hidden" />
                  <span 
                    className="ml-2 sm:ml-3 inline-block"
                    style={{
                      background: 'linear-gradient(90deg, #00D1FF 0%, #2B6BFF 50%, #7C3AED 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      filter: 'drop-shadow(0 4px 20px rgba(0, 209, 255, 0.35)) drop-shadow(0 0 40px rgba(43, 107, 255, 0.25))'
                    }}
                  >for Daily Life</span>
                </h1>
              </div>

              {/* Subheading - high contrast */}
              <p className="text-center text-sm md:text-base text-[rgba(255,255,255,0.78)] max-w-md mx-auto mb-5 md:mb-6 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === PRIMARY SEARCH BAR - Liquid Glass Style === */}
              <div className="animate-fade-up delay-200 mb-5 md:mb-6">
                <div className="mx-auto" style={{ width: 'min(860px, 92vw)' }}>
                  <SmartSearch 
                    onSearch={handleSearch} 
                    size="large"
                    placeholder="Search healthcare, schools, or wellness centers…"
                    variant="dark"
                    onOpenChange={setIsSearchOpen}
                  />
                </div>
              </div>

              {/* AI Suggestion Chips - Hidden when search is open */}
              {!isSearchOpen && (
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-5 md:mb-6 animate-fade-up delay-300">
                  {aiSuggestionChips.map((chip) => (
                    <button
                      key={chip.text}
                      onClick={() => handleSearch(chip.text)}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-full",
                        "bg-white/8 backdrop-blur-md border border-white/12",
                        "text-white/75 text-xs md:text-sm font-medium",
                        "hover:bg-white/14 hover:border-cyan-400/35 hover:text-white",
                        "transition-all duration-200"
                      )}
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* === EXPLORE BY CATEGORY - MERGED INTO HERO === */}
              <div className={cn(
                "animate-fade-up delay-400 transition-all duration-300",
                isSearchOpen ? "mt-4" : ""
              )}>
                {/* Section Header with glowing divider */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                    <h2 className="font-heading text-xs md:text-sm font-semibold text-white/70 tracking-wide uppercase">
                      Explore by Category
                    </h2>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                  </div>
                  <div className="flex justify-center">
                    <div className="h-[1.5px] w-16 md:w-20 rounded-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  </div>
                </div>

                {/* Glass Tray Container */}
                <div className="max-w-[780px] mx-auto glass-tray rounded-2xl p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <div
                          key={category.title}
                          className={cn(
                            "relative rounded-xl p-4 md:p-5 overflow-hidden group cursor-pointer",
                            isHealthcare ? "glass-card-healthcare" : "glass-card-education"
                          )}
                        >
                          {/* Icon + Title */}
                          <div className="flex items-center gap-3 mb-3 relative">
                            <div
                              className={cn(
                                "w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare 
                                  ? "bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_0_20px_-5px_rgba(0,100,200,0.4)]" 
                                  : "bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-[0_0_20px_-5px_rgba(0,200,255,0.4)]"
                              )}
                            >
                              <category.icon className="w-5 h-5 text-white drop-shadow-md" strokeWidth={2} />
                            </div>
                            <h3 className="font-heading text-base md:text-lg font-bold text-white leading-tight">
                              {category.title}
                            </h3>
                          </div>

                          {/* Glass Chips */}
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 relative">
                            {category.chips.map((chip) => (
                              <span
                                key={chip}
                                className="px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-medium bg-white/8 backdrop-blur-sm border border-white/10 text-white/80"
                              >
                                {chip}
                              </span>
                            ))}
                          </div>

                          {/* CTA Button - Gradient with consistent icon */}
                          <Button
                            size="sm"
                            asChild
                            className={cn(
                              "w-full h-11 transition-all duration-300 group/btn relative overflow-hidden",
                              "font-semibold text-sm rounded-xl border-0",
                              "bg-gradient-to-r from-[#00D1FF] via-[#2B6BFF] to-[#7C3AED]",
                              "shadow-[0_10px_30px_-8px_rgba(43,107,255,0.5)]",
                              "hover:shadow-[0_12px_35px_-8px_rgba(43,107,255,0.6)] hover:brightness-110"
                            )}
                          >
                            <Link to="/map" className="flex items-center justify-center gap-2">
                              <span className="text-white">Explore Map</span>
                              <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5" strokeWidth={2} />
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

      <Footer variant="dark" compact />
    </div>
  );
}

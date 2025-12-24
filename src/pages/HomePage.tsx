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
  },
  {
    icon: GraduationCap,
    title: 'Education',
    colorClass: 'education',
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
          
          {/* === LAYERED IMMERSIVE BACKGROUND (must not block UI) === */}
          <div className="absolute inset-0 bg-hero-immersive pointer-events-none" />
          <div className="absolute inset-0 bg-indigo-glow-left pointer-events-none" />
          <div className="absolute inset-0 bg-teal-glow-right pointer-events-none" />
          <div className="absolute inset-0 bg-cyan-glow-center pointer-events-none" />
          <div className="absolute inset-0 bg-wave-flow pointer-events-none" />
          <div className="absolute inset-0 bg-pulse-glow pointer-events-none" />
          <div className="absolute inset-0 bg-noise-overlay pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-hero-bottom-fade pointer-events-none" />

          {/* === HERO CONTENT === */}
          <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-6 md:py-8">
            <div className="max-w-[920px] mx-auto w-full">
              
              {/* Main Heading - "Smart Map for" normal weight, "Daily Life" bold highlighted */}
              <div className="text-center mb-3 animate-fade-up relative z-20">
                <h1 className="font-heading text-[2.75rem] md:text-5xl lg:text-[4.5rem] leading-[1.2] tracking-[0.5px] relative z-10">
                  <span 
                    className="text-white font-normal relative z-10"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
                  >Smart Map for</span>
                  <br className="sm:hidden" />
                  <span 
                    className="ml-2 sm:ml-3 inline-block relative z-10 tracking-[2px] font-bold"
                    style={{
                      color: '#64E8FF',
                      textShadow: '0 2px 16px rgba(100, 232, 255, 0.5), 0 0 40px rgba(100, 232, 255, 0.4)'
                    }}
                  >Daily Life</span>
                </h1>
              </div>

              {/* Subheading - high contrast */}
              <p className="text-center text-sm md:text-base text-[rgba(255,255,255,0.78)] max-w-md mx-auto mb-5 md:mb-6 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === PRIMARY SEARCH BAR - More Prominent with wider width === */}
              <div className="animate-fade-up delay-200 mb-8 md:mb-10 relative z-[var(--z-popover)]">
                <div className="mx-auto" style={{ width: 'min(920px, 95vw)' }}>
                  <SmartSearch
                    onSearch={handleSearch} 
                    size="large"
                    placeholder="Search healthcare, schools, or wellness centers…"
                    variant="dark"
                    onOpenChange={setIsSearchOpen}
                  />
                </div>
              </div>

              {/* Suggestion Chips - Refined styling */}
              {!isSearchOpen && (
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12 animate-fade-up delay-300">
                  {aiSuggestionChips.map((chip) => (
                    <button
                      key={chip.text}
                      onClick={() => handleSearch(chip.text)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full",
                        "bg-[#1A4B73]/40 backdrop-blur-md border border-white/10",
                        "text-white/70 text-sm font-medium",
                        "hover:bg-[#1A4B73]/60 hover:border-[#7ac8ff]/30 hover:text-white",
                        "transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_20px_rgba(122,200,255,0.15)]"
                      )}
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* === EXPLORE BY CATEGORY === */}
              <div className={cn(
                "animate-fade-up delay-400 transition-all duration-300 relative z-[1]",
                isSearchOpen ? "mt-4" : ""
              )}>
                {/* Section Header - Clean and minimal */}
                <div className="text-center mb-5 md:mb-6">
                  <h2 className="font-heading text-sm md:text-base font-medium text-white/60 tracking-wide">
                    Explore by Category
                  </h2>
                  <div className="flex justify-center mt-2">
                    <div className="h-[1px] w-12 md:w-16 rounded-full bg-[#7ac8ff]/30" />
                  </div>
                </div>

                {/* Category Cards - Clean styling with hover effects */}
                <div className="max-w-[640px] mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <Link
                          to="/map"
                          key={category.title}
                          className={cn(
                            "relative rounded-xl overflow-hidden group cursor-pointer",
                            "bg-[#0F304F]/60 backdrop-blur-md border border-white/10",
                            "hover:bg-[#1A4B73]/70 hover:border-[#7ac8ff]/25",
                            "hover:shadow-[0_8px_30px_rgba(122,200,255,0.12)]",
                            "transition-all duration-300",
                            "h-[88px] md:h-[96px] flex items-center"
                          )}
                        >
                          {/* Icon + Title - Single Line Layout */}
                          <div className="flex items-center gap-4 px-5 md:px-6 w-full">
                            <div
                              className={cn(
                                "w-11 h-11 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare 
                                  ? "bg-[#1A4B73] shadow-[0_0_20px_rgba(122,200,255,0.15)]" 
                                  : "bg-[#1A4B73] shadow-[0_0_20px_rgba(122,200,255,0.15)]"
                              )}
                            >
                              <category.icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
                            </div>
                            <h3 className="font-heading text-base md:text-lg font-medium text-white/80 leading-tight group-hover:text-white transition-colors">
                              {category.title}
                            </h3>
                            {/* Arrow indicator */}
                            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#7ac8ff] group-hover:translate-x-1 transition-all duration-300 ml-auto flex-shrink-0" />
                          </div>
                        </Link>
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

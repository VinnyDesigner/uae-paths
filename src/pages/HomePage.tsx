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
            <div className="max-w-[900px] mx-auto w-full">
              
              {/* Main Heading - Gradient TEXT only on "for Daily Life", NO boxes */}
              <div className="text-center mb-3 animate-fade-up relative z-20">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight relative z-10">
                  <span 
                    className="text-white relative z-10"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)' }}
                  >Smart Map</span>
                  <br className="sm:hidden" />
                  <span 
                    className="ml-2 sm:ml-3 inline-block relative z-10"
                    style={{
                      background: 'linear-gradient(90deg, #4DD4FF 0%, #60A5FA 35%, #818CF8 70%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      filter: 'drop-shadow(0 2px 12px rgba(77, 212, 255, 0.4)) drop-shadow(0 0 30px rgba(129, 140, 248, 0.35))'
                    }}
                  >for Daily Life</span>
                </h1>
              </div>

              {/* Subheading - high contrast */}
              <p className="text-center text-sm md:text-base text-[rgba(255,255,255,0.78)] max-w-md mx-auto mb-5 md:mb-6 animate-fade-up delay-100 leading-relaxed font-medium">
                Find healthcare and education services across the UAE
              </p>

              {/* === PRIMARY SEARCH BAR - Liquid Glass Style === */}
              <div className="animate-fade-up delay-200 mb-5 md:mb-6 relative z-[var(--z-popover)]">
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

              {/* AI Suggestion Chips - Subtle styling with reduced opacity */}
              {!isSearchOpen && (
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-5 md:mb-6 animate-fade-up delay-300">
                  {aiSuggestionChips.map((chip) => (
                    <button
                      key={chip.text}
                      onClick={() => handleSearch(chip.text)}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-full",
                        "bg-white/5 backdrop-blur-md border border-white/8",
                        "text-white/50 text-xs md:text-sm font-medium",
                        "hover:bg-white/12 hover:border-cyan-400/30 hover:text-white hover:opacity-100",
                        "transition-all duration-300 opacity-60 hover:scale-105"
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
                "animate-fade-up delay-400 transition-all duration-300 relative z-[1]",
                isSearchOpen ? "mt-4" : ""
              )}>
                {/* Section Header with increased spacing */}
                <div className="text-center mb-8 md:mb-10">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                    <h2 className="font-heading text-sm md:text-base font-semibold text-white/80 tracking-wide uppercase">
                      Explore by Category
                    </h2>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400/60" strokeWidth={2} />
                  </div>
                  <div className="flex justify-center">
                    <div className="h-[1.5px] w-20 md:w-24 rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                  </div>
                </div>

                {/* Simplified Category Cards - Icons and Title Only, Equal Size */}
                <div className="max-w-[680px] mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <Link
                          to="/map"
                          key={category.title}
                          className={cn(
                            "relative rounded-2xl overflow-hidden group cursor-pointer",
                            "bg-white/[0.06] backdrop-blur-lg border border-white/10",
                            "hover:bg-white/[0.10] hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
                            "transition-all duration-300 hover:scale-[1.02]",
                            "h-[140px] md:h-[160px] flex items-center justify-center"
                          )}
                        >
                          {/* Icon + Title - Centered Layout */}
                          <div className="flex items-center gap-4 px-6">
                            <div
                              className={cn(
                                "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                                "transition-all duration-300 group-hover:scale-110",
                                isHealthcare 
                                  ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)]" 
                                  : "bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_25px_-5px_rgba(34,211,238,0.5)]"
                              )}
                            >
                              <category.icon className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-md" strokeWidth={2} />
                            </div>
                            <h3 className="font-heading text-lg md:text-xl font-bold text-white leading-tight">
                              {category.title}
                            </h3>
                            {/* Arrow indicator */}
                            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300 ml-auto" />
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

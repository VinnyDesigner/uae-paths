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
                      background: 'linear-gradient(45deg, #004f7c 0%, #006f9b 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      filter: 'drop-shadow(0 2px 12px rgba(0, 111, 155, 0.5)) drop-shadow(0 0 20px rgba(0, 79, 124, 0.4))'
                    }}
                  >for Daily Life</span>
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

              {/* AI Suggestion Chips - Subtle styling with reduced opacity */}
              {!isSearchOpen && (
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 animate-fade-up delay-300">
                  {aiSuggestionChips.map((chip) => (
                    <button
                      key={chip.text}
                      onClick={() => handleSearch(chip.text)}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-full",
                        "bg-white/[0.03] backdrop-blur-md border border-white/[0.06]",
                        "text-white/40 text-xs md:text-sm font-medium",
                        "hover:bg-white/10 hover:border-white/15 hover:text-white/80 hover:opacity-100",
                        "transition-all duration-300 opacity-50 hover:scale-105"
                      )}
                    >
                      <span className="opacity-70">{chip.icon}</span>
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
                {/* Section Header - Less prominent */}
                <div className="text-center mb-4 md:mb-5">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <Sparkles className="w-3 h-3 text-cyan-400/40" strokeWidth={2} />
                    <h2 className="font-heading text-xs md:text-sm font-medium text-white/50 tracking-wide uppercase">
                      Explore by Category
                    </h2>
                    <Sparkles className="w-3 h-3 text-cyan-400/40" strokeWidth={2} />
                  </div>
                  <div className="flex justify-center">
                    <div className="h-[1px] w-16 md:w-20 rounded-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                  </div>
                </div>

                {/* Category Cards - Less prominent, subtle styling */}
                <div className="max-w-[640px] mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <Link
                          to="/map"
                          key={category.title}
                          className={cn(
                            "relative rounded-xl overflow-hidden group cursor-pointer",
                            "bg-white/[0.04] backdrop-blur-md border border-white/[0.08]",
                            "hover:bg-white/[0.08] hover:border-white/15",
                            "transition-all duration-300 hover:scale-[1.01]",
                            "h-[80px] md:h-[88px] flex items-center"
                          )}
                        >
                          {/* Icon + Title - Single Line Layout */}
                          <div className="flex items-center gap-3 px-4 md:px-5 w-full">
                            <div
                              className={cn(
                                "w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                                "transition-all duration-300 group-hover:scale-105",
                                isHealthcare 
                                  ? "bg-gradient-to-br from-blue-500/80 to-blue-700/80 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]" 
                                  : "bg-gradient-to-br from-cyan-400/80 to-cyan-600/80 shadow-[0_0_15px_-5px_rgba(34,211,238,0.3)]"
                              )}
                            >
                              <category.icon className="w-4 h-4 md:w-5 md:h-5 text-white/90 drop-shadow-sm" strokeWidth={2} />
                            </div>
                            <h3 className="font-heading text-sm md:text-base font-semibold text-white/70 leading-tight whitespace-nowrap group-hover:text-white/90 transition-colors">
                              {category.title}
                            </h3>
                            {/* Arrow indicator */}
                            <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 ml-auto flex-shrink-0" />
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

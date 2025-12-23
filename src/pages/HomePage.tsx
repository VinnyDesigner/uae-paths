import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmartSearch } from '@/components/search/SmartSearch';

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
          
          {/* === LAYERED IMMERSIVE BACKGROUND - z-index 0, below content === */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-hero-immersive" />
            <div className="absolute inset-0 bg-indigo-glow-left" />
            <div className="absolute inset-0 bg-teal-glow-right" />
            <div className="absolute inset-0 bg-cyan-glow-center" />
            <div className="absolute inset-0 bg-wave-flow" />
            <div className="absolute inset-0 bg-pulse-glow" />
            <div className="absolute inset-0 bg-noise-overlay" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-hero-bottom-fade" />
          </div>

          {/* === HERO CONTENT - z-index 10, above background === */}
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
                "animate-fade-up delay-400 transition-all duration-300 relative z-[1]",
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

                {/* Simplified Category Cards - Icon + Text Only */}
                <div className="max-w-[600px] mx-auto">
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {categories.map((category) => {
                      const isHealthcare = category.colorClass === 'healthcare';
                      return (
                        <Link
                          key={category.title}
                          to="/map"
                          className={cn(
                            "flex items-center gap-3 px-5 py-3 md:px-6 md:py-3.5",
                            "rounded-2xl cursor-pointer",
                            "bg-white/10 backdrop-blur-md",
                            "border border-white/15",
                            "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)]",
                            "hover:bg-white/18 hover:border-white/25 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]",
                            "transition-all duration-300 group"
                          )}
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                              "transition-transform duration-300 group-hover:scale-110",
                              isHealthcare 
                                ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_4px_16px_-4px_rgba(59,130,246,0.5)]" 
                                : "bg-gradient-to-br from-cyan-500 to-teal-600 shadow-[0_4px_16px_-4px_rgba(20,184,166,0.5)]"
                            )}
                          >
                            <category.icon className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                          {/* Text */}
                          <span className="font-heading text-base md:text-lg font-bold text-white">
                            {category.title}
                          </span>
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

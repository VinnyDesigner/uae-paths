import { Link } from 'react-router-dom';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import heroMapVisual from '@/assets/hero-map-visual.png';

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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* === IMMERSIVE HERO SECTION === */}
        <section className="relative min-h-[calc(100vh-64px)] flex flex-col overflow-hidden">
          
          {/* === HERO IMAGE BACKGROUND === */}
          <div className="absolute inset-0">
            <img 
              src={heroMapVisual} 
              alt="" 
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F304F]/70 via-[#0F304F]/40 to-[#1A4B73]/90" />
            {/* Center spotlight for headline clarity */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,transparent_0%,rgba(15,48,79,0.4)_100%)]" />
          </div>

          {/* Subtle noise overlay */}
          <div className="absolute inset-0 bg-noise-overlay pointer-events-none" />
          
          {/* Bottom fade to category section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A4B73] to-transparent pointer-events-none" />

          {/* === HERO CONTENT === */}
          <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-8 md:py-12">
            <div className="max-w-[920px] mx-auto w-full">
              
              {/* Main Heading */}
              <div className="text-center mb-16 md:mb-20 animate-fade-up relative z-20">
                <h1 className="font-heading text-[2.75rem] md:text-5xl lg:text-[4.5rem] leading-[1.2] tracking-[0.5px] relative z-10">
                  <span 
                    className="text-white font-normal relative z-10"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
                  >Smart Map for</span>
                  <br className="sm:hidden" />
                  <span 
                    className="ml-2 sm:ml-3 inline-block relative z-10 tracking-[2px] font-bold"
                    style={{
                      color: '#64E8FF',
                      textShadow: '0 2px 24px rgba(100, 232, 255, 0.6), 0 0 60px rgba(100, 232, 255, 0.4)'
                    }}
                  >Daily Life</span>
                </h1>
              </div>

              {/* === EXPLORE BY CATEGORY === */}
              <div className="animate-fade-up delay-200 relative z-[1]">
                {/* Section Header */}
                <div className="text-center mb-5 md:mb-6">
                  <h2 className="font-heading text-sm md:text-base font-medium text-white/60 tracking-wide">
                    Explore by Category
                  </h2>
                  <div className="flex justify-center mt-2">
                    <div className="h-[1px] w-12 md:w-16 rounded-full bg-[#7ac8ff]/30" />
                  </div>
                </div>

                {/* Category Cards */}
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

import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Layers,
  Database,
  Shield,
  Target,
  Lightbulb,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dgeLogo from '@/assets/dge-logo.png';
import dgeLogoDark from '@/assets/dge-logo-dark.png';
import sdiLogo from '@/assets/sdi-logo.png';

const dgeFeatures = [
  {
    icon: Target,
    title: 'Centralised Government Enabler',
    description: 'Delivering quality services to Abu Dhabi government employees, entities, citizens, and residents.'
  },
  {
    icon: Lightbulb,
    title: 'Smart Digital Government',
    description: 'Leading the implementation of Abu Dhabi Government Digital Strategy 2025-2027, driving 100% digitalisation and automation.'
  },
  {
    icon: Users,
    title: 'Team Behind the Teams',
    description: 'The unified engine powering Abu Dhabi\'s transformation into a future-ready government.'
  },
];

const sdiFeatures = [
  {
    icon: Layers,
    title: 'Geospatial Map Viewer',
    description: 'Easy access to view maps and analyze spatial data across Abu Dhabi.'
  },
  {
    icon: Database,
    title: 'Open Data Sharing',
    description: 'Facilitating the sharing and exchange of geospatial data among government agencies and stakeholders.'
  },
  {
    icon: Shield,
    title: 'Spatially Enabled Services',
    description: 'Empowering government and society with open and timely access to geographic information.'
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-hero-immersive pointer-events-none" />
          <div className="absolute inset-0 bg-indigo-glow-left pointer-events-none opacity-50" />
          <div className="absolute inset-0 bg-teal-glow-right pointer-events-none opacity-50" />
          <div className="absolute inset-0 bg-noise-overlay pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-[2.75rem] md:text-5xl lg:text-[4.5rem] leading-[1.2] tracking-[0.5px]">
                <span 
                  className="text-white font-normal"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
                >About</span>
                <br className="sm:hidden" />
                <span 
                  className="ml-2 sm:ml-3 inline-block tracking-[2px] font-bold text-white"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
                >Smart Map</span>
              </h1>
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                A collaborative initiative bringing together Abu Dhabi's leading government 
                technology organizations to provide seamless access to healthcare and 
                education services across the UAE.
              </p>
            </div>
          </div>
        </section>

        {/* DGE Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center p-3">
                      <img 
                        src={dgeLogoDark} 
                        alt="Department of Government Enablement" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                        Department of Government Enablement
                      </h2>
                      <p className="text-sm text-muted-foreground">Abu Dhabi Government</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      The Department of Government Enablement (DGE) is a centralised government enabler 
                      that delivers quality services to the Emirate of Abu Dhabi government employees 
                      and entities, customers, citizens, and residents.
                    </p>
                    <p>
                      At DGE, we are the team behind the teams — the unified engine powering Abu Dhabi's 
                      transformation into a future-ready, digitally advanced government. Our role is to help Abu Dhabi 
                      Government work better by building the shared systems, platforms, and capabilities 
                      that allow every government entity to operate faster, smarter, and more seamlessly.
                    </p>
                    <p>
                      DGE leads the implementation of the Abu Dhabi Government Digital Strategy 2025-2027, 
                      driving 100% digitalisation and automation for government services.
                    </p>
                  </div>

                  <a 
                    href="https://www.dge.gov.ae/en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Visit DGE Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {dgeFeatures.map((feature) => (
                    <div 
                      key={feature.title}
                      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SDI Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Features - Order reversed on desktop */}
                <div className="space-y-4 lg:order-2">
                  {sdiFeatures.map((feature) => (
                    <div 
                      key={feature.title}
                      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="lg:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center p-3">
                      <img 
                        src={sdiLogo} 
                        alt="Abu Dhabi Spatial Data Infrastructure" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                        <span 
                          className="font-bold"
                          style={{
                            color: '#0F304F',
                            textShadow: '0 1px 8px rgba(15, 48, 79, 0.2)'
                          }}
                        >Abu Dhabi Spatial Data Infrastructure</span>
                      </h2>
                      <p className="text-sm text-muted-foreground">AD-SDI Program</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      The Abu Dhabi Spatial Data Infrastructure (AD-SDI) is a program of the Government 
                      of Abu Dhabi, administered within the Abu Dhabi Digital Authority (ADDA). The program 
                      is designed to facilitate the sharing and exchange of geospatial data among 
                      government agencies and other stakeholders.
                    </p>
                    <p>
                      Initiated in 2007 by the Abu Dhabi Systems & Information Center (ADSIC) in 
                      collaboration with 9 government stakeholder entities, AD-SDI has achieved 
                      international recognition for its vision to empower government and society 
                      with open and timely access to up-to-date geographic information.
                    </p>
                    <p>
                      The program provides spatially enabled e-government services, including the 
                      Abu Dhabi Geospatial Map Viewer — an easy way to view, access, and analyze 
                      spatial data across the emirate.
                    </p>
                  </div>

                  <a 
                    href="https://sdi.gov.abudhabi/sdi/index.html" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Visit AD-SDI Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Smart Map brings together the power of government digital transformation 
                  and geospatial intelligence to serve the people of Abu Dhabi.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Accessible Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Find healthcare and education facilities easily with our intuitive map interface.
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Open Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Leveraging government geospatial data to provide accurate, up-to-date information.
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Smart Government</h3>
                  <p className="text-sm text-muted-foreground">
                    Part of Abu Dhabi's journey towards a digitally transformed, intelligent government.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-cyan-500/10 to-primary/10 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Explore?
              </h2>
              <p className="text-muted-foreground mb-8">
                Discover healthcare and education services near you with our intelligent map platform.
              </p>
              <Button
                size="lg"
                asChild
                className={cn(
                  "px-8 h-12 font-semibold text-base rounded-full",
                  "backdrop-blur-xl border border-white/60",
                  "bg-white/90 text-[#0F304F]",
                  "shadow-[0_8px_32px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.8)]",
                  "hover:bg-white hover:border-[rgba(0,212,255,0.5)]",
                  "hover:shadow-[0_12px_40px_rgba(0,212,255,0.35),inset_0_1px_2px_rgba(255,255,255,1)]",
                  "active:scale-[0.96] transition-all duration-300"
                )}
              >
                <Link to="/map" className="flex items-center gap-2">
                  Open Smart Map
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="light" />
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Globe, 
  Music, 
  Users, 
  Trophy, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  MapPin,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export default function FranchisePage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const franchisePackages = [
    {
      id: 'new-business',
      title: 'New Business Package',
      subtitle: 'Complete turnkey solution for new entrepreneurs',
      totalInvestment: '₩180,000,000',
      interiorCost: '₩1,200,000 per pyeong',
      minSpace: '120㎡ (36 pyeong)',
      features: [
        'Complete studio equipment setup',
        'Professional interior design & construction',
        'Brand identity & signage package',
        'Staff training program (3 months)',
        'Marketing launch support',
        'Menu development & supply chain',
        'Global distribution system integration',
        'Legal & licensing support'
      ],
      breakdown: {
        equipment: '₩80,000,000',
        interior: '₩43,200,000 (36 pyeong × ₩1,200,000)',
        franchise: '₩15,000,000',
        training: '₩12,000,000',
        marketing: '₩8,000,000',
        legal: '₩5,000,000',
        contingency: '₩16,800,000'
      },
      monthlyFee: '6% of revenue',
      support: '24/7 technical support + quarterly business reviews'
    },
    {
      id: 'remodeling',
      title: 'Existing Business Remodeling',
      subtitle: 'Transform your existing cafe into K-Recording Cafe',
      totalInvestment: '₩120,000,000',
      interiorCost: '₩800,000 per pyeong',
      minSpace: '100㎡ (30 pyeong)',
      features: [
        'Professional recording studio addition',
        'Partial interior renovation',
        'Brand conversion package',
        'Staff retraining program (2 months)',
        'Menu integration & expansion',
        'Existing customer transition support',
        'Global distribution system integration',
        'Equipment upgrade consultation'
      ],
      breakdown: {
        equipment: '₩65,000,000',
        renovation: '₩24,000,000 (30 pyeong × ₩800,000)',
        franchise: '₩10,000,000',
        training: '₩8,000,000',
        marketing: '₩6,000,000',
        consultation: '₩3,000,000',
        contingency: '₩4,000,000'
      },
      monthlyFee: '5% of revenue',
      support: 'Business transition specialist + monthly check-ins'
    }
  ];

  const successMetrics = [
    { icon: Trophy, title: '10+ Years', subtitle: 'Proven track record in entertainment industry' },
    { icon: Globe, title: 'Global Reach', subtitle: 'US copyright partnership & China market entry' },
    { icon: TrendingUp, title: '₩2B Revenue', subtitle: 'Achieved in 6 months by founding team' },
    { icon: Users, title: '50+ Artists', subtitle: 'Trained and managed in-house system' }
  ];

  const differentiators = [
    {
      icon: Shield,
      title: 'Proven Business Model',
      description: 'Real entertainment company system made accessible to general public'
    },
    {
      icon: Zap,
      title: 'End-to-End Process',
      description: 'Recording → Mixing → Distribution → Copyright registration in one place'
    },
    {
      icon: Globe,
      title: 'Global Distribution',
      description: 'Direct partnership with US copyright management and global streaming platforms'
    },
    {
      icon: Music,
      title: 'Lifetime Royalties',
      description: 'Customers earn royalties for 70 years, creating long-term engagement'
    }
  ];

  const targetCustomers = [
    {
      name: 'Jiwoo Kim',
      age: '21',
      profile: 'Office worker with hidden artistic dreams',
      painPoints: [
        'Wants to record K-pop covers but finds professional studios intimidating',
        'Dreams of releasing music but doesn\'t know where to start',
        'Seeks authentic creative experience beyond karaoke'
      ],
      solution: 'Comfortable cafe environment with professional recording capabilities'
    },
    {
      name: 'International K-pop Fan',
      age: '19-35',
      profile: 'Tourist visiting Korea for K-pop culture',
      painPoints: [
        'Limited time to experience authentic K-pop culture',
        'Language barriers in traditional entertainment venues',
        'Wants memorable souvenir beyond merchandise'
      ],
      solution: 'Create and take home professionally recorded K-pop covers'
    }
  ];

  const revenueStreams = [
    {
      category: 'Cafe Operations',
      monthly: '₩25,000,000',
      items: ['Beverages', 'Desserts', 'Light meals', 'Merchandise']
    },
    {
      category: 'Recording Services',
      monthly: '₩35,000,000',
      items: ['Recording packages', 'Mixing services', 'Professional coaching', 'Music video production']
    },
    {
      category: 'Digital Services',
      monthly: '₩15,000,000',
      items: ['Global distribution', 'Copyright registration', 'Streaming royalties', 'Digital marketing']
    }
  ];

  const expansionPlan = [
    {
      phase: 'Phase 1',
      timeline: '2025',
      goal: 'Seoul Metropolitan Area',
      targets: ['Gangnam', 'Hongdae', 'Myeongdong', 'Itaewon']
    },
    {
      phase: 'Phase 2',
      timeline: '2026',
      goal: 'Major Korean Cities',
      targets: ['Busan', 'Daegu', 'Incheon', 'Gwangju']
    },
    {
      phase: 'Phase 3',
      timeline: '2027-2028',
      goal: 'Global Expansion',
      targets: ['China', 'Japan', 'Southeast Asia', 'North America']
    }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 glass">
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
            K-Recording Cafe
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/franchise" className="hover:text-[hsl(var(--k-pink))] transition-colors">
              Franchise
            </Link>
          </div>
          
          <Button className="k-gradient-pink-purple px-6 py-2 rounded-full hover:scale-105 transition-transform text-white border-0">
            Apply Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-8 xl:px-12 text-center max-w-6xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90 mb-4">
              Global Franchise Opportunity
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">K-Recording Cafe</span>
            <br />
            <span className="text-white">Franchise</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Bring 10 years of proven entertainment industry systems to your city. 
            Transform ordinary cafe visits into extraordinary music creation experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="k-gradient-pink-purple px-8 py-4 text-lg rounded-full hover:scale-105 transition-transform">
              <Calendar className="mr-2 h-5 w-5" />
              Book Info Session
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
              <Phone className="mr-2 h-5 w-5" />
              Call: 02-555-KPOP
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 px-6 lg:px-8 xl:px-12 bg-gray-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full k-gradient-pink-purple mb-4">
                  <metric.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{metric.title}</h3>
                <p className="text-gray-300">{metric.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              From Entertainment Industry to
              <span className="gradient-text"> Global Platform</span>
            </h2>
            <div className="glass-card p-8 rounded-3xl">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                For over 10 years, our system has been the secret behind training 50+ artists and managing 
                successful entertainment projects worth billions. What was once exclusive to industry insiders 
                is now available to anyone with a dream to create.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                We've proven that the gap between professional music creation and everyday people can be bridged 
                through the right combination of technology, environment, and guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center text-[hsl(var(--k-pink))]">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Real entertainment company infrastructure
                </div>
                <div className="flex items-center text-[hsl(var(--k-purple))]">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  10+ years of proven results
                </div>
                <div className="flex items-center text-[hsl(var(--k-blue))]">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Global distribution network
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise Packages */}
      <section className="py-20 px-6 lg:px-8 xl:px-12 bg-gray-900/50" id="packages">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your
              <span className="gradient-text"> Franchise Package</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Whether you're starting fresh or transforming an existing business, we have the perfect solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {franchisePackages.map((pkg) => (
              <Card key={pkg.id} className="glass-card hover:border-[hsl(var(--k-pink))]/50 transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl font-bold text-white">{pkg.title}</CardTitle>
                    <Badge className="bg-[hsl(var(--k-pink))]/20 text-[hsl(var(--k-pink))] border-[hsl(var(--k-pink))]/30">
                      {pkg.id === 'new-business' ? 'Most Popular' : 'Cost Effective'}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300 text-base">
                    {pkg.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-white mb-2">{pkg.totalInvestment}</div>
                    <div className="text-lg text-gray-300">{pkg.interiorCost}</div>
                    <div className="text-sm text-gray-400">Minimum space: {pkg.minSpace}</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="text-lg font-semibold text-white">Package Includes:</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/20 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Investment Breakdown:</h4>
                    <div className="space-y-2">
                      {Object.entries(pkg.breakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-300 capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monthly Fee:</span>
                      <span className="text-white font-medium">{pkg.monthlyFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Support Level:</span>
                      <span className="text-white font-medium">{pkg.support}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full k-gradient-pink-purple hover:scale-105 transition-transform"
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    Choose This Package
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-20 px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why K-Recording Cafe
              <span className="gradient-text"> Dominates</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((diff, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full k-gradient-pink-purple mb-4">
                  <diff.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{diff.title}</h3>
                <p className="text-gray-300">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Customer Analysis */}
      <section className="py-20 px-6 lg:px-8 xl:px-12 bg-gray-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Know Your
              <span className="gradient-text"> Target Customers</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {targetCustomers.map((customer, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full k-gradient-pink-purple flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{customer.name}</CardTitle>
                      <CardDescription className="text-gray-300">Age: {customer.age}</CardDescription>
                    </div>
                  </div>
                  <p className="text-gray-300">{customer.profile}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Pain Points:</h4>
                      <ul className="space-y-1">
                        {customer.painPoints.map((point, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Our Solution:</h4>
                      <p className="text-sm text-green-400">{customer.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-20 px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Triple Revenue
              <span className="gradient-text"> Stream Model</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Average monthly revenue: ₩75,000,000 per location
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="glass-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{stream.category}</CardTitle>
                  <div className="text-3xl font-bold gradient-text">
                    {stream.monthly}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {stream.items.map((item, i) => (
                      <li key={i} className="text-gray-300 flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Expansion Plan */}
      <section className="py-20 px-6 lg:px-8 xl:px-12 bg-gray-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Global Expansion
              <span className="gradient-text"> Roadmap</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {expansionPlan.map((phase, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full k-gradient-pink-purple flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">{phase.phase}</h3>
                      <Badge className="bg-[hsl(var(--k-pink))]/20 text-[hsl(var(--k-pink))] border-[hsl(var(--k-pink))]/30">
                        {phase.timeline}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3">{phase.goal}</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.targets.map((target, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                          {target}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Application
              <span className="gradient-text"> Process</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Info Session', desc: 'Online/offline presentation' },
                { step: '02', title: 'Application', desc: 'Submit business plan & location' },
                { step: '03', title: 'Contract', desc: 'Sign franchise agreement' },
                { step: '04', title: 'Launch', desc: 'Setup, training & grand opening' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full k-gradient-pink-purple flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="glass-card p-12 text-center rounded-3xl border border-[hsl(var(--k-pink))]/30">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="gradient-text"> Music Empire?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the revolution that's transforming how people experience music creation. 
              Limited franchise opportunities available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="k-gradient-pink-purple px-8 py-4 text-lg rounded-full hover:scale-105 transition-transform">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Info Session
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
                <Mail className="mr-2 h-5 w-5" />
                franchise@record.co.kr
              </Button>
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-2">Direct Line:</p>
              <p className="text-2xl font-bold gradient-text">02-555-KPOP (5767)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-16 px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="h-8 w-8 text-[hsl(var(--k-pink))]" />
                <span className="text-xl font-bold gradient-text">K-Recording Cafe</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Transforming music dreams into reality through proven entertainment industry systems.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Franchise Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li>New Business Package</li>
                <li>Remodeling Package</li>
                <li>Training Programs</li>
                <li>Marketing Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  02-555-KPOP (5767)
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  franchise@record.co.kr
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Sinsa-dong, Gangnam-gu, Seoul
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2025 K-Recording Cafe. All rights reserved. Patent protected under Korean law.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
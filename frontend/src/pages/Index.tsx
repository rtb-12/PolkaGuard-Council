
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Users, Vault, ArrowRight, Download, Lock, DollarSign, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

const Index = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: Lock,
      title: "Zero-Knowledge Audit Reports",
      description: "Submit comprehensive smart contract audit reports using zero-knowledge proofs. Prove the validity of your security findings without revealing sensitive implementation details or exploitation vectors."
    },
    {
      icon: DollarSign,
      title: "Automated Bounty Payments",
      description: "Get paid instantly for verified audit reports through our decentralized bounty system. Our platform uses Polkadot's native features to ensure cost-effective and transparent reward distribution."
    },
    {
      icon: Database,
      title: "Immutable Audit Registry",
      description: "All audit reports and findings are published on-chain with cryptographic verification, creating a tamper-proof registry of smart contract security assessments accessible to the entire ecosystem."
    }
  ];

  const workflowSteps = [
    {
      number: "1",
      title: "Submit Your Audit Report",
      description: "Upload your comprehensive security audit findings and vulnerability assessments. Our ZK proof system ensures your methodology and detailed findings remain confidential while proving their authenticity."
    },
    {
      number: "2",
      title: "DAO Verification Process",
      description: "The audit report undergoes community verification through our decentralized governance system. Experienced auditors and security researchers validate findings using on-chain cryptographic proofs."
    },
    {
      number: "3",
      title: "Bounty Distribution",
      description: "Once verified by the DAO, receive automatic bounty payments based on the severity and impact of your findings. All transactions are recorded on-chain for complete transparency."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-polka-purple/30 bg-polka-purple/10 text-sm text-polka-purple-light mb-6">
                Zero-knowledge audit platform with bounty rewards
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Submit Audit Reports.</span><br />
              <span className="bg-gradient-to-r from-blue-400 to-polka-purple bg-clip-text text-transparent">
                Earn Bounties.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The world's first zero-knowledge smart contract audit platform. Submit comprehensive 
              security audit reports with mathematical privacy guarantees and receive instant 
              bounty payments for verified findings.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button size="lg" className="glow-button bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg">
              <Download className="mr-2 h-5 w-5" />
              Download Audit Tool
            </Button>
            <Link to="/proof-upload">
              <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3">
                Submit Audit Report
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
            <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
            <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Zero-Knowledge Security Section */}
      <section className="py-24 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Revolutionary Audit Platform
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Combining advanced cryptography with decentralized governance to create 
              the most secure and rewarding audit reporting system.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-polka-purple/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="p-3 bg-polka-purple/20 rounded-lg w-fit">
                      <feature.icon className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              How It Works
            </h2>
            <p className="text-lg text-gray-300">
              A streamlined process from audit submission to bounty payment.
            </p>
          </div>
          
          <div className="space-y-12">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-polka-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="w-px h-16 bg-gray-700 mx-auto mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-polka-purple/10 to-blue-500/10 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Earning Bounties?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the PolkaGuard ecosystem and monetize your security expertise through our 
            decentralized audit platform with guaranteed privacy and instant payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glow-button bg-white text-black hover:bg-gray-100 px-8 py-3">
              <Download className="mr-2 h-5 w-5" />
              Download Audit Tool
            </Button>
            <Link to="/proof-upload">
              <Button size="lg" className="glow-button bg-polka-purple hover:bg-polka-purple-dark px-8 py-3">
                Submit Your First Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/council">
              <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3">
                Join the DAO Council
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { PokerTable } from "@/components/ui/poker-table";
import { TableLobby } from "@/components/ui/table-lobby";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Globe, TrendingUp } from "lucide-react";

const Index = () => {
  // Casino Royal - Premium Crypto Poker Platform
  const features = [
    {
      icon: Shield,
      title: "Provably Fair",
      description: "Cryptographically secure random number generation with full transparency"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time gameplay with sub-second response times"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Play from anywhere with crypto payments and decentralized architecture"
    },
    {
      icon: TrendingUp,
      title: "Professional Stakes",
      description: "From micro stakes to high roller tables for every skill level"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-royal mb-4">
              Why Choose Casino Royal?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of online poker with our cutting-edge platform built for serious players.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-elegant text-center hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/20 w-fit">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Table Preview */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-royal mb-4">
              Live Table Experience
            </h2>
            <p className="text-xl text-muted-foreground">
              Immersive 6-max Texas Hold'em with professional-grade animations
            </p>
          </div>
          
          <div className="mb-12">
            <PokerTable />
          </div>
          
          <div className="text-center">
            <Button 
              variant="royal" 
              size="lg"
              className="px-12 py-4 text-lg"
            >
              Join a Table
            </Button>
          </div>
        </div>
      </section>

      {/* Table Lobby */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <TableLobby />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gradient-royal mb-6">
            Ready to Play?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players in the most advanced crypto poker platform. 
            Start with as little as $1 and experience the future of online poker.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="royal" size="lg" className="px-8 py-4 text-lg">
              Create Account
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              Play as Guest
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            18+ only • Gamble responsibly • Terms and conditions apply
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;

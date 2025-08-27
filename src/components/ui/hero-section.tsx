import { Button } from "./button";
import { Crown, Shield, Trophy } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Crown icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 rounded-full bg-primary/20 animate-royal-glow">
            <Crown className="w-16 h-16 text-accent" />
          </div>
        </div>
        
        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient-royal">
          Casino Royal
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
          The premier crypto-enabled Texas Hold'em poker platform
        </p>
        
        {/* Key features */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base">
          <div className="flex items-center gap-2 text-accent">
            <Shield className="w-5 h-5" />
            <span>Provably Fair</span>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <Trophy className="w-5 h-5" />
            <span>6-Max Tables</span>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <Crown className="w-5 h-5" />
            <span>Crypto Payments</span>
          </div>
        </div>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            variant="royal"
            className="px-8 py-4 text-lg font-semibold animate-royal-glow"
          >
            Play Now
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-4 text-lg border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            View Tables
          </Button>
        </div>
        
        {/* Minimum buy-in notice */}
        <p className="mt-8 text-sm text-muted-foreground">
          Minimum buy-in: $1 USD equivalent • 18+ only • Play responsibly
        </p>
      </div>
    </section>
  );
};
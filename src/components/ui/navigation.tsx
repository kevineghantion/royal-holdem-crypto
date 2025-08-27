import { Button } from "./button";
import { Crown, Menu, X, Wallet, User, Settings } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Crown className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xl font-bold text-gradient-royal">Casino Royal</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-accent transition-colors">Tables</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Tournaments</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Leaderboard</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Help</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="royal" size="sm">
              Play Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border/40">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-foreground hover:text-accent transition-colors py-2">Tables</a>
              <a href="#" className="text-foreground hover:text-accent transition-colors py-2">Tournaments</a>
              <a href="#" className="text-foreground hover:text-accent transition-colors py-2">Leaderboard</a>
              <a href="#" className="text-foreground hover:text-accent transition-colors py-2">Help</a>
              
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
                <Button variant="ghost" size="sm" className="justify-start">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button variant="royal" size="sm">
                  Play Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
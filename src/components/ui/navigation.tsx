import { Button } from "./button";
import { Crown, Menu, X, Wallet, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./auth-modal";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout, connectWallet, isWalletConnected } = useAuth();
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet connected successfully!",
        description: "You can now make transactions.",
      });
    } catch (error) {
      toast({
        title: "Failed to connect wallet",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlayNow = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      // Navigate to game table - replace with actual navigation later
      toast({
        title: "Joining table...",
        description: "Redirecting to poker table.",
      });
    }
  };

  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };

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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleConnectWallet}
              disabled={isWalletConnected}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">Welcome, {user?.username}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSignIn}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button variant="royal" size="sm" onClick={handlePlayNow}>
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={handleConnectWallet}
                  disabled={isWalletConnected}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </Button>
                
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-foreground">Welcome, {user?.username}</div>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="justify-start" onClick={handleSignIn}>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
                
                <Button variant="royal" size="sm" onClick={handlePlayNow}>
                  Play Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};
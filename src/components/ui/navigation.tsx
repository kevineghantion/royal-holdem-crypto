import { Button } from "./button";
import { Crown, Menu, X, Wallet, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./auth-modal";
import { WalletModal } from "./wallet-modal";
import { GamesMenu } from "./games-menu";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isGamesMenuOpen, setIsGamesMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, connectWallet, isWalletConnected, walletBalance } = useAuth();
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

  const handleWalletClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsWalletModalOpen(true);
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
            <div className="relative">
              <button
                onClick={() => setIsGamesMenuOpen(!isGamesMenuOpen)}
                className="flex items-center gap-1 text-foreground hover:text-accent transition-colors"
              >
                Games
                <ChevronDown className="w-4 h-4" />
              </button>
              {isGamesMenuOpen && (
                <GamesMenu onClose={() => setIsGamesMenuOpen(false)} />
              )}
            </div>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Help</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <motion.button
                onClick={handleWalletClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  ${walletBalance?.toFixed(2) || '0.00'}
                </span>
              </motion.button>
            )}
            
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
          <motion.div 
            className="md:hidden mt-4 py-4 border-t border-border/40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setIsGamesMenuOpen(!isGamesMenuOpen)}
                className="flex items-center justify-between text-foreground hover:text-accent transition-colors py-2"
              >
                Games
                <ChevronDown className="w-4 h-4" />
              </button>
              {isGamesMenuOpen && (
                <div className="ml-4">
                  <GamesMenu onClose={() => setIsGamesMenuOpen(false)} />
                </div>
              )}
              <a href="#" className="text-foreground hover:text-accent transition-colors py-2">Help</a>
              
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
                {isAuthenticated && (
                  <button
                    onClick={handleWalletClick}
                    className="flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors justify-start"
                  >
                    <Wallet className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      ${walletBalance?.toFixed(2) || '0.00'}
                    </span>
                  </button>
                )}
                
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
              </div>
            </div>
          </motion.div>
        )}
      </nav>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </header>
  );
};
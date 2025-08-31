import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Spade, Club, Diamond, Heart, Users, DollarSign, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GamesMenuProps {
  onClose: () => void;
}

interface GameTable {
  id: string;
  name: string;
  game: 'poker' | 'blackjack';
  minBet: number;
  maxBet: number;
  players: number;
  maxPlayers: number;
  status: 'active' | 'waiting' | 'full';
}

const mockTables: GameTable[] = [
  {
    id: 'poker-1',
    name: 'Royal High Stakes',
    game: 'poker',
    minBet: 10,
    maxBet: 500,
    players: 4,
    maxPlayers: 6,
    status: 'active'
  },
  {
    id: 'poker-2',
    name: 'Beginner Friendly',
    game: 'poker',
    minBet: 1,
    maxBet: 25,
    players: 2,
    maxPlayers: 6,
    status: 'waiting'
  },
  {
    id: 'blackjack-1',
    name: 'Classic 21',
    game: 'blackjack',
    minBet: 5,
    maxBet: 100,
    players: 3,
    maxPlayers: 5,
    status: 'active'
  },
  {
    id: 'blackjack-2',
    name: 'VIP Blackjack',
    game: 'blackjack',
    minBet: 25,
    maxBet: 1000,
    players: 5,
    maxPlayers: 5,
    status: 'full'
  }
];

export const GamesMenu: React.FC<GamesMenuProps> = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState<'poker' | 'blackjack' | null>(null);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleGameSelect = (game: 'poker' | 'blackjack') => {
    setSelectedGame(selectedGame === game ? null : game);
  };

  const handleJoinTable = (table: GameTable) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join a table.",
        variant: "destructive",
      });
      return;
    }

    if (table.status === 'full') {
      toast({
        title: "Table full",
        description: "This table is currently full. Please try another one.",
        variant: "destructive",
      });
      return;
    }

    // Mock join table functionality
    toast({
      title: "Joining table...",
      description: `Joining ${table.name}. This is a demo mode.`,
    });
    
    onClose();
  };

  const getStatusColor = (status: GameTable['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'waiting': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'full': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const AnimatedCard = ({ suit, delay }: { suit: React.ElementType; delay: number }) => (
    <motion.div
      className="absolute"
      initial={{ x: 0, y: 0, rotate: 0 }}
      animate={{ 
        x: [0, 10, -5, 0],
        y: [0, -5, 5, 0],
        rotate: [0, 5, -3, 0]
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {React.createElement(suit, { className: "w-6 h-6 text-accent opacity-20" })}
    </motion.div>
  );

  return (
    <div className="absolute top-full mt-2 bg-card border border-border/40 rounded-lg shadow-lg min-w-[300px] max-w-[500px] z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Select a Game</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all relative overflow-hidden ${
                selectedGame === 'poker' ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-card/80'
              }`}
              onClick={() => handleGameSelect('poker')}
            >
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Spade className="w-4 h-4" />
                  Poker
                </CardTitle>
                <AnimatedCard suit={Spade} delay={0} />
                <AnimatedCard suit={Heart} delay={0.5} />
                <AnimatedCard suit={Club} delay={1} />
                <AnimatedCard suit={Diamond} delay={1.5} />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">Texas Hold'em</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all relative overflow-hidden ${
                selectedGame === 'blackjack' ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-card/80'
              }`}
              onClick={() => handleGameSelect('blackjack')}
            >
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Club className="w-4 h-4" />
                  Blackjack
                </CardTitle>
                <motion.div
                  className="absolute right-2 top-2"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Diamond className="w-4 h-4 text-accent opacity-30" />
                </motion.div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">Classic 21</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-2">
                <h4 className="text-sm font-medium capitalize">{selectedGame} Tables</h4>
                {mockTables
                  .filter(table => table.game === selectedGame)
                  .map((table) => (
                    <motion.div
                      key={table.id}
                      className="p-3 bg-card/30 rounded-lg border border-border/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm font-medium">{table.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ${table.minBet} - ${table.maxBet}
                          </div>
                        </div>
                        <Badge className={getStatusColor(table.status)}>
                          {table.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {table.players}/{table.maxPlayers}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${table.minBet}+
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleJoinTable(table)}
                          disabled={table.status === 'full'}
                          className="text-xs h-6"
                        >
                          {table.status === 'full' ? 'Full' : 'Join'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pt-3 border-t border-border/20">
          <div className="text-xs text-muted-foreground text-center">
            🎮 Demo Mode - Tables are simulated for demonstration
          </div>
        </div>
      </div>
    </div>
  );
};
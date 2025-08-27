import { Card } from "./card";
import { Button } from "./button";
import { User, Timer, DollarSign } from "lucide-react";

interface Seat {
  id: number;
  player?: {
    name: string;
    chips: number;
    isActive: boolean;
  };
  position: string;
}

export const PokerTable = () => {
  const seats: Seat[] = [
    { id: 1, position: "top-1/2 left-4 -translate-y-1/2", player: { name: "Player1", chips: 1250, isActive: true } },
    { id: 2, position: "top-8 left-1/2 -translate-x-1/2", player: { name: "Player2", chips: 890, isActive: false } },
    { id: 3, position: "top-1/2 right-4 -translate-y-1/2", player: { name: "Player3", chips: 2100, isActive: false } },
    { id: 4, position: "bottom-8 right-1/2 translate-x-1/2" },
    { id: 5, position: "bottom-8 left-1/2 -translate-x-1/2" },
    { id: 6, position: "bottom-1/2 left-4 translate-y-1/2" }
  ];

  const communityCards = [
    { suit: "hearts", value: "A", visible: true },
    { suit: "diamonds", value: "K", visible: true },
    { suit: "clubs", value: "Q", visible: true },
    { suit: "spades", value: "J", visible: false },
    { suit: "hearts", value: "10", visible: false }
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] poker-table-bg rounded-full border-8 border-accent/30 shadow-2xl">
      {/* Table felt texture overlay */}
      <div className="absolute inset-0 rounded-full opacity-20 bg-gradient-to-br from-green-600/30 to-green-800/30" />
      
      {/* Pot area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-accent font-semibold">
            <DollarSign className="w-5 h-5" />
            <span>Pot: $485</span>
          </div>
        </div>
        
        {/* Community cards */}
        <div className="flex gap-2 justify-center">
          {communityCards.map((card, index) => (
            <div 
              key={index} 
              className={`w-12 h-16 rounded border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                card.visible 
                  ? 'bg-white text-gray-800 border-gray-300 animate-card-flip' 
                  : 'bg-primary border-primary/50'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {card.visible ? `${card.value}${card.suit === 'hearts' ? '♥️' : card.suit === 'diamonds' ? '♦️' : card.suit === 'clubs' ? '♣️' : '♠️'}` : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Player seats */}
      {seats.map((seat) => (
        <div 
          key={seat.id} 
          className={`absolute ${seat.position} w-24 h-24`}
        >
          {seat.player ? (
            <div className="relative">
              {/* Player avatar and info */}
              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center card-elegant ${
                seat.player.isActive ? 'border-accent animate-royal-glow' : 'border-border'
              }`}>
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              
              {/* Player name and chips */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                <div className="text-xs font-medium text-foreground bg-card/80 px-2 py-1 rounded backdrop-blur-sm">
                  {seat.player.name}
                </div>
                <div className="text-xs text-accent font-semibold">
                  ${seat.player.chips}
                </div>
              </div>
              
              {/* Player cards (for active player) */}
              {seat.player.isActive && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-6 h-8 bg-white rounded border text-xs flex items-center justify-center font-bold text-gray-800">
                    A♠️
                  </div>
                  <div className="w-6 h-8 bg-white rounded border text-xs flex items-center justify-center font-bold text-gray-800">
                    K♠️
                  </div>
                </div>
              )}
              
              {/* Chips stack */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <div className="w-8 h-3 bg-accent rounded-full animate-chip-slide" />
                <div className="w-8 h-3 bg-accent/80 rounded-full -mt-1" />
                <div className="w-8 h-3 bg-accent/60 rounded-full -mt-1" />
              </div>
            </div>
          ) : (
            /* Empty seat */
            <Button 
              variant="ghost" 
              className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-accent/50 transition-colors"
            >
              <span className="text-xs text-muted-foreground">Join</span>
            </Button>
          )}
        </div>
      ))}
      
      {/* Dealer button */}
      <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-accent-foreground">
        D
      </div>
      
      {/* Action timer (for active player) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-accent">
        <Timer className="w-4 h-4" />
        <span className="text-sm font-medium">15s</span>
      </div>
    </div>
  );
};
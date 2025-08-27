import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Users, DollarSign, Clock, Eye } from "lucide-react";

interface TableInfo {
  id: string;
  name: string;
  stakes: string;
  players: number;
  maxPlayers: number;
  minBuyIn: number;
  maxBuyIn: number;
  gameSpeed: "Normal" | "Fast" | "Turbo";
  avgPot: number;
}

export const TableLobby = () => {
  const tables: TableInfo[] = [
    {
      id: "1",
      name: "Royal High Rollers",
      stakes: "$5/$10",
      players: 4,
      maxPlayers: 6,
      minBuyIn: 500,
      maxBuyIn: 2000,
      gameSpeed: "Normal",
      avgPot: 125
    },
    {
      id: "2", 
      name: "Crown Classics",
      stakes: "$1/$2",
      players: 5,
      maxPlayers: 6,
      minBuyIn: 100,
      maxBuyIn: 500,
      gameSpeed: "Fast",
      avgPot: 45
    },
    {
      id: "3",
      name: "Ace Lounge",
      stakes: "$0.50/$1",
      players: 2,
      maxPlayers: 6,
      minBuyIn: 50,
      maxBuyIn: 200,
      gameSpeed: "Normal", 
      avgPot: 28
    },
    {
      id: "4",
      name: "Diamond Express",
      stakes: "$2/$5",
      players: 6,
      maxPlayers: 6,
      minBuyIn: 200,
      maxBuyIn: 1000,
      gameSpeed: "Turbo",
      avgPot: 89
    }
  ];

  const getSpeedBadge = (speed: string) => {
    const variants = {
      Normal: "secondary",
      Fast: "default", 
      Turbo: "destructive"
    } as const;
    return variants[speed as keyof typeof variants] || "secondary";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gradient-royal mb-4">Active Tables</h2>
        <p className="text-muted-foreground">Choose your table and start playing Texas Hold'em</p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="card-elegant hover:scale-[1.02] transition-transform duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-foreground">{table.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-accent text-accent">
                      {table.stakes}
                    </Badge>
                    <Badge variant={getSpeedBadge(table.gameSpeed)}>
                      {table.gameSpeed}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{table.players}/{table.maxPlayers}</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Avg: ${table.avgPot}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Buy-in: ${table.minBuyIn} - ${table.maxBuyIn}</div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Average hand: {table.gameSpeed === 'Turbo' ? '45s' : table.gameSpeed === 'Fast' ? '60s' : '90s'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="border border-border/50">
                    <Eye className="w-4 h-4 mr-1" />
                    Spectate
                  </Button>
                  <Button 
                    variant="royal"
                    size="sm"
                    disabled={table.players >= table.maxPlayers}
                    className="min-w-20"
                  >
                    {table.players >= table.maxPlayers ? 'Full' : 'Join'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          Create Private Table
        </Button>
      </div>
    </div>
  );
};
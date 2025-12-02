import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Player {
  id: string;
  name: string;
  uuid: string;
  joinedAt: string;
  ping: number;
  world: string;
}

interface OnlinePlayersProps {
  serverId: string;
  serverName: string;
  isRunning: boolean;
}

const playerNames = ['Steve', 'Alex', 'Notch', 'Herobrine', 'Creeper_Hunter', 'Diamond_Miner', 'Ender_Dragon', 'Builder_Pro'];
const worlds = ['world', 'world_nether', 'world_the_end'];

const OnlinePlayers = ({ serverId, serverName, isRunning }: OnlinePlayersProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [maxPlayers] = useState(20);

  useEffect(() => {
    if (!isRunning) {
      setPlayers([]);
      return;
    }

    const initialPlayers: Player[] = [];
    const initialCount = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < initialCount; i++) {
      const name = playerNames[Math.floor(Math.random() * playerNames.length)];
      initialPlayers.push({
        id: String(Date.now() + i),
        name: name + '_' + Math.floor(Math.random() * 1000),
        uuid: crypto.randomUUID(),
        joinedAt: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('ru-RU', { hour12: false }),
        ping: Math.floor(Math.random() * 100) + 20,
        world: worlds[Math.floor(Math.random() * worlds.length)],
      });
    }
    setPlayers(initialPlayers);

    const interval = setInterval(() => {
      setPlayers((prev) => {
        const action = Math.random();
        
        if (action > 0.7 && prev.length < maxPlayers) {
          const name = playerNames[Math.floor(Math.random() * playerNames.length)];
          return [
            ...prev,
            {
              id: String(Date.now()),
              name: name + '_' + Math.floor(Math.random() * 1000),
              uuid: crypto.randomUUID(),
              joinedAt: new Date().toLocaleTimeString('ru-RU', { hour12: false }),
              ping: Math.floor(Math.random() * 100) + 20,
              world: worlds[Math.floor(Math.random() * worlds.length)],
            },
          ];
        } else if (action < 0.2 && prev.length > 0) {
          const randomIndex = Math.floor(Math.random() * prev.length);
          return prev.filter((_, index) => index !== randomIndex);
        } else {
          return prev.map(player => ({
            ...player,
            ping: Math.floor(Math.random() * 100) + 20,
          }));
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isRunning, maxPlayers]);

  const getPingColor = (ping: number) => {
    if (ping < 50) return 'text-success';
    if (ping < 100) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Online Players</h3>
        </div>
        <Badge className="bg-primary/20 text-primary border-0">
          {players.length}/{maxPlayers}
        </Badge>
      </div>

      {!isRunning ? (
        <div className="text-center py-8">
          <Icon name="Power" size={48} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Server is offline</p>
          <p className="text-xs text-muted-foreground mt-1">Start the server to see online players</p>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No players online</p>
          <p className="text-xs text-muted-foreground mt-1">Waiting for players to join...</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {player.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Icon name="Clock" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Joined {player.joinedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">World</p>
                    <Badge variant="outline" className="text-xs">
                      {player.world}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Ping</p>
                    <p className={`text-sm font-semibold ${getPingColor(player.ping)}`}>
                      {player.ping}ms
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {isRunning && players.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Avg Ping</p>
              <p className="text-lg font-bold text-foreground">
                {Math.round(players.reduce((sum, p) => sum + p.ping, 0) / players.length)}ms
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peak Today</p>
              <p className="text-lg font-bold text-foreground">{Math.max(players.length, 12)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Server Load</p>
              <p className="text-lg font-bold text-primary">
                {Math.round((players.length / maxPlayers) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OnlinePlayers;

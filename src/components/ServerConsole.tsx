import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsoleLog {
  id: number;
  timestamp: string;
  type: 'info' | 'warn' | 'error' | 'success' | 'command';
  message: string;
}

interface ServerConsoleProps {
  serverId: string;
  serverName: string;
  isRunning: boolean;
}

const ServerConsole = ({ serverId, serverName, isRunning }: ServerConsoleProps) => {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [command, setCommand] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  const addLog = (message: string, type: ConsoleLog['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour12: false });
    setLogs((prev) => [...prev, { id: logIdRef.current++, timestamp, type, message }]);
  };

  useEffect(() => {
    if (isRunning) {
      addLog(`[${serverName}] Starting server...`, 'info');
      addLog(`[${serverName}] Loading properties...`, 'info');
      
      const interval = setInterval(() => {
        const messages = [
          { msg: '[Server thread/INFO] Loading world...', type: 'info' as const },
          { msg: '[Server thread/INFO] Preparing spawn area: 23%', type: 'info' as const },
          { msg: '[Server thread/INFO] Preparing spawn area: 45%', type: 'info' as const },
          { msg: '[Server thread/INFO] Preparing spawn area: 67%', type: 'info' as const },
          { msg: '[Server thread/INFO] Preparing spawn area: 89%', type: 'info' as const },
          { msg: '[Server thread/INFO] Done! Server started successfully', type: 'success' as const },
          { msg: '[Server thread/INFO] Player connected: Steve', type: 'info' as const },
          { msg: '[Server thread/INFO] Steve joined the game', type: 'success' as const },
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addLog(randomMessage.msg, randomMessage.type);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning, serverName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !isRunning) return;

    addLog(`> ${command}`, 'command');

    if (command.startsWith('op ')) {
      const player = command.substring(3);
      addLog(`[Server thread/INFO] Made ${player} a server operator`, 'success');
    } else if (command === 'stop') {
      addLog('[Server thread/INFO] Stopping server...', 'warn');
      addLog('[Server thread/INFO] Saving worlds...', 'info');
      addLog('[Server thread/INFO] Server stopped', 'error');
    } else if (command === 'restart') {
      addLog('[Server thread/INFO] Restarting server...', 'warn');
      setTimeout(() => addLog('[Server thread/INFO] Server restarted successfully', 'success'), 1000);
    } else if (command.startsWith('say ')) {
      const message = command.substring(4);
      addLog(`[Server] ${message}`, 'info');
    } else {
      addLog(`[Server thread/INFO] Unknown command: ${command}`, 'warn');
    }

    setCommand('');
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-destructive';
      case 'warn':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'command':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card border-border overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Terminal" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Server Console</h3>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
                <span className="text-sm text-success font-medium">Running</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full" />
                <span className="text-sm text-muted-foreground">Stopped</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-black/40" ref={scrollRef}>
        <div className="font-mono text-sm space-y-1">
          {logs.length === 0 ? (
            <div className="text-muted-foreground italic">Waiting for server logs...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-muted-foreground/60">[{log.timestamp}]</span>
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-muted/30">
        <form onSubmit={handleCommand} className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder={isRunning ? "Enter command... (op, stop, restart, say)" : "Start server to use console"}
            disabled={!isRunning}
            className="font-mono bg-background"
          />
          <Button type="submit" disabled={!isRunning || !command.trim()}>
            <Icon name="Send" size={16} />
          </Button>
        </form>
        <div className="mt-2 text-xs text-muted-foreground">
          Available commands: <span className="text-accent">op [player]</span>, <span className="text-accent">stop</span>, <span className="text-accent">restart</span>, <span className="text-accent">say [message]</span>
        </div>
      </div>
    </Card>
  );
};

export default ServerConsole;

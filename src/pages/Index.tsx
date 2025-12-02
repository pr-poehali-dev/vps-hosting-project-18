import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Server {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'loading';
  cpu: number;
  ram: number;
  disk: number;
  ip: string;
  region: string;
  load: number;
}

const mockServers: Server[] = [
  { id: '1', name: 'prod-web-01', status: 'running', cpu: 45, ram: 62, disk: 38, ip: '185.22.154.12', region: 'EU-West', load: 45 },
  { id: '2', name: 'prod-web-02', status: 'running', cpu: 72, ram: 85, disk: 55, ip: '185.22.154.13', region: 'EU-West', load: 72 },
  { id: '3', name: 'prod-api-01', status: 'running', cpu: 28, ram: 41, disk: 22, ip: '185.22.154.14', region: 'US-East', load: 28 },
  { id: '4', name: 'dev-test-01', status: 'stopped', cpu: 0, ram: 0, disk: 15, ip: '185.22.154.15', region: 'EU-West', load: 0 },
];

const cpuData = [
  { time: '00:00', value: 35 },
  { time: '04:00', value: 42 },
  { time: '08:00', value: 68 },
  { time: '12:00', value: 85 },
  { time: '16:00', value: 72 },
  { time: '20:00', value: 48 },
];

const trafficData = [
  { time: '00:00', incoming: 120, outgoing: 80 },
  { time: '04:00', incoming: 95, outgoing: 65 },
  { time: '08:00', incoming: 180, outgoing: 140 },
  { time: '12:00', incoming: 250, outgoing: 190 },
  { time: '16:00', incoming: 220, outgoing: 165 },
  { time: '20:00', incoming: 140, outgoing: 95 },
];

const loadBalancerData = [
  { name: 'prod-web-01', value: 45, color: '#8B5CF6' },
  { name: 'prod-web-02', value: 72, color: '#D946EF' },
  { name: 'prod-api-01', value: 28, color: '#0EA5E9' },
];

const Index = () => {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  const toggleServerStatus = (serverId: string) => {
    setServers(
      servers.map((server) =>
        server.id === serverId
          ? {
              ...server,
              status: server.status === 'running' ? 'stopped' : 'running',
              cpu: server.status === 'running' ? 0 : server.cpu,
              ram: server.status === 'running' ? 0 : server.ram,
            }
          : server
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-success';
      case 'stopped':
        return 'bg-destructive';
      case 'loading':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const runningServers = servers.filter((s) => s.status === 'running').length;
  const totalCpu = Math.round(servers.reduce((acc, s) => acc + s.cpu, 0) / servers.length);
  const totalRam = Math.round(servers.reduce((acc, s) => acc + s.ram, 0) / servers.length);
  const totalTraffic = '1.24 TB';

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Server" size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">VPS Panel</h1>
            </div>

            <nav className="space-y-2">
              {[
                { icon: 'LayoutDashboard', label: 'Dashboard', active: true },
                { icon: 'Server', label: 'Servers' },
                { icon: 'BarChart3', label: 'Analytics' },
                { icon: 'Wallet', label: 'Billing' },
                { icon: 'MessageSquare', label: 'Support' },
                { icon: 'Shield', label: 'Security' },
                { icon: 'Database', label: 'Backups' },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Управление виртуальными серверами</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card border-border animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name="Server" size={24} className="text-primary" />
                </div>
                <Badge className="bg-success/20 text-success border-0">Online</Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-1">Active Servers</p>
              <p className="text-3xl font-bold text-foreground">{runningServers}/{servers.length}</p>
            </Card>

            <Card className="p-6 bg-card border-border animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Icon name="Cpu" size={24} className="text-accent" />
                </div>
                <span className="text-sm text-muted-foreground">{totalCpu}%</span>
              </div>
              <p className="text-muted-foreground text-sm mb-1">Avg CPU Usage</p>
              <Progress value={totalCpu} className="h-2" />
            </Card>

            <Card className="p-6 bg-card border-border animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Icon name="MemoryStick" size={24} className="text-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">{totalRam}%</span>
              </div>
              <p className="text-muted-foreground text-sm mb-1">Avg RAM Usage</p>
              <Progress value={totalRam} className="h-2" />
            </Card>

            <Card className="p-6 bg-card border-border animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Icon name="Activity" size={24} className="text-warning" />
                </div>
                <Icon name="TrendingUp" size={16} className="text-success" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Total Traffic</p>
              <p className="text-3xl font-bold text-foreground">{totalTraffic}</p>
            </Card>
          </div>

          <Tabs defaultValue="servers" className="mb-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="servers">
                <Icon name="Server" size={16} className="mr-2" />
                Servers
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Icon name="BarChart3" size={16} className="mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="load-balancer">
                <Icon name="Network" size={16} className="mr-2" />
                Load Balancer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="servers" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {servers.map((server) => (
                  <Card
                    key={server.id}
                    className="p-6 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => setSelectedServer(server)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)} animate-pulse-glow`} />
                        <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
                      </div>
                      <Button
                        size="sm"
                        variant={server.status === 'running' ? 'destructive' : 'default'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleServerStatus(server.id);
                        }}
                      >
                        <Icon name={server.status === 'running' ? 'Square' : 'Play'} size={16} className="mr-2" />
                        {server.status === 'running' ? 'Stop' : 'Start'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                        <p className="text-sm font-medium text-foreground">{server.ip}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Region</p>
                        <p className="text-sm font-medium text-foreground">{server.region}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">CPU</span>
                          <span className="text-xs font-medium text-foreground">{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">RAM</span>
                          <span className="text-xs font-medium text-foreground">{server.ram}%</span>
                        </div>
                        <Progress value={server.ram} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Disk</span>
                          <span className="text-xs font-medium text-foreground">{server.disk}%</span>
                        </div>
                        <Progress value={server.disk} className="h-1.5" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Cpu" size={20} className="text-primary" />
                    CPU Usage (24h)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={cpuData}>
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                      <XAxis dataKey="time" stroke="hsl(215, 20.2%, 65.1%)" />
                      <YAxis stroke="hsl(215, 20.2%, 65.1%)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(222, 15%, 13%)',
                          border: '1px solid hsl(220, 15%, 20%)',
                          borderRadius: '8px',
                          color: 'hsl(210, 40%, 98%)',
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(262, 83%, 58%)" fill="url(#cpuGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Activity" size={20} className="text-accent" />
                    Network Traffic (24h)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                      <XAxis dataKey="time" stroke="hsl(215, 20.2%, 65.1%)" />
                      <YAxis stroke="hsl(215, 20.2%, 65.1%)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(222, 15%, 13%)',
                          border: '1px solid hsl(220, 15%, 20%)',
                          borderRadius: '8px',
                          color: 'hsl(210, 40%, 98%)',
                        }}
                      />
                      <Bar dataKey="incoming" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outgoing" fill="hsl(328, 85%, 70%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="load-balancer" className="mt-6">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Network" size={20} className="text-primary" />
                    Load Distribution
                  </h3>
                  <Badge className="bg-success/20 text-success border-0">Active</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={loadBalancerData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {loadBalancerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 15%, 13%)',
                            border: '1px solid hsl(220, 15%, 20%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {loadBalancerData.map((server) => (
                      <div key={server.name} className="p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{server.name}</span>
                          <span className="text-sm font-semibold" style={{ color: server.color }}>
                            {server.value}%
                          </span>
                        </div>
                        <Progress value={server.value} className="h-2" style={{ backgroundColor: `${server.color}20` }} />
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: server.color }} />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(server.value * 2.5)} requests/sec
                          </span>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Info" size={16} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">Load Balancing Algorithm</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Round Robin with Health Checks</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;

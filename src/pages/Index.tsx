import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ServerConsole from '@/components/ServerConsole';
import FileManager from '@/components/FileManager';
import {
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
  domain?: string;
}

const mockServers: Server[] = [
  { id: '1', name: 'minecraft-01', status: 'running', cpu: 45, ram: 62, disk: 38, ip: '185.22.154.12', region: 'EU-West', load: 45, domain: 'play.myserver.net:25565' },
  { id: '2', name: 'minecraft-02', status: 'running', cpu: 72, ram: 85, disk: 55, ip: '185.22.154.13', region: 'EU-West', load: 72, domain: 'play2.myserver.net:25565' },
  { id: '3', name: 'minecraft-03', status: 'running', cpu: 28, ram: 41, disk: 22, ip: '185.22.154.14', region: 'US-East', load: 28, domain: 'us.myserver.net:25565' },
  { id: '4', name: 'test-server', status: 'stopped', cpu: 0, ram: 0, disk: 15, ip: '185.22.154.15', region: 'EU-West', load: 0 },
];

const cpuData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 50) + 30,
}));

const trafficData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  incoming: Math.floor(Math.random() * 150) + 100,
  outgoing: Math.floor(Math.random() * 100) + 50,
}));

const loadBalancerData = [
  { name: 'minecraft-01', value: 45, color: '#8B5CF6' },
  { name: 'minecraft-02', value: 72, color: '#D946EF' },
  { name: 'minecraft-03', value: 28, color: '#0EA5E9' },
];

const Index = () => {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<Server>(mockServers[0]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleServerStatus = (serverId: string) => {
    setServers(
      servers.map((server) =>
        server.id === serverId
          ? {
              ...server,
              status: server.status === 'running' ? 'stopped' : 'running',
              cpu: server.status === 'running' ? 0 : 45,
              ram: server.status === 'running' ? 0 : 62,
            }
          : server
      )
    );
    if (selectedServer.id === serverId) {
      setSelectedServer({
        ...selectedServer,
        status: selectedServer.status === 'running' ? 'stopped' : 'running',
      });
    }
  };

  const restartServer = (serverId: string) => {
    setServers(
      servers.map((server) =>
        server.id === serverId ? { ...server, status: 'loading' } : server
      )
    );
    setTimeout(() => {
      setServers(
        servers.map((server) =>
          server.id === serverId ? { ...server, status: 'running' } : server
        )
      );
    }, 2000);
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

  const menuItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', tab: 'dashboard' },
    { icon: 'Server', label: 'Servers', tab: 'servers' },
    { icon: 'Terminal', label: 'Console', tab: 'console' },
    { icon: 'FolderTree', label: 'Files', tab: 'files' },
    { icon: 'BarChart3', label: 'Monitoring', tab: 'analytics' },
    { icon: 'Wallet', label: 'Billing', tab: 'billing' },
    { icon: 'Globe', label: 'Domains', tab: 'domains' },
    { icon: 'Shield', label: 'SFTP', tab: 'sftp' },
    { icon: 'User', label: 'Profile', tab: 'profile' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border fixed">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Server" size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">VPS Panel</h1>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.tab
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

        <main className="flex-1 ml-64 p-8 overflow-auto">
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
                <p className="text-muted-foreground">Управление серверами Minecraft</p>
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
                  <p className="text-muted-foreground text-sm mb-1">Avg CPU</p>
                  <Progress value={totalCpu} className="h-2" />
                </Card>

                <Card className="p-6 bg-card border-border animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Icon name="MemoryStick" size={24} className="text-secondary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{totalRam}%</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">Avg RAM</p>
                  <Progress value={totalRam} className="h-2" />
                </Card>

                <Card className="p-6 bg-card border-border animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Icon name="Users" size={24} className="text-warning" />
                    </div>
                    <Icon name="TrendingUp" size={16} className="text-success" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">Online Players</p>
                  <p className="text-3xl font-bold text-foreground">124</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {servers.map((server) => (
                  <Card key={server.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)} animate-pulse-glow`} />
                        <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restartServer(server.id)}
                          disabled={server.status !== 'running'}
                          title="Restart"
                        >
                          <Icon name="RotateCw" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant={server.status === 'running' ? 'destructive' : 'default'}
                          onClick={() => toggleServerStatus(server.id)}
                        >
                          <Icon name={server.status === 'running' ? 'Square' : 'Play'} size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {server.domain && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Connect:</span>
                          <span className="text-foreground font-mono text-xs">{server.domain}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">IP:</span>
                        <span className="text-foreground font-mono text-xs">{server.ip}</span>
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
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'console' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Server Console</h2>
                <p className="text-muted-foreground">Управление через консоль (op, stop, restart, say)</p>
              </div>

              <div className="mb-6 flex gap-2">
                {servers.map((server) => (
                  <Button
                    key={server.id}
                    variant={selectedServer.id === server.id ? 'default' : 'outline'}
                    onClick={() => setSelectedServer(server)}
                    size="sm"
                  >
                    {server.name}
                  </Button>
                ))}
              </div>

              <ServerConsole
                serverId={selectedServer.id}
                serverName={selectedServer.name}
                isRunning={selectedServer.status === 'running'}
              />
            </>
          )}

          {activeTab === 'files' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">File Manager</h2>
                <p className="text-muted-foreground">Полный доступ к файлам: просмотр, редактирование, загрузка, удаление</p>
              </div>

              <div className="mb-6 flex gap-2">
                {servers.map((server) => (
                  <Button
                    key={server.id}
                    variant={selectedServer.id === server.id ? 'default' : 'outline'}
                    onClick={() => setSelectedServer(server)}
                    size="sm"
                  >
                    {server.name}
                  </Button>
                ))}
              </div>

              <FileManager serverId={selectedServer.id} />
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Monitoring & Analytics</h2>
                <p className="text-muted-foreground">Мониторинг CPU, памяти, диска и анализ нагрузки</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Icon name="Network" size={20} className="text-primary" />
                  Load Balancer Distribution
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4">
                    {loadBalancerData.map((server) => (
                      <div key={server.name} className="p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{server.name}</span>
                          <span className="text-sm font-semibold" style={{ color: server.color }}>
                            {server.value}%
                          </span>
                        </div>
                        <Progress value={server.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'domains' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Domain Management</h2>
                <p className="text-muted-foreground">Настройка доменов для подключения к серверам</p>
              </div>

              <div className="grid gap-6">
                {servers.map((server) => (
                  <Card key={server.id} className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{server.name}</h3>
                        <p className="text-sm text-muted-foreground">IP: {server.ip}</p>
                      </div>
                      <Badge className={server.domain ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                        {server.domain ? 'Connected' : 'No domain'}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-foreground mb-2">Domain</Label>
                        <Input
                          defaultValue={server.domain || ''}
                          placeholder="play.myserver.net:25565"
                          className="font-mono"
                        />
                      </div>
                      <Button>
                        <Icon name="Save" size={16} className="mr-2" />
                        Save Domain
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'sftp' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">SFTP & API Settings</h2>
                <p className="text-muted-foreground">Настройки SFTP доступа и API ключей</p>
              </div>

              <div className="grid gap-6">
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon name="Key" size={24} className="text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">SFTP Credentials</h3>
                      <p className="text-sm text-muted-foreground">Доступ к файлам через SFTP</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2">Host</Label>
                      <Input value="sftp.vps-panel.com" readOnly className="font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground mb-2">Port</Label>
                        <Input value="2022" readOnly className="font-mono" />
                      </div>
                      <div>
                        <Label className="text-foreground mb-2">Protocol</Label>
                        <Input value="SFTP" readOnly />
                      </div>
                    </div>
                    <div>
                      <Label className="text-foreground mb-2">Username</Label>
                      <Input value="admin" readOnly className="font-mono" />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2">Password</Label>
                      <Input type="password" value="••••••••••" readOnly />
                    </div>
                    <Button>
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Generate New Password
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Code" size={20} className="text-accent" />
                    API Access
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2">API Key</Label>
                      <div className="flex gap-2">
                        <Input value="sk_live_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                        <Button variant="outline">
                          <Icon name="Copy" size={16} />
                        </Button>
                      </div>
                    </div>
                    <Button variant="destructive">
                      <Icon name="RotateCw" size={16} className="mr-2" />
                      Regenerate API Key
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h2>
                <p className="text-muted-foreground">Управление профилем и совладельцами</p>
              </div>

              <div className="grid gap-6">
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2">Full Name</Label>
                      <Input defaultValue="John Doe" />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2">Email</Label>
                      <Input type="email" defaultValue="john@example.com" />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2">Company</Label>
                      <Input defaultValue="My Company" />
                    </div>
                    <Button>
                      <Icon name="Save" size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Совладельцы (Co-Owners)</h3>
                  <p className="text-sm text-muted-foreground mb-4">Предоставьте полный доступ другим пользователям</p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Alice Smith</p>
                          <p className="text-xs text-muted-foreground">alice@example.com</p>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive">
                        <Icon name="UserMinus" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} className="text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Bob Johnson</p>
                          <p className="text-xs text-muted-foreground">bob@example.com</p>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive">
                        <Icon name="UserMinus" size={16} />
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Add Co-Owner
                  </Button>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Lock" size={16} className="mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Shield" size={16} className="mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'billing' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Billing & Payments</h2>
                <p className="text-muted-foreground">Управление платежами и подписками</p>
              </div>

              <div className="grid gap-6">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">$249.99</h3>
                      <p className="text-muted-foreground">Current balance</p>
                    </div>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Top Up
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Active Subscriptions</h3>
                  <div className="space-y-3">
                    {servers.map((server) => (
                      <div key={server.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground">{server.name}</p>
                          <p className="text-sm text-muted-foreground">Plan: Premium • $29.99/month</p>
                        </div>
                        <Badge className="bg-success/20 text-success">Active</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Payment History</h3>
                  <div className="space-y-3">
                    {[
                      { date: 'Dec 1, 2024', amount: '$29.99', status: 'Paid' },
                      { date: 'Nov 1, 2024', amount: '$29.99', status: 'Paid' },
                      { date: 'Oct 1, 2024', amount: '$29.99', status: 'Paid' },
                    ].map((payment, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground">{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                        <Badge className="bg-success/20 text-success">{payment.status}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'servers' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">All Servers</h2>
                <p className="text-muted-foreground">Полный список всех серверов с управлением</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {servers.map((server) => (
                  <Card
                    key={server.id}
                    className="p-6 bg-card border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)} animate-pulse-glow`} />
                        <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restartServer(server.id)}
                          disabled={server.status !== 'running'}
                          title="Restart"
                        >
                          <Icon name="RotateCw" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant={server.status === 'running' ? 'destructive' : 'default'}
                          onClick={() => toggleServerStatus(server.id)}
                          title={server.status === 'running' ? 'Stop' : 'Start'}
                        >
                          <Icon name={server.status === 'running' ? 'Square' : 'Play'} size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Domain</p>
                        <p className="text-sm font-medium text-foreground">{server.domain || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">IP</p>
                        <p className="text-sm font-medium text-foreground font-mono">{server.ip}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Region</p>
                        <p className="text-sm font-medium text-foreground">{server.region}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <Badge className={`${getStatusColor(server.status)} text-white border-0`}>
                          {server.status}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="my-4" />

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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;

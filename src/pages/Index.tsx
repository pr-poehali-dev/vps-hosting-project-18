import { useState, useEffect } from 'react';
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
import AuthModal from '@/components/AuthModal';
import TopUpModal from '@/components/TopUpModal';
import AddCoOwnerModal from '@/components/AddCoOwnerModal';
import OnlinePlayers from '@/components/OnlinePlayers';
import BackupScheduler from '@/components/BackupScheduler';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAddCoOwnerModal, setShowAddCoOwnerModal] = useState(false);
  const [balance, setBalance] = useState(249.99);
  const [coOwners, setCoOwners] = useState([
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', permissions: ['console', 'files', 'settings'] },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', permissions: ['console', 'files'] },
  ]);
  const [paymentHistory, setPaymentHistory] = useState([
    { id: '1', date: 'Dec 1, 2024', amount: 29.99, method: 'Credit Card', status: 'Paid' as const },
    { id: '2', date: 'Nov 1, 2024', amount: 29.99, method: 'PayPal', status: 'Paid' as const },
    { id: '3', date: 'Oct 1, 2024', amount: 29.99, method: 'Credit Card', status: 'Paid' as const },
  ]);
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<Server>(mockServers[0]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUsername = localStorage.getItem('vps_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsAuthenticated(true);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleLogin = (user: string) => {
    localStorage.setItem('vps_username', user);
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vps_username');
    setUsername('');
    setIsAuthenticated(false);
    setShowAuthModal(true);
  };

  const handleTopUp = (amount: number, method: string) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    
    const newPayment = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: amount,
      method: method === 'card' ? 'Credit Card' : method === 'paypal' ? 'PayPal' : method === 'crypto' ? 'Cryptocurrency' : 'Bank Transfer',
      status: 'Paid' as const
    };
    
    setPaymentHistory([newPayment, ...paymentHistory]);
  };

  const handleAddCoOwner = (email: string, name: string, permissions: string[]) => {
    const newCoOwner = {
      id: String(Date.now()),
      name,
      email,
      permissions,
    };
    setCoOwners([...coOwners, newCoOwner]);
  };

  const handleRemoveCoOwner = (coOwnerId: string) => {
    setCoOwners(coOwners.filter(co => co.id !== coOwnerId));
  };

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
      if (selectedServer.id === serverId) {
        setSelectedServer({ ...selectedServer, status: 'running' });
      }
    }, 15000);
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
    { icon: 'Users', label: 'Players', tab: 'players' },
    { icon: 'Terminal', label: 'Console', tab: 'console' },
    { icon: 'FolderTree', label: 'Files', tab: 'files' },
    { icon: 'Archive', label: 'Backups', tab: 'backups' },
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
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">VPS Panel</h1>
                {isAuthenticated && (
                  <p className="text-xs text-muted-foreground">@{username}</p>
                )}
              </div>
            </div>

            <nav className="space-y-2 mb-4">
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

            <div className="border-t border-sidebar-border pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={handleLogout}
              >
                <Icon name="LogOut" size={20} className="mr-3" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />

        <TopUpModal
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          currentBalance={balance}
          onTopUp={handleTopUp}
        />

        <AddCoOwnerModal
          isOpen={showAddCoOwnerModal}
          onClose={() => setShowAddCoOwnerModal(false)}
          onAdd={handleAddCoOwner}
        />

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
                      <div className="space-y-1">
                        {server.domain && (
                          <div className="p-2 bg-primary/10 rounded border border-primary/20">
                            <p className="text-xs text-muted-foreground mb-1">Connect via DNS:</p>
                            <p className="text-sm font-mono text-primary font-semibold">{server.domain}</p>
                          </div>
                        )}
                        <div className="p-2 bg-muted/30 rounded border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Direct IP:</p>
                          <p className="text-sm font-mono text-foreground">{server.ip}:25565</p>
                        </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ServerConsole
                    serverId={selectedServer.id}
                    serverName={selectedServer.name}
                    isRunning={selectedServer.status === 'running'}
                  />
                </div>
                <div>
                  <OnlinePlayers
                    serverId={selectedServer.id}
                    serverName={selectedServer.name}
                    isRunning={selectedServer.status === 'running'}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'players' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Online Players</h2>
                <p className="text-muted-foreground">Мониторинг игроков в реальном времени</p>
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

              <OnlinePlayers
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

          {activeTab === 'backups' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Backup Management</h2>
                <p className="text-muted-foreground">Автоматические бэкапы по расписанию</p>
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

              <BackupScheduler
                serverId={selectedServer.id}
                serverName={selectedServer.name}
              />
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
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-semibold text-primary mb-2">✅ SFTP is Active</p>
                      <p className="text-xs text-muted-foreground">Use these credentials in FileZilla, WinSCP, or Cyberduck</p>
                    </div>
                    <div>
                      <Label className="text-foreground mb-2">Host</Label>
                      <div className="flex gap-2">
                        <Input value="sftp.vps-panel.com" readOnly className="font-mono" />
                        <Button variant="outline" size="sm">
                          <Icon name="Copy" size={16} />
                        </Button>
                      </div>
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
                      <div className="flex gap-2">
                        <Input value={username || 'admin'} readOnly className="font-mono" />
                        <Button variant="outline" size="sm">
                          <Icon name="Copy" size={16} />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-foreground mb-2">Password</Label>
                      <div className="flex gap-2">
                        <Input type="password" value="vps_secure_2024_pass" readOnly className="font-mono" />
                        <Button variant="outline" size="sm">
                          <Icon name="Copy" size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm font-semibold text-foreground mb-2">Quick Connect String:</p>
                      <code className="text-xs font-mono text-accent break-all">
                        sftp://{username || 'admin'}@sftp.vps-panel.com:2022
                      </code>
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
                      <Label className="text-foreground mb-2">Minecraft Username</Label>
                      <Input value={username} readOnly className="font-mono bg-muted" />
                      <p className="text-xs text-muted-foreground mt-1">
                        This is your login username. Cannot be changed.
                      </p>
                    </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Совладельцы (Co-Owners)</h3>
                      <p className="text-sm text-muted-foreground">Пригласите пользователей по email для совместного управления</p>
                    </div>
                    <Button onClick={() => setShowAddCoOwnerModal(true)}>
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Add Co-Owner
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {coOwners.map((coOwner) => (
                      <div key={coOwner.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{coOwner.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{coOwner.name}</p>
                            <p className="text-sm text-muted-foreground">{coOwner.email}</p>
                            <div className="flex gap-1 mt-1">
                              {coOwner.permissions.slice(0, 3).map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {coOwner.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{coOwner.permissions.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveCoOwner(coOwner.id)}>
                          <Icon name="UserMinus" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
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
                      <h3 className="text-3xl font-bold text-foreground mb-1 text-center">$3.00</h3>
                      <p className="text-muted-foreground">Current balance</p>
                    </div>
                    <Button onClick={() => setShowTopUpModal(true)} size="lg">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Top Up Balance
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">+${paymentHistory.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Deposited</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">${(servers.length * 29.99).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Monthly Cost</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{Math.floor(balance / (servers.length * 29.99))} mo</p>
                      <p className="text-xs text-muted-foreground mt-1">Remaining Time</p>
                    </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
                    <Button variant="outline" size="sm">
                      <Icon name="Download" size={16} className="mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                            <Icon name="CheckCircle2" size={20} className="text-success" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">${payment.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{payment.date} • {payment.method}</p>
                          </div>
                        </div>
                        <Badge className="bg-success/20 text-success border-0">{payment.status}</Badge>
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
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface BackupSchedulerProps {
  serverId: string;
  serverName: string;
}

interface BackupSchedule {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  time: string;
  retention: number;
  autoCleanup: boolean;
}

interface BackupEntry {
  id: string;
  filename: string;
  size: string;
  date: string;
  type: 'auto' | 'manual';
}

const BackupScheduler = ({ serverId, serverName }: BackupSchedulerProps) => {
  const [schedule, setSchedule] = useState<BackupSchedule>({
    enabled: true,
    frequency: 'daily',
    time: '03:00',
    retention: 7,
    autoCleanup: true,
  });

  const [backups, setBackups] = useState<BackupEntry[]>([
    { id: '1', filename: 'backup_2024-12-02_03-00.zip', size: '256 MB', date: '2 hours ago', type: 'auto' },
    { id: '2', filename: 'backup_2024-12-01_03-00.zip', size: '248 MB', date: '1 day ago', type: 'auto' },
    { id: '3', filename: 'manual_backup_important.zip', size: '255 MB', date: '2 days ago', type: 'manual' },
    { id: '4', filename: 'backup_2024-11-30_03-00.zip', size: '242 MB', date: '3 days ago', type: 'auto' },
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    
    setTimeout(() => {
      const newBackup: BackupEntry = {
        id: String(Date.now()),
        filename: `manual_backup_${new Date().toISOString().split('T')[0]}.zip`,
        size: `${Math.floor(Math.random() * 50 + 240)} MB`,
        date: 'Just now',
        type: 'manual',
      };
      setBackups([newBackup, ...backups]);
      setIsCreatingBackup(false);
    }, 3000);
  };

  const handleDownloadBackup = (backupId: string) => {
    console.log('Downloading backup:', backupId);
  };

  const handleDeleteBackup = (backupId: string) => {
    setBackups(backups.filter(b => b.id !== backupId));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Automatic Backups</h3>
          </div>
          <Switch
            checked={schedule.enabled}
            onCheckedChange={(checked) => setSchedule({ ...schedule, enabled: checked })}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2">Frequency</Label>
              <Select
                value={schedule.frequency}
                onValueChange={(value: 'hourly' | 'daily' | 'weekly') => 
                  setSchedule({ ...schedule, frequency: value })
                }
                disabled={!schedule.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2">Time (Server Time)</Label>
              <Select
                value={schedule.time}
                onValueChange={(value) => setSchedule({ ...schedule, time: value })}
                disabled={!schedule.enabled || schedule.frequency === 'hourly'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="00:00">00:00 (Midnight)</SelectItem>
                  <SelectItem value="03:00">03:00 (3 AM)</SelectItem>
                  <SelectItem value="06:00">06:00 (6 AM)</SelectItem>
                  <SelectItem value="12:00">12:00 (Noon)</SelectItem>
                  <SelectItem value="18:00">18:00 (6 PM)</SelectItem>
                  <SelectItem value="21:00">21:00 (9 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2">Retention Period</Label>
              <Select
                value={String(schedule.retention)}
                onValueChange={(value) => setSchedule({ ...schedule, retention: parseInt(value) })}
                disabled={!schedule.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <Label className="text-foreground">Auto Cleanup</Label>
                <p className="text-xs text-muted-foreground">Delete old backups</p>
              </div>
              <Switch
                checked={schedule.autoCleanup}
                onCheckedChange={(checked) => setSchedule({ ...schedule, autoCleanup: checked })}
                disabled={!schedule.enabled}
              />
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-primary mb-1">Next Backup Schedule</p>
                <p className="text-muted-foreground">
                  {schedule.enabled
                    ? `Next backup will be created ${
                        schedule.frequency === 'hourly'
                          ? 'in the next hour'
                          : schedule.frequency === 'daily'
                          ? `daily at ${schedule.time}`
                          : `weekly on Sunday at ${schedule.time}`
                      }`
                    : 'Automatic backups are disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Archive" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Backup History</h3>
          </div>
          <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
            {isCreatingBackup ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon name="Download" size={16} className="mr-2" />
                Create Backup Now
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {backups.map((backup) => (
            <div
              key={backup.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  backup.type === 'auto' ? 'bg-primary/10' : 'bg-accent/10'
                }`}>
                  <Icon
                    name={backup.type === 'auto' ? 'Clock' : 'FileArchive'}
                    size={20}
                    className={backup.type === 'auto' ? 'text-primary' : 'text-accent'}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{backup.filename}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{backup.size}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{backup.date}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        backup.type === 'auto'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-accent/10 text-accent border-accent/20'
                      }`}
                    >
                      {backup.type === 'auto' ? 'Auto' : 'Manual'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadBackup(backup.id)}
                >
                  <Icon name="Download" size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteBackup(backup.id)}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Backups</p>
            <p className="text-xl font-bold text-foreground">{backups.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Size</p>
            <p className="text-xl font-bold text-foreground">
              {backups.reduce((sum, b) => sum + parseInt(b.size), 0)} MB
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Backup</p>
            <p className="text-xl font-bold text-primary">{backups[0]?.date || 'Never'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BackupScheduler;

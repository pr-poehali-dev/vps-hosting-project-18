import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AddCoOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string, name: string, permissions: string[]) => void;
}

const AddCoOwnerModal = ({ isOpen, onClose, onAdd }: AddCoOwnerModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['console', 'files']);
  const [isProcessing, setIsProcessing] = useState(false);

  const permissions = [
    { id: 'console', name: 'Console Access', icon: 'Terminal', description: 'Execute server commands' },
    { id: 'files', name: 'File Management', icon: 'FolderTree', description: 'Upload, edit, delete files' },
    { id: 'settings', name: 'Server Settings', icon: 'Settings', description: 'Change server configuration' },
    { id: 'billing', name: 'Billing Access', icon: 'Wallet', description: 'View and manage payments' },
    { id: 'users', name: 'User Management', icon: 'Users', description: 'Add/remove co-owners' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim() || selectedPermissions.length === 0) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      onAdd(email.trim(), name.trim(), selectedPermissions);
      setIsProcessing(false);
      setEmail('');
      setName('');
      setSelectedPermissions(['console', 'files']);
      onClose();
    }, 1500);
  };

  const togglePermission = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="UserPlus" size={24} className="text-primary" />
            Add Co-Owner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              💡 Co-owners will receive an email invitation to access this VPS panel. 
              They can manage servers according to the permissions you grant.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-foreground mb-2">
                Full Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="font-medium"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground mb-2">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="font-medium"
              />
            </div>
          </div>

          <div>
            <Label className="text-foreground mb-3 block">
              Permissions
              <span className="text-muted-foreground font-normal ml-2">
                (Select at least one)
              </span>
            </Label>
            <div className="space-y-2">
              {permissions.map((permission) => (
                <button
                  key={permission.id}
                  type="button"
                  onClick={() => togglePermission(permission.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedPermissions.includes(permission.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon
                        name={permission.icon}
                        size={20}
                        className={
                          selectedPermissions.includes(permission.id)
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }
                      />
                      <div>
                        <p className={`font-medium ${
                          selectedPermissions.includes(permission.id)
                            ? 'text-primary'
                            : 'text-foreground'
                        }`}>
                          {permission.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                    {selectedPermissions.includes(permission.id) && (
                      <Icon name="CheckCircle2" size={20} className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <p className="text-sm text-warning flex items-center gap-2">
              <Icon name="AlertTriangle" size={16} />
              Co-owners will have significant access. Only invite trusted users.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!email.trim() || !name.trim() || selectedPermissions.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoOwnerModal;

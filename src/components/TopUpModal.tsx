import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onTopUp: (amount: number, method: string) => void;
}

const TopUpModal = ({ isOpen, onClose, currentBalance, onTopUp }: TopUpModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard', popular: true },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet', popular: true },
    { id: 'crypto', name: 'Cryptocurrency', icon: 'Bitcoin', popular: false },
    { id: 'bank', name: 'Bank Transfer', icon: 'Landmark', popular: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0 || !selectedMethod) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      onTopUp(numAmount, selectedMethod);
      setIsProcessing(false);
      setAmount('');
      setSelectedMethod('');
      onClose();
    }, 2000);
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Wallet" size={24} className="text-primary" />
            Top Up Balance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-foreground">${currentBalance.toFixed(2)}</p>
              </div>
              {amount && parseFloat(amount) > 0 && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">New Balance</p>
                  <p className="text-2xl font-bold text-success">
                    ${(currentBalance + parseFloat(amount)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="amount" className="text-foreground mb-2">
                Amount to add (USD)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 text-lg font-semibold"
                  min="1"
                  step="0.01"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={amount === preset.toString() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetAmount(preset)}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-foreground mb-3 block">Select Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon
                        name={method.icon}
                        size={24}
                        className={selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'}
                      />
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className={`font-medium ${
                      selectedMethod === method.id ? 'text-primary' : 'text-foreground'
                    }`}>
                      {method.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold text-foreground">
                  ${amount || '0.00'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Processing Fee (2.9%)</span>
                <span className="font-semibold text-foreground">
                  ${amount ? ((parseFloat(amount) * 0.029).toFixed(2)) : '0.00'}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">
                  ${amount ? ((parseFloat(amount) * 1.029).toFixed(2)) : '0.00'}
                </span>
              </div>
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
                disabled={!amount || parseFloat(amount) <= 0 || !selectedMethod || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={16} className="mr-2" />
                    Add ${amount || '0.00'}
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              🔒 Payments are processed securely. Your card information is encrypted.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;

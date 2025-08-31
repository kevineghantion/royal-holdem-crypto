import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Bitcoin, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet' | 'win';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  description: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 500.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000),
    description: 'Credit Card Deposit'
  },
  {
    id: '2',
    type: 'bet',
    amount: -25.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    description: 'Poker Table #5'
  },
  {
    id: '3',
    type: 'win',
    amount: 150.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
    description: 'Blackjack Win'
  },
  {
    id: '4',
    type: 'withdraw',
    amount: -100.00,
    status: 'pending',
    timestamp: new Date(Date.now() - 1800000),
    description: 'Bank Transfer'
  }
];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit' | 'crypto' | 'bank'>('credit');
  
  const { walletBalance, updateWalletBalance } = useAuth();
  const { toast } = useToast();

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    // Mock deposit processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateWalletBalance(walletBalance + amount);
    
    toast({
      title: "Deposit successful!",
      description: `$${amount.toFixed(2)} has been added to your wallet.`,
    });
    
    setDepositAmount('');
    setActiveTab('overview');
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > walletBalance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    // Mock withdrawal processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateWalletBalance(walletBalance - amount);
    
    toast({
      title: "Withdrawal initiated!",
      description: `$${amount.toFixed(2)} withdrawal is being processed.`,
    });
    
    setWithdrawAmount('');
    setActiveTab('overview');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'withdraw': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'bet': return <Minus className="w-4 h-4 text-orange-500" />;
      case 'win': return <Plus className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient-royal flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6">
          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-elegant">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">${walletBalance.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card className="card-elegant">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">$0.00</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'overview' ? 'royal' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === 'deposit' ? 'royal' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('deposit')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Deposit
            </Button>
            <Button 
              variant={activeTab === 'withdraw' ? 'royal' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('withdraw')}
            >
              <Minus className="w-4 h-4 mr-1" />
              Withdraw
            </Button>
          </div>

          <div className="min-h-[300px] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <div className="space-y-2">
                  {mockTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/40"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="text-sm font-medium">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(transaction.timestamp)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        {getStatusIcon(transaction.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'deposit' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deposit Funds</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button
                        variant={selectedPaymentMethod === 'credit' ? 'royal' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPaymentMethod('credit')}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Card
                      </Button>
                      <Button
                        variant={selectedPaymentMethod === 'crypto' ? 'royal' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPaymentMethod('crypto')}
                        className="flex items-center gap-2"
                      >
                        <Bitcoin className="w-4 h-4" />
                        Crypto
                      </Button>
                      <Button
                        variant={selectedPaymentMethod === 'bank' ? 'royal' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPaymentMethod('bank')}
                        className="flex items-center gap-2"
                      >
                        <Banknote className="w-4 h-4" />
                        Bank
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleDeposit} className="w-full" variant="royal">
                    Deposit ${depositAmount || '0.00'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Withdraw Funds</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={walletBalance}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Available: ${walletBalance.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      <strong>KYC Required:</strong> Withdrawals require identity verification. This is a demo placeholder.
                    </div>
                  </div>

                  <Button onClick={handleWithdraw} className="w-full" variant="royal">
                    Withdraw ${withdrawAmount || '0.00'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
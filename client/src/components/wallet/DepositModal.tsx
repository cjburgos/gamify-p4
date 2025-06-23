import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/contexts/WalletContext'
import { useToast } from '@/hooks/use-toast'
import { Coins, ArrowRight, AlertCircle } from 'lucide-react'

type TokenType = 'USDC' | 'PYUSD'

export function DepositModal() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenType>('USDC')
  const [isDepositing, setIsDepositing] = useState(false)
  
  const { depositTickets, isLoading } = useWallet()
  const { toast } = useToast()

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount)
    
    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive"
      })
      return
    }

    if (depositAmount < 1) {
      toast({
        title: "Minimum Deposit",
        description: "Minimum deposit is $1 USD",
        variant: "destructive"
      })
      return
    }

    setIsDepositing(true)
    try {
      await depositTickets(depositAmount, selectedToken)
      toast({
        title: "Deposit Successful!",
        description: `Deposited ${depositAmount} ${selectedToken} for ${depositAmount} Tickets`,
      })
      setAmount('')
      setOpen(false)
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDepositing(false)
    }
  }

  const isValidAmount = amount && parseFloat(amount) >= 1

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-neon-green to-cyber-blue hover:from-cyber-blue hover:to-electric-purple font-bold transition-all duration-300 hover:scale-105">
          <Coins className="w-4 h-4 mr-2" />
          Deposit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-dark-secondary border-gray-700/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">Deposit Stablecoins</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-dark-primary p-4 rounded-lg border border-gray-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-gold-accent" />
              <span className="text-sm font-semibold text-gold-accent">1:1 Exchange Rate</span>
            </div>
            <p className="text-xs text-gray-400">
              Deposit stablecoins to receive Tickets at a 1:1 rate. Use Tickets to join games on the platform.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="token" className="text-sm font-medium text-white">
                Select Stablecoin
              </Label>
              <Select value={selectedToken} onValueChange={(value: TokenType) => setSelectedToken(value)}>
                <SelectTrigger className="bg-dark-tertiary border-gray-600 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-tertiary border-gray-600">
                  <SelectItem value="USDC" className="text-white hover:bg-dark-secondary">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      USDC
                    </div>
                  </SelectItem>
                  <SelectItem value="PYUSD" className="text-white hover:bg-dark-secondary">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500" />
                      PYUSD
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-white">
                Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-dark-tertiary border-gray-600 text-white mt-2"
                min="1"
                step="0.01"
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimum: $1.00 USD
              </p>
            </div>

            {isValidAmount && (
              <Card className="bg-dark-tertiary border-gray-600/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">You will receive:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gold-accent">{amount} Tickets</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-orange-200">
                <p className="font-semibold mb-1">Important:</p>
                <p>Make sure your wallet is connected to Flow EVM network before depositing.</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={!isValidAmount || isDepositing || isLoading}
            className="w-full bg-gradient-to-r from-neon-green to-cyber-blue hover:from-cyber-blue hover:to-electric-purple font-bold"
          >
            {isDepositing || isLoading ? 'Processing...' : `Deposit ${amount || '0'} ${selectedToken}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
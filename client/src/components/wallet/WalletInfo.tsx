import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useWallet } from '@/contexts/WalletContext'
import { Wallet, LogOut, Ticket, Copy, Check } from 'lucide-react'
import { DepositModal } from './DepositModal'

export function WalletInfo() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { ticketBalance, ethBalance } = useWallet()
  const [copied, setCopied] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)

  if (!address) return null

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      {/* Tickets Balance Display */}
      <Badge className="bg-gold-accent/20 text-gold-accent border-gold-accent/30 px-3 py-2 text-sm font-semibold">
        <Ticket className="w-4 h-4 mr-2" />
        {ticketBalance.toLocaleString()} Tickets
      </Badge>

      {/* Deposit Button */}
      <DepositModal />

      {/* Wallet Info */}
      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-dark-tertiary border-gray-600 text-white hover:bg-dark-secondary hover:border-electric-purple/30 transition-all"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {formatAddress(address)}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-dark-secondary border-gray-700/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold gradient-text">Wallet Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-dark-tertiary border-gray-600/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Wallet Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-white bg-dark-primary px-2 py-1 rounded">
                    {address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="text-cyber-blue hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-dark-tertiary border-gray-600/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Tickets Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-gold-accent" />
                    <span className="text-lg font-bold text-gold-accent">
                      {ticketBalance.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-tertiary border-gray-600/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">ETH Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-electric-purple to-cyber-blue" />
                    <span className="text-lg font-bold text-white">
                      {parseFloat(ethBalance).toFixed(4)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-gray-600/50" />

            <Button
              onClick={() => {
                disconnect()
                setWalletOpen(false)
              }}
              variant="destructive"
              className="w-full bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
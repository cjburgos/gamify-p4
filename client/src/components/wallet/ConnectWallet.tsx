import { useState } from 'react'
import { useConnect, useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Zap } from 'lucide-react'

export function ConnectWallet() {
  const [open, setOpen] = useState(false)
  const { connectors, connect, isPending } = useConnect()
  const { isConnected } = useAccount()

  if (isConnected) {
    return null
  }

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-electric-purple to-cyber-blue hover:from-cyber-blue hover:to-neon-green font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-electric-purple/25"
          disabled={isPending}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-secondary border-gray-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Connect your wallet to join games and manage your Tickets on Flow EVM
          </p>
          
          <div className="grid gap-3">
            {connectors.map((connector) => (
              <Card 
                key={connector.id}
                className="bg-dark-tertiary border-gray-600/50 hover:border-electric-purple/30 transition-all cursor-pointer"
                onClick={() => handleConnect(connector.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-electric-purple to-cyber-blue flex items-center justify-center">
                      {connector.name === 'MetaMask' && <Zap className="w-4 h-4 text-white" />}
                      {connector.name !== 'MetaMask' && <Wallet className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm">{connector.name}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs">
                        {connector.name === 'MetaMask' && 'Most popular wallet'}
                        {connector.name === 'WalletConnect' && 'Scan with mobile wallet'}
                        {connector.name === 'Injected' && 'Browser wallet'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-dark-primary rounded-lg border border-gray-600/30">
            <p className="text-xs text-gray-400">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
              Make sure you're on the Flow EVM network.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
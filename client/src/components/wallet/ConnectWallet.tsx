import { useState } from 'react'
import { useConnect, useAccount, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Zap, AlertCircle } from 'lucide-react'
import { flowTestnet, flowMainnet } from '@/lib/wagmi'

export function ConnectWallet() {
  const [open, setOpen] = useState(false)
  const { connectors, connect, isPending } = useConnect()
  const { isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()

  // Check if connected to Flow network (chain ID 545 or 747)
  const isOnFlowNetwork = chain?.id === 545 || chain?.id === 747
  const needsNetworkSwitch = isConnected && !isOnFlowNetwork

  if (isConnected && isOnFlowNetwork) {
    return null
  }

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ 
        connector,
        chainId: flowTestnet.id // Default to Flow testnet
      })
      setOpen(false)
    }
  }

  const handleSwitchToFlow = () => {
    switchChain({ chainId: flowTestnet.id })
  }

  // Show network switch button if connected but wrong network
  if (needsNetworkSwitch) {
    return (
      <Button 
        onClick={handleSwitchToFlow}
        className="bg-red-600 border border-red-500 text-white hover:bg-red-700 font-medium px-4 py-2 rounded-lg transition-all duration-300"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Switch to Flow
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 font-medium px-4 py-2 rounded-lg transition-all duration-300"
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
            Connect your wallet to deploy games and manage your earnings on Flow EVM (Chain ID 545 or 747)
          </p>
          
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <p className="text-xs text-blue-200">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              This app will automatically connect to Flow Testnet (Chain ID 545). You can switch to Flow Mainnet (Chain ID 747) after connecting.
            </p>
          </div>
          
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
              The app will search for Flow accounts on Chain ID 545 (testnet) or 747 (mainnet).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Zap, AlertCircle, Network } from 'lucide-react'
import { useFlow } from '@/contexts/FlowContext'

// in the browser
import * as fcl from "@onflow/fcl"

fcl.config({
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
})




export function ConnectWallet() {
  const [open, setOpen] = useState(false)
  const { user, isLoading, network, connect, switchToMainnet, switchToTestnet } = useFlow()

  // If user is connected, don't show the connect button
  if (user?.loggedIn) {
    return null
  }

  const handleConnect = async () => {
    try {
      await connect()
      setOpen(false)
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 font-medium px-4 py-2 rounded-lg transition-all duration-300"
          disabled={isLoading}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-secondary border-gray-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">Connect Flow Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Connect your native Flow wallet to deploy games and manage your earnings on Flow blockchain
          </p>
          
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <p className="text-xs text-blue-200 flex items-center">
              <Network className="w-3 h-3 mr-1" />
              Currently on Flow {network}. You can switch networks after connecting.
            </p>
          </div>
          
          <Card 
            className="bg-dark-tertiary border-gray-600/50 hover:border-electric-purple/30 transition-all cursor-pointer"
            onClick={handleConnect}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Connect Flow Wallet</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    Scan QR code with your Flow wallet app or connect via browser extension
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <p className="text-xs text-purple-200 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Flow Kit will open an authentication modal with QR code for mobile wallets or direct connection for browser wallets.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={switchToTestnet}
              className={`${network === 'testnet' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              Testnet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={switchToMainnet}
              className={`${network === 'mainnet' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
            >
              Mainnet
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-dark-primary rounded-lg border border-gray-600/30">
            <p className="text-xs text-gray-400">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
              Flow wallets support native Flow accounts and FLOW token transactions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
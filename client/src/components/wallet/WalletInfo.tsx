import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, LogOut, Network, Copy } from 'lucide-react'
import { useFlow } from '../../contexts/MinimalFlowContext'
import { useToast } from '@/hooks/use-toast'

export function WalletInfo() {
  const { user, balance, network, disconnect, switchToMainnet, switchToTestnet } = useFlow()
  const { toast } = useToast()

  if (!user?.loggedIn) {
    return null
  }

  const handleCopyAddress = () => {
    if (user.addr) {
      navigator.clipboard.writeText(user.addr)
      toast({
        title: "Address copied",
        description: "Flow address copied to clipboard",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Flow wallet",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="bg-dark-secondary border-gray-700/50 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-sm">Flow Account</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Connected to Flow {network}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <Network className="w-3 h-3 mr-1" />
            {network}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Address</p>
            <p className="text-sm text-white font-mono">
              {user.addr ? formatAddress(user.addr) : 'Unknown'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAddress}
            className="text-gray-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <p className="text-xs text-gray-400">Balance</p>
          <p className="text-sm text-white">
            {parseFloat(balance).toFixed(4)} FLOW
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={switchToTestnet}
            className={`text-xs ${network === 'testnet' ? 'bg-blue-600 text-white border-blue-500' : 'text-gray-400 border-gray-600'}`}
          >
            Testnet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={switchToMainnet}
            className={`text-xs ${network === 'mainnet' ? 'bg-green-600 text-white border-green-500' : 'text-gray-400 border-gray-600'}`}
          >
            Mainnet
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDisconnect}
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}
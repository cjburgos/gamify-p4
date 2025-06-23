import { ReactNode } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectWallet } from './ConnectWallet'
import { Wallet, Lock } from 'lucide-react'

interface WalletGuardProps {
  children: ReactNode
  requiredTickets?: number
  showTicketRequirement?: boolean
}

export function WalletGuard({ 
  children, 
  requiredTickets = 0, 
  showTicketRequirement = false 
}: WalletGuardProps) {
  const { isConnected, ticketBalance } = useWallet()

  if (!isConnected) {
    return (
      <Card className="bg-dark-secondary/50 border-gray-700/50 p-6">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-purple to-cyber-blue flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Wallet Required</CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet to join games and manage your Tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ConnectWallet />
        </CardContent>
      </Card>
    )
  }

  if (showTicketRequirement && ticketBalance < requiredTickets) {
    return (
      <Card className="bg-dark-secondary/50 border-gray-700/50 p-6">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-accent to-neon-green flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Insufficient Tickets</CardTitle>
          <CardDescription className="text-gray-400">
            You need {requiredTickets} Tickets to join this game. You have {ticketBalance} Tickets.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ConnectWallet />
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
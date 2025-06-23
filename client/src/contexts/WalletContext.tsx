import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { formatUnits } from 'viem'

interface WalletContextType {
  isConnected: boolean
  address: string | undefined
  ticketBalance: number
  ethBalance: string
  connect: () => void
  disconnect: () => void
  depositTickets: (amount: number, token: 'USDC' | 'PYUSD') => Promise<void>
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [ticketBalance, setTicketBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const { data: balanceData } = useBalance({
    address: address,
  })

  const ethBalance = balanceData ? formatUnits(balanceData.value, balanceData.decimals) : '0'

  // Mock ticket balance for now (would come from smart contract)
  useEffect(() => {
    if (isConnected && address) {
      // Simulate fetching ticket balance from smart contract
      const storedBalance = localStorage.getItem(`tickets_${address}`)
      setTicketBalance(storedBalance ? parseInt(storedBalance) : 0)
    } else {
      setTicketBalance(0)
    }
  }, [isConnected, address])

  const connect = () => {
    // This will be handled by the Connect Wallet button component
  }

  const depositTickets = async (amount: number, token: 'USDC' | 'PYUSD') => {
    if (!address) return
    
    setIsLoading(true)
    try {
      // Mock deposit for now (would interact with smart contract)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction
      
      const newBalance = ticketBalance + amount
      setTicketBalance(newBalance)
      localStorage.setItem(`tickets_${address}`, newBalance.toString())
      
      console.log(`Deposited ${amount} ${token} for ${amount} Tickets`)
    } catch (error) {
      console.error('Deposit failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: WalletContextType = {
    isConnected,
    address,
    ticketBalance,
    ethBalance,
    connect,
    disconnect,
    depositTickets,
    isLoading,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  authenticateUser, 
  unauthenticateUser, 
  subscribeToAuth, 
  getCurrentUser,
  getAccountBalance,
  switchNetwork
} from '@/lib/flow'

interface FlowUser {
  addr?: string
  loggedIn: boolean
  cid?: string
  expiresAt?: number
  f_type: string
  f_vsn: string
  services: any[]
}

interface FlowContextType {
  user: FlowUser | null
  isLoading: boolean
  balance: string
  network: 'testnet' | 'mainnet'
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchToMainnet: () => void
  switchToTestnet: () => void
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState('0.0')
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet')

  useEffect(() => {
    // Subscribe to Flow authentication state changes
    const unsubscribe = subscribeToAuth((currentUser: FlowUser) => {
      setUser(currentUser)
      
      // Fetch balance when user connects
      if (currentUser?.addr && currentUser.loggedIn) {
        fetchBalance(currentUser.addr)
      } else {
        setBalance('0.0')
      }
    })

    // Get initial user state
    const initialUser = getCurrentUser()
    setUser(initialUser)
    
    if (initialUser?.addr && initialUser.loggedIn) {
      fetchBalance(initialUser.addr)
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const fetchBalance = async (address: string) => {
    try {
      const flowBalance = await getAccountBalance(address)
      setBalance(flowBalance?.toString() || '0.0')
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance('0.0')
    }
  }

  const connect = async () => {
    setIsLoading(true)
    try {
      await authenticateUser()
    } catch (error) {
      console.error('Connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    setIsLoading(true)
    try {
      await unauthenticateUser()
    } catch (error) {
      console.error('Disconnect error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToMainnet = () => {
    switchNetwork('mainnet')
    setNetwork('mainnet')
    // Refresh balance if user is connected
    if (user?.addr && user.loggedIn) {
      fetchBalance(user.addr)
    }
  }

  const switchToTestnet = () => {
    switchNetwork('testnet')
    setNetwork('testnet')
    // Refresh balance if user is connected
    if (user?.addr && user.loggedIn) {
      fetchBalance(user.addr)
    }
  }

  const value: FlowContextType = {
    user,
    isLoading,
    balance,
    network,
    connect,
    disconnect,
    switchToMainnet,
    switchToTestnet
  }

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  )
}

export function useFlow() {
  const context = useContext(FlowContext)
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider')
  }
  return context
}
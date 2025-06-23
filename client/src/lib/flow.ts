import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'

// Flow configuration
export const configureFlow = () => {
  fcl.config({
    'app.detail.title': 'PlayOnchain',
    'app.detail.icon': 'https://placeholder.com/48x48',
    'accessNode.api': 'https://rest-testnet.onflow.org', // Flow Testnet
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Testnet wallet discovery
    'flow.network': 'testnet',
    '0xProfile': '0xba1132bc08f82fe2' // Flow testnet Profile contract
  })
}

// Initialize Flow configuration
configureFlow()

// Flow account authentication
export const authenticateUser = async () => {
  try {
    const user = await fcl.authenticate()
    return user
  } catch (error) {
    console.error('Flow authentication error:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = () => {
  return fcl.currentUser.snapshot()
}

// Unauthenticate user
export const unauthenticateUser = async () => {
  try {
    await fcl.unauthenticate()
  } catch (error) {
    console.error('Flow unauthentication error:', error)
    throw error
  }
}

// Subscribe to authentication changes
export const subscribeToAuth = (callback: (user: any) => void) => {
  return fcl.currentUser.subscribe(callback)
}

// Get Flow account balance
export const getAccountBalance = async (address: string) => {
  try {
    const script = `
      import FlowToken from 0x7e60df042a9c0868
      import FungibleToken from 0x9a0766d93b6608b7

      pub fun main(address: Address): UFix64 {
        let account = getAccount(address)
        let vaultRef = account.getCapability(/public/flowTokenBalance)
          .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow Balance reference to the Vault")

        return vaultRef.balance
      }
    `
    
    const balance = await fcl.query({
      cadence: script,
      args: (arg: any, t: any) => [arg(address, t.Address)]
    })
    
    return balance
  } catch (error) {
    console.error('Error fetching Flow balance:', error)
    return '0.0'
  }
}

// Switch between testnet and mainnet
export const switchNetwork = (network: 'testnet' | 'mainnet') => {
  const config = network === 'mainnet' ? {
    'accessNode.api': 'https://rest-mainnet.onflow.org',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
    'flow.network': 'mainnet',
    '0xProfile': '0x51ea0e37c27a1f1a'
  } : {
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
    'flow.network': 'testnet',
    '0xProfile': '0xba1132bc08f82fe2'
  }
  
  fcl.config(config)
}

export { fcl, t }
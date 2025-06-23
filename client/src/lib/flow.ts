import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { init, authenticate, unauthenticate, currentUser } from '@onflow/kit'

// Flow Kit configuration
export const initializeFlowKit = () => {
  init({
    network: 'testnet', // or 'mainnet'
    appDetails: {
      title: 'PlayOnchain',
      icon: 'https://placeholder.com/48x48'
    }
  })
}

// Initialize Flow Kit
initializeFlowKit()

// Flow account authentication using Kit
export const authenticateUser = async () => {
  try {
    const user = await authenticate()
    return user
  } catch (error) {
    console.error('Flow authentication error:', error)
    throw error
  }
}

// Get current user using Kit
export const getCurrentUser = () => {
  return currentUser.snapshot()
}

// Unauthenticate user using Kit
export const unauthenticateUser = async () => {
  try {
    await unauthenticate()
    // Clear any cached data
    localStorage.removeItem('flow_user_data')
    localStorage.removeItem('flow_wallet_address')
  } catch (error) {
    console.error('Flow unauthentication error:', error)
    throw error
  }
}

// Subscribe to authentication changes using Kit
export const subscribeToAuth = (callback: (user: any) => void) => {
  return currentUser.subscribe(callback)
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

// Switch between testnet and mainnet using Kit
export const switchNetwork = (network: 'testnet' | 'mainnet') => {
  init({
    network,
    appDetails: {
      title: 'PlayOnchain',
      icon: 'https://placeholder.com/48x48'
    }
  })
}

export { fcl, t }
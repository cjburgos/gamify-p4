import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { metaMask, walletConnect, injected } from 'wagmi/connectors'

// Flow EVM network configurations
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // This would come from environment

// Define Flow Testnet (Chain ID 545)
export const flowTestnet = defineChain({
  id: 545,
  name: 'Flow Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flow Testnet Explorer',
      url: 'https://evm-testnet.flowscan.io',
    },
  },
})

// Define Flow Mainnet (Chain ID 747)
export const flowMainnet = defineChain({
  id: 747,
  name: 'Flow Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flow Explorer',
      url: 'https://evm.flowscan.io',
    },
  },
})

export const config = createConfig({
  chains: [flowTestnet, flowMainnet],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
    injected(),
  ],
  transports: {
    [flowTestnet.id]: http(),
    [flowMainnet.id]: http(),
  },
})

// Token addresses for Flow EVM
export const TOKENS = {
  USDC: {
    [flowTestnet.id]: '0x', // Flow testnet USDC address - to be configured
    [flowMainnet.id]: '0xA0b86991c431B0C6C7C5c16f31e8e86B8e2c0C2c2', // Flow mainnet USDC address
  },
  PYUSD: {
    [flowTestnet.id]: '0x', // Flow testnet PYUSD address - to be configured
    [flowMainnet.id]: '0x6c3ea9036406852006290770befd8c4fc9b8e153', // Flow mainnet PYUSD address
  },
} as const

export type SupportedToken = keyof typeof TOKENS
import { NetworkChainType } from "../types/network";

export const networkConfigs = {
  [NetworkChainType.SOLANA]: {
    name: "Solana",
    chainType: NetworkChainType.SOLANA,
    logo: '/icons/Solana.svg',
    chainId: '1'
  },
  [NetworkChainType.BNB]: {
    name: "BNB Chain",
    chainType: NetworkChainType.BNB,
    logo: '/icons/BNBChain.svg',
    chainId: '2'
  },
  [NetworkChainType.ETH]: {
    name: "Ethereum",
    chainType: NetworkChainType.ETH,
    logo: '/icons/eth.svg',
    chainId: '3'
  },
}

export const networkAdvanceParams = {
  [NetworkChainType.SOLANA]: {
    schedule: null,
    slippage: "0.02",
    priority_fee: 0,
    routing: null,
  },
  [NetworkChainType.BNB]: {
    routing: null,
    minimum_received: null,
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  },
  [NetworkChainType.ETH]: {
    routing: null,
    minimum_received: null,
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  },
}

export const networkRouting = {
  [NetworkChainType.SOLANA]: [
    "Jupiter",
    "Raydium"
  ],
  [NetworkChainType.BNB]: [
    "Optimized",
    "V3",
    "V2"
  ],
  [NetworkChainType.ETH]: [
    "Optimized",
    "V3",
    "V2"
  ],
}

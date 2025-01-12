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

export const networkAdvanceParams = {
  [NetworkChainType.SOLANA]: {
    routing: networkRouting[NetworkChainType.SOLANA][0],
    schedule: null,
    slippage: "0.02",
    priority_fee: 0,
  },
  [NetworkChainType.BNB]: {
    routing: networkRouting[NetworkChainType.BNB][0],
    minimum_received: 0,
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  },
  [NetworkChainType.ETH]: {
    routing: networkRouting[NetworkChainType.ETH][0],
    minimum_received: 0,
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  },
}
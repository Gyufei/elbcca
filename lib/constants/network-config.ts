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

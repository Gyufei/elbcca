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
  [NetworkChainType.USDC]: {
    name: "Hyperliquid",
    chainType: NetworkChainType.USDC,
    logo: '/icons/eth.svg',
    chainId: '4'
  },
}


export const networkRouting = {
  [NetworkChainType.SOLANA]: [
    { label: "Jupiter", value: "Jupiter" },
    { label: "Raydium", value: "Raydium" },
  ],
  [NetworkChainType.BNB]: [
    { label: "Optimized", value: "Optimized", },
    { label: "Pancake", value:  "Pancake", },
  ],
  [NetworkChainType.ETH]: [
    { label: "Optimized", value: "Optimized", },
    { label:  "UniV3", value:  "uniswapv3", },
    { label:  "UniV2", value:  "uniswap", },
  ],
  [NetworkChainType.USDC]: [],
}

export const networkAdvanceParams = {
  [NetworkChainType.SOLANA]: {
    minimum_received: "",
    routing: networkRouting[NetworkChainType.SOLANA][0].value,
    schedule: null,
    slippage: "0.02",
    priority_fee: "",
  },
  [NetworkChainType.BNB]: {
    routing: networkRouting[NetworkChainType.BNB][0].value,
    minimum_received: "",
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  },
  [NetworkChainType.ETH]: {
    routing: networkRouting[NetworkChainType.ETH][0].value,
    minimum_received: "",
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  },
  [NetworkChainType.USDC]: {

  }
}

export const USDCDefaultParams = {
  total_item_amount: null,
  quote_token_amount: null,
  order_id: null,
  item_amount: null,
  delete_id: null,
  token_balance_type: "sales_revenue",
  bridge_chain: "hyperliquid-arbitrum"
}


export const networkAdvanceKeysMap = {
  [NetworkChainType.SOLANA]: ['fromAddress', 'transfer', 'tokenSwap', 'toAddress', 'routing', 'minimum_received', 'priority_fee', 'slippage', 'schedue'],
  [NetworkChainType.BNB]: ['fromAddress', 'transfer', 'tokenSwap', 'toAddress', 'routing', 'minimum_received', 'timeout', 'slippage', 'nonce', 'gas', 'fixed_gas', 'no_check_gas', 'schedue'],
  [NetworkChainType.ETH]: ['fromAddress', 'transfer', 'tokenSwap', 'toAddress', 'routing', 'minimum_received', 'timeout', 'slippage', 'nonce', 'gas', 'fixed_gas', 'no_check_gas', 'schedue'],
  [NetworkChainType.USDC]: ['usdcMarket', 'usdcOption', 'schedue'],
}
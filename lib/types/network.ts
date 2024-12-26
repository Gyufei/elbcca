export interface INetwork {
  block_explorer_url: string;
  chain_id: string;
  currency_symbol: string;
  network_name: string;
  rpc_url: string;
}

export enum NetworkChainType {
  SOLANA = "SOL",
  BNB = "BNB",
  ETH = "ETH",
}

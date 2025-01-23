export interface INetwork {
  block_explorer_url: string;
  currency_symbol: string;
  network_name: string;
  chain_id: number;
  chain_name: string;
  create_time: string;
  currency_name: string;
  explorer_url: string;
  id: string;
  rpc_url: string;
  stable_token_address: string;
  wrapped_token_address: string;
}

export enum NetworkChainType {
  SOLANA = "SOL",
  BNB = "BNB",
  ETH = "ETH",
  USDC = "USDC"
}

export enum USDCOpType {
  CREATEOFFER = 4,
  TAKEOFFER = 5,
  CANCELOFFER = 6,
  WITHDRAW = 7,
  CREATEACCOUNT = 8,
  BRIDGE = 9
};

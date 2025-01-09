export interface IToken {
  is_stable_token: boolean;
  token_address: string;
  chain_id: number;
  token_decimals: number;
  token_id: number;
  token_logo_url: string;
  token_name: string;
  token_symbol: string;
}

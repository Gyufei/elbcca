export enum StatusEnum {
  "pre-queue" = 1,
  queue,
  pending,
  finished,
  failed,
  canceled,
  replaced,
}

export interface ITask {
  id: number;
  date: string;
  account: string;
  op: number;
  opName: string;
  status: StatusEnum;
  txHash: string;
  data: ITaskData;
  gasUsed: number;
  memo: string;
}

export interface ITaskData {
  chain_id: string;
  keystore: string;
  account: string;
  amount: string;
  nonce: number;
  gas: string;
  fixed_gas: boolean;
  no_check_gas: boolean;

  //approve
  token?: string;
  token_name?: string;
  spender?: string;

  // transfer
  recipient?: string;

  // swap
  is_exact_input: boolean;
  slippage: string;
  swap_router_address: string;
  timeout: number;
  token_in: string;
  token_out: string;
  token_in_name: string;
  token_out_name: string;
}

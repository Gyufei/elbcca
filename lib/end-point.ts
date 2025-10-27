export const isPreview = process.env.NEXT_PUBLIC_IS_DETAKE_PREVIEW === "1";
export const isProduction = process.env.NODE_ENV === "production" && !isPreview;

const AuthHostUrl = isProduction ? 'https://auth.dapp.do' : 'https://preview-auth.dapp.do';

function WithHost(path: string) {
  return `${AuthHostUrl}${path}`;
}

export const SystemEndPointPathMap = {
  login: WithHost("/user/login"),
  logout: WithHost("/user/logout"),
  changePassword: WithHost("/user/change_password"),
  endPoint: WithHost("/user/end_point"),
  userInfo: WithHost("/user/info"),
  userTimezone: WithHost("/user/timezone"),
  userAliasName: WithHost("/user/aliasname"),

  allKeyStores: WithHost("/keystore/all"),
  userKeyStores: WithHost("/keystore/user"),
  addKeyStore: WithHost("/keystore/user/add"),
  deleteKeyStore: WithHost("/keystore/user/remove"),

  allPages: WithHost("/keystore/pages/all"),
  keyStorePages: WithHost("/keystore/pages"),
  keyStoreRemovePage: WithHost("/keystore/pages/remove"),
  keyStoreAddPage: WithHost("/keystore/pages/add"),

  keyStoreByPage: WithHost("/keystore/list"),

  networks: WithHost("/setting/networks"),
  ops: WithHost("/setting/op"),
  deleteToken: WithHost("/setting/delete_token"),
  upTopToken: WithHost("/setting/token_top_up"),
  addToken: WithHost("/setting/add_token"),
  getTokenList: WithHost("/setting/account_token_list"),
  updateRpc: WithHost("/setting/private_rpc"),
  getRPC: WithHost("/setting/private_rpc"),
  
  uploadImage: WithHost("/upload/image"),
};

export const UserEndPointPathMap = {
  keyStoreAccounts: "/keystore/accounts",
  web3Info: "/tokenswap/info",
  tokenList: "/setting/account_token_list",
  filterAccount: "/tokenswap/filter_account",
  estimateToken: "/tokenswap/estimate_token_amount",
  signTransfer: "/tokenswap/transfer/sign",

  nonceNum: "/web3/nonce",
  gasPrice: "/web3/gas_price",
  priorityFee: "/web3/priority_fee",
  accountTokensBalance: "/web3/batch_token_balanceof",
  accountTokenBalance: "/web3/balanceof",
  accountTokenAllowance: "/web3/token_allowance",

  signApprove: "/tokenswap/approve/sign",
  signSwap: "/tokenswap/swap/sign",
  sendTransfer: "/tokenswap/transfer/send",
  sendApprove: "/tokenswap/approve/send",
  sendSwap: "/tokenswap/swap/send",
  swapHistory: "/tokenswap/history",
  cancelTask: "/tokenswap/cancel",
  
  scheduleXYZ: "/schedule/xyz",
  scheduleList: "/schedule/list",
  scheduleSave: "/schedule/save",
  scheduleApply: "/schedule/apply",

  hypeTradeUserInfo: "/hype_trade/user_info",
  hypeTradeUserPointAmount: "/hype_trade/user_point_amount",
  hypeTradeCreateAccount: "hype_trade/create_account",
  hypeTradeCreateOffer: "/hype_trade/create_offer",
  hypeTradeCancelOffer: "/hype_trade/cancel_offer",
  hypeTradeGetOffer: "/hype_trade/offers",
  hypeTradeTakeOffer: "/hype_trade/take_offer",
  hypeTradeBridge: "/hype_trade/bridge",
  hypeTradeWithdraw: "/hype_trade/withdraw_token_balance",

  createNote: "/wallet_notes/create",
  getWalletNote: "/wallet_notes/list",
  updateNote: "/wallet_notes/update",
  deleteNote: "/wallet_notes/delete",
};

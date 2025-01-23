import { IOp } from "@/lib/types/op";
import { useTranslations } from "next-intl";
import { FormItem } from "./components/form-item";
import Input from "./components/input";
import { Combobox } from "../ui/combobox";
import Select from "./components/select";
import { useHypeTradeOffer } from "@/lib/hooks/use-hypetrade-offer";
import { USDCOpType } from "@/lib/types/network";



export default function UsdcOptions({
  op,
  params,
  onChange,
  fromAddress
}: {
  op: IOp | null;
  params: Record<string, any>;
  fromAddress: string;
  onChange: (v: Record<string, any>) => void;
}) {
  const T = useTranslations("Common");
  const { data: offerOptions = []} = useHypeTradeOffer(params, fromAddress);
  const tokenBalanceOptions = [
    { value: 'sales_revenue', label: T("UsdcSalesRevenue") },
    { value: 'referral_bonus', label: T("UsdcReferralReward")},
  ]
  const bridgeOptions = [
    { value: "hyperliquid-arbitrum", label: "hyperliquid->arbitrum" },
    { value: "arbitrum-hyperliquid", label: "arbitrum->hyperliquid" },
  ]
  if (op?.op_id === USDCOpType.CREATEOFFER) {
    return (
      <>
        <FormItem title={T("UsdcPointsQuantity")} className="px-3">
          <Input
            value={params['total_item_amount']}
            onChange={(v: any) => {
              onChange({ 'total_item_amount': v})
            }}
            placeholder={"1"}
            type={"number"}
            noDecimals
          />
        </FormItem>
        <FormItem title={T("UsdcPointsPrice")} className="px-3">
          <Input
            value={params['quote_token_amount']}
            onChange={(v: any) => {
              onChange({ 'quote_token_amount': v})
            }}
            placeholder={''}
            type="number"
          />
        </FormItem> 
      </>
    )
  }

  if (op?.op_id === USDCOpType.TAKEOFFER) {
    return (
      <>
        <FormItem title={T("UsdcTradeOrder")} className="px-3">
          <Combobox
            valueKey={'offer_id'}
            labelKey={'entry_id'}
            labelInValue
            options={offerOptions}
            value={params['order_id']}
            onChange={(v: any) => {
              console.log(v, "v 23344")
              onChange({ 'order_id': v })
            }}
          />
        </FormItem>
        <FormItem title={T("UsdcTradeQuantity")} className="px-3">
          <Input
            value={params['item_amount']}
            onChange={(v: any) => {
              onChange({ 'item_amount': v})
            }}
            placeholder={''}
          />
        </FormItem>
        <OfferMsg
          offerItem={params['order_id']}
        />
      </>
    )
  }

  if (op?.op_id === USDCOpType.CANCELOFFER) {
    return (
      <>
        <FormItem title={T("UsdcOrderId")} className="px-3">
          <Combobox
            valueKey={'offer_id'}
            labelKey={'entry_id'}
            labelInValue
            value={params['delete_id']}
            options={offerOptions}
            onChange={(v: any) => {
              onChange({ 'delete_id': v })
            }}
          />
        </FormItem>
        {params['delete_id'] && (
          <OfferMsg 
            offerItem={params['delete_id']}
          />
        )}
      </>
    )
  }

 

  if (op?.op_id === USDCOpType.WITHDRAW) {
    return (
      <FormItem title={T("UsdcTokenType")} className="px-3">
        <Select
          options={tokenBalanceOptions}
          value={params['token_balance_type']}
          labelInValue
          onChange={(v: any) => {
            onChange({ 'token_balance_type': v })
          }}
        />
      </FormItem>
    )
  }

  if (op?.op_id === USDCOpType.BRIDGE) {
    return (
      <>
        <FormItem title={T("UsdcBridgeChainWay")} className="px-3">
          <Select
            options={bridgeOptions}
            value={params['bridge_chain']}
            onChange={(v: any) => {
              onChange({ 'bridge_chain': v })
            }}
          />
        </FormItem>
        <FormItem title={T("UsdcBridgeAmount")} className="px-3">
          <Input
            value={params['bridge_amount']}
            onChange={(v: any) => {
              onChange({ 'bridge_amount': v})
            }}
            placeholder={''}
            type={'number'}
          />
        </FormItem>
      </>
    )
  }

  return null;
}

export function OfferMsg({
  offerItem
}: {
  offerItem?: Record<string, any>;
}){
  
  if (!offerItem) return null;
  const {
    quote_token_amount,
    taken_item_amount,
    item_amount
  } = offerItem;
  return (
    <div className="text-[12px] mt-2 px-3 text-[#707070]">{item_amount || ""}积分可转换{quote_token_amount} USDC，已经成交了{taken_item_amount}积分</div>
  )
}

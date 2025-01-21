import { useContext,} from "react";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IOp } from "@/lib/types/op";
import { useTranslations } from "next-intl";
import { FormItem } from "./components/form-item";
import Input from "./components/input";
import { Combobox } from "../ui/combobox";
import Select from "./components/select";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]
const tokenBalanceOptions = [
  { value: 'sales_revenue', label: '销售收入' },
  { value: 'referral_bonus', label: '推荐奖励' },
]

export default function UsdcOptions({
  op,
  params,
  onChange
}: {
  op: IOp | null;
  params: Record<string, any>;
  onChange: (v: Record<string, any>) => void;
}) {
  const T = useTranslations("Common");
  const { network } = useContext(NetworkContext);
 
  if (op?.op_id === 1) {
    return (
      <>
        <FormItem title={"积分数量"} className="px-3">
          <Input
            value={params['total_item_amount']}
            onChange={(v: any) => {
              onChange({ 'total_item_amount': v})
            }}
            placeholder={'积分数量'}
          />
        </FormItem>
        <FormItem title={"积分售价"} className="px-3">
          <Input
            value={params['usdc_amount']}
            onChange={(v: any) => {
              onChange({ 'usdc_amount': v})
            }}
            placeholder={'积分售价'}
            type="number"
          />
        </FormItem> 
      </>
    )
  }
  if (op?.op_id === 2) {
    return (
      <>
        <FormItem title={"订单id"} className="px-3">
          <Combobox 
            value={params['delete_id']}
            options={frameworks}
            onChange={(v: any) => {
              onChange({ 'delete_id': v })
            }}
            placeholder="取消订单Id"
          />
        </FormItem>
        <div className="text-[12px] mt-2 px-3 text-[#707070]">10积分 0.02 USDC，已经成交了5积分</div>
      </>
    )
  }

  if (op?.op_id === 3) {
    return (
      <>
        <FormItem title={"交易订单"} className="px-3">
          <Combobox 
            value={params['order_id']}
            options={frameworks}
            placeholder="交易订单Id"
            onChange={(v: any) => {
              onChange({ 'order_id': v })
            }}
          />
        </FormItem>
        <FormItem title={"交易数量"} className="px-3">
          <Input
            value={params['item_amount']}
            onChange={(v: any) => {
              onChange({ 'item_amount': v})
            }}
            placeholder={'交易数量'}
          />
        </FormItem>
        <div className="text-[12px] mt-2 px-3 text-[#707070]">10积分 0.02 USDC，已经成交了5积分</div>
      </>
    )
  }

  if (op?.op_id === 4) {
    return (
      <FormItem title={"代币类型"} className="px-3">
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

  return null;
}


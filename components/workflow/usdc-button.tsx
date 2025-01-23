import { useContext, useEffect, useMemo, useState,} from "react";
import { IOp } from "@/lib/types/op";
import { useTranslations } from "next-intl";
import { BasicButton } from "./components/button";
import { toast } from "@/components/ui/use-toast";
import fetcher from "@/lib/fetcher";
import useIndexStore from "@/lib/state";
import { NetworkContext } from "@/lib/providers/network-provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useSWRMutation from "swr/mutation";
import Input from "./components/input";
import Select from "./components/select";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { pick } from "lodash";
import { USDCOpType } from "@/lib/types/network";

export default function UsdcBtn({
  op,
  keyStores,
  params,
  fromAddress,
  onAfterAction = () => {},
}: {
  op: IOp | null;
  params: Record<string, any>;
  fromAddress: string;
  keyStores: Array<IKeyStoreAccount>;
  onAfterAction: () => void;
}) {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const [loading, setLoading] = useState<boolean>(false);
  const { networkId } = useContext(NetworkContext);
  const [show, setShow] = useState<boolean>(false);
  
  const { data: hypeTradeUserInfo, trigger: triggerUserInfo, isMutating: isLoading } = useSWRMutation(
    () => {
      return networkId&&fromAddress
        ? `${userPathMap.hypeTradeUserInfo}?chain_id=${networkId}&account=${fromAddress}`
        : null;
    }, fetcher as any);


  const commParams =  useMemo(() => {
    const account = fromAddress;
    const kStore = keyStores.find((ks) =>
      ks.accounts.some((a) => a.account === account),
    );
    const keystore = kStore?.name || "";
    return {
      keystore,
      account,
      chain_id: (networkId || "") + ""
    }
  }, [fromAddress, keyStores])


  useEffect(() => {
    triggerUserInfo()
  }, [networkId, fromAddress])

  const isCreated = !isLoading && !!hypeTradeUserInfo;

  const T = useTranslations("Common");

  function usdcAction() {
    let url = null;
    let extraParams = {};
    if (op?.op_id === USDCOpType.CREATEOFFER) {
      url = userPathMap.hypeTradeCreateOffer;
      extraParams = {
        ...pick(params, ['market_symbol', 'total_item_amount', 'quote_token_amount']),
        market_symbol: params?.marketToken?.token_name || ""
      }
    }
    if (op?.op_id === USDCOpType.TAKEOFFER) {
      url = userPathMap.hypeTradeTakeOffer;
      console.log(params['order_id'], "5555")
      const orderItem = params['order_id'];
      extraParams = {
        ...pick(params, ['item_amount']),
        'offer_id': orderItem.offer_id,
        'offer_point_token_amount': orderItem.item_amount,
        'offer_quote_token_amount': orderItem.quote_token_amount
      }
    }
    if (op?.op_id === USDCOpType.CANCELOFFER) {
      url = userPathMap.hypeTradeCancelOffer;
      extraParams = {
        ...pick(params['delete_id'] || {}, ['offer_id'])
      }
    }
    if (op?.op_id === USDCOpType.WITHDRAW) {
      url = userPathMap.hypeTradeWithdraw;
      extraParams = {
        ...pick(params, ['token_balance_type'])
      }
    }
    if (op?.op_id === USDCOpType.BRIDGE) {
      url = userPathMap.hypeTradeBridge;
      const  chains = (params.bridge_chain || "hyperliquid-arbitrum").split("-");
      extraParams = {
        ...pick(params, ['bridge_amount']),
        'from_chain': chains[0],
        'to_chain': chains[1],
      }
    }
    if (!url) return null;
    return fetcher(url, {
      method: "POST",
      body: JSON.stringify({
        ...commParams,
        ...extraParams
      }),
    })
  };

  async function handleClick() {
    try {
      setLoading(true);
      const res = await usdcAction();
      setLoading(false);
      if (!res) return;
      if (res.status === false) {
        toast({
          variant: "destructive",
          description: res.msg || "schedue fail",
        });
      }
      onAfterAction();
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
      setLoading(false);
    }
  }

  return (
    <>
      <BasicButton 
        loading={loading}
        disabled={loading}
        onClick={() => handleClick()}
      >
        <span>{T("Schedule")}</span>
      </BasicButton>
      {
        !isCreated && (
          <BasicButton 
            loading={loading}
            disabled={loading}
            onClick={() => setShow(true)}
          >
            <span>创建账号</span>
          </BasicButton>
        )
      }
      <HypeTradeCreateAmountDialog
        show={show}
        setShow={setShow}
        commParams={commParams}
        onSubmitted={(v) => {
          if (v === true) {
            triggerUserInfo();
            setShow(false)
          } 
        }}
      />
    </>
  );
}

interface HypeTradeCreateFormFields {
  user_name: string;
  trading_mode: string;
}


function HypeTradeCreateAmountDialog({
  show,
  setShow,
  onSubmitted,
  commParams
}: {
  commParams: Record<string, any>;
  show: boolean;
  setShow: (val: boolean) => void;
  onSubmitted: (val: boolean) => void;
}) {
  const T = useTranslations("Common");
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const tradeModeOptions = [
    { label: "Private", value: "Private" },
    { label: "Public", value: "Public" },
  ]
  const [formValue, setFormValue] = useState<HypeTradeCreateFormFields>({
    user_name: "",
    trading_mode: "",
  })

  useEffect(() => {
    if (!show) {
      setFormValue({
        user_name: "",
        trading_mode: "",
      })
    }
  }, [show])
  
  const onChange = (key: string, v: string) => {
    setFormValue((preV) => {
      return {
        ...preV,
        [key]: v
      }
    })
  }
  const submitFetcher = async (url: string, { arg }: { arg: HypeTradeCreateFormFields }) => {
    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify({
        ...commParams,
        ...arg
      }),
    });

    toast({
      description: T("UsdcCreateSuccess"),
    });
    onSubmitted(res.data === true);
    return res;
  };

  const { trigger: submitAction, isMutating: isSubmitting } = useSWRMutation(
    userPathMap.hypeTradeCreateAccount,
    submitFetcher as any,
  );

  const onSubmit = () => {
    if (!formValue.trading_mode || !formValue.user_name) return;
    submitAction(formValue as any);
  };

  return (
    <Dialog open={show} onOpenChange={(val) => setShow(val)}>
      <DialogContent
        title={T("UsdcCreateAccount")}
        showClose={true}
        className="w-[400px]"
      >
        <div className="flex flex-col gap-y-4 px-4">
          <div className="flex flex-col gap-y-1">
            <span className="LabelText">{T("UsdcUserName")}</span>
            <Input
              type="text"
              value={formValue.user_name}
              onChange={(v) => onChange("user_name", v)}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <span className="LabelText">{T("UsdcTradingMode")}</span>
            <Select
              options={tradeModeOptions}
              value={formValue.trading_mode}
              onChange={(v) => onChange("trading_mode", v as string)}
            />

          </div>
          <BasicButton 
            loading={isSubmitting}
            disabled={isSubmitting || !formValue.trading_mode}
            onClick={onSubmit}
          >
            <span>创建账户</span>
          </BasicButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
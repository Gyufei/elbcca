import { useContext, useEffect, useState, useRef } from "react";

import QueryAccountBalance from "@/components/workflow/query-account-balance";
import OpAdvanceOptions, {
  IAdvanceOptions,
} from "@/components/workflow/op-advance-options";
import { NetworkContext } from "@/lib/providers/network-provider";
import Input from "./components/input";
import { useWorkflowParams } from "@/lib/hooks/use-workflow-params";
import SelectSwapToken from "./select-swap-token";
import { TokenContext } from "@/lib/providers/token-provider";
import useIndexStore from "@/lib/state";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useGasPrice } from "@/lib/hooks/use-gas-price";
import { useTranslations } from "next-intl";
import { networkAdvanceKeysMap, networkAdvanceParams } from "@/lib/constants/network-config";
import { NetworkChainType } from "@/lib/types/network";
import { usePriorityFee } from "@/lib/hooks/use-priorityFee";
import { TransferMax } from "./transfer-max";
import { FormItem } from "./components/form-item";
import Select from "./components/select";
import useSWR from "swr";
import { SystemEndPointPathMap } from "@/lib/end-point";
import { fetchOp } from "./request";
import { pick } from "lodash";
import { TestTxBtn } from "./test-tx-btn";
import { ApproveBtn } from "./approve-btn";
import { SchedueBtn, SchedueBtnMethods } from "./schedue-btn";
import { useWorkflow } from "@/lib/hooks/use-workflow";
import QueryAccountUsdcMarket from "./query-account-usdc-market";
import UsdcOptions from "./usdc-options";
import UsdcBtn from "./usdc-button";

export default function Op({
  keyStores,
  children,
  afterAction,
}: {
  keyStores: Array<IKeyStoreAccount>;
  children?: React.ReactNode;
  afterAction: () => void;
}) {
  const T = useTranslations("Common");
  const { networkId, networkName } = useContext(NetworkContext);
  const { tokens } = useContext(TokenContext);
  const [gasBalance, setGasBalance] = useState<number | null>(0);
  const fromAddress = useIndexStore((state) => state.fromAddress);
  const toAddress = useIndexStore((state) => state.toAddress);
  const setToAddress = useIndexStore((state) => state.setToAddress);
  const [advanceOptions, setAdvanceOptions] = useState<IAdvanceOptions>({
    ...networkAdvanceParams[NetworkChainType.ETH] as IAdvanceOptions
  });
  const advanceShowKey = networkAdvanceKeysMap[networkName as NetworkChainType] || [];
  const [transferAmount, setTransferAmount] = useState<string>("");
  
  // const { data: opOptions = [] } = useSWR(() => {
  //   return networkId
  //     ? `${SystemEndPointPathMap.ops}?chain_id=${networkId}`
  //     : null;
  // }, fetchOp);

  const opOptions = [
    {op_id: 1, op_name: "创建订单"},
    {op_id: 2, op_name: "取消订单"},
    {op_id: 3, op_name: "交易订单"},
    {op_id: 4, op_name: "提取代币"},
  ]

 

  const { data: gasPrice } = useGasPrice();
  const { data: priorityFee } = usePriorityFee();
  const  schedueRef = useRef<SchedueBtnMethods>(null);
  
  const [params, setParams] = useState<Record<string, any>>({});
  const {
    routings,
    maxMinimum,
    isApproveOp,
    isTransferOp,
    isSwapOp,
    shouldApproveToken0,
    trigger0Allowance
  } = useWorkflowParams(params);

  const {
    signAction,
    sendAction,
    approveAction
  } = useWorkflow({
    params,
    keyStores,
    gasPrice,
    priorityFee,
    fromAddress,
    toAddress,
    advanceOptions,
    transferAmount
  })

  const onParamsChange = (key?: string, value?: any) => {
    console.log(key, value, "value 8888")
    if (key) {
      setParams((preParams) => {
        console.log({
          ...preParams,
          [key]: value,
        })
        return {
          ...preParams,
          [key]: value,
        }
      })
    } else {
      setParams((preParams) => {
        return {
          ...preParams,
          ...(value || {}),
        }
      })
    }
  }


  useEffect(() => {
    // init params
    if (tokens && opOptions) {
      const defaultParams = networkAdvanceParams[networkName as  NetworkChainType] as IAdvanceOptions;
      setParams({
        op: opOptions[0],
        token0: tokens?.[0],
        token1: tokens?.[1] || null,
        token0Num: "",
        token1Num: "",
      })
      setAdvanceOptions({
        ...defaultParams,
      })

    }
    // , opOptions
  }, [tokens])
  
  return (
    <>
     <div className="flex flex-col">
      <FormItem title={T("OP")} className="px-3">
        <Select
          valueKey={'op_id'}
          labelKey={'op_name'}
          options={opOptions}
          value={params['op']}
          labelInValue
          onChange={(v) => onParamsChange('op', v)}
        />
      </FormItem>
      {
        advanceShowKey.includes('fromAddress') && (
          <QueryAccountBalance
            gas={gasBalance}
            setGas={setGasBalance}
            token0={params['token0']}
            token1={params['token1']}
          />
        )
      }
      {
        advanceShowKey.includes('usdcMarket') && (
          <QueryAccountUsdcMarket />
        )
      }
      {
        advanceShowKey.includes('usdcOption') && (
          <UsdcOptions op={params['op']} params={params} onChange={(v: Record<string, any>) => onParamsChange(undefined, v)} />
        )
      }
      {isSwapOp && advanceShowKey.includes('tokenSwap') && (
        <SelectSwapToken
          value={pick(params, ['token0', 'token1', 'token0Num', 'token1Num', 'spender'])}
          routing={advanceOptions?.["routing"] || ""}
          options={tokens}
          onChange={(v) => onParamsChange(undefined, v)}
        />
      )}
      {isTransferOp && advanceShowKey.includes('transfer') && (
        <FormItem title={T("TransferAmount")} className="px-3">
          <div className="relative">
            <Input
              value={transferAmount}
              onChange={(v) => setTransferAmount(v)}
              placeholder="0"
              type="number"
            />
            <TransferMax 
              gasBalance={gasBalance}
              advanceOptions={advanceOptions}
              handleTransferAmountChange={setTransferAmount}
            />
          </div>
        </FormItem>
        )}
      {!isApproveOp && advanceShowKey.includes('toAddress') && (
        <FormItem title={T("ToAddress")} className="px-3">
          <Input
            value={toAddress}
            onChange={(e: any) => setToAddress(e.target.value)}
            placeholder={networkName ===  NetworkChainType.SOLANA ? "" : "0x11111111111"}
          />
        </FormItem>)}
        <OpAdvanceOptions
          routings={routings}
          maxMinimum={maxMinimum}
          params={params}
          options={advanceOptions}
          fromAddress={fromAddress}
          onAdvanceOptionsChange={setAdvanceOptions}
        />
     </div>
     <div className="mt-3 flex h-[60px] items-center gap-x-3 border-t bg-white px-3 py-2">
      {children}
      {
        networkName !== NetworkChainType.USDC && (
        <>
          <TestTxBtn 
            networkName={networkName}
            params={params}
            priorityFee={priorityFee}
            gasPrice={gasPrice}
            signAction={signAction}
            onAfterAction={() => afterAction()}
            onShowTxResult={(res) => schedueRef?.current?.onOpenTestResult(res)}
          />
          {isSwapOp && shouldApproveToken0 && (
            <ApproveBtn
              approveAction={approveAction}
              onAfterAction={() => {
                afterAction();
                trigger0Allowance();
              }}
            />
          )}
          <SchedueBtn
            ref={schedueRef}
            networkName={networkName}
            params={params}
            priorityFee={priorityFee}
            gasBalance={gasBalance}
            onAfterAction={() => afterAction()}
            signAction={signAction}
            sendAction={sendAction} 
          />
        </>
        )
      }

      {
        networkName === NetworkChainType.USDC && (
          <UsdcBtn
            op={params['op']}
            params={params}
            onAfterAction={() => afterAction()}
          />
        )
      }
     </div>
    </>
  )
}

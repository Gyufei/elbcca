import { useContext, useEffect, useState, useRef, useMemo } from "react";

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
import {
  networkAdvanceKeysMap,
  networkAdvanceParams,
  USDCDefaultParams,
} from "@/lib/constants/network-config";
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
import { ScheduleBtn, ScheduleBtnMethods } from "./schedue-btn";
import { useWorkflow } from "@/lib/hooks/use-workflow";
import QueryAccountUsdcMarket from "./query-account-usdc-market";
import UsdcOptions from "./usdc-options";
import UsdcBtn from "./usdc-button";
import { VaContext } from "@/lib/providers/va-provider";
import VaSelectSwapToken from "./va-select-swap-token";

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
  const { currentAccountType } = useContext(VaContext);
  const isVa = currentAccountType === "VirtualAccount";

  const [gasBalance, setGasBalance] = useState<number | null>(0);
  const fromAddress = useIndexStore((state) => state.fromAddress);
  const toAddress = useIndexStore((state) => state.toAddress);
  const setToAddress = useIndexStore((state) => state.setToAddress);

  const initAdvanceOptions = {
    ...(networkAdvanceParams[
      isVa ? "VA" : networkName || ("ETH" as NetworkChainType)
    ] as IAdvanceOptions),
    routing: (
      networkAdvanceParams[networkName as NetworkChainType] as IAdvanceOptions
    )?.routing,
  };

  const [advanceOptions, setAdvanceOptions] =
    useState<IAdvanceOptions>(initAdvanceOptions);

  const advanceShowKey = useMemo(() => {
    return isVa
      ? networkAdvanceKeysMap.VA
      : networkAdvanceKeysMap[networkName as NetworkChainType] || [];
  }, [isVa, networkName]);

  networkAdvanceKeysMap[networkName as NetworkChainType] || [];
  const [transferAmount, setTransferAmount] = useState<string>("");

  const fetchOpAction = (url: string) => {
    return fetchOp(url, networkName);
  };
  const { data: opOptionsData = [] } = useSWR(() => {
    return networkId
      ? `${SystemEndPointPathMap.ops}?chain_id=${networkId}`
      : null;
  }, fetchOpAction);

  const opOptions = useMemo(() => {
    if (isVa) {
      return opOptionsData.filter((op: any) => op.op_id !== 3);
    } else {
      return opOptionsData;
    }
  }, [opOptionsData, isVa]);

  const { data: gasPrice } = useGasPrice();
  const { data: priorityFee } = usePriorityFee();
  const scheduleRef = useRef<ScheduleBtnMethods>(null);

  const [params, setParams] = useState<Record<string, any>>({});
  const {
    routings,
    maxMinimum,
    isApproveOp,
    isTransferOp,
    isSwapOp,
    shouldApproveToken0,
    trigger0Allowance,
  } = useWorkflowParams(params, isVa);

  const { signAction, sendAction, approveAction } = useWorkflow({
    params,
    keyStores,
    gasPrice,
    priorityFee,
    fromAddress: fromAddress || "",
    toAddress,
    advanceOptions,
    transferAmount,
    isVa,
  });

  const onParamsChange = (key?: string, value?: any) => {
    if (key) {
      setParams((preParams) => {
        return {
          ...preParams,
          [key]: value,
        };
      });
    } else {
      setParams((preParams) => {
        return {
          ...preParams,
          ...(value || {}),
        };
      });
    }
  };

  useEffect(() => {
    // init params
    if (tokens && opOptions) {
      const defaultParams = {
        ...(networkAdvanceParams[
          isVa ? "VA" : (networkName as NetworkChainType)
        ] as IAdvanceOptions),
        routing: (
          networkAdvanceParams[
            networkName as NetworkChainType
          ] as IAdvanceOptions
        )?.routing,
      };

      const extraParams =
        networkName === NetworkChainType.USDC ? USDCDefaultParams : {};

      setParams({
        op: opOptions[0],
        token0: tokens?.[0],
        token1: tokens?.[1] || null,
        token0Num: "",
        token1Num: "",
        marketToken: tokens?.[0] || null,
        ...extraParams,
      });

      setAdvanceOptions({
        ...defaultParams,
      });
    }
  }, [tokens, opOptions, networkName, isVa]);

  return (
    <>
      <div className="flex flex-col">
        <FormItem title={T("OP")} className="px-3">
          <Select
            valueKey={"op_id"}
            labelKey={"op_name"}
            options={opOptions}
            value={params["op"]}
            labelInValue
            onChange={(v) => onParamsChange("op", v)}
          />
        </FormItem>
        {advanceShowKey.includes("fromAddress") && (
          <QueryAccountBalance
            gas={gasBalance}
            setGas={setGasBalance}
            token0={params["token0"]}
            token1={params["token1"]}
            isVa={isVa}
          />
        )}
        {advanceShowKey.includes("usdcMarket") && (
          <QueryAccountUsdcMarket
            params={params}
            gas={gasBalance}
            setGas={setGasBalance}
            tokens={tokens}
            onParamsChange={(v) => onParamsChange(undefined, v)}
          />
        )}
        {advanceShowKey.includes("usdcOption") && (
          <UsdcOptions
            op={params["op"]}
            params={params}
            fromAddress={fromAddress}
            onChange={(v: Record<string, any>) => onParamsChange(undefined, v)}
          />
        )}
        {isSwapOp && !isVa && advanceShowKey.includes("tokenSwap") && (
          <SelectSwapToken
            value={pick(params, [
              "token0",
              "token1",
              "token0Num",
              "token1Num",
              "spender",
            ])}
            routing={advanceOptions?.["routing"] || ""}
            options={tokens}
            onChange={(v) => onParamsChange(undefined, v)}
          />
        )}
        {isSwapOp && isVa && advanceShowKey.includes("tokenSwap") && (
          <VaSelectSwapToken
            value={pick(params, [
              "token0",
              "token1",
              "token0Num",
              "token1Num",
              "spender",
            ])}
            routing={advanceOptions?.["routing"] || ""}
            options={tokens}
            onChange={(v) => onParamsChange(undefined, v)}
            vaName={fromAddress || ""}
          />
        )}
        {isTransferOp && advanceShowKey.includes("transfer") && (
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
        {(!isVa && !isApproveOp && advanceShowKey.includes("toAddress")) ||
          (isVa && advanceShowKey.includes("toAddress") && isTransferOp && (
            <FormItem title={T("ToAddress")} className="px-3">
              <Input
                value={toAddress}
                onChange={(v: string) => setToAddress(v)}
                placeholder={
                  networkName === NetworkChainType.SOLANA ? "" : "0x11111111111"
                }
              />
            </FormItem>
          ))}
        <OpAdvanceOptions
          isVa={isVa}
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
        {networkName !== NetworkChainType.USDC && (
          <>
            {!isVa && (
              <TestTxBtn
                networkName={networkName}
                params={params}
                priorityFee={priorityFee}
                gasPrice={gasPrice}
                signAction={signAction}
                onAfterAction={() => afterAction()}
                onShowTxResult={(res) =>
                  scheduleRef?.current?.onOpenTestResult(res)
                }
              />
            )}
            {isSwapOp && shouldApproveToken0 && (
              <ApproveBtn
                approveAction={approveAction}
                onAfterAction={() => {
                  afterAction();
                  trigger0Allowance();
                }}
              />
            )}
            <ScheduleBtn
              ref={scheduleRef}
              networkName={networkName}
              params={params}
              priorityFee={priorityFee}
              gasBalance={gasBalance}
              onAfterAction={() => afterAction()}
              signAction={signAction}
              sendAction={sendAction}
              isVa={isVa}
            />
          </>
        )}

        {networkName === NetworkChainType.USDC && (
          <UsdcBtn
            keyStores={keyStores}
            fromAddress={fromAddress || ""}
            op={params["op"]}
            params={params}
            onAfterAction={() => afterAction()}
          />
        )}
      </div>
    </>
  );
}

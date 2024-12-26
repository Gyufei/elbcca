"use client";

import DetailItem from "../shared/detail-item";
import { Input } from "../ui/input";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { HintTexts } from "@/lib/hint-texts";
import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "@/lib/end-point";
import useSWR from "swr";
import { isUrl } from "@/lib/utils";
 
interface RpcProps {
  chainId: string;
}
 
export interface RpcMethods {
  onSubmit: () => void;
}

const Rpc = forwardRef(
  function Rpc({ chainId }: RpcProps, ref: ForwardedRef<RpcMethods>){

  const [errorMsg, setErrorMsg] = useState("");
  const [inputValue, setInputValue] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [RPCLoading, setRPCLoading] = useState<boolean>(false)
  const { data } = useSWR(SystemEndPointPathMap.getRPC + `?chain_id=${chainId}`, fetcher);

  useEffect(() => {
    setInputValue(data?.rpc_url || '')
  }, [data])
  
  // 使用 useImperativeHandle 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    onSubmit: onSubmit,
  }));


  const onSubmit = async () => {
    if (errorMsg) return;
    if (!isUrl(inputValue || '')) {
      setErrorMsg(HintTexts.RPCError);
      return;
    }
    if (RPCLoading) return;
    setRPCLoading(true)
    const params = {
      'chain_id': chainId,
      'rpc_url': inputValue,
    };

    try {
      await fetcher(SystemEndPointPathMap.updateRpc + `?chain_id=${chainId}`, {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch (err) {
        console.error('Error Add RPC', err);
    } finally {
      setRPCLoading(false)
    }
  }

  const onChange = (val: string) => {
    setInputValue(val);

    if (val && !isUrl(val)) {
      setErrorMsg(HintTexts.RPCError);
      return;
    }

    setErrorMsg("");
  };

  const onBlur = () => {
    if (errorMsg) {
      return;
    }

  };

  return (
    <DetailItem title={"RPC"} className={"border-none p-0"}>
      <div className="relative flex w-full flex-col justify-center">
      <Input
        data-state={errorMsg ? "error" : ""}
        ref={inputRef}
        type="text"
        value={inputValue || ""}
        placeholder="https://"
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        className="w-[620px] focus-visible:ring-0 data-[state=error]:border-destructive"
      />
        <div className="mt-2 text-sm text-destructive">
          {errorMsg}
        </div>
      </div>
    </DetailItem>
  );
});

export default Rpc;

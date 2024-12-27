"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { useTranslations } from "next-intl";
import {  useSearchParams } from "next/navigation";
import TokenList from "@/components/network/token-list";
import Rpc, { RpcMethods } from "@/components/network/rpc";
import { useRef, useState } from "react";
import { NetworkChainType } from "@/lib/types/network";
import { networkConfigs } from "@/lib/constants/network-config";
import Image from "next/image";

enum NetTabsEnum  {
  network = 'network',
  tokenList = 'tokenList'
}

export default function NetworkMain() {
  const searchParams = useSearchParams();
  const T = useTranslations("Common");
  const netName = searchParams.get("name");
  const chainId = searchParams.get("chainId") || '';
  const netInfo = netName && networkConfigs[netName as NetworkChainType];
  const [tabValue, setTabValue] = useState<string>(NetTabsEnum.network)
  const rpcRef = useRef<RpcMethods>(null);

  const netOptions = [
    { name: 'Network', value: NetTabsEnum.network },
    { name: 'TokenList', value: NetTabsEnum.tokenList },
  ]

  if (!netInfo) return null;

  const goBack = () => {
    window.history.back();
  }
  
  return (
    <div className="relative w-full h-full bg-[#fafafa] md:static md:overflow-y-hidden p-5">
      <div className="relative border border-[#BFBFBF] bg-[#FFFFFF] w-full h-full rounded-[12px] p-8 min-h-[300px]">
        <div className="text-2xl text-[#333333] font-bold mb-[10px]">{netInfo.name}</div>
        <Tabs 
          value={tabValue} 
          onValueChange={(v) => {
            setTabValue(v)
          }}
          className="pd-[88] h-[calc(100%-120px)] overflow-y-auto"
        >
          <TabsList className="grid grid-cols-2 gap-5 w-[520px] mb-[40px]">
            {netOptions.map((item) => (
              <TabsTrigger key={item.value} className="w-[240px] justify-start" value={item.value}>
                <div className={`w-3 h-3 rounded-full border border-[#BFBFBF] ${tabValue === item.value ? 'bg-[#BFBFBF]' : 'bg-[#FFF]'}`}></div>
                <div className="ml-3">{T(item.name)}</div> 
              </TabsTrigger>
              ))}
          </TabsList>
          <TabsContent value={NetTabsEnum.network}>
            <Rpc ref={rpcRef} chainId={chainId}/>
          </TabsContent>
          <TabsContent value={NetTabsEnum.tokenList}>
            <TokenList chainId={chainId} />
          </TabsContent>
        </Tabs>
        <div className="absolute rounded-[12px]  bottom-0 left-0 right-0 px-8 pb-8 bg-[#FFFFFF]">
          <div className="h-18 relative border-t border-[##BFBFBF] flex flex-row items-end pt-8">
            <div className="cursor-pointer text-base text-[#333] flex align-items" onClick={goBack}>
              <Image
                src="/icons/back.svg"
                width={16}
                height={16}
                alt="back"
              />
              {T("Back")}
            </div>
            {
              tabValue === NetTabsEnum.network && (
                <div 
                  className="absolute bottom-0 right-0 w-[70px] h-10 rounded-lg bg-[#0572EC] cursor-pointer text-base text-white flex items-center justify-center"
                  onClick={() => rpcRef.current?.onSubmit()}
                >{T("Save")}</div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

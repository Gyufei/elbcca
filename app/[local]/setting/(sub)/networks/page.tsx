"use client";
import { networkMap } from "@/components/setting/network-setting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { useTranslations } from "next-intl";
import {  useSearchParams } from "next/navigation";
import TokenList from "@/components/network/token-list";
import Rpc from "@/components/network/rpc";
import { useState } from "react";

enum NetTabsEnum  {
  network = 'network',
  tokenList = 'tokenList'
}

export default async function Networks() {
  const searchParams = useSearchParams();
  const T = useTranslations("Common");
  const netType = searchParams.get("type");
  const netName = netType && networkMap[netType];
  const [tabValue, setTabValue] = useState<string>(NetTabsEnum.tokenList)

  const netOptions = [
    { name: 'Network', value: NetTabsEnum.network },
    { name: 'TokenList', value: NetTabsEnum.tokenList },
  ]

  if (!netName) return null;

  const goBack = () => {
    window.history.back();
  }
  
  return (
    <div className="relative w-full h-full bg-[#fafafa] md:static md:overflow-y-hidden p-5">
      <div className="relative border border-[#BFBFBF] bg-[#FFFFFF] w-full h-full rounded-[12px] p-8 min-h-[300px]">
        <div className="text-2xl text-[#333333] font-bold mb-[10px]">{netName}</div>
        <Tabs 
          value={tabValue} 
          onValueChange={(v) => setTabValue(v)}
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
            <Rpc />
            <div className="h-[800px]"></div>
          </TabsContent>
          <TabsContent value={NetTabsEnum.tokenList}>
            <TokenList />
          </TabsContent>
        </Tabs>
        <div className="absolute rounded-[12px]  bottom-0 left-0 right-0 px-8 pb-8 bg-[#FFFFFF]">
          <div className="h-18 relative border-t border-[##BFBFBF] flex flex-row items-end pt-8">
            <div className="text-base text-[#333]" onClick={goBack}>
              {T("Back")}
            </div>
            {
              tabValue === NetTabsEnum.network && (
                <div className="absolute bottom-0 right-0 w-[70px] h-10 rounded-lg bg-[#0572EC] cursor-pointer text-base text-white flex items-center justify-center">{T("Save")}</div>
              )
            }
          </div>
        </div>
        
      </div>
    </div>
  );
}

"use client";
import { useContext, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";

import DetailItem from "@/components/shared/detail-item";

import FilterAccountList from "@/components/tokenswap/filter-account-list";
import KeyStoreSelect from "@/components/tokenswap/key-store-select";
import Op from "@/components/tokenswap/op";
import SwapHistory from "@/components/tokenswap/swap-history";
import { NetworkContext } from "@/lib/providers/network-provider";
import MobileFoldBtn from "@/components/tokenswap/mobile-fold-btn";
import { IKeyStoreAccount } from "@/lib/types/keystore";

export default function TokenSwap() {
  const { network } = useContext(NetworkContext);

  const [selectedKeyStores, setSelectedKeyStore] = useState<
    Array<IKeyStoreAccount>
  >([]);

  const foldPages = ["Filter Account", "Filter Task"];
  const [showSlidePage, setShowSlidePage] = useState<
    "Filter Account" | "Filter Task" | null
  >(null);

  const SwiperHandlerBox = () => {
    const swiperHandlers = useSwipeable({
      onSwipedDown: (_e) => {
        setShowSlidePage(null);
      },
    });

    return (
      <div className="h-5 md:hidden" {...swiperHandlers}>
        <div className="mx-auto mt-3 h-1 w-12 rounded-md bg-shadow-color"></div>
      </div>
    );
  };

  const historySearchRef = useRef({});

  const afterAction = () => {
    (historySearchRef.current as any)?.handleSearch();
  };

  return (
    <div className="relative grid h-full grid-cols-1 bg-[#fafafa] md:static md:grid-cols-3 md:overflow-y-hidden">
      <div
        data-state={showSlidePage === "Filter Account"}
        className="border-[#dadada absolute top-[-69px]  z-10 h-screen w-full rounded-t-3xl border-r-0 bg-[#fafafa] data-[state=false]:hidden data-[state=true]:animate-in data-[state=false]:animate-out data-[state=false]:slide-out-to-bottom data-[state=true]:slide-in-from-bottom md:static md:h-full md:w-auto md:rounded-none md:border-r md:data-[state=false]:block"
      >
        <SwiperHandlerBox />
        <div className="flex flex-col px-4 pb-4 md:pt-4">
          <DetailItem title="Network">{network?.network_name}</DetailItem>
          <DetailItem title="KeyStore">
            <KeyStoreSelect
              page="Tokenswap"
              keyStores={selectedKeyStores}
              handleKeyStoreSelect={(e) => setSelectedKeyStore(e)}
            />
          </DetailItem>
        </div>

        <FilterAccountList keyStores={selectedKeyStores}></FilterAccountList>
      </div>

      <div className="flex h-[calc(100vh-70px)] flex-col justify-between overflow-y-auto border-r border-r-[#dadada] md:h-full">
        <Op keyStores={selectedKeyStores} afterAction={afterAction}>
          <MobileFoldBtn
            pages={foldPages}
            onChange={(e) =>
              setShowSlidePage(e as "Filter Account" | "Filter Task")
            }
          />
        </Op>
      </div>

      <div
        data-state={showSlidePage === "Filter Task"}
        className="absolute top-[-69px] z-10 h-screen w-full rounded-t-3xl border-[#dadada] bg-[#fafafa] data-[state=false]:hidden md:static md:h-full md:w-auto md:rounded-none md:data-[state=false]:block"
      >
        <SwiperHandlerBox />
        <SwapHistory ref={historySearchRef} />
      </div>
    </div>
  );
}

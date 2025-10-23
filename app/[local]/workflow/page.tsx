"use client";
import { useContext, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";

import DetailItem from "@/components/shared/detail-item";

import KeyStoreSelect from "@/components/workflow/key-store-select";
import Op from "@/components/workflow/op";
import SwapHistory from "@/components/workflow/swap-history";
import { NetworkContext } from "@/lib/providers/network-provider";
import MobileFoldBtn from "@/components/workflow/mobile-fold-btn";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useTranslations } from "next-intl";
import NetworkSelect from "@/components/workflow/network-select";
import WalletVA from "@/components/workflow/wallet-va";

export default function WorkFlow() {
  const T = useTranslations("Common");
  const { network, onNetworkChange } = useContext(NetworkContext);

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
        className="absolute top-[-69px] z-10  h-screen w-full rounded-t-3xl border-r-0 border-[#dadada] bg-[#fafafa] data-[state=false]:hidden data-[state=true]:animate-in data-[state=false]:animate-out data-[state=false]:slide-out-to-bottom data-[state=true]:slide-in-from-bottom md:static md:h-full md:w-auto md:rounded-none md:border-r md:data-[state=false]:block"
      >
        <SwiperHandlerBox />
        <div className="flex flex-col px-3 md:pt-3">
          <DetailItem title={T("Network")}>
            <NetworkSelect
              size="large"
              currentNetwork={network}
              handleSelect={onNetworkChange}
            />
          </DetailItem>
          <DetailItem title={T("KeyStore")}>
            <KeyStoreSelect
              page="Tokenswap"
              keyStores={selectedKeyStores}
              handleKeyStoreSelect={(e) => setSelectedKeyStore(e)}
            />
          </DetailItem>
        </div>

        <WalletVA keyStores={selectedKeyStores}></WalletVA>
        {/* <FilterAccountList keyStores={selectedKeyStores}></FilterAccountList> */}
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

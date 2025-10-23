import { useTranslations } from "next-intl";
import Image from "next/image";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FilterAccountList from "./filter-account-list";

export default function WalletVA({
  keyStores,
}: {
  keyStores: Array<IKeyStoreAccount>;
}) {
  console.log(keyStores);
  const T = useTranslations("Common");
  const [currentTab, setCurrentTab] = useState<"wallet" | "virtualAccount">(
    "wallet",
  );

  const handleTabChange = (tab: "wallet" | "virtualAccount") => {
    setCurrentTab(tab);
  };

  const handleChangeFilter = () => {
    setShowFilter(!showFilter);
  };

  const [showFilter, setShowFilter] = useState(true);

  return (
    <div className="flex flex-col border-t border-[#d6d6d6]">
      <div className="flex justify-start">
        <div
          className={cn(
            "flex w-[176px] cursor-pointer items-center justify-between border-r border-[#d6d6d6] p-3",
            currentTab === "wallet"
              ? "border-b-0 bg-[#F6F7F8] text-[#0572EC]"
              : "bg-[#fafafa] text-[#707070]" +
                  (showFilter ? "border-b" : "border-b-0"),
          )}
          onClick={() => handleTabChange("wallet")}
        >
          <div>{T("Wallets")}</div>
          <Image
            onClick={handleChangeFilter}
            alt="search"
            src="/icons/search.svg"
            width="16"
            height="16"
          />
        </div>
        <div
          className={cn(
            "flex w-[176px] cursor-pointer items-center border-r border-[#d6d6d6] p-3",
            currentTab === "virtualAccount"
              ? "border-b-0 bg-[#F6F7F8] text-[#0572EC]"
              : "bg-[#fafafa] text-[#707070] " +
                  (showFilter ? "border-b" : "border-b-0"),
          )}
          onClick={() => handleTabChange("virtualAccount")}
        >
          <div>{T("VirtualAccounts")}</div>
        </div>
        <div
          className={cn(
            "flex-1 border-[#d6d6d6]",
            showFilter ? "border-b" : "",
          )}
        ></div>
      </div>
      <FilterAccountList
        className={cn(currentTab === "wallet" ? "visible" : "hidden")}
        keyStores={keyStores}
        showFilter={showFilter}
      />
    </div>
  );
}

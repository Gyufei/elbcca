import { useTranslations } from "next-intl";
import Image from "next/image";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useContext, useState } from "react";
import { cn } from "@/lib/utils";
import FilterAccountList from "./filter-account-list";
import VirtualAccounts from "./virtual-accounts";
import { VaContext } from "@/lib/providers/va-provider";

export default function WalletVA({
  keyStores,
}: {
  keyStores: Array<IKeyStoreAccount>;
}) {
  const T = useTranslations("Common");
  const { currentAccountType, onAccountTypeChange } = useContext(VaContext);

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
            currentAccountType === "Wallet"
              ? "border-b-0 bg-[#F6F7F8] text-[#0572EC]"
              : "border-b bg-[#fafafa] text-[#707070]",
          )}
          onClick={() => onAccountTypeChange("Wallet")}
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
            currentAccountType === "VirtualAccount"
              ? "border-b-0 bg-[#F6F7F8] text-[#0572EC]"
              : "bg-[#fafafa] text-[#707070] " +
                  (showFilter ? "border-b" : "border-b-0"),
          )}
          onClick={() => onAccountTypeChange("VirtualAccount")}
        >
          <div>{T("VirtualAccounts")}</div>
        </div>
        <div
          className={cn(
            "flex-1 border-[#d6d6d6]",
            currentAccountType === "VirtualAccount" || showFilter ? "border-b" : "",
          )}
        ></div>
      </div>
      <FilterAccountList
        className={cn(currentAccountType === "Wallet" ? "visible" : "hidden")}
        keyStores={keyStores}
        showFilter={showFilter}
      />
      <VirtualAccounts
        keyStores={keyStores}
        className={cn(currentAccountType === "VirtualAccount" ? "visible" : "hidden")}
      />
    </div>
  );
}

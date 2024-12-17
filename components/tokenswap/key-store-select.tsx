import { useContext, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useKeyStoreAccounts } from "@/lib/hooks/use-key-store-accounts";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useTranslations } from "next-intl";

export default function KeyStoreSelect({
  keyStores,
  handleKeyStoreSelect,
  page,
}: {
  page: string;
  keyStores: Array<IKeyStoreAccount>;
  handleKeyStoreSelect: (
    _keyStoreUpdate:
      | Array<IKeyStoreAccount>
      | ((_ks: Array<IKeyStoreAccount>) => Array<IKeyStoreAccount>),
  ) => void;
}) {
  const T = useTranslations("Common");
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id || null;

  const [openKeyStorePopOpen, setKeyStorePopOpen] = useState(false);

  const keyStoreOptions = useKeyStoreAccounts(networkId, page);

  useEffect(() => {
    if (!keyStores.length && keyStoreOptions.length) {
      handleKeyStoreSelect(keyStoreOptions);
    }

    if (keyStores.length && keyStoreOptions.length) {
      const ks = keyStores.map((ks) => {
        const newKs = keyStoreOptions.find((k) => k.name === ks.name);
        return newKs as any;
      });
      handleKeyStoreSelect(ks);
    }
  }, [keyStoreOptions]);

  const handleSelectKeyStore = (keyStore: any) => {
    handleKeyStoreSelect((ks: Array<IKeyStoreAccount>) => {
      if (ks.some((k) => k.name === keyStore.name)) {
        return ks.filter((k) => k.name !== keyStore.name);
      } else {
        return [...ks, keyStore];
      }
    });
    setKeyStorePopOpen(false);
  };

  return (
    <Popover
      open={openKeyStorePopOpen}
      onOpenChange={(isOpen) => setKeyStorePopOpen(isOpen)}
    >
      <PopoverTrigger className="w-[350px]">
        <div
          className="flex items-center transition-all duration-75 active:bg-gray-100"
          onClick={() => setKeyStorePopOpen(!openKeyStorePopOpen)}
        >
          {keyStores.length ? (
            <>
              <div className="mr-2 text-title-color">
                {keyStores[0].name}
                {keyStores.length > 1 && " ..."}
              </div>
              <div className="Tag mr-2 bg-[#e9eaee]">{keyStores.length}</div>
            </>
          ) : (
            <div className="text-sm text-content-color">Select KeyStore</div>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openKeyStorePopOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[360px]" align="start">
        <div className="w-[340px] rounded-md bg-white">
          <div className="flex flex-col">
            <div className="LabelText mb-1 flex items-center">
              {T("AvailableKeyStores")}
            </div>
            <div className="flex flex-wrap">
              {!keyStoreOptions.length && <div>No Available KeyStores</div>}
              {keyStoreOptions.map((option) => (
                <div
                  key={option.name}
                  className="flex min-w-[160px] cursor-pointer items-center"
                >
                  <Checkbox
                    id={option.name}
                    checked={keyStores.some((ks) => ks.name === option.name)}
                    onCheckedChange={() => handleSelectKeyStore(option)}
                  />
                  <label
                    className="flex cursor-pointer items-center pl-2 text-lg font-medium text-title-color"
                    htmlFor={option.name}
                  >
                    {option.name}
                    {!option.accountLoading && (
                      <div className="Tag ml-2 bg-[#e9eaee]">
                        {option.accounts.length}
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

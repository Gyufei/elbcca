import { useEffect, useState } from "react";

import fetcher from "@/lib/fetcher";
import { IAccountGas } from "@/components/keystore/key-store-accounts-table";
import { usePageKeystores } from "./use-page-keystores";
import { IKeyStore, IKeyStoreAccount, IKeyStoreRange } from "../types/keystore";
import useIndexStore from "../state";

export function useKeyStoreAccounts(networkId: number | null, page: string) {
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const { data: keyStores } = usePageKeystores(page);

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<IKeyStoreAccount>
  >([]);

  const getRangeAccounts = (
    range: IKeyStoreRange,
    accounts: Array<IKeyStoreAccount>,
  ) => {
    if (!accounts) return [];

    const target =
      accounts.find((ks) => ks.accounts[0].account === range.root_account)
        ?.accounts || [];

    if (target?.length) {
      return target.slice(range.from_index, range.to_index + 1);
    }

    return target;
  };

  async function getKeyStoreAccounts(name: string): Promise<IKeyStoreAccount> {
    try {
      const url = `${userPathMap.keyStoreAccounts}?keystore=${name}&chain_id=${networkId}`;
      const res: Array<IKeyStoreAccount> = await fetcher(url);

      const ks = keyStores.find((k) => k.keystore_name === name);
      if (!ks) throw new Error("keystore not found");

      let targetAcc = [];

      if (!ks.range.length) {
        targetAcc = res.reduce((acc: Array<IAccountGas>, ks) => {
          return acc.concat(ks.accounts);
        }, []);
      } else {
        targetAcc = ks.range.reduce(
          (acc: Array<IAccountGas>, rangeItem: IKeyStoreRange) => {
            const targetAcc = getRangeAccounts(rangeItem, res);
            return acc.concat(targetAcc);
          },
          [],
        );
      }

      return {
        name,
        accounts: targetAcc,
        count: targetAcc.length,
        accountLoading: false,
      };
    } catch (e) {
      return {
        name,
        accounts: [],
        count: 0,
        accountLoading: false,
      };
    }
  }

  useEffect(() => {
    if (!keyStores?.length || !networkId) {
      return;
    }

    const ksAcs = keyStores.map((ks: IKeyStore) => {
      return {
        name: ks.keystore_name,
        accounts: [],
        count: 0,
        accountLoading: true,
      };
    });

    setKeyStoreAccounts(() => {
      return ksAcs;
    });

    async function getItemAccounts() {
      const ksAcs = await Promise.all(
        keyStores.map((ks: IKeyStore) => {
          return getKeyStoreAccounts(ks.keystore_name);
        }),
      );

      setKeyStoreAccounts(() => {
        return ksAcs;
      });
    }

    getItemAccounts();
  }, [keyStores, networkId]);

  return keyStoreAccounts;
}

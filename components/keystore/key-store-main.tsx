"use client";

import useSWR from "swr";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Loader, PenLine, Trash2 } from "lucide-react";

import KeyStoreLinks from "@/components/keystore/key-store-links";

import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";

import { KeyStorePageSelect } from "@/components/keystore/key-store-page-select";
import DetailItem from "@/components/shared/detail-item";
import KeyStoreAccountsTable, {
  IAccountGas,
} from "@/components/keystore/key-store-accounts-table";
import { NetworkContext } from "@/lib/providers/network-provider";
import DeleteKeyStoreDialog from "@/components/keystore/delete-key-store-dialog";
import { IKeyStore, IKeyStoreRange } from "@/lib/types/keystore";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useSWRMutation from "swr/mutation";
import { useUserKeystores } from "@/lib/hooks/use-user-keystores";
import { uniqBy } from "lodash";
import useIndexStore from "@/lib/state";
import { useTranslations } from "next-intl";
import NetworkSelect from "../workflow/network-select";

export default function KeyStoreMain() {
  const T = useTranslations("Common");
  const { network, onNetworkChange } = useContext(NetworkContext);

  const userPathMap = useIndexStore((state) => state.userPathMap());

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const {
    data: userKeyStores,
    isLoading: keyStoreLoading,
    mutate: refetchKeyStores,
  } = useUserKeystores();

  const [selectedKeyStoreName, setSelectedKeyStoreName] = useState<
    string | null
  >(null);

  const selectedKeyStore = useMemo(() => {
    if (!userKeyStores.length) return null;

    const ks = userKeyStores.find(
      (k: IKeyStore) => k.keystore_name === selectedKeyStoreName,
    );

    return ks;
  }, [userKeyStores, selectedKeyStoreName]);

  if (userKeyStores.length && !selectedKeyStoreName) {
    setSelectedKeyStoreName(userKeyStores[0].keystore_name);
  }

  const [selectedRangeName, setSelectedRangeName] = useState<string | null>(
    null,
  );

  const selectedRange = useMemo(() => {
    if (!selectedKeyStoreName) return null;

    const ks = selectedKeyStore?.range.find(
      (k: IKeyStoreRange) => k.root_account === selectedRangeName,
    );

    return ks;
  }, [selectedKeyStoreName, selectedKeyStore, selectedRangeName]);

  const {
    data: keyStoreAccountsDataRes,
    isLoading: accountsLoading,
    mutate: refreshAccount,
  } = useSWR<Array<{ accounts: Array<IAccountGas>; count: number }>>(() => {
    if (userKeyStores.length && selectedKeyStoreName && network?.chain_id) {
      return `${userPathMap.keyStoreAccounts}?keystore=${selectedKeyStoreName}&chain_id=${network?.chain_id}`;
    } else {
      return null;
    }
  }, fetcher);

  const keyStoreAccountsData = useMemo(() => {
    if (!keyStoreAccountsDataRes) return [];

    return keyStoreAccountsDataRes?.map((ks) => {
      const indexedAccounts = ks.accounts.map((a, i) => ({
        ...a,
        index: i,
      }));

      return {
        ...ks,
        accounts: indexedAccounts,
      };
    });
  }, [keyStoreAccountsDataRes]);

  const getRangeAccounts = useCallback(
    (range: IKeyStoreRange) => {
      if (!keyStoreAccountsData) return [];

      const target =
        keyStoreAccountsData.find(
          (ks) => ks.accounts[0].account === range.root_account,
        )?.accounts || [];

      if (target?.length) {
        return target.slice(range.from_index, range.to_index + 1);
      }

      return target;
    },
    [keyStoreAccountsData],
  );

  const accounts: Array<IAccountGas> = useMemo(() => {
    if (!userKeyStores || !keyStoreAccountsData || !selectedKeyStore) return [];

    let targetAcc: Array<IAccountGas> = [];
    if (selectedKeyStore && !selectedRange) {
      if (selectedKeyStore.range.length === 0) {
        targetAcc = keyStoreAccountsData
          .reduce((acc: Array<IAccountGas>, ks) => {
            return acc.concat(ks.accounts);
          }, [])
          .map((ag, i) => ({
            ...ag,
            index: i,
          }));
      } else {
        targetAcc = selectedKeyStore.range.reduce(
          (acc: Array<IAccountGas>, k) => {
            const rangeAccounts = getRangeAccounts(k);
            return acc.concat(rangeAccounts);
          },
          [],
        );
      }

      targetAcc = uniqBy(targetAcc, "account");
    }

    if (selectedKeyStore && selectedRange) {
      targetAcc = getRangeAccounts(selectedRange);
    }

    return targetAcc;
  }, [
    userKeyStores,
    keyStoreAccountsData,
    selectedKeyStore,
    selectedRange,
    getRangeAccounts,
  ]);

  const tx = accounts.reduce(
    (acc: number, aG: Record<string, any>) => acc + aG.tx,
    0,
  );

  const gasAvailable = accounts.filter(
    (aG: Record<string, any>) => aG.gas > 0,
  ).length;

  const submitFetcher = async (url: string, { arg }: { arg: IKeyStore }) => {
    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(arg),
    });

    toast({
      description: "Update KeyStore Success",
    });
    return res;
  };

  const { trigger: submitAction } = useSWRMutation(
    SystemEndPointPathMap.addKeyStore,
    submitFetcher as any,
  );

  const [edit, setEdit] = useState<"from" | "to" | null>(null);

  const [fromValue, setFromValue] = useState<string | null>(null);
  const [toValue, setToValue] = useState<string | null>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const onEdit = (type: "from" | "to") => {
    if (type === "from") {
      setFromValue(String(selectedRange?.from_index) || null);
      fromRef.current?.select();
      fromRef.current?.focus();
    }

    if (type === "to") {
      setToValue(String(selectedRange?.to_index) || null);
      toRef.current?.select();
      toRef.current?.focus();
    }

    setEdit(type);
  };

  const onFromBlur = () => {
    if (!fromValue) {
      setFromValue(String(selectedRange?.from_index) || null);
      setEdit(null);
      return;
    }

    updateKeyStoreRange();
  };

  const onToBlur = () => {
    if (!toValue) {
      setToValue(String(selectedRange?.to_index) || null);
      setEdit(null);
      return;
    }

    updateKeyStoreRange();
  };

  const onFromChange = (val: string) => {
    setFromValue(val || null);
  };

  const onToChange = (val: string) => {
    setToValue(val || null);
  };

  const updateKeyStoreRange = async () => {
    if (!selectedKeyStore) return;

    const res = await submitAction({
      keystore_name: selectedKeyStore.keystore_name,
      range: JSON.stringify([
        ...selectedKeyStore.range.filter(
          (r: IKeyStoreRange) => r.root_account !== selectedRange?.root_account,
        ),
        {
          root_account: selectedRange?.root_account,
          from_index: fromValue
            ? parseInt(fromValue)
            : selectedRange?.from_index,
          to_index: toValue ? parseInt(toValue) : selectedRange?.to_index,
        },
      ]),
    } as any);

    if (res) {
      refetchKeyStores();
      refreshAccount();
      setEdit(null);
    }
  };

  const onDelete = () => {
    setSelectedKeyStoreName(null);
    setSelectedRangeName(null);
    refetchKeyStores();
  };

  return (
    <div className="flex h-[calc(100vh-70px)] w-screen flex-col bg-[#fafafa] md:w-auto md:flex-row md:items-stretch">
      <KeyStoreLinks
        isLoading={keyStoreLoading}
        keyStores={userKeyStores}
        selected={selectedKeyStoreName || null}
        setSelected={setSelectedKeyStoreName}
        selectedRange={selectedRangeName}
        setSelectedRange={setSelectedRangeName}
        onSubmitted={() => refetchKeyStores()}
        onDelete={() => setDeleteDialogOpen(true)}
      ></KeyStoreLinks>

      <div className="flex min-h-[400px] flex-1 flex-col items-stretch overflow-y-auto bg-[#fafafa] md:flex-row md:overflow-y-hidden">
        <div className="flex w-full flex-col justify-between border-b border-shadow-color px-3 pb-4 pt-3 md:w-[400px] md:border-b-0 md:border-r">
          {keyStoreLoading || accountsLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col justify-stretch">
              <DetailItem title={T("Address")}>{accounts.length}</DetailItem>
              <DetailItem title={T("GasAvailable")}>{gasAvailable}</DetailItem>
              <DetailItem title={T("Tx")}>{tx}</DetailItem>
              <DetailItem title={T("DefaultNetwork")}>
                <NetworkSelect
                  curretNetwork={network}
                  handleSelect={onNetworkChange}
                />
              </DetailItem>
              {!selectedRange && (
                <DetailItem title={T("WorksFor")}>
                  {selectedKeyStoreName ? (
                    <KeyStorePageSelect
                      keyStoreName={selectedKeyStoreName || null}
                    />
                  ) : (
                    <div className="h-6 w-10"></div>
                  )}
                </DetailItem>
              )}
              {selectedRange && (
                <div className="flex items-center justify-between">
                  <DetailItem title="From" className="flex-1">
                    <div className="flex items-center gap-x-3">
                      {edit === "from" ? (
                        <Input
                          ref={fromRef}
                          type="text"
                          value={fromValue || ""}
                          placeholder="0"
                          onBlur={onFromBlur}
                          onChange={(e) => onFromChange(e.target.value)}
                          className="h-6 focus-visible:ring-0 data-[state=error]:border-destructive"
                        />
                      ) : (
                        <span className="leading-6">
                          {selectedRange.from_index}
                        </span>
                      )}
                      <PenLine
                        onClick={() => onEdit("from")}
                        className="h-4 w-4 cursor-pointer text-[8c8c8c]"
                      />
                    </div>
                  </DetailItem>
                  <div className="mx-[3px]">-</div>
                  <DetailItem title="To" className="flex-1">
                    <div className="flex items-center gap-x-3">
                      {edit === "to" ? (
                        <Input
                          // data-state={errorMsg ? "error" : ""}
                          ref={toRef}
                          type="text"
                          value={toValue || ""}
                          placeholder="0"
                          onBlur={onToBlur}
                          onChange={(e) => onToChange(e.target.value)}
                          className="h-6 focus-visible:ring-0 data-[state=error]:border-destructive"
                        />
                      ) : (
                        <span className="leading-6">
                          {selectedRange.to_index}
                        </span>
                      )}
                      <PenLine
                        onClick={() => onEdit("to")}
                        className="h-4 w-4 cursor-pointer text-[8c8c8c]"
                      />
                    </div>
                  </DetailItem>
                </div>
              )}
            </div>
          )}

          <div className="hidden w-full justify-end pr-2 md:flex">
            {!selectedRange && (
              <Trash2
                onClick={() => setDeleteDialogOpen(true)}
                className="h-5 w-5 cursor-pointer hover:text-[#ec5b55]"
              />
            )}
            <DeleteKeyStoreDialog
              open={deleteDialogOpen}
              keyStoreName={selectedKeyStoreName || null}
              onOpenChange={setDeleteDialogOpen}
              onDeleted={onDelete}
            />
          </div>
        </div>

        <KeyStoreAccountsTable
          isLoading={keyStoreLoading || accountsLoading}
          accounts={accounts}
        />
      </div>
    </div>
  );
}

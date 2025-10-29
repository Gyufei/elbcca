import { cn } from "@/lib/utils";
import TruncateText from "../shared/trunc-text";
import { ArrowUpRight, XCircle } from "lucide-react";
import Image from "next/image";
import { useContext, useRef, useState, useMemo } from "react";
import { TokenContext } from "@/lib/providers/token-provider";
import AmountTooltipDisplay from "./amount-tooltip-display";
import WalletRow from "./wallet-row";
import { Pagination } from "../pagination/pagination";
import { IVaData, useGetVa } from "@/lib/hooks/use-get-va";
import { IToken } from "@/lib/types/token";
import { useGetSubVa } from "@/lib/hooks/use-get-sub-va";
import { Input } from "../ui/input";
import { VaContext } from "@/lib/providers/va-provider";
import { useDeleteVa } from "@/lib/hooks/use-delete-va";
import { NetworkContext } from "@/lib/providers/network-provider";
import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { useTranslations } from "next-intl";
import { toast } from "../ui/use-toast";
import Empty from "../shared/empty";

export default function VirtualAccounts({ className }: { className?: string }) {
  const T = useTranslations("Common");
  const { data: vaData } = useGetVa();
  const [openSubVa, setOpenSubVa] = useState<string | null>(null);

  const { gasToken } = useContext(TokenContext);
  const { selectedToken } = useContext(VaContext);

  function handleOpenSubVa(va: string) {
    setOpenSubVa(openSubVa === va ? null : va);
  }

  return (
    <div className={cn("flex flex-col justify-stretch", className)}>
      <div className="relative flex flex-col bg-[#fafafa]">
        <div
          className="overflow-y-auto pb-2"
          style={{
            height: "calc(100vh - 286px)",
          }}
        >
          {vaData?.length ? (
            vaData?.map((va: IVaData, index: number) => (
              <VaRow
                key={va.va_name}
                index={index}
                vaLength={vaData.length || 0}
                vaData={va}
                openSubVa={openSubVa}
                handleOpenSubVa={handleOpenSubVa}
                gasToken={gasToken || undefined}
                token={selectedToken || undefined}
              />
            ))
          ) : (
            <Empty displayText={T("NoVirtualAccounts")} />
          )}
        </div>
      </div>
    </div>
  );
}

function SubWalletFlag({
  className,
  subWalletNum,
}: {
  className?: string;
  subWalletNum: number;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded border border-[#707070] bg-[#fff]",
        className,
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center bg-[#707070]">
        <Image src="/icons/wallet.svg" alt="path-flag" width={16} height={16} />
      </div>
      <div className="flex h-5 w-5 items-center justify-center text-xs text-[#707070]">
        {subWalletNum}
      </div>
    </div>
  );
}

function VaRow({
  index,
  vaLength,
  vaData,
  openSubVa,
  handleOpenSubVa,
  gasToken,
  token,
}: {
  index: number;
  vaLength: number;
  vaData: IVaData;
  openSubVa: string | null;
  handleOpenSubVa: (va: string) => void;
  gasToken: IToken | undefined;
  token: IToken | undefined;
}) {
  const T = useTranslations("Common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditName, setIsEditName] = useState(false);
  const [newName, setNewName] = useState(vaData.va_name);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { trigger: deleteVa } = useDeleteVa();
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const onVaNameChange = useIndexStore((state) => state.setFromAddress);

  const { data: subVaData } = useGetSubVa({
    tokenAddr: token?.token_address || "",
    accounts: vaData.wallet_list,
  });

  // 搜索过滤逻辑
  const filteredSubVaData = useMemo(() => {
    if (!subVaData) return [];
    if (!searchKeyword.trim()) return subVaData;

    const filtered = subVaData.filter((subAcc: any) =>
      subAcc.account.toLowerCase().includes(searchKeyword.toLowerCase()),
    );
    return filtered;
  }, [subVaData, searchKeyword]);

  const itemsPerPage = 5;
  const totalItems = filteredSubVaData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredSubVaData.slice(startIndex, endIndex);

  const totalGasTokenAmount = subVaData?.reduce(
    (acc: number, curr: any) => acc + Number(curr.gas_token_amount),
    0,
  );
  const totalQuoteTokenAmount = subVaData?.reduce(
    (acc: number, curr: any) => acc + Number(curr.quote_token_amount),
    0,
  );

  function handleEditName() {
    setIsEditName(true);
    setNewName(vaData.va_name);
    setTimeout(() => {
      inputRef.current?.select();
      inputRef.current?.focus();
    }, 500);
  }

  function handleVaNameChange(va: string) {
    onVaNameChange(va);
  }

  function handleDelete() {
    if (!networkId || !activeUser?.email) return;
    deleteVa(
      {
        chain_id: networkId,
        user_name: activeUser.email,
        va_name: vaData.va_name,
      },
      {
        onSuccess: () => {
          toast({ title: T("VaDeleted") });
        },
        onError: () => {
          toast({ title: T("VaDeleteFailed"), variant: "destructive" });
        },
      },
    );
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchKeyword(value);
    // 搜索时重置到第一页
    setCurrentPage(0);
  }

  function handleClearSearch() {
    setSearchKeyword("");
    setCurrentPage(0);
  }

  return (
    <div
      className={cn(
        "bg-custom-bg-white",
        index !== 0 ? "border-t" : vaLength === 1 ? "border-b" : "",
        index === vaLength - 1 && openSubVa === vaData.va_name
          ? "border-b"
          : "",
      )}
    >
      <div
        className={cn(
          "flex h-[73px] items-center justify-between p-3",
          openSubVa === vaData.va_name || index === vaLength - 1
            ? "border-b"
            : "",
        )}
      >
        <div className="flex flex-1 flex-col gap-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="pl-1 pr-5 text-left text-lg leading-none text-content-color">
                {index + 1}
              </div>
              <div>
                {isEditName ? (
                  <Input
                    value={newName}
                    className="h-7 border border-[rgba(5,114,236,0.4)]"
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => setIsEditName(false)}
                    ref={inputRef}
                  />
                ) : (
                  <div onClick={handleEditName} className="cursor-pointer">
                    <TruncateText
                      onClick={(e) => e.stopPropagation()}
                      text={vaData.va_name}
                      textClx="hover:underline hover:decoration-dashed hover:underline-offset-2"
                    >
                      <span
                        className="ml-1 cursor-pointer text-lg font-medium text-title-color"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVaNameChange(vaData.va_name);
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </TruncateText>
                  </div>
                )}
              </div>
              <SubWalletFlag
                className="ml-4"
                subWalletNum={vaData.wallet_list.length}
              />
            </div>
            <button
              onClick={handleDelete}
              className="rounded p-1 transition-colors hover:bg-gray-100"
              title="delete"
            >
              <Image
                src="/icons/delete.svg"
                width={16}
                height={16}
                alt="delete"
              />
            </button>
          </div>
          <div className="LabelText flex">
            <Image
              src="/icons/left-arrow.svg"
              alt="left-arrow"
              className={cn(
                "mr-3 cursor-pointer",
                openSubVa === vaData.va_name ? "rotate-90" : "",
              )}
              width={16}
              height={16}
              onClick={() => handleOpenSubVa(vaData.va_name)}
            />
            <div className="mr-20 flex items-center gap-x-1">
              <span>{gasToken?.token_symbol}</span>
              <AmountTooltipDisplay amount={String(totalGasTokenAmount || 0)} />
            </div>

            <div className="flex items-center gap-x-1">
              <span>{token?.token_symbol}</span>
              <AmountTooltipDisplay
                amount={String(totalQuoteTokenAmount || 0)}
              />
            </div>
          </div>
        </div>
      </div>
      {openSubVa === vaData.va_name && (
        <div className="border-b border-[#d6d6d6] p-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={searchKeyword}
              onChange={handleSearchChange}
              className="rounded-[24px] border border-[#BFBFBF] pr-8"
            />
            {searchKeyword && (
              <XCircle
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-lg font-bold text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
              />
            )}
          </div>
        </div>
      )}
      {openSubVa === vaData.va_name && (
        <div className="flex flex-col px-3">
          {currentPageData.length > 0 ? (
            currentPageData.map((subAcc: any, subIndex: number) => (
              <WalletRow
                indexClx="pr-2"
                clx={
                  totalPages < 2 && subIndex === currentPageData.length - 1
                    ? "!border-b-0"
                    : ""
                }
                key={subAcc.account}
                index={startIndex + subIndex}
                accData={subAcc}
                isFilterGasToken={false}
                gasToken={gasToken}
                token={token}
              >
                <div className="ml-1 h-4 w-4"></div>
              </WalletRow>
            ))
          ) : (
            <Empty />
          )}

          {/* 分页组件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                edgePageCount={1}
                middlePagesSiblingCount={1}
              >
                <Pagination.PrevButton />
                <Pagination.PageButton />
                <Pagination.NextButton />
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

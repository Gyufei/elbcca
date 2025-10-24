import { IKeyStoreAccount } from "@/lib/types/keystore";
import { cn } from "@/lib/utils";
import TruncateText from "../shared/trunc-text";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import { TokenContext } from "@/lib/providers/token-provider";
import AmountTooltipDisplay from "./amount-tooltip-display";
import WalletRow from "./wallet-row";
import { Pagination } from "../pagination/pagination";

const uniqAccounts = [
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    subWalletNum: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    subWalletNum: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    subWalletNum: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    subWalletNum: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    subWalletNum: 1,
  },
];

const subUniqAccounts = [
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0243a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0343a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a39D5c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
  {
    account: "0x94f0143a83Aec01a31D4c68478FE6aC9f3DF83B3",
    gas_token_amount: "0.00046879092757876",
    quote_token_amount: "0.00046879092757876",
    nonce: 1,
  },
];

export default function VirtualAccounts({
  className,
  keyStores,
}: {
  keyStores: Array<IKeyStoreAccount>;
  className?: string;
}) {
  console.log(keyStores);
  const [openSubVa, setOpenSubVa] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  function handleClickAcc(addr: string) {
    console.log(addr);
  }

  const { gasToken } = useContext(TokenContext);

  // 分页相关计算
  const itemsPerPage = 5;
  const totalItems = subUniqAccounts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 计算当前页显示的数据
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = subUniqAccounts.slice(startIndex, endIndex);

  function handleOpenSubVa(va: string) {
    if (openSubVa === va) {
      setOpenSubVa(null);
    } else {
      setOpenSubVa(va);
      // 重置分页到第一页
      setCurrentPage(0);
    }
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
          {uniqAccounts.map((acc: any, index: number) => (
            <div
              key={acc.account}
              className={cn(
                "bg-custom-bg-white",
                index !== 0
                  ? "border-t"
                  : uniqAccounts.length === 1
                  ? "border-b"
                  : "",
              )}
            >
              <div
                className={cn(
                  "flex h-[73px] items-center justify-between p-3",
                  openSubVa === acc.account ? "border-b" : "",
                )}
              >
                <div className="flex flex-1 flex-col gap-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="pl-1 pr-5 text-left text-lg leading-none text-content-color">
                        {index + 1}
                      </div>
                      <TruncateText text={acc.account}>
                        <span
                          className="ml-1 cursor-pointer text-lg font-medium text-title-color"
                          onClick={() => handleClickAcc(acc.subWalletNum)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </TruncateText>
                      <SubWalletFlag
                        className="ml-4"
                        subWalletNum={acc.subWalletNum}
                      />
                    </div>
                  </div>
                  <div className="LabelText flex">
                    <Image
                      src="/icons/left-arrow.svg"
                      alt="left-arrow"
                      className={cn(
                        "mr-3 cursor-pointer",
                        openSubVa === acc.account ? "rotate-90" : "",
                      )}
                      width={16}
                      height={16}
                      onClick={() => handleOpenSubVa(acc.account)}
                    />
                    <div className="mr-20 flex items-center gap-x-1">
                      <span>{gasToken?.token_symbol}</span>
                      <AmountTooltipDisplay amount={acc.gas_token_amount} />
                    </div>

                    <div className="flex items-center gap-x-1">
                      <span>Token</span>
                      <AmountTooltipDisplay amount={acc.quote_token_amount} />
                    </div>
                  </div>
                </div>
              </div>
              {openSubVa === acc.account && (
                <div className="flex flex-col px-3">
                  {currentPageData.length > 0 &&
                    currentPageData.map((subAcc: any, subIndex: number) => (
                      <WalletRow
                        key={subAcc.account}
                        index={startIndex + subIndex}
                        accData={subAcc}
                        handleClickAcc={handleClickAcc}
                        isFilterGasToken={false}
                        gasToken={gasToken || undefined}
                        token={undefined}
                      ></WalletRow>
                    ))}
                  
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
          ))}
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

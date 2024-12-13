import { memo, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Empty from "@/components/shared/empty";
import { TruncateTextNoProvider } from "@/components/shared/trunc-text";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export interface IAccountGas {
  account: string;
  gas: string;
  tx: number;
  index: number;
}

export default function KeyStoreAccountsTable({
  isLoading,
  accounts,
}: {
  isLoading: boolean;
  accounts: Array<IAccountGas>;
}) {
  const T = useTranslations("Common");
  const [filterText, setFilterText] = useState<string>("");
  const [filterTextDebounce] = useDebounce(filterText, 500);

  const filteredAccount = useMemo(() => {
    if (!accounts?.length) return [];

    if (!filterTextDebounce) {
      return accounts;
    }

    const filtered = accounts.filter((aG) =>
      aG.account.toLowerCase().includes(filterTextDebounce.toLowerCase()),
    );

    return filtered;
  }, [filterTextDebounce, accounts]);

  return (
    <div className="flex flex-1 flex-col justify-stretch">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <div
            style={{
              boxShadow: "inset 0px -1px 0px 0px #D6D6D6",
            }}
            className="bg-custom-bg-white px-3 py-2 "
          >
            <Input
              className="rounded-3xl bg-custom-bg-white"
              type="text"
              placeholder={T("Search")}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <AccTable acc={filteredAccount} />
        </>
      )}
    </div>
  );
}

const AccTable = memo(function AccTable({ acc }: { acc: Array<IAccountGas> }) {
  const T = useTranslations("Common");
  const [showAcc, setShowAcc] = useState<Array<IAccountGas>>([]);

  useEffect(() => {
    if (!acc?.length) return;

    setShowAcc(acc.slice(0, 40));

    setTimeout(() => {
      setShowAcc(acc);
    }, 1000);
  }, [acc, setShowAcc]);

  return (
    <Table className="table-fixed">
      <TableHeader className="sticky top-0 h-10 bg-white text-content-color">
        <TableRow className="shadow-md">
          <TableHead className="w-[30px] text-center font-normal md:w-[100px]">
            #
          </TableHead>
          <TableHead className="w-[230px] font-normal md:w-auto">
            {T("Address")}
          </TableHead>
          <TableHead className="font-normal">{T("Gas")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-base">
        <TooltipProvider delayDuration={100}>
          {showAcc.length ? (
            showAcc?.map((aG) => (
              <TableRow
                key={aG.account}
                className="h-[48px] border-b border-shadow-color"
              >
                <TableCell className="p-2 text-center">{aG.index}</TableCell>
                <TableCell className="p-2">
                  <TruncateTextNoProvider text={aG.account} showCopy={true} />
                </TableCell>
                <TableCell className="p-2">
                  <span className="TruncateSingleLine inline-block max-w-[100px] leading-4 md:max-w-none">
                    {aG.gas}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <Empty />
              </td>
            </tr>
          )}
        </TooltipProvider>
      </TableBody>
    </Table>
  );
});


import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import Empty from "@/components/shared/empty";
import { TruncateTextNoProvider } from "@/components/shared/trunc-text";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useTranslations } from "next-intl";
import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "@/lib/end-point";

export interface TokenItem {
  chain_id: number;
  token_id: number;
  token_symbol: string;
  token_name: string;
  token_address: string;
  index: number;
}

export const TokenTable = function TokenTable({ chainId, list = [], onRefresh}: { chainId: string; list: Array<TokenItem>;  onRefresh: () => void}) {
  const T = useTranslations("Common");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [upLoading, setUpLoading] = useState<boolean>(false)
  
  const handleUp = async (item: TokenItem) => {
    if (upLoading) return;
    setUpLoading(true)
    const params = {
      token_id: item.token_id,
    };

    try {
      await fetcher(SystemEndPointPathMap.upTopToken + `?chain_id=${chainId}`, {
        method: "POST",
        body: JSON.stringify(params),
      });
      onRefresh()
    } catch (err) {
        console.error('Error update:', err);
    } finally {
      setUpLoading(false)
    }
  }

  const handleDelete = async (item: TokenItem) => {
    if (deleteLoading) return;
    setDeleteLoading(true)
    const params = {
      token_id: item.token_id,
    };

    try {
      await fetcher(SystemEndPointPathMap.deleteToken + `?chain_id=${chainId}`, {
        method: "POST",
        body: JSON.stringify(params),
      });
      onRefresh()
    } catch (err) {
        console.error('Error deleting', err);
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Table className="table-fixed">
      <TableHeader className="sticky top-0 h-10 bg-white text-content-color">
        <TableRow className="shadow-md">
          <TableHead className="w-[30px] text-center font-normal md:w-[100px]">
            #
          </TableHead>
          <TableHead className="w-[230px] font-normal md:w-auto">
            {T("Symbol")}
          </TableHead>
          <TableHead className="w-[230px] font-normal md:w-auto">
            {T("Name")}
          </TableHead>
          <TableHead className="w-[230px] font-normal md:w-auto">
            {T("Address")}
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-base">
        <TooltipProvider delayDuration={100}>
          {list.length ? (
            (list || []).map((item, index) => (
              <TableRow
                key={item.token_address}
                className="h-[56px] border-b border-shadow-color"
              >
                <TableCell className="p-2 text-center">{index + 1}</TableCell>
                <TableCell className="p-2">
                  {item.token_symbol}
                </TableCell>
                <TableCell className="p-2">
                  {item.token_name}
                </TableCell>
                <TableCell className="p-2">
                  <TruncateTextNoProvider text={item.token_address} showCopy={true} />
                </TableCell>
                <TableCell className="h-[56px] p-2 flex flex-row justify-end items-center">
                  <Image
                    src="/icons/up-top.svg"
                    alt="up-top"
                    width={20}
                    height={20}
                    className="mx-3 cursor-pointer"
                    onClick={() => handleUp(item)}
                  />
                  <Image
                    src="/icons/delete.svg"
                    alt="delete"
                    width={20}
                    height={20}
                    className="mx-3 cursor-pointer"
                    onClick={() => handleDelete(item)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={5}>
                <Empty />
              </td>
            </tr>
          )}
        </TooltipProvider>
      </TableBody>
    </Table>
  );
};
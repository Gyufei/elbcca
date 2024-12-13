"use client";
import { useContext, useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useIndexStore from "@/lib/state";
import DetailItem from "../shared/detail-item";

import { toast } from "../ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TzList } from "@/lib/constants/global";
import useEffectStore from "@/lib/state/use-store";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";
import { SystemEndPointPathMap } from "@/lib/end-point";
import { UserInfoContext } from "@/lib/providers/user-info-provider";
import { useTranslations } from "next-intl";

export default function ChangeTimezone() {
  const T = useTranslations("Common");
  const { refreshUser } = useContext(UserInfoContext);

  const [showChangeDialog, setShowChangeDialog] = useState(false);

  const timezone = useEffectStore(useIndexStore, (state) => state.timezone());
  const timezoneText = useEffectStore(useIndexStore, (state) =>
    state.timezoneText(),
  );

  const submitEndpoint = async (url: string, { arg }: { arg: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("timezone", arg);
    const query = searchParams.toString();

    const res = await fetcher(`${url}?${query}`, {
      method: "POST",
    });

    toast({
      description: "timezone updated",
    });
    refreshUser();
    return res;
  };

  const { trigger: submitAction } = useSWRMutation(
    SystemEndPointPathMap.userTimezone,
    submitEndpoint,
  );

  const handleSelect = (val: string) => {
    submitAction(val as string);
  };

  return (
    <DetailItem title={T("Timezone")}>
      <div className="relative flex w-full flex-col justify-center">
        <div
          className="flex items-center gap-x-3"
          onClick={() => setShowChangeDialog(true)}
        >
          <span>{timezoneText}</span>
          <Image
            src="/icons/edit.svg"
            width={24}
            height={24}
            className="cursor-pointer"
            alt="edit"
          />
        </div>
        <Dialog
          open={showChangeDialog}
          onOpenChange={(val) => setShowChangeDialog(val)}
        >
          <DialogContent
            title={T("Timezone")}
            showClose={true}
            className="w-[320px] outline-none"
          >
            <div className="flex flex-col gap-y-5 px-4">
              <Select
                value={timezone || undefined}
                onValueChange={(e) => handleSelect(e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OP" />
                </SelectTrigger>
                <SelectContent className="w-[286px]">
                  <div className="h-[180px] overflow-y-scroll">
                    {(TzList || []).map(
                      (t: { value: number; text: string }) => (
                        <SelectItem key={t.value} value={String(t.value)}>
                          {t.text}
                        </SelectItem>
                      ),
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DetailItem>
  );
}

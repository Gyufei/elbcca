"use client";

import useSWRMutation from "swr/mutation";

import Image from "next/image";
import DetailItem from "../shared/detail-item";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import { toast } from "../ui/use-toast";
import { UserInfoContext } from "@/lib/providers/user-info-provider";
import useIndexStore from "@/lib/state";
import { useContext, useRef, useState } from "react";
import useEffectStore from "@/lib/state/use-store";
import { useTranslations } from "next-intl";

export default function EditAliasname() {
  const T = useTranslations("Common");
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );
  const aliasname = activeUser?.aliasname;

  const { refreshUser } = useContext(UserInfoContext);
  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState(aliasname);
  const inputRef = useRef<HTMLInputElement>(null);

  const onEdit = () => {
    setInputValue(aliasname);
    setTimeout(() => {
      inputRef.current?.select();
      inputRef.current?.focus();
    }, 500);
    setEdit(true);
  };

  const onChange = (val: string) => {
    setInputValue(val);

    if (!val) {
      setErrorMsg(T("ChangeAliasnameEmptyError"));
      return;
    }

    setErrorMsg("");
  };

  const onBlur = () => {
    if (errorMsg) {
      return;
    }

    if (inputValue === aliasname) {
      setEdit(false);
      return;
    }

    submitAction(inputValue as string);
  };

  const submitEndpoint = async (url: string, { arg }: { arg: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("aliasname", arg);
    const query = searchParams.toString();

    const res = await fetcher(`${url}?${query}`, {
      method: "POST",
    });

    toast({
      description: T("ChangeAliasnameSuccess"),
    });
    refreshUser();
    setEdit(false);
    return res;
  };

  const { trigger: submitAction } = useSWRMutation(
    SystemEndPointPathMap.userAliasName,
    submitEndpoint,
  );

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <DetailItem title={T("UserAlias")}>
      <div className="relative flex w-full flex-col justify-center">
        {activeUser ? (
          <div className="flex items-center gap-x-3">
            {edit ? (
              <Input
                data-state={errorMsg ? "error" : ""}
                ref={inputRef}
                type="text"
                value={inputValue || ""}
                placeholder="aliasname"
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                className="focus-visible:ring-0 data-[state=error]:border-destructive"
              />
            ) : (
              <span>{aliasname}</span>
            )}
            <Image
              className="cursor-pointer"
              onClick={onEdit}
              src="/icons/edit.svg"
              width={24}
              height={24}
              alt="edit"
            />
          </div>
        ) : (
          <Skeleton className="h-7 w-full bg-white" />
        )}

        <div className="absolute -top-7 right-10 mt-1 text-sm text-destructive">
          {errorMsg}
        </div>
      </div>
    </DetailItem>
  );
}

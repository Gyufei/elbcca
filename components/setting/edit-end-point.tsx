"use client";

import Image from "next/image";
import { useContext, useMemo, useRef, useState } from "react";

import { NetworkContext } from "@/lib/providers/network-provider";
import DetailItem from "../shared/detail-item";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";
import { toast } from "../ui/use-toast";
import { UserInfoContext } from "@/lib/providers/user-info-provider";
import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { HintTexts } from "@/lib/hint-texts";
import { useTranslations } from "next-intl";

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

export default function EditEndPoint() {
  const T = useTranslations("Common");
  const userEndPoint = useEffectStore(useIndexStore, (state) =>
    state.endpoint(),
  );

  const { network } = useContext(NetworkContext);
  const { refreshUser } = useContext(UserInfoContext);

  const networkDisplay = useMemo(() => {
    if (!network || !network?.network_name) return "";
    if (network?.network_name === "BNB Smart Chain") return "(BNB Chain)";
    return `(${network?.network_name})`;
  }, [network]);

  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState(userEndPoint);
  const inputRef = useRef<HTMLInputElement>(null);

  const onEdit = () => {
    setInputValue(userEndPoint);
    setTimeout(() => {
      inputRef.current?.select();
      inputRef.current?.focus();
    }, 500);
    setEdit(true);
  };

  const onChange = (val: string) => {
    setInputValue(val);

    if (!val) {
      setErrorMsg(T("ChangeEndpointEmptyError"));
      return;
    }

    if (!URL_REGEX.test(val || "")) {
      setErrorMsg(T("NotUrlError"));
      return;
    }

    setErrorMsg("");
  };

  const onBlur = () => {
    if (errorMsg) {
      return;
    }

    if (inputValue === userEndPoint) {
      setEdit(false);
      return;
    }

    submitAction(inputValue as string);
  };

  const submitEndpoint = async (url: string, { arg }: { arg: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("end_point", arg);
    const query = searchParams.toString();

    const res = await fetcher(`${url}?${query}`, {
      method: "POST",
    });

    toast({
      description: T("ChangeEndpointSuccess"),
    });
    setEdit(false);
    refreshUser();
    return res;
  };

  const { trigger: submitAction } = useSWRMutation(
    SystemEndPointPathMap.endPoint,
    submitEndpoint,
  );

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <DetailItem title={`${T("ServiceEndpoint")} ${networkDisplay}`}>
      <div className="relative flex w-full flex-col justify-center">
        {userEndPoint ? (
          <div className="flex items-center gap-x-3">
            {edit ? (
              <Input
                data-state={errorMsg ? "error" : ""}
                ref={inputRef}
                type="text"
                value={inputValue || ""}
                placeholder="https://"
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                className="focus-visible:ring-0 data-[state=error]:border-destructive"
              />
            ) : (
              <span>{userEndPoint}</span>
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

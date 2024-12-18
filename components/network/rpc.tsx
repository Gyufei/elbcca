"use client";


import DetailItem from "../shared/detail-item";
import { Input } from "../ui/input";
import useIndexStore from "@/lib/state";
import { useRef, useState } from "react";
import useEffectStore from "@/lib/state/use-store";
import { HintTexts } from "@/lib/hint-texts";

export default function Rpc() {
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );
  const aliasname = activeUser?.aliasname;
  const [errorMsg, setErrorMsg] = useState("");

  const [inputValue, setInputValue] = useState(aliasname);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (val: string) => {
    setInputValue(val);

    if (!val) {
      setErrorMsg(HintTexts.ChangeAliasnameEmptyError);
      return;
    }

    setErrorMsg("");
  };

  const onBlur = () => {
    if (errorMsg) {
      return;
    }

  };

  return (
    <DetailItem title={"RPC"} className={"border-none"}>
      <div className="relative flex w-full flex-col justify-center">
      <Input
        data-state={errorMsg ? "error" : ""}
        ref={inputRef}
        type="text"
        value={inputValue || ""}
        placeholder="https://"
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        className="w-[620px] focus-visible:ring-0 data-[state=error]:border-destructive"
      />
        <div className="mt-2 text-sm text-destructive">
          {errorMsg}
        </div>
      </div>
    </DetailItem>
  );
}

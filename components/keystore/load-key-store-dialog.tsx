import { useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/shared/loading-icon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { replaceStrNumNoDecimal } from "@/lib/hooks/use-str-num";
import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "@/lib/end-point";
import { toast } from "../ui/use-toast";
import { UNIT32_MAX } from "@/lib/constants/global";
import { parseToAddress } from "@/lib/utils";
import { HintTexts } from "@/lib/hint-texts";
import { useTranslations } from "next-intl";

const EmptyRow = {
  root_account: "",
  from_index: "",
  to_index: "",
};

interface IFormFields {
  keystore_name: string;
  range: Array<{
    root_account: string;
    from_index: string;
    to_index: string;
  }>;
}

export function LoadKeyStoreDialog({
  show,
  setShow,
  onSubmitted,
}: {
  show: boolean;
  setShow: (val: boolean) => void;
  onSubmitted: (val: IFormFields) => void;
}) {
  const T = useTranslations("Common");
  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      keystore_name: "",
      range: [
        {
          ...EmptyRow,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "range",
  });

  const [rootAddress, setRootAddress] = useState(false);

  const submitFetcher = async (url: string, { arg }: { arg: IFormFields }) => {
    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(arg),
    });

    toast({
      description: T("LoadKeyStoreSuccess"),
    });
    onSubmitted(arg);
    return res;
  };

  const { trigger: submitAction, isMutating: isSubmitting } = useSWRMutation(
    SystemEndPointPathMap.addKeyStore,
    submitFetcher as any,
  );

  const onSubmit: SubmitHandler<IFormFields> = (formValue) => {
    if (!rootAddress) {
      formValue.range = [];
    }

    formValue.range = JSON.stringify(
      formValue.range.map((item) => {
        return {
          ...item,
          from_index: item.from_index ? parseInt(item.from_index) : "0",
          to_index: item.to_index
            ? parseInt(item.to_index)
            : parseInt(UNIT32_MAX),
        };
      }),
    ) as any;

    submitAction(formValue as any);
  };

  return (
    <Dialog open={show} onOpenChange={(val) => setShow(val)}>
      <DialogContent
        title={T("LoadKeyStore")}
        showClose={true}
        className="w-[600px]"
      >
        <div className="flex flex-col gap-y-4 px-4">
          <div className="flex flex-col gap-y-1">
            <span className="LabelText">{T("Name")}</span>
            <Input
              type="text"
              placeholder={T("NameLowUpper")}
              {...register("keystore_name", {
                required: true,
                onChange: (e) => {
                  const v = e.target.value;
                  setValue("keystore_name", v.trim());
                },
              })}
            />
          </div>

          <div className="w-max">
            <div className="mb-2 flex items-center gap-x-4">
              <label htmlFor="root" className="LabelText">
                {T("RootAddresses")}
              </label>
              <Checkbox
                id="root"
                checked={rootAddress}
                onCheckedChange={(val: boolean) => setRootAddress(val)}
              />
            </div>

            {rootAddress && (
              <>
                <div className="LabelText mb-1 grid grid-cols-[256px_150px_40px_40px] gap-x-3 text-xs">
                  <div>{T("Address")}</div>
                  <div className="flex items-center gap-x-[2px]">
                    <div className="flex-1">{T("From")}</div>
                    <div className="w-10"></div>
                    <div className="flex-1">{T("To")}</div>
                  </div>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="mb-3 grid grid-cols-[256px_190px_40px_40px] gap-x-3 last:mb-0"
                  >
                    <Input
                      {...register(`range.${index}.root_account`, {
                        required: true,
                        minLength: 42,
                        onChange: (e) => {
                          const addr = parseToAddress(e.target.value);
                          setValue(`range.${index}.root_account`, addr);
                        },
                      })}
                      placeholder="0X"
                    />
                    <div className="flex items-center gap-x-1">
                      <Input
                        {...register(`range.${index}.from_index`, {
                          onChange: (e) => {
                            const num = replaceStrNumNoDecimal(e.target.value);
                            setValue(`range.${index}.from_index`, num);
                          },
                        })}
                        placeholder="0"
                      />
                      <div>-</div>
                      <Input
                        {...register(`range.${index}.to_index`, {
                          onChange: (e) => {
                            const num = replaceStrNumNoDecimal(e.target.value);
                            setValue(`range.${index}.to_index`, num);
                          },
                        })}
                        placeholder="-"
                      />
                    </div>
                    <Button
                      onClick={() =>
                        append({
                          ...EmptyRow,
                        })
                      }
                      variant="outline"
                      className="p-[10px]"
                    >
                      <Plus className="text-primary" />
                    </Button>
                    {index !== 0 && (
                      <Button
                        onClick={() => remove(index)}
                        variant="outline"
                        className="p-[10px]"
                      >
                        <Minus />
                      </Button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <Button
            variant="default"
            disabled={isSubmitting}
            className="flex w-64 items-center rounded-full shadow-none"
            onClick={handleSubmit(onSubmit)}
          >
            <LoadingIcon className="text-white" isLoading={isSubmitting} />
            {T("Load")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

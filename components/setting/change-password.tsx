"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "@/lib/end-point";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoadingIcon from "@/components/shared/loading-icon";
import { HintTexts } from "@/lib/hint-texts";
import { useTranslations } from "next-intl";

interface IFormFields {
  password: string;
  repeatPassword: string;
}

export default function ChangePassword() {
  const T = useTranslations("Common");
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  const { register, formState, handleSubmit, trigger, getValues, watch } =
    useForm<IFormFields>({
      defaultValues: {
        password: "",
        repeatPassword: "",
      },
    });

  const password = watch("password");
  const repeatPassword = watch("repeatPassword");

  useEffect(() => {
    if (password || repeatPassword) {
      trigger(["password", "repeatPassword"]);
    }
  }, [password, repeatPassword, trigger]);

  const submitFetcher = async (url: string, { arg }: { arg: IFormFields }) => {
    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(arg),
    });

    toast({
      description: HintTexts.ChangePasswordSuccess,
    });

    setShowChangeDialog(false);
    return res;
  };

  const { trigger: submitAction, isMutating: isSubmitting } = useSWRMutation(
    SystemEndPointPathMap.changePassword,
    submitFetcher as any,
  );

  const onSubmit: SubmitHandler<IFormFields> = (formValue: IFormFields) => {
    submitAction(formValue as any);
  };

  return (
    <>
      <Button
        className="mt-4 text-primary"
        onClick={() => setShowChangeDialog(true)}
        variant="outline"
      >
        {T("ChangePassword")}
      </Button>
      <Dialog
        open={showChangeDialog}
        onOpenChange={(val) => setShowChangeDialog(val)}
      >
        <DialogContent
          title={T("ChangePassword")}
          showClose={true}
          className="w-[320px]"
        >
          <div className="flex flex-col gap-y-5 px-4">
            <div className="flex flex-col gap-y-1">
              <span className="LabelText">{T("NewPassword")}</span>
              <Input
                type="password"
                {...register("password", {
                  validate: (value) => {
                    if (!value) return HintTexts.ChangePasswordEmptyError;

                    const repeat = getValues("repeatPassword");

                    if (!repeat || !value) {
                      return true;
                    }
                    if (value !== repeat) {
                      return HintTexts.ChangePasswordRepeatError;
                    }
                  },
                  deps: ["repeatPassword"],
                })}
              />
              <div className="text-sm font-medium text-destructive">
                {formState.errors?.password && (
                  <p>{formState.errors.password.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="LabelText">{T("RepeatNewPassword")}</span>
              <Input
                type="password"
                {...register("repeatPassword", {
                  validate: (value) => {
                    if (!value) return HintTexts.ChangePasswordEmptyError;

                    const pass = getValues("password");
                    if (!pass || !value) {
                      return true;
                    }

                    if (value !== pass) {
                      return HintTexts.ChangePasswordRepeatError;
                    }
                  },
                  deps: ["password"],
                })}
              />
              <div className="text-sm font-medium text-destructive">
                {formState.errors?.repeatPassword && (
                  <p>{formState.errors.repeatPassword.message}</p>
                )}
              </div>
            </div>
            <Button
              variant="default"
              disabled={isSubmitting || !formState.isValid}
              className="flex w-full items-center rounded-full shadow-none disabled:border disabled:bg-custom-bg-white disabled:text-content-color"
              onClick={handleSubmit(onSubmit)}
            >
              <LoadingIcon className="text-white" isLoading={isSubmitting} />
              {T("Change")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

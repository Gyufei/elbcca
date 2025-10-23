"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import LoginFailTip from "./login-fail-tip";
import SessionTip from "./session-tip";
import LinkToAccountList from "./link-to-account-list";
import md5 from "js-md5";
import { signInAction } from "@/lib/auth/auth-api";
import LoadingIcon from "../shared/loading-icon";
import { IUser } from "@/lib/auth/user";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { defaultRoute } from "@/lib/constants/global";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

export default function LoginForm({
  user,
  showAccountCb,
}: {
  user: IUser | null;
  showAccountCb: () => void;
}) {
  const T = useTranslations("Common");
  const showUserForLogin = !!user?.name;

  const [showLoginFailTip, setShowLoginFailTip] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (showUserForLogin && user?.email) {
      form.setValue("email", user.email || "");
    }
  }, [showUserForLogin, user?.email, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLogging(true);
    const { email, password } = values;
    const mPassword = md5(password);

    const res = await signInAction({
      username: email,
      password: mPassword,
    });

    if (!res) {
      setShowLoginFailTip(true);
    } else {
      window.location.href = `${window.location.origin}${defaultRoute}`;
    }

    setIsLogging(false);
  }

  const FormHead = () => {
    return (
      <>
        {showUserForLogin ? (
          <>
            <div className="mb-5 flex justify-start">
              <Avatar className="mr-4 h-16 w-16 rounded-lg">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{name?.[0] || ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-around">
                <div className="text-lg font-bold text-title-color">
                  {T("SignInTo")}{name}
                </div>
                <div className="LabelText">{user?.email}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-lg font-bold text-title-color">
             {T("SignInToYourDappDoAccount")}
            </div>
          </>
        )}
      </>
    );
  };

  const name = user?.aliasname || user?.name;

  return (
    <div className="flex w-full grow flex-col items-stretch px-4 pt-20 md:max-w-md md:pt-[24vh]">
      <div className="relative flex w-full flex-col">
        <LinkToAccountList onShow={showAccountCb} />
        {showUserForLogin && (
          <SessionTip user={user} className="hidden md:block" />
        )}
        <FormHead />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:w-[420px]">
            {!showUserForLogin && (
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded hover:border-blue-500 focus:bg-[#e9f0fd]"
                        type="string"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{T("Password")}</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded hover:border-blue-500 focus:bg-[#e9f0fd]"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-5 flex flex-col items-stretch justify-center md:flex-row md:items-center md:justify-between ">
              <button
                disabled={isLogging}
                className="mb-3 flex h-10 w-full items-center justify-center rounded-3xl bg-primary px-10 py-2.5 text-white disabled:cursor-not-allowed disabled:bg-gray-300 md:mb-0 md:w-36"
                type="submit"
              >
                <div className="flex items-center">
                  <span className="whitespace-nowrap">{T("SignIn")}</span>
                  <LoadingIcon
                    className="ml-1 text-white"
                    isLoading={isLogging}
                  />
                </div>
              </button>
              <div className="cursor-pointer text-center text-sm text-primary">
                {T("HavingTroubleSigningIn")}
              </div>
            </div>
          </form>
        </Form>
        {showUserForLogin && <SessionTip user={user} className="md:hidden" />}
        {showLoginFailTip && <LoginFailTip />}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { redirect, usePathname } from "next/navigation";
import useIndexStore from "@/lib/state";
import { checkUserIsValid } from "@/lib/auth/user";
import { defaultRoute } from "@/lib/constants/global";

const loginPath = "/signin";
const Matcher = ["/dashboard", "/keystore", "/workflow", "/setting"];

export default function GlobalRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeUser = useIndexStore((state) => state.activeUser());
  const endpoint = useIndexStore((state) => state.endpoint());

  const pathname = usePathname();

  const isLogin = useMemo(() => {
    if (!activeUser) return false;
    if (!activeUser?.token || !activeUser?.expires) return false;

    const isExpired = checkUserIsValid(activeUser);

    return isExpired;
  }, [activeUser]);

  useEffect(() => {
    if (!isLogin) {
      if (pathname === "/" || Matcher.find((m) => pathname.includes(m))) {
        redirect(loginPath);
      }
    } else {
      if (
        activeUser &&
        "endpoint" in activeUser &&
        !endpoint &&
        !pathname.includes("/setting")
      ) {
        redirect("/setting");
      }

      if (pathname === "/") {
        redirect(defaultRoute);
      }
    }
  }, [isLogin, pathname, activeUser, endpoint]);

  return <>{children}</>;
}

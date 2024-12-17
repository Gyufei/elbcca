"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import LoginForm from "@/components/signin/login-form";
import AccountList from "@/components/signin/account-list";
import useIndexStore from "@/lib/state";
import { IUser, checkUserIsValid } from "@/lib/auth/user";
import useEffectStore from "@/lib/state/use-store";
import { useRouter, useSearchParams } from "next/navigation";

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );
  const setUserActive = useIndexStore((state) => state.setUserActive);
  const [showAccountList, setShowAccountList] = useState(false);
  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IUser | null>(activeUser);

  const currActiveUserAlreadyLogin = useMemo(() => {
    if (!activeUser) return false;
    if (!activeUser?.token) return false;

    const isExpired = checkUserIsValid(activeUser);

    return isExpired;
  }, [activeUser]);

  if (
    currActiveUserAlreadyLogin &&
    currentSelectedAccount &&
    currentSelectedAccount?.name === activeUser?.name &&
    !showAccountList
  ) {
    setShowAccountList(true);
  }

  if (!currActiveUserAlreadyLogin && activeUser && !currentSelectedAccount) {
    setCurrentSelectedAccount(activeUser);
  }

  useEffect(() => {
    if (!showAccountList) {
      if (!currentSelectedAccount) {
        if (searchParams.get("a") !== "new") {
          router.replace("/signin?a=new");
        }
      }

      if (currentSelectedAccount) {
        if (searchParams.get("a") !== currentSelectedAccount.email) {
          router.replace(`/signin?a=${currentSelectedAccount.email}`);
        }
      }
    } else {
      if (searchParams.get("a")) {
        router.replace("/signin");
      }
    }
  }, [showAccountList, currentSelectedAccount, router, searchParams]);

  const handleSelectAccount = useCallback(
    (account: IUser) => {
      const isValid = checkUserIsValid(account);

      if (isValid) {
        setUserActive(account?.name || "");
        window.location.href = `${window.location.origin}/dashboard`;
      } else {
        setCurrentSelectedAccount(account);
        setShowAccountList(false);
      }
    },
    [setUserActive],
  );

  const handleAddAccount = useCallback(() => {
    setShowAccountList(false);
    setCurrentSelectedAccount(null);
  }, []);

  const handleShowAccountList = useCallback(() => {
    setShowAccountList(true);
  }, []);

  return (
    <div className="flex w-full grow flex-col items-start md:max-w-md">
      {showAccountList ? (
        <AccountList onSelect={handleSelectAccount} onAdd={handleAddAccount} />
      ) : (
        <LoginForm
          user={currentSelectedAccount}
          showAccountCb={handleShowAccountList}
        />
      )}
    </div>
  );
}

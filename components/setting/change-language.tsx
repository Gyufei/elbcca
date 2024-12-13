"use client";

import { useState } from "react";


import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/app/navigation";
import { useTranslations } from "next-intl";

// import { setLocale } from '@/i18n';

const localList = [
  { title: 'English', local: 'en'},
  { title: '简体中文', local: 'zh'},
]
export default function ChangeLanguage() {
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const T = useTranslations("Common");

  const changeLanguage =  (value: string) => {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: value },
    );
    setShowChangeDialog(false);
  };

  return (
    <>
      <Button
        className="mt-4 text-primary"
        onClick={() => setShowChangeDialog(true)}
        variant="outline"
      >
       {T("ChangeLanguage")}
      </Button>
      <Dialog
        open={showChangeDialog}
        onOpenChange={(val) => setShowChangeDialog(val)}
      >
        <DialogContent
          title={T("ChangeLanguage")}
          showClose={true}
          className="w-[320px]"
        >
          <div className="flex flex-col gap-y-5 px-4">
            {
              localList.map((item) => (
                <div
                  key={item.local}
                  className="flex flex-col gap-y-1 cursor-pointer" onClick={() => changeLanguage(item.local)}>
                  {item.title}
                </div>
              ))
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

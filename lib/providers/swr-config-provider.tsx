"use client";

import { toast } from "@/components/ui/use-toast";
import { SWRConfig } from "swr";
import { HintTexts } from "../hint-texts";
import { useTranslations } from "next-intl";

export default function SWRConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const T = useTranslations("Common");
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          toast({
            variant: "destructive",
            title: `Api: ${key}`,
            description: `${error.status || "Error"}: ${
              error.info || T("GlobalError")
            }`,
          });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

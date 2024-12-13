"use client";

import { usePathname } from "next/navigation";
import { LINKS } from "@/lib/constants/global";
import { useTranslations } from "next-intl";

export default function TopBarTitle() {
  const T = useTranslations("Common");
  const pathname = usePathname();

  const title = LINKS.find(
    (link) => link.href === pathname || pathname.includes(link.href),
  )?.name;

  return <>{T(title)}</>;
}

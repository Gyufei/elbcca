import { Link } from "@/app/navigation"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { LINKS } from "@/lib/constants/global";
import { useTranslations } from "next-intl";

export function SideNav() {
  const pathname = usePathname();
  const T = useTranslations("Common");

  return (
    <div className="flex flex-1 flex-col justify-start px-4 py-3">
      {LINKS.map((link) => (
        <Link
          key={link.name}
          className={cn(
            "mb-2 border border-transparent px-4 py-[6px] text-sm font-medium text-content-color hover:rounded hover:border-primary hover:bg-white hover:text-primary",
            pathname.includes(link.href) &&
              "rounded border-primary bg-white text-primary",
          )}
          href={link.href}
        >
          {T(link.name)}
        </Link>
      ))}
    </div>
  );
}

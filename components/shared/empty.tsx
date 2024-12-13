import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Empty() {
  const T = useTranslations("Common");
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-content-color">
      <PackageOpen className="mb-5 h-[40px] w-[40px]" />
      <p className="text-lg">{T("NoItemsYet")}</p>
    </div>
  );
}

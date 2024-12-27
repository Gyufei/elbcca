import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LinkToAccountList({ onShow }: { onShow: () => void }) {
  const allUsers = useEffectStore(useIndexStore, (state) => state.users);
  const T = useTranslations("Common");
  return (
    <>
      {allUsers && allUsers?.length > 0 && (
        <div
          className="absolute top-[-40px] flex select-none items-center hover:cursor-pointer md:top-[-3.8em]"
          onClick={onShow}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          <span className="text-primary">{T("AccountList")}</span>
        </div>
      )}
    </>
  );
}

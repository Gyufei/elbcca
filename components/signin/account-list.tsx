import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

import { IUser, checkUserIsValid } from "@/lib/auth/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSwipeable } from "react-swipeable";
import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { useTranslations } from "next-intl";

export default function AccountList({
  onAdd,
  onSelect,
}: {
  onAdd: () => void;
  onSelect: (ac: IUser) => void;
}) {
  const T = useTranslations("Common");
  const activeUser = useEffectStore(useIndexStore, (state) => state.activeUser);
  const allUsers = useIndexStore((state) => state.users);
  const removeUser = useIndexStore((state) => state.removeUser);

  const handleDelete = (ac: IUser) => {
    removeUser(ac.name);
  };

  const handleAdd = () => {
    onAdd();
  };

  return (
    <div className="w-full pt-20 md:max-w-md md:pt-[24vh]">
      <div className="mb-4 px-4 text-lg font-bold text-title-color">
        {T("PickUpOneAccount")}
      </div>

      {allUsers.map((ac) => {
        const isActive = ac?.name === activeUser?.name;
        return (
          <AccountCard
            key={ac?.name}
            isActive={isActive}
            user={ac}
            onSelect={onSelect}
            onDelete={handleDelete}
          />
        );
      })}

      <div
        onClick={() => handleAdd()}
        className="mx-auto flex w-[95%] cursor-pointer justify-center rounded border border-border-color bg-custom-bg-white p-4 hover:bg-slate-50 md:ml-4 md:mr-10 md:w-[378px]"
      >
        <Plus></Plus>
      </div>
    </div>
  );
}

const AccountCard = ({
  user: ac,
  onSelect,
  onDelete,
  isActive,
}: {
  user: IUser;
  onSelect: (_u: IUser) => void;
  onDelete: (_u: IUser) => void;
  isActive: boolean;
}) => {
  const swiperHandlers = useSwipeable({
    onSwipedLeft: (_e) => {
      setShowTrash(true);
    },
    onSwipedRight: (_e) => {
      setShowTrash(false);
    },
  });

  const [showTrash, setShowTrash] = useState(false);

  const isValid = checkUserIsValid(ac);

  const name = ac?.aliasname || ac?.name;

  return (
    <div className="mb-5 flex w-full items-center overflow-x-hidden px-4">
      <div
        {...swiperHandlers}
        data-state={showTrash ? "show" : "hide"}
        className="flex min-w-full cursor-pointer justify-between rounded border border-border-color bg-white p-4 hover:bg-slate-50 data-[state=hide]:translate-x-0 data-[state=show]:-translate-x-16 md:w-[420px] md:min-w-[auto] md:translate-x-0"
        onClick={() => onSelect(ac)}
      >
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10 rounded-lg">
            <AvatarImage src={ac?.image || ""} />
            <AvatarFallback>{name?.[0] || ""}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-between">
            <div className="flex items-center text-base font-bold leading-[22px] text-title-color">
              {name}
              <div
                data-valid={isValid}
                className="ml-1 h-2 w-2 rounded-full data-[valid=false]:bg-[#FFA646] data-[valid=true]:bg-[#07D498]"
              ></div>
            </div>
            <div className="text-base leading-4 text-content-color">
              {ac?.email}
            </div>
          </div>
        </div>
        {isActive && (
          <Image
            alt="check"
            src="/icons/cur-check.svg"
            width={24}
            height={24}
          />
        )}
      </div>
      <div
        data-state={showTrash ? "show" : "hide"}
        className=" ml-4 flex cursor-pointer items-center self-stretch rounded-md border-[#dea69c] bg-[#F8DEDA] px-2 slide-in-from-left data-[state=hide]:translate-x-0 data-[state=show]:-translate-x-16 data-[state=show]:animate-in md:hidden"
      >
        <Trash2 className="hover:text-primary" onClick={() => onDelete(ac)} />
      </div>
      <Trash2
        className="ml-4 hidden cursor-pointer hover:text-[#da5349] md:inline-block"
        onClick={() => onDelete(ac)}
      />
    </div>
  );
};

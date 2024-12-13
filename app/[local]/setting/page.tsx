import AvatarCard from "@/components/setting/avatar-card";
import ChangeLanguage from "@/components/setting/change-language";
import ChangePassword from "@/components/setting/change-password";
import UserOption from "@/components/setting/user-option";

export default async function Setting() {
  return (
    <div className="relative h-full bg-[#fafafa] md:static md:overflow-y-hidden">
      <div className="flex w-full gap-x-6 px-24 py-5">
        <div className="flex flex-col">
          <AvatarCard />
          <ChangePassword />
          <ChangeLanguage />
        </div>
        <UserOption />
      </div>
    </div>
  );
}

import { PackageOpen } from "lucide-react";

export default function Empty() {
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-content-color">
      <PackageOpen className="mb-5 h-[40px] w-[40px]" />
      <p className="text-lg">No items yet</p>
    </div>
  );
}

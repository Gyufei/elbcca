import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Loader2 } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  loading: boolean;
  onClick: () => void;
  disabled: boolean;
  className?: string;
};

export const BasicButton = ({
  disabled,
  loading,
  onClick,
  children,
  className,
}: ButtonProps) => {
  return (
    <Button
      disabled={disabled}
      variant="outline"
      className={cn(
        "h-10 w-32 rounded-md border border-primary text-primary hover:bg-primary hover:text-white",
        className,
      )}
      onClick={() => onClick()}
    >
      <div className="flex items-center">
        {children}
        {loading && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
      </div>
    </Button>
  );
};

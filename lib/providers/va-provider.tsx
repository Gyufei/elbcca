"use client";

import { createContext, useState } from "react";

import { IToken } from "@/lib/types/token";

interface IVaContext {
  currentAccountType: "Wallet" | "VirtualAccount";
  selectedToken: IToken | null;
  onAccountTypeChange: (value: "Wallet" | "VirtualAccount") => void;
  onTokenChange: (value: IToken | null) => void;
}

export const VaContext = createContext<IVaContext>({
  currentAccountType: "Wallet",
  selectedToken: null,
  onAccountTypeChange: () => {},
  onTokenChange: () => {},
});

export default function VaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentAccountType, setCurrentAccountType] = useState<"Wallet" | "VirtualAccount">("Wallet");
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);

  const onAccountTypeChange = (value: "Wallet" | "VirtualAccount") => {
    setCurrentAccountType(value);
  };

  const onTokenChange = (value: IToken | null) => {
    setSelectedToken(value);
  };

  return (
    <VaContext.Provider
      value={{
        currentAccountType,
        selectedToken,
        onAccountTypeChange,
        onTokenChange,
      }}
    >
      {children}
    </VaContext.Provider>
  );
}

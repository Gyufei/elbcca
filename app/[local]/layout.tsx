import TopBar from "@/components/layout/top-bar";
import Sidebar from "@/components/layout/sidebar";

import UserInfoProvider from "@/lib/providers/user-info-provider";
import NetworkProvider from "@/lib/providers/network-provider";
import TokenProvider from "@/lib/providers/token-provider";
import VaProvider from "@/lib/providers/va-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-stretch">
      <div className="flex h-full grow flex-col">
        <TopBar />
        <UserInfoProvider>
          <NetworkProvider>
            <TokenProvider>
              <VaProvider>{children}</VaProvider>
            </TokenProvider>
          </NetworkProvider>
        </UserInfoProvider>
      </div>

      <Sidebar />
    </div>
  );
}

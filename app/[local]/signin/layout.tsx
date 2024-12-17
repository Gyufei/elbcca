import LogoPlace from "@/components/signin/logo-place";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-stretch bg-custom-bg-white pt-20 md:flex-row md:items-start md:justify-center md:pt-0">
      <LogoPlace />
      {children}
    </div>
  );
}

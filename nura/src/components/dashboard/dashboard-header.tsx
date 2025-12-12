import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleTheme } from "../common/theme-toggler";

export const AppHeader = () => {
  return (
    <header className='flex h-14 shrink-0 items-center gap-2 border-b justify-between px-4 md:px-10 bg-background'>
      <SidebarTrigger />
      <ToggleTheme />
    </header>
  );
};

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleTheme } from "../common/theme-toggler";
import { getServerSession } from "@/lib/get-session";
import Image from "next/image";

export const AppHeader = async () => {
  const session = await getServerSession();

  return (
    <header className='flex h-14 shrink-0 items-center gap-2 border-b justify-between px-4 md:px-10 bg-background'>
      <SidebarTrigger />
      <div className='flex items-center flex-row gap-x-2.5'>
        <ToggleTheme />
        {session?.user.image ? (
          <>
            <div>
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={50}
                height={50}
                unoptimized
                className='size-8 rounded-sm shadow-xl'
              />
            </div>
          </>
        ) : (
          <>
            <div className='size-8 flex items-center justify-center bg-accent rounded-sm shadow'>
              {session?.user.name[0]}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

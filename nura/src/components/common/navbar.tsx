import { getServerSession } from "@/lib/get-session";
import { DesktopNavbar, MobileNavbar } from "./responsive-navs";

export const Navbar = async () => {
  const session = await getServerSession();
  return (
    <div className='border-b border-neutral-200 dark:border-neutral-800 fixed w-full top-0 backdrop-blur-2xl z-9999'>
      <DesktopNavbar presence={!!session?.user} />
      <MobileNavbar presence={!!session?.user} />
    </div>
  );
};

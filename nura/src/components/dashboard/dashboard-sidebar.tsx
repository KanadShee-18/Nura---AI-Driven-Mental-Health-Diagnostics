"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
  StethoscopeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToggleTheme } from "@/components/common/theme-toggler";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { BrandLogo } from "../common/brand-logo";

const sidebarMenus = [
  {
    title: "Dashboard",
    items: [
      {
        title: "History",
        icon: HistoryIcon,
        url: "/dashboard",
      },
      {
        title: "Check Up",
        icon: StethoscopeIcon,
        url: "/dashboard/check-up",
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className='h-10 px-4 hover:bg-transparent'>
            <BrandLogo showName={false} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {sidebarMenus.map((group, index) => (
          <SidebarGroup key={`${group.title}-${index}`}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((menuItem, index) => (
                  <SidebarMenuItem
                    key={`${menuItem.title}-${index}`}
                    className='group'
                  >
                    <SidebarMenuButton
                      tooltip={menuItem.title}
                      isActive={pathname.startsWith(menuItem.url)}
                      asChild
                      className='gap-x-4 px-4 group h-9'
                    >
                      <Link href={menuItem.url} prefetch>
                        <div className='flex gap-x-3 items-center'>
                          <menuItem.icon className='size-4' />
                          <span className='font-medium transition-all duration-300 hover:-translate-x-1 py-5 flex-1 flex w-full'>
                            {menuItem.title}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className='font-medium mb-7'>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Logout"}
              className='gap-x-4 px-4 h-10'
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("You've successfully signed out!");
                      router.push("/sign-in");
                      window.location.replace("/sign-in");
                    },
                  },
                });
              }}
            >
              <LogOutIcon className='size-4' />
              <span className='py-5 hover:-translate-x-1 duration-200 transition-all ease-linear'>
                Sign Out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

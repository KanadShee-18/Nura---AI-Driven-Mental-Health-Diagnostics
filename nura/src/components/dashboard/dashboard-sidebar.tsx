"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
  StethoscopeIcon,
  UserIcon,
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
      {
        title: "Profile",
        icon: UserIcon,
        url: "/dashboard/profile",
      },
    ],
  },
];

export const AppSidebar = ({
  userEmail,
  userName,
  oauthEnabled,
  imageUrl,
}: {
  userName: string;
  userEmail: string;
  oauthEnabled: boolean;
  imageUrl?: string;
}) => {
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
                      isActive={pathname === menuItem.url}
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
        <SidebarMenu className='font-medium mb-2'>
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
        <SidebarMenu className='bg-accent rounded-sm font-medium'>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Account"}
              className='gap-x-4 px-4 h-auto py-2'
              onClick={() => router.push("/dashboard/profile")}
            >
              <span className='w-full aspect-square min-w-4 max-w-8 rounded shadow flex items-center justify-center bg-primary text-white text-sm font-semibold'>
                {imageUrl?.length ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={userName[0]}
                      width={20}
                      height={20}
                      className='min-w-4 w-full max-w-8 rounded aspect-square'
                      unoptimized
                    />
                  </>
                ) : (
                  <p>{userName[0]}</p>
                )}
              </span>
              <span className='flex flex-col overflow-hidden'>
                <p className='text-sm font-semibold truncate duration-200 transition-transform ease-linear'>
                  {userName}
                </p>
                <p className='text-muted-foreground text-xs truncate duration-200 transition-transform ease-linear'>
                  {userEmail}
                </p>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

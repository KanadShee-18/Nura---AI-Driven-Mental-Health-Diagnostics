import { AppHeader } from "@/components/dashboard/dashboard-header";
import { AppSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getFullSession,
  getServerSession,
  requireAuth,
} from "@/lib/get-session";
import { ReceiptRussianRuble } from "lucide-react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAuth();

  const session = await getFullSession();

  if (!session) {
    return null;
  }

  const hasOAuthEnabled = session.accounts?.some(
    (account) => account.providerId !== "credential"
  );

  return (
    <SidebarProvider>
      <AppSidebar
        userName={session.user.name}
        userEmail={session.user.email}
        oauthEnabled={hasOAuthEnabled}
        imageUrl={session.user.image || ""}
      />
      <SidebarInset className='bg-accent/20'>
        <AppHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;

import { Container } from "@/components/common/container";
import { ProfileForm } from "@/components/dashboard/profile-form";
import {
  getFullSession,
  getServerSession,
  requireAuth,
} from "@/lib/get-session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Nura",
  description: "Manage profile settings.",
};

const ProfilePage = async () => {
  await requireAuth();

  const session = await getFullSession();

  if (!session) {
    return <div>Loading!!!</div>;
  }

  const hasOAuthEnabled = session.accounts?.some(
    (account) => account.providerId !== "credential"
  );

  console.log(hasOAuthEnabled);

  return (
    <div className='flex p-5 w-full flex-1 h-screen relative flex-col'>
      <div className='fixed -z-10 inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#22252b_1px,transparent_1px)] bg-size-[16px_16px]' />

      <div className='fixed inset-0 -z-5 h-full w-full bg-linear-to-br from-teal-400/20 via-transparent to-cyan-400/25 mask-b-from-0% mask-t-from-20% rotate-45 scale-200'></div>

      <Container className='pt-14'>
        <h2 className='text-2xl font-semibold text-primary text-shadow-2xs'>
          Profile Information
        </h2>
        <p className='text-sm font-medium text-muted-foreground'>
          Manage your name, email, password seamlessly with Nura
        </p>
        <div>
          <ProfileForm
            email={session.user.email}
            name={session.user.name}
            oauthEnabled={hasOAuthEnabled}
          />
        </div>
      </Container>
    </div>
  );
};
export default ProfilePage;

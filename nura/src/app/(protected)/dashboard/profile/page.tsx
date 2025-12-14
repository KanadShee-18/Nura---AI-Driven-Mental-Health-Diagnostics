import { BrandLogo } from "@/components/common/brand-logo";
import { Container } from "@/components/common/container";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getFullSession, requireAuth } from "@/lib/get-session";
import { LoaderIcon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile | Nura",
  description: "Manage profile settings.",
};

async function ProfileWrapper({
  email,
  name,
  oauthEnabled,
  imageUrl,
}: {
  email: string;
  name: string;
  oauthEnabled: boolean;
  imageUrl?: string;
}) {
  return (
    <ProfileForm
      email={email}
      name={name}
      oauthEnabled={oauthEnabled}
      imageUrl={imageUrl}
    />
  );
}

const ProfilePage = async () => {
  await requireAuth();

  const session = await getFullSession();

  if (!session) {
    return <div>Loading!!!</div>;
  }

  const hasOAuthEnabled = session.accounts?.some(
    (account) => account.providerId !== "credential"
  );

  return (
    <div className='flex p-5 w-full flex-1 h-screen relative flex-col pb-20'>
      <div className='fixed md:flex hidden min-h-full -z-10 inset-0 w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#22252b_1px,transparent_1px)] bg-size-[16px_16px]' />

      <div className='fixed md:flex hidden inset-0 -z-5 h-full w-full bg-linear-to-br from-teal-400/20 via-transparent to-cyan-400/25 mask-b-from-0% mask-t-from-20% rotate-45 scale-200'></div>

      <Container className='md:pt-14 pt-5'>
        <h2 className='text-2xl font-semibold text-primary text-shadow-2xs'>
          Profile Information
        </h2>
        <p className='text-sm font-medium text-muted-foreground'>
          Manage your name, email, password seamlessly with Nura
        </p>
        <Suspense
          fallback={
            <div className='flex items-center flex-col gap-y-5 justify-center h-screen w-full'>
              <BrandLogo showName={false} className='animate-pulse scale-200' />
              <div className='flex flex-row items-center gap-x-2 animate-pulse'>
                <LoaderIcon className='animate-spin' />
                Loading Profile ...
              </div>
            </div>
          }
        >
          <ProfileWrapper
            email={session.user.email}
            name={session.user.name}
            oauthEnabled={hasOAuthEnabled}
            imageUrl={session.user.image ?? ""}
          />
        </Suspense>
      </Container>
    </div>
  );
};
export default ProfilePage;

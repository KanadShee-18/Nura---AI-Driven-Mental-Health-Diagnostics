import { BrandLogo } from "@/components/common/brand-logo";
import { Container } from "@/components/common/container";
import { CheckUpForm } from "@/components/dashboard/checkup-form";
import { getServerSession, requireAuth } from "@/lib/get-session";
import { LoaderIcon, StethoscopeIcon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

async function CheckUpWrapper({ userId }: { userId: string }) {
  return <CheckUpForm userId={userId} />;
}

export const metadata: Metadata = {
  title: "CheckUp | Nura",
  description:
    "An AI model which predicts mental health with more than 80 percent accuracy.",
};

const CheckUpPage = async () => {
  await requireAuth();

  const session = await getServerSession();

  if (!session) {
    return <div>Loading!!!</div>;
  }

  return (
    <div className='p-5 relative'>
      <div className='fixed md:flex hidden -z-10 inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#22252b_1px,transparent_1px)] bg-size-[16px_16px]' />

      <div className='fixed md:flex hidden inset-0 -z-5 h-full w-full bg-linear-to-br from-teal-400/40 via-transparent to-cyan-400/45 mask-b-from-0% mask-t-from-20% rotate-45 scale-200'></div>

      <Container className=' pt-5'>
        <div className='flex flex-row gap-x-2 text-primary items-center'>
          <StethoscopeIcon className='text-2xl' />
          <h2 className='text-2xl font-semibold text-shadow-2xs'>Check Up</h2>
        </div>
        <p className='text-sm font-medium text-muted-foreground'>
          Fill out some basic details to get a mental health report
        </p>

        <Suspense
          fallback={
            <div className='flex flex-col gap-y-5 items-center justify-center h-screen w-full'>
              <BrandLogo showName={false} className='animate-pulse scale-200' />
              <div className='flex flex-row items-center gap-x-2 animate-pulse'>
                <LoaderIcon className='animate-spin' />
                Loading Form ...
              </div>
            </div>
          }
        >
          <CheckUpWrapper userId={session.user.id} />
        </Suspense>
      </Container>
    </div>
  );
};
export default CheckUpPage;

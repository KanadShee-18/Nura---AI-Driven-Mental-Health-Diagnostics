import { CheckUpForm } from "@/components/dashboard/checkup-form";
import { getServerSession, requireAuth } from "@/lib/get-session";
import { LoaderIcon } from "lucide-react";
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
      <div className='fixed -z-10 inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#22252b_1px,transparent_1px)] bg-size-[16px_16px]' />

      <div className='fixed inset-0 -z-5 h-full w-full bg-linear-to-br from-teal-400/40 via-transparent to-cyan-400/45 mask-b-from-0% mask-t-from-20% rotate-45 scale-200'></div>

      {/* <CheckUpForm userId={session.user.id} /> */}
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-screen w-full'>
            <div className='flex flex-row items-center gap-x-2 animate-pulse'>
              <LoaderIcon className='animate-spin' />
              Loading Form ...
            </div>
          </div>
        }
      >
        <CheckUpWrapper userId={session.user.id} />
      </Suspense>
    </div>
  );
};
export default CheckUpPage;

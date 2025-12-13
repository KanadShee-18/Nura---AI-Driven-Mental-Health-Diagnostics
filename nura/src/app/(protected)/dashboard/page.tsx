import { checkUps } from "@/actions/checkUp-action";
import { Container } from "@/components/common/container";
import DashboardHistory from "@/components/dashboard/dashboard-history";
import { Button } from "@/components/ui/button";
import { getServerSession, requireAuth } from "@/lib/get-session";
import { StethoscopeIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Nura",
  description: "History of previous check ups.",
};

const DashboardPage = async () => {
  await requireAuth();

  const session = await getServerSession();

  if (!session) {
    return <div>Loading!!!</div>;
  }

  const checkUpsData = await checkUps({
    email: session?.user.email,
    userId: session?.user.id,
  });

  return (
    <div className='flex p-5 w-full flex-1 h-screen relative flex-col'>
      <div className='fixed -z-10 inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#22252b_1px,transparent_1px)] bg-size-[16px_16px]' />

      <div className='fixed inset-0 -z-5 h-full w-full bg-linear-to-br from-teal-400/20 via-transparent to-cyan-400/25 mask-b-from-0% mask-t-from-20% rotate-45 scale-200'></div>

      <Container>
        <div className='flex h-fit flex-row gap-4 justify-between w-full'>
          <div className='flex flex-row gap-x-2.5 items-center h-fit'>
            <StethoscopeIcon className='size-6 text-cyan-500' />
            <h2 className='text-2xl font-semibold text-cyan-500 text-shadow-2xs'>
              Previous Check Ups
            </h2>
          </div>
          <Link href={"/check-up"}>
            <Button variant={"outline"} size={"sm"}>
              New CheckUp
            </Button>
          </Link>
        </div>

        <div className='mt-10'>
          {checkUpsData.success === false ? (
            <p>{checkUpsData.message}</p>
          ) : (
            <div>
              {checkUpsData.checkUps && (
                <DashboardHistory data={checkUpsData.checkUps} />
              )}
            </div>
          )}
          {checkUpsData.count === 0 && (
            <div className='w-full h-60 gap-y-3.5 flex flex-col items-center justify-center text-muted-foreground'>
              No previous check ups available!
              <Link href={"/dashboard/check-up"}>
                <Button variant={"outline"}>Opt For New CheckUp</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
export default DashboardPage;

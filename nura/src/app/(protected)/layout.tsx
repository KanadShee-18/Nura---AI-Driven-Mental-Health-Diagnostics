import { BrandLogo } from "@/components/common/brand-logo";
import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col gap-y-5 items-center justify-center min-h-screen w-full'>
          <BrandLogo showName={false} className='scale-200 animate-pulse' />
          <div className='flex flex-row items-center gap-x-2 animate-pulse'>
            <LoaderIcon className='animate-spin' />
            Loading Dashboard ...
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

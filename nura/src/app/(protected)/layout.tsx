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
        <div className='flex items-center justify-center h-screen w-full'>
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

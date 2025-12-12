import { cn } from "@/lib/utils";
import Link from "next/link";

export const BrandLogo = ({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) => {
  return (
    <Link href={"/"} className='flex flex-row items-center gap-x-3 w-fit'>
      <SVGLogo className={className} />
      {showName && <p className='text-xl font-bold tracking-tight'>NURA</p>}
    </Link>
  );
};

const SVGLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      id='logo-72'
      width='52'
      height='44'
      viewBox='0 0 53 44'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn("dark:invert w-7", className)}
    >
      {" "}
      <path
        d='M23.2997 0L52.0461 28.6301V44H38.6311V34.1553L17.7522 13.3607L13.415 13.3607L13.415 44H0L0 0L23.2997 0ZM38.6311 15.2694V0L52.0461 0V15.2694L38.6311 15.2694Z'
        className='ccustom'
        fill='#101010'
      ></path>{" "}
    </svg>
  );
};

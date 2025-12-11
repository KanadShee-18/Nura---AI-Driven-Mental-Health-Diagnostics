import { cn } from "@/lib/utils";

export const Container = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("w-full max-w-7xl mx-auto h-full", className)}>
      {children}
    </div>
  );
};

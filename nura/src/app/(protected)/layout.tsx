import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

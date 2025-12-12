import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export const requireAuth = async () => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
};

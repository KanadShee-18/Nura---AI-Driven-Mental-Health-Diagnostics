import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getFullSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return null;
  }

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return {
    ...session,
    accounts,
  };
}

export const requireAuth = async () => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
};

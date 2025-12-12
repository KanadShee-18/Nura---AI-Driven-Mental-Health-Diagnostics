"use server";

import prisma from "@/lib/db";

export async function checkEmailPresent({ email }: { email: string }) {
  if (!email) {
    return {
      success: false,
      message: "Email is required to check it's present of not!",
    };
  }
  try {
    const presentUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!presentUser) {
      return {
        success: false,
        message: "No account found. Provide valid registered email!",
      };
    }
    if (presentUser?.emailVerified) {
      return {
        success: false,
        message: "Email is already verified for this user!",
      };
    }
    if (presentUser) {
      return {
        success: true,
        message: "User is Valid!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Some error occurred while checking user!",
    };
  }
}

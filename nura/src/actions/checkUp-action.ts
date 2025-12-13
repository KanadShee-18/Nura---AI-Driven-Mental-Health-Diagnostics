"use server";

import prisma from "@/lib/db";

export const checkUps = async ({
  email,
  userId,
}: {
  userId: string;
  email: string;
}) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }
    const preCheckUps = await prisma.checkUp.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const preCheckUpsCount = await prisma.checkUp.count({
      where: {
        userId: user.id,
      },
    });

    return {
      success: true,
      count: preCheckUpsCount,
      message: "Check Ups fetched successfully!",
      checkUps: preCheckUps,
    };
  } catch (error) {
    console.log("Error in fetching previous check ups: ", error);
    return {
      success: false,
      message: "Some error occurred while fetching user check ups!",
    };
  }
};

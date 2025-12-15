"use server";

import prisma from "@/lib/db";
import { mentalHealthSchema, type MentalHealthFormData } from "@/lib/schemas";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const healthCheckUp = async (
  values: MentalHealthFormData,
  userId: string
) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User Id is required!",
      };
    }
    const checkUpValues = mentalHealthSchema.safeParse(values);
    if (checkUpValues.error) {
      return {
        success: false,
        message:
          checkUpValues.error.message ??
          "Some error occurred while validating fields",
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return {
        success: false,
        message: "User not authorized for check up!",
      };
    }

    const { data } = checkUpValues;

    const apiPayload = {
      Gender: data.gender,
      Occupation: data.occupation,
      SelfEmployed: data.selfEmployed,
      FamilyHistory: data.familyHistory,
      MentalHealthHistory: data.pastHistory,
      DaysIndoors: data.spendIndoors,
      HabitsChange: data.habitChange,
      IncreasingStress: data.increasingStressLevel,
      SocialWeakness: data.sociallyWeak,
      CopingStruggles: data.faceDailyProblem,
      WorkInterest: data.findInterestInWork,
      MentalHealthInterview: data.takenMentalHealthInterview,
      CareOptions: data.awareAboutCareOption,
    };

    const resp = await axios.post(
      `${process.env.SERVER_URL}/predict`,
      apiPayload,
      {
        headers: {
          "x-api-key": process.env.API_SECRET_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const { predicted_mood_swings, treatment_needed } = resp.data;

    await prisma.checkUp.create({
      data: {
        userId: user.id,
        gender: data.gender,
        occupation: data.occupation,
        selfEmployed: data.selfEmployed,
        familyHistory: data.familyHistory,
        pastHistory: data.pastHistory,
        spendIndoors: data.spendIndoors,
        habitChange: data.habitChange,
        increasingStressLevel: data.increasingStressLevel,
        sociallyWeak: data.sociallyWeak,
        faceDailyProblem: data.faceDailyProblem,
        findInterestInWork: data.findInterestInWork,
        takenMentalHealthInterview: data.takenMentalHealthInterview,
        awareAboutCareOption: data.awareAboutCareOption,
        condition: predicted_mood_swings,
        treatment: treatment_needed,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Check up completed successfully!",
      data: {
        condition: predicted_mood_swings,
        treatment: treatment_needed,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Some error occurred while check up mental health",
    };
  }
};

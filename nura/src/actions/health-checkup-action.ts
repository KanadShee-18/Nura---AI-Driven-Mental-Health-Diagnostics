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
      Age: data.age.toString(),
      Gender: data.gender,
      work_interfere: data.work_interfere,
      family_history: data.family_history,
      benefits: data.benefits,
      care_options: data.care_options,
      leave: data.leave,
      mental_health_consequence: data.mental_health_consequence,
      self_employed: data.self_employed,
      mental_health_interview: data.mental_health_interview,
      yoga: data.yoga,
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

    const { predicted_condition, treatment_needed } = resp.data;

    await prisma.checkUp.create({
      data: {
        userId: user.id,
        age: data.age,
        gender: data.gender,
        selfEmployed: data.self_employed,
        familyHistory: data.family_history,
        workInterfere: data.work_interfere,
        noEmployees: "Unknown",
        remoteWork: "Unknown",
        techCompany: "Unknown",
        benefits: data.benefits,
        careOptions: data.care_options,
        wellnessProgram: "Unknown",
        seekHelp: "Unknown",
        leave: data.leave,
        mentalHealthConsequence: data.mental_health_consequence,
        physHealthConsequence: "Unknown",
        mentalHealthInterview: data.mental_health_interview,
        physHealthInterview: "Unknown",
        mentalVsPhysical: "Unknown",
        obsConsequence: "Unknown",
        yoga: data.yoga,
        condition: predicted_condition,
        treatment: treatment_needed,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Check up completed successfully!",
      data: {
        condition: predicted_condition,
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

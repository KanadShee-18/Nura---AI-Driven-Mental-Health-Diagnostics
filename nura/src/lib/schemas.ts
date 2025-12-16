import { z } from "zod";

export const mentalHealthSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]),

  occupation: z.enum([
    "Student",
    "Corporate",
    "Business",
    "Housewife",
    "Others",
  ]),

  selfEmployed: z.enum(["Yes", "No"]),

  familyHistory: z.enum(["Yes", "No", "Maybe"]),
  pastHistory: z.enum(["Yes", "No", "Maybe"]),

  spendIndoors: z.enum([
    "1-14 Days",
    "15-30 Days",
    "31-60 Days",
    "More than 2 months",
    "Go out Every Day",
  ]),

  habitChange: z.enum(["Yes", "No", "Maybe"]),

  moodSwings: z.enum(["Low", "Medium", "High"]),

  increasingStressLevel: z.enum(["Yes", "No", "Maybe"]),

  sociallyWeak: z.enum(["Yes", "No", "Maybe"]),

  faceDailyProblem: z.enum(["Yes", "No"]),

  findInterestInWork: z.enum(["Yes", "No", "Maybe"]),

  takenMentalHealthInterview: z.enum(["Yes", "No", "Maybe"]),

  awareAboutCareOption: z.enum(["Yes", "No", "Not Sure"]),
});

export type MentalHealthFormData = z.infer<typeof mentalHealthSchema>;

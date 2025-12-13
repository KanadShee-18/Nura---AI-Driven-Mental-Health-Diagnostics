import { z } from "zod";

export const mentalHealthSchema = z.object({
  age: z
    .number()
    .int()
    .min(10, "Age must be at least 10")
    .max(100, "Age must be less than or equal to 100"),

  gender: z.enum(["Male", "Female", "Other"]),

  work_interfere: z.enum(["Often", "Rarely", "Never", "Sometimes"]),

  family_history: z.enum(["Yes", "No"]),

  benefits: z.enum(["Yes", "No", "Don't know"]),

  care_options: z.enum(["Yes", "No", "Not sure"]),

  leave: z.enum([
    "Very easy",
    "Somewhat easy",
    "Somewhat difficult",
    "Very difficult",
    "Don't know",
  ]),

  mental_health_consequence: z.enum(["Yes", "No", "Maybe"]),

  self_employed: z.enum(["Yes", "No"]),

  mental_health_interview: z.enum(["Yes", "No", "Maybe"]),

  yoga: z.enum(["Yes", "No"]),
});

export type MentalHealthFormData = z.infer<typeof mentalHealthSchema>;

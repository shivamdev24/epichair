import { z } from "zod";
import { verifySchema } from "./loginSchema";

export const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  otp: verifySchema
});

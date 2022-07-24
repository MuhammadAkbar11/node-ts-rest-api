import z from "zod";

export const createUserSessionSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Passowrd to short"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid Email"),
  }),
});

export type CreateUserInput = Omit<
  z.TypeOf<typeof createUserSessionSchema>,
  "body.passwordConfirmation"
>;

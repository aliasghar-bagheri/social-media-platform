import { z } from "zod";

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Your password must be longer than 8 characters" }),
});

export const SignupValidation = z.object({
  name: z.string(),
  username: z.string().min(2, { message: "Username is required." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Your password must be longer than 8 characters" }),
});

export const PostFormValidation = z.object({
  caption: z.string().min(3),
  image_url: z.custom(),
  location: z.string(),
  tags: z.string(),
});

export const EditProfileFormValidation = z.object({
  profile: z.string(),
  name: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  phone: z.string(),
  bio: z.string(),
});

export const EditPasswordFormValidation = z.object({
  current_password: z
    .string()
    .min(8, { message: "Your password must be longer than 8 characters" }),
  new_password: z
    .string()
    .min(8, { message: "Your password must be longer than 8 characters" }),
  new_password_confirmation: z
    .string()
    .min(8, { message: "Your password must be longer than 8 characters" }),
});

export type PostFormType = z.infer<typeof PostFormValidation>;
export type EditProfileType = z.infer<typeof EditProfileFormValidation>;
export type EditPasswordType = z.infer<typeof EditPasswordFormValidation>;
export type SigninSchemaType = z.infer<typeof SigninValidation>;
export type SignupSchemaType = z.infer<typeof SignupValidation>;

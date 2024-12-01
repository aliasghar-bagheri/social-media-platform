import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown): string => {
  let message: string;
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      const valueError = error.response.data;
      if ("messages" in valueError) {
        const { username, email }: { username: string[]; email: string[] } =
          error.response.data.messages;
        message = `${username ?? ""}\n ${email ?? ""}`;
      } else if ("message" in valueError) {
        message = valueError.message;
      } else {
        message = "As error occured, Please try again";
      }
    } else {
      if (error.name === "CanceledError") {
        message = "Request canceled.";
      } else {
        message = "As error occured, Please try again";
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "As error occured, Please try again";
  }

  return message;
};

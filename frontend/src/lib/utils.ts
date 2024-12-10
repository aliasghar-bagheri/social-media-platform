import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatMessage = (messages: Record<string, unknown>): string => {
  return Object.values(messages).flat().join("\n");
};

export const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;

    if (responseData) {
      if ("messages" in responseData && typeof responseData.messages === "object") {
        return formatMessage(responseData.messages);
      }
      if ("message" in responseData) {
        return typeof responseData.message === "object"
          ? Object.values(responseData.message).flat().join("\n")
          : String(responseData.message);
      }
      return "As error occured, Please try again";
    }

    return error.name === "CanceledError"
      ? "Request canceled."
      : "As error occured, Please try again";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  if (typeof error === "string") {
    return error;
  }

  return "As error occured, Please try again";
};

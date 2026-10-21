import { ApiError } from "@/services/utils/api";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 0) {
    return error.message;
  } else return "Something went wrong. Please try again.";
}

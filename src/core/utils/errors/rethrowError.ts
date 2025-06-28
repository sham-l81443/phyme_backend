import { AppError } from "./AppError";


export function rethrowAppError(error: unknown, fallbackMessage: string): never {
  if (error instanceof AppError) throw error;

  console.error(fallbackMessage + ":", error instanceof Error ? error.message : "Unknown error");

  throw new AppError({
    errorType: "Internal Server Error",
    message: fallbackMessage,
  });
}
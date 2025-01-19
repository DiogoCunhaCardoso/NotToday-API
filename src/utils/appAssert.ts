import { AppError } from "./appError.js";

/**
 * Asserts a condition and throws a custom AppError if the condition is falsy.
 */
export const appAssert = (
  condition: any,
  code: string,
  message: string,
  extensions?: Record<string, any>
) => {
  if (!condition) {
    throw new AppError(message, code, extensions);
  }
};

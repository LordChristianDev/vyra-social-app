import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Result } from "./try-catch"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
};

export const retryOperation = async <T>(
  operation: () => Promise<Result<T, Error>>,
  operationName: string,
  maxRetries: number = 3
): Promise<T | null> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const [data, error] = await operation();

    if (!error && data) {
      return data;
    }

    if (attempt === maxRetries) {
      console.error(`Failed to ${operationName} after ${maxRetries} attempts:`, error);
      return null;
    }

    console.warn(`${operationName} failed (attempt ${attempt}/${maxRetries}), retrying...`);
    // Optional: Add a small delay between retries
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
  return null;
};

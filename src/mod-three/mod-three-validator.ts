/**
 * Validates a binary string input
 * input The string to validate
 * Throw Error if the input is invalid
 */
export function validateBinaryInput(input: string): void {
  // Check if input exists
  if (input === undefined || input === null) {
    throw new Error("Invalid input: input cannot be undefined or null");
  }

  // Check if input is a string
  if (typeof input !== "string") {
    throw new Error("Invalid input: input must be a string");
  }

  // Check if input is empty
  if (input.length === 0) {
    throw new Error("Invalid input: input cannot be empty");
  }

  // Check if input contains only binary digits
  if (!/^[01]+$/.test(input)) {
    throw new Error("Invalid input: must contain only 0s and 1s");
  }

  // (to prevent potential performance issues)
  if (input.length > 1000) {
    // arbitrary limit, adjust as needed
    throw new Error("Invalid input: binary string is too long");
  }
}

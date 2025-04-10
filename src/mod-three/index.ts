import { FiniteStateMachine } from "../finite-state-machine/finite-state-machine";
import { modThreeConfig, BinarySymbol } from "./config";
import { validateBinaryInput } from "./mod-three-validator";

/**
 * Calculates the remainder when dividing the binary number by 3
 */
export function modThree(input: string): number {
  // Validate input
  validateBinaryInput(input);

  // Create the FSM with the mod-three configuration
  const fsm = new FiniteStateMachine(modThreeConfig);

  // Convert input string to array of symbols
  const symbols = input.split("") as BinarySymbol[];

  // Process input and return output
  return fsm.processWithOutput(symbols);
}

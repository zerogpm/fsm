/**
 * Generic Finite State Machine implementation
 */
import { FSMConfig } from "./types";
import { FSMValidator } from "./fsmValidator";

export class FiniteStateMachine<State, Symbol> {
  private config: FSMConfig<State, Symbol>;

  constructor(config: FSMConfig<State, Symbol>) {
    // We need to validate if the config is correctly define
    FSMValidator.validateConfig(config);
    this.config = config;
  }

  /**
   * Process an input and return the final state
   */
  public process(input: Symbol[]): State {
    let currentState = this.config.initialState;

    for (const symbol of input) {
      // Validate that the symbol is in the alphabet
      FSMValidator.validateSymbol(symbol, this.config.alphabet);

      // Apply transition function
      currentState = this.config.transition(currentState, symbol);

      // Validate the resulting state
      FSMValidator.validateState(currentState, this.config.states);
    }

    return currentState;
  }

  /**
   * Process an input sequence and map the final state to an output
   * Array of input symbols
   * The mapped output based on the final state
   * Error if the final state is not valid or if no output mapper is provided
   */
  public processWithOutput<OutputType>(input: Symbol[]): OutputType {
    const finalState = this.process(input);

    // Validate that we reached a final state
    if (!this.config.finalStates.has(finalState)) {
      throw new Error(
        `Processing ended in non-final state: ${String(finalState)}`
      );
    }

    // Apply output mapper if provided
    if (!this.config.outputMapper) {
      throw new Error("Output mapper is required for processWithOutput method");
    }

    return this.config.outputMapper(finalState) as OutputType;
  }

  /**
   * Check if the final state after processing is an accepting state
   * This is useful for jest testing purpose.
   */
  public accepts(input: Symbol[]): boolean {
    const finalState = this.process(input);
    return this.config.finalStates.has(finalState);
  }
}

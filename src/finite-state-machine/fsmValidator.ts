/**
 * Validator for Finite State Machine configurations
 */
import { FSMConfig } from "./types";

export class FSMValidator {
  /**
   * Validates FSM configuration
   */
  public static validateConfig<State, Symbol>(
    config: FSMConfig<State, Symbol>
  ): void {
    // Check that initial state is in the set of states
    if (!config.states.has(config.initialState)) {
      throw new Error("Initial state must be included in the set of states");
    }

    // Check that all final states are in the set of states
    for (const finalState of config.finalStates) {
      if (!config.states.has(finalState)) {
        throw new Error(
          "All final states must be included in the set of states"
        );
      }
    }
  }

  /**
   * Validates that an input symbol is in the alphabet
   */
  public static validateSymbol<Symbol>(
    symbol: Symbol,
    alphabet: Set<Symbol>
  ): void {
    if (!alphabet.has(symbol)) {
      throw new Error(`Invalid input symbol: ${String(symbol)}`);
    }
  }

  /**
   * Validates that a state is in the set of states
   */
  public static validateState<State>(state: State, states: Set<State>): void {
    if (!states.has(state)) {
      throw new Error(`Invalid state: ${String(state)}`);
    }
  }
}

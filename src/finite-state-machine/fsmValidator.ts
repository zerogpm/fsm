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
    // Check that states set is provided
    if (config.states.size === 0) {
      throw new Error("states cannot be empty");
    }

    if (config.alphabet.size === 0) {
      throw new Error("Alphaber cannot be empty");
    }

    // Check that initial state is in the config
    if (!config.states.has(config.initialState)) {
      throw new Error("Initial state must be included in the set of states");
    }

    // Check that at least one final state provided
    if (config.finalStates.size === 0) {
      throw new Error("At least provide one final state");
    }

    // Check that all final states are in the set of states
    for (const finalState of config.finalStates) {
      if (!config.states.has(finalState)) {
        throw new Error(
          "All final states must be included in the set of states"
        );
      }
    }

    // Check that all transition function will produce a valid state
    for (const state of config.states) {
      for (const symbol of config.alphabet) {
        const nextState = config.transition(state, symbol);

        // Ensure the resulting state is valid
        if (!config.states.has(nextState)) {
          throw new Error(
            `Transition function produced invalid state: ${String(
              nextState
            )} ` + `for state ${String(state)} and symbol ${String(symbol)}`
          );
        }
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

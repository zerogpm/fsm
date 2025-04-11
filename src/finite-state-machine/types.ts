/**
 * Type for transition function
 * Maps from a state and an input symbol to a new state
 */
export type TransitionFunction<State, Symbol> = (
  state: State,
  symbol: Symbol
) => State;

/**
 * Configuration for a Finite State Machine
 */
export interface FSMConfig<State, Symbol, OutputType = unknown> {
  // Q: Set of states
  states: Set<State>;

  // Σ: Input alphabet
  alphabet: Set<Symbol>;

  // q0: Initial state
  initialState: State;

  // F: Set of accepting/final states
  finalStates: Set<State>;

  // δ: Transition function
  transition: TransitionFunction<State, Symbol>;

  // Optional output mapper function
  outputMapper?: (state: State) => OutputType;
}

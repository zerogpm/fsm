#My Thoughts steps

A finite automaton (FA) is a 5-tuple (Q, Σ, q₀, F, δ) where:

- Q is a finite set of states
- Σ is a finite input alphabet
- q₀ ∈ Q is the initial state
- F ⊆ Q is the set of accepting/final states
- δ: Q × Σ → Q is the transition function

## Implementation

This is a good starting point with the type and configuration:
Optional output mapper function - Transforms state to output value if needed

```javascript
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
export interface FSMConfig<State, Symbol, OutputType = any> {
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
```

## FSM Validator

The following validation methods ensure that our FSM operates correctly by enforcing constraints on states, symbols, and configuration.

### validateConfig

Before we create a Generic Finite State Machine, we should validate that our configuration is correct. This ensures we have a valid initial state, correct symbols, and final states.

```javascript
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
```

### validateSymbol

Validates that an input symbol belongs to the defined alphabet
This is critical for ensuring that only valid inputs are processed by the FSM.The function converts the symbol to a string for error reporting purposes.

```javascript
  public static validateSymbol<Symbol>(
    symbol: Symbol,
    alphabet: Set<Symbol>
  ): void {
    if (!alphabet.has(symbol)) {
      throw new Error(`Invalid input symbol: ${String(symbol)}`);
    }
  }
```

### validateState

Finally, we check if a state is in the set of states:
Validates that a state exists in the set of defined states
This function helps ensure that the FSM only operates with valid states, which is essential for preventing runtime errors during FSM processing.

```javascript
public static validateState<State>(state: State, states: Set<State>): void {
    if (!states.has(state)) {
      throw new Error(`Invalid state: ${String(state)}`);
    }
  }
```

### Note:

Note: Additional validation could be added here, such as:

- Ensuring the states set is not empty
- Ensuring the alphabet set is not empty
- Checking that the transition function handles all possible state-symbol combinations

I will come back to this if feel the need to do so

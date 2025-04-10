## My Thoughts steps

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

The Validation is useful for checking many states, symbols and transition. Some state-symobol combinations might be overlooked
during development.This catches the bug early on befor the fsm
processes any input.

### validateConfig

Before we create a Generic Finite State Machine, we should validate that our configuration is correct. This ensures we have a valid initial state, correct symbols, and final states.

```javascript
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

### Finite State Machine implementation

This library provides a generic Finite State Machine implementation that can be used to model and process state transitions based on input symbols. It's designed to be flexible, type-safe, and easy to integrate into your projects.

## API Reference

### `FiniteStateMachine<State, Symbol>`

The main class that implements the finite state machine.

#### Constructor

```typescript
constructor(config: FSMConfig<State, Symbol>)
```

Creates a new FSM with the provided configuration.

#### Methods

##### `process(input: Symbol[]): State`

Processes a sequence of input symbols and returns the final state.

##### `processWithOutput<OutputType>(input: Symbol[]): OutputType`

Processes a sequence of input symbols for example 1 and 0, checks that the final state is an accepting state, and returns the mapped output.

##### `accepts(input: Symbol[]): boolean`

Checks whether the given input sequence leads to an accepting (final) state. We don't use this directly, i make this for test suits like jest easer to be tested.

### `FSMConfig<State, Symbol>`

The configuration interface for creating a finite state machine.

```typescript
interface FSMConfig<State, Symbol> {
  states: Set<State>;
  alphabet: Set<Symbol>;
  initialState: State;
  finalStates: Set<State>;
  transition: (state: State, symbol: Symbol) => State;
  outputMapper?: (state: State) => any;
}
```

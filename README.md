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

Checks whether the given input sequence leads to an accepting (final) state. We don't use this directly, i make this for test suits like jest for testing purposes.

### `FSMConfig<State, Symbol>`

The configuration interface for creating a finite state machine.

```typescript
interface FSMConfig<State, Symbol> {
  states: Set<State>;
  alphabet: Set<Symbol>;
  initialState: State;
  finalStates: Set<State>;
  transition: (state: State, symbol: Symbol) => State;
  outputMapper?: (state: State) => (state: State) => OutputType;
}
```

## Why I Design This Way

I take advantage of TypeScript generics <State, Symbol> for flexibility in the types of states and input symbols. The code is split into three main components: finite state machine class, FSM configuration, and FSM validator. This separation of concerns makes each class do its own job.
Rather than hardcoding transition rules, I use FSMConfig to set states, symbols, transition functions, outputs, and initial and final states. This makes the FSM easy to configure without changing its implementation. There is strict validation, so the program won't accept invalid input, which prevents unexpected behavior.
I also provide multiple processing options:

- `process()`
- `processWithOutput()`
- `accepts()`

I have encountered cases where I need to return a number but instead return a string, which is not what I want. The output is not flexible enough for me to return a specific type, so processWithOutput() is meant for that.
The class is sometimes hard to test, so I designed it to provide a simple acceptance check without duplicating the core processing. In a usual approach, you need to initialize a class and test it, then a second time, the actual process will run, causing duplication. This is a trade-off for handling very large inputs during testing.
Another trade-off is that valid states/symbols can't always be known at compile time, which is why I value validation failures before compile errors. The generic approach adds flexibility but requires more type handling. It's a balance that led me to create interfaces and validation helpers.
I also chose to use Set objects for states, alphabet, and final states, which ensures uniqueness, provides O(1) lookups, and makes the code more readable than arrays with manual duplicate checking.

## How to use it

Take the mod-three demonstrates how to use the fsm to calculate
the remainder when dividing by 3.

### Understanding the Mod-Three

The mod-three has three states (S0, S1, S2) that represent the remainder when the binary number processed so far is divided by 3:

- S0: The number is divisible by 3 (remainder 0)
- S1: The number has remainder 1 when divided by 3
- S2: The number has remainder 2 when divided by 3

The input alphabet consists of binary digits (0, 1). As each digit is processed, the state transitions according to the following rules:

| Current State | Input: 0 | Input: 1 |
| ------------- | -------- | -------- |
| S0            | S0       | S1       |
| S1            | S2       | S0       |
| S2            | S1       | S2       |

### How to Use the Mod Three

The main program is at ./src/index.ts

```typescript
import { modThree } from "./mod-three";

// Calculate the remainder when 101 (binary) is divided by 3
const remainder = modThree("101"); // Returns 2

// Calculate the remainder when 1010 (binary) is divided by 3
const anotherRemainder = modThree("1010"); // Returns 1
```

The mod-three implementation consists of the following files:

1. `config.ts` - Defines the states, alphabet, and transition function:

```typescript
// Define the states for the mod-three FSM
export enum ModThreeState {
  S0 = "S0", // Remainder 0
  S1 = "S1", // Remainder 1
  S2 = "S2", // Remainder 2
}

// Define the binary alphabet
export type BinarySymbol = "0" | "1";

// State transition table
const STATE_TRANSITIONS: Record<
  ModThreeState,
  Record<BinarySymbol, ModThreeState>
> = {
  [ModThreeState.S0]: { "0": ModThreeState.S0, "1": ModThreeState.S1 },
  [ModThreeState.S1]: { "0": ModThreeState.S2, "1": ModThreeState.S0 },
  [ModThreeState.S2]: { "0": ModThreeState.S1, "1": ModThreeState.S2 },
};

// Output mapping
const STATE_OUTPUTS: Record<ModThreeState, number> = {
  [ModThreeState.S0]: 0,
  [ModThreeState.S1]: 1,
  [ModThreeState.S2]: 2,
};

// Create and export the FSM configuration
export const modThreeConfig: FSMConfig<ModThreeState, BinarySymbol> = {
  states: new Set([ModThreeState.S0, ModThreeState.S1, ModThreeState.S2]),
  initialState: ModThreeState.S0,
  alphabet: new Set<BinarySymbol>(["0", "1"]),
  finalStates: new Set<ModThreeState>([
    ModThreeState.S0,
    ModThreeState.S1,
    ModThreeState.S2,
  ]),
  transition: (state: ModThreeState, symbol: BinarySymbol) => {
    return STATE_TRANSITIONS[state][symbol];
  },
  outputMapper: (state: ModThreeState) => {
    return STATE_OUTPUTS[state];
  },
};
```

2. `mod-three-validator.ts` - Validates the input:

```typescript
export function validateBinaryInput(input: string): void {
  if (!input || input.length === 0) {
    throw new Error("Input cannot be empty");
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char !== "0" && char !== "1") {
      throw new Error(`Invalid binary digit at position ${i}: ${char}`);
    }
  }
}
```

3. `index.ts` - The main function that uses the FSM:

```typescript
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
```

## Creating Your Own FSM

To create your own FSM using this framework, you can use the mod-three example as a template. Here are the steps to follow:

### 1.Define States and Inputs

```javascript
export enum LightState { ON, OFF }
export type SwitchInput = "TOGGLE";
```

### 2. Create a Config

```javascript
const transitions = {
  [LightState.ON]: { TOGGLE: LightState.OFF },
  [LightState.OFF]: { TOGGLE: LightState.ON },
};

const outputs = {
  [LightState.ON]: "Light is ON",
  [LightState.OFF]: "Light is OFF",
};

export const lightSwitchConfig = {
  states: new Set([LightState.ON, LightState.OFF]),
  initialState: LightState.OFF,
  alphabet: new Set(["TOGGLE"]),
  finalStates: new Set([LightState.ON, LightState.OFF]),
  transition: (state, input) => transitions[state][input],
  outputMapper: (state) => outputs[state],
};
```

### 3. Validate Inputs

```javascript
export function validateInput(input: string) {
  if (input !== "TOGGLE") {
    throw new Error("Invalid input. Try 'TOGGLE'");
  }
}
```

### 4. Use It in a Function

```javascript
import { FiniteStateMachine } from "../finite-state-machine/finite-state-machine";
import { lightSwitchConfig } from "./config";
import { validateInput } from ".validator";

export function useLightSwitch(input: string): string {
  validateInput(input);
  const fsm = new FiniteStateMachine(lightSwitchConfig);
  return fsm.processWithOutput([input]);
}
```

import { FSMConfig } from "../finite-state-machine/types";

// Define the states for the mod-three FSM
export enum ModThreeState {
  S0 = "S0",
  S1 = "S1",
  S2 = "S2",
}

// Define the binary alphabet
export type BinarySymbol = "0" | "1";

// State transition table, it can look up this table and decide what state should pick
const STATE_TRANSITIONS: Record<
  ModThreeState,
  Record<BinarySymbol, ModThreeState>
> = {
  [ModThreeState.S0]: { "0": ModThreeState.S0, "1": ModThreeState.S1 },
  [ModThreeState.S1]: { "0": ModThreeState.S2, "1": ModThreeState.S0 },
  [ModThreeState.S2]: { "0": ModThreeState.S1, "1": ModThreeState.S2 },
};

// Output mapping: Final output, it should return as int as the exercise
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

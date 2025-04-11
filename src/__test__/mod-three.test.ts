import { modThree, FiniteStateMachine, FSMValidator } from "../../src";

describe("modThree function functionality", () => {
  // Core functionality tests (examples from the exercise)
  it("should calculate mod 3 of binary 110", () => {
    expect(modThree("110")).toBe(0);
  });

  it("should calculate mod 3 of binary 101", () => {
    expect(modThree("101")).toBe(2); // 5 mod 3 = 2
  });
});

describe("Test Finite State Machine class with mod three impelmentation", () => {
  enum ModThreeState {
    S0 = "S0",
    S1 = "S1",
    S2 = "S2",
  }

  // Define the binary alphabet
  type BinarySymbol = "0" | "1";

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

  const createModeThreeConfig = {
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

  it("should create a valid Mod Three with proper configuration", () => {
    const validConfig = { ...createModeThreeConfig };
    expect(() => new FiniteStateMachine(validConfig)).not.toThrow();
  });

  it("should throw error for empty states", () => {
    const invalidConfig = { ...createModeThreeConfig };
    invalidConfig.states = new Set();
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "States cannot be empty"
    );
  });

  it("should throw error for empty alphabet", () => {
    const invalidConfig = { ...createModeThreeConfig };
    invalidConfig.alphabet = new Set();
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "Alphabet cannot be empty"
    );
  });

  it("should throw error for invalid initial state", () => {
    const invalidConfig = { ...createModeThreeConfig };
    invalidConfig.initialState = "INVALID_STATE" as ModThreeState;
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "Initial state must be included in the set of states"
    );
  });

  it("should not throw for valid states", () => {
    const states = new Set([
      ModThreeState.S0,
      ModThreeState.S1,
      ModThreeState.S2,
    ]);
    expect(() =>
      FSMValidator.validateState(ModThreeState.S0, states)
    ).not.toThrow();
    expect(() =>
      FSMValidator.validateState(ModThreeState.S1, states)
    ).not.toThrow();
    expect(() =>
      FSMValidator.validateState(ModThreeState.S2, states)
    ).not.toThrow();
  });

  it("should throw error for empty final states", () => {
    const invalidConfig = { ...createModeThreeConfig };
    invalidConfig.finalStates = new Set();
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "At least provide one final state"
    );
  });

  it("should throw error for invalid final state", () => {
    const invalidConfig = { ...createModeThreeConfig };
    invalidConfig.finalStates = new Set([5] as any);
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "All final states must be included in the set of states"
    );
  });

  it("should throw error for invalid output mapper", () => {
    const invalidConfig = {
      ...createModeThreeConfig,
      outputMapper: () => undefined, // Invalid implementation that returns undefined
    };
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "Output mapper function returned undefined"
    );
  });

  it("should throw error for null output mapper", () => {
    const invalidConfig = {
      ...createModeThreeConfig,
      outputMapper: () => null, // Invalid implementation that returns null
    };
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "Output mapper function returned null"
    );
  });

  it("should throw error for invalid transition result", () => {
    const invalidConfig = { ...createModeThreeConfig };
    // Override the transition function to return an invalid state
    invalidConfig.transition = () => {
      // Return a state that doesn't exist in the states set
      return "INVALID_STATE" as ModThreeState;
    };

    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "Transition function produced invalid state"
    );
  });

  it("should throw error for invalid final state", () => {
    const invalidConfig = { ...createModeThreeConfig };
    invalidConfig.finalStates = new Set([5] as any);
    expect(() => new FiniteStateMachine(invalidConfig)).toThrow(
      "All final states must be included in the set of states"
    );
  });

  it("should not throw for valid symbols", () => {
    const alphabet = new Set(["0", "1"]);
    expect(() => FSMValidator.validateSymbol("0", alphabet)).not.toThrow();
    expect(() => FSMValidator.validateSymbol("1", alphabet)).not.toThrow();
  });

  it("should throw for invalid symbols", () => {
    const alphabet = new Set(["0", "1"]);
    expect(() => FSMValidator.validateSymbol("2", alphabet)).toThrow(
      "Invalid input symbol: 2"
    );
    expect(() => FSMValidator.validateSymbol("a", alphabet)).toThrow(
      "Invalid input symbol: a"
    );
  });

  it("should handle circular references in config", () => {
    const circularConfig = { ...createModeThreeConfig };
    const circularObject: any = {};
    circularObject.self = circularObject;

    // Add a circular reference somewhere in the config
    circularConfig.states = new Set([
      ModThreeState.S0,
      ModThreeState.S1,
      circularObject,
    ]);

    expect(() => new FiniteStateMachine(circularConfig)).toThrow();
  });

  it("should process input correctly for mod 3 FSM", () => {
    const ModeThreeConfig = { ...createModeThreeConfig };
    const fsm = new FiniteStateMachine(ModeThreeConfig);
    expect(fsm.processWithOutput(["1", "1", "0"])).toBe(0); // Binary 110 = 6, 6 mod 3 = 0
    expect(fsm.processWithOutput(["1", "0", "1"])).toBe(2); // Binary 101 = 5, 5 mod 3 = 2
    expect(fsm.processWithOutput(["1", "0", "0"])).toBe(1); // Binary 100 = 4, 4 mod 3 = 1
  });
});

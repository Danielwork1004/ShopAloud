import { atom, PrimitiveAtom } from 'jotai';
import { atomWithStorage, useReducerAtom } from 'jotai/utils'
import { TypedDictionary } from 'typed-two-way-map';
import { useSocket } from './useSocket';

const sessionAtom = atomWithStorage('shopaloud_currentSessionState', "idle")
// const sessionAtom = atom("idle")

export type PossibleTransition = 
                          "GET_STARTED"               | 
                          "GET_SCREEN_STREAM"         | 
                          "SHOW_RECORDING"            | 
                          "GET_SCREEN_STREAM_SUCCESS" |
                          "GET_SCREEN_STREAM_FAILURE" |
                          "START_RECORDING"           |
                          "SUCCESS"

type State = "idle" | "gettingStarted" | "showRecording" | "recording" | "success"

type StatesDictionary = TypedDictionary<State, Partial<TypedDictionary<PossibleTransition, State>>>

type StateMachine = {
  initialState: State
  states: StatesDictionary
}

type StateFunction = () => void
type StateActions = Partial<TypedDictionary<State, StateFunction>>

const sessionMachine: StateMachine = {
  initialState: "idle",
  states: {
    idle: {
      GET_STARTED: "gettingStarted",
    },
    gettingStarted: {
      GET_SCREEN_STREAM_SUCCESS: "showRecording",
      GET_SCREEN_STREAM_FAILURE: "gettingStarted",
    },
    showRecording: {
      START_RECORDING: "recording",
    },
    recording: {
      SUCCESS: "success",
    },
    success: {
      SHOW_RECORDING: "showRecording",
    },
  }
}

type StateMachineReducer = (state: State, event: PossibleTransition) => State
type BuildMachineReducer = (spec: StateMachine, actions: StateActions) => StateMachineReducer

export const buildMachineReducer: BuildMachineReducer = (spec: StateMachine, actions: StateActions = {}) => (currentState: State, event: PossibleTransition) => {
  // We get all possible transitions for the current State
  const stateTransitions = spec.states[currentState];

  if (stateTransitions === undefined) {
    throw new Error(`No transitions defined for ${currentState}`);
  }

  // We try to transition to the next state
  const nextState = stateTransitions[event];
  
  // No next state? Error!
  if (nextState === undefined) {
    throw new Error(
      `Unknown transition for event ${event} in state ${currentState}`
    );
  }

  // We execute the action for the new state
  if(actions[nextState] != null) {
    console.log(`*** Executing action for ${nextState}`)
    actions[nextState]!()
  }

  // We return the new state
  return nextState;
};

export const useSessionMachine = () => {
  const { connectSocket, stopRecording } = useSocket()

  const stateActions: StateActions = {
    showRecording: connectSocket,
    success: stopRecording,
  }

  return useReducerAtom(sessionAtom, buildMachineReducer(sessionMachine, stateActions) as any)
}
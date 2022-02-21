import { Reducer } from "./configureStore";

export type Reducers<State, Action> = {
  [key: string]: Reducer<State, Action> | any;
};

export type States = {
  [key: string]: any;
};

export function combineReducers<State, Action>(
  reducers: Reducers<State, Action> = {}
): any {
  return (state: State | any, action: Action) => {
    const states: States = {};
    Object.entries(reducers).forEach(([key, reducer]) => {
      states[key] = reducer(state && state[key], action);
    });
    return states;
  };
}

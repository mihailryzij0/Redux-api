export type Store<State = any, Action = { type: string }> = {
  getState(): State | undefined;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
};

export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;

export type Middleware<State, Action> = (
  store: Store<State, Action>
) => (next: (action: Action) => any) => (action: Action) => any;

export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined,
  middlewares?: Middleware<State, Action>[]
) => Store<State, Action>;

export type Subscriber = () => void;

export function configureStore<State = any, Action = { type: string }>(
  reducer: Reducer<State, Action>,
  initialState?: State | undefined,
  middlewares?: Middleware<State, Action>[]
): Store<State, Action> {
  const subscribers = new Set<Subscriber>();
  let state = initialState;

  const getState = (): State | undefined => state;

  const dispatch = (action: Action): any => {
    state = reducer(state, action);
    subscribers.forEach((subscriber) => subscriber());
  };

  const subscribe = (subscriber: Subscriber): (() => void) => {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  };

  const store = {
    getState,
    dispatch,
    subscribe,
  };

  return store;
}

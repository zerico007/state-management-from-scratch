import { useState, useEffect } from "react";

type StateUpdate<State> = State | ((oldValue: State) => State);

type StateUpdater<State> = (newState: StateUpdate<State>) => void;

type Getter = <State>(store: StateStore<State>) => State;

type GetterState<State> = (get: Getter) => State;

class StateStore<State> {
  private listeners = new Set<(state: State) => void>();
  state;

  constructor(state: State | GetterState<State>) {
    this.state = state;
  }

  private computeValue(get: Getter) {
    return this.state instanceof Function ? this.state(get) : this.state;
  }

  private get<Target>(store: StateStore<Target>): Target {
    let currentValue = store.read();
    store.subscribe((newState) => {
      if (newState === currentValue) {
        return;
      }
      this.listeners.forEach((listener) => {
        listener(this.read())
      });
      currentValue = newState;
    });
    return currentValue;
  }

  read(): State {
    return this.computeValue(this.get.bind(this));
  }

  write(newState: StateUpdate<State>) {
    if (this.state instanceof Function) {
      throw new Error("Cannot set value on computed state");
    }
    if (newState instanceof Function) {
      newState = newState(this.read());
      this.state = newState;
    } else {
    this.state = newState;
    }
    this.listeners.forEach((listener) => listener(newState));
  }

  subscribe(listener: (state: State) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

function createClassStore<State>(state: State | GetterState<State>) {
  return new StateStore(state);
}

function useClassStore<State>(
  store: StateStore<State>
): [State, StateUpdater<State>] {
  const [state, setState] = useState(store.read());

  function write(newState: StateUpdate<State>) {
    store.write(newState);
  }

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  /* returning [state, store.write] causes store.write to be assigned to a variable when useClassStore is called. This variable
  removes the this context from store.write, so it is unable to access the class context */
  return [state, write];
}

export { createClassStore, useClassStore };

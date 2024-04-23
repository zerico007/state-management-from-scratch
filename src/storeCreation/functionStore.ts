import { useSyncExternalStore } from "react";

import Collection from "./collection";

type Store<StoreType> = {
  read: () => StoreType;
  subscribe: (listener: (state: StoreType) => void) => () => void;
  write: Updater<StoreType>;
};

type Updater<StoreType> = (
  newState: StoreType | ((oldValue: StoreType) => StoreType)
) => void;

type Getter = <StoreType>(store: Store<StoreType>) => StoreType;

type GetterStoreType<StoreType> = (get: Getter) => StoreType;

function computeValue<State>(state: State, get: Getter) {
  return state instanceof Function ? state(get) : state;
}

function createFunctionStore<StoreType>(
  state: StoreType | GetterStoreType<StoreType>
): Store<StoreType> {
  const listeners = new Collection<(state: StoreType) => void>();
  let internalState: StoreType | GetterStoreType<StoreType> = state;

  function get<Target>(store: Store<Target>): Target {
    let currentValue = store.read();
    store.subscribe((newState) => {
      if (newState === currentValue) {
        return;
      }
      listeners.each((listener) => listener(read()));
      currentValue = newState;
    });
    return currentValue;
  }

  const read = () => {
    return computeValue(internalState, get);
  };

  const subscribe = (listener: (state: StoreType) => void) => {
    listeners.add(listener);
    return () => {
      listeners.remove(listener);
    };
  };

  const write: Updater<StoreType> = (newState) => {
    const currentValue = read();
    if (state instanceof Function) {
      throw new Error("Cannot set value on computed state");
    }
    if (newState instanceof Function) {
      newState = newState(currentValue);
      internalState = newState;
    } else {
      internalState = newState;
    }
    listeners.each((listener) => listener(read()));
  };

  return {
    read,
    subscribe,
    write,
  };
}

function useFunctionStoreSync<StoreType>(
  store: Store<StoreType>
): [StoreType, Updater<StoreType>] {
  const state = useSyncExternalStore(
    (effect) => store.subscribe(effect),
    () => store.read()
  );

  const updateStore: Updater<StoreType> = (newState) => {
    store.write(newState);
  };

  return [state, updateStore];
}

export { createFunctionStore, useFunctionStoreSync };

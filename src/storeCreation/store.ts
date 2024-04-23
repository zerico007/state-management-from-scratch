import { useEffect, useState, useSyncExternalStore } from "react";

type Store<StoreType> = {
  value: StoreType;
  subscribe: (listener: (state: StoreType) => void) => () => void;
};

export type Updater<StoreType> = (
  newState: StoreType | ((oldValue: StoreType) => StoreType)
) => void;

type StoreGetter = <StoreType>(store: Store<StoreType>) => StoreType;

type ReadOnlyStoreType<StoreType> = (get: StoreGetter) => StoreType;

function computeValue<State>(state: State, get: StoreGetter) {
  return state instanceof Function ? state(get) : state;
}

function isWritableStore<StoreType>(store: Store<StoreType>): boolean {
  function updateStore(newValue: StoreType) {
    store.value = newValue;
  }
  try {
    updateStore(store.value);
    return true;
  } catch (error) {
    return false;
  }
}

function createStore<StoreType>(
  state: StoreType | ReadOnlyStoreType<StoreType>
) {
  const value = computeValue(state, get);
  const internalState: Store<StoreType> = {
    value,
    subscribe: () => () => {},
  };

  const listeners = new Set<(state: StoreType) => void>();

  function get<Target>(store: Store<Target>): Target {
    let currentValue = store.value;
    store.subscribe((newState) => {
      if (newState === currentValue) {
        return;
      }
      listeners.forEach((listener) => listener(computeValue(state, get)));
      currentValue = newState;
    });
    return currentValue;
  }

  return new Proxy(internalState, {
    get(target, prop) {
      if (prop === "value") {
        return target.value;
      }
      if (prop === "subscribe") {
        return (listener: (state: StoreType) => void) => {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        };
      }
      throw new Error(`Unknown property ${String(prop)}`);
    },
    set(target, prop, newValue) {
      if (prop === "value") {
        if (state instanceof Function) {
          throw new Error("Cannot set value on computed state");
        }
        if (target.value === newValue) {
          return true;
        }
        target.value = newValue;
        for (const listener of listeners) {
          listener(target.value);
        }
        return true;
      }
      throw new Error(`Cannot set property ${String(prop)}`);
    },
  });
}

function useStore<StoreType>(
  store: Store<StoreType>
): [StoreType, Updater<StoreType>] {
  const [value, setValue] = useState(store.value);

  const updateStore: Updater<StoreType> = (newState) => {
    if (!isWritableStore(store)) return;
    if (newState instanceof Function) {
      store.value = newState(store.value);
      return;
    }
    store.value = newState;
  };

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setValue(state);
    });

    return unsubscribe;
  }, [store]);

  return [value, updateStore];
}

function useStoreSync<StoreType>(
  store: Store<StoreType>
): [StoreType, Updater<StoreType>] {
  const state = useSyncExternalStore(
    (effect) => store.subscribe(effect),
    () => store.value
  );

  const updateStore: Updater<StoreType> = (newState) => {
    if (!isWritableStore(store)) return;
    if (newState instanceof Function) {
      store.value = newState(store.value);
      return;
    }
    store.value = newState;
  };

  return [state, updateStore];
}

function usePersistentStore<StoreType>(
  store: Store<StoreType>,
  key: string,
  storage: Storage = window.localStorage
): [StoreType, Updater<StoreType>] {
  const [storeValue, setStoreValue] = useStore(store);

  useEffect(() => {
    if (!isWritableStore(store)) return;
    const storedValue = storage?.getItem(key);
    if (storedValue) {
      store.value = JSON.parse(storedValue);
    }
  }, [key, storage, store]);

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      storage?.setItem(key, JSON.stringify(state));
    });

    return unsubscribe;
  }, [key, storage, store]);

  return [storeValue, setStoreValue];
}

export { createStore, useStore, useStoreSync, usePersistentStore };

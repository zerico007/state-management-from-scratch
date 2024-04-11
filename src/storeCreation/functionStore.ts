type Store<StoreType> = {
  get: () => StoreType;
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
) {
  let value = computeValue(state, get);

  const listeners = new Set<(state: StoreType) => void>();

  function get<Target>(store: Store<Target>): Target {
    let currentValue = store.get();
    store.subscribe((newState) => {
      if (newState === currentValue) {
        return;
      }
      listeners.forEach((listener) => listener(computeValue(state, get)));
      currentValue = newState;
    });
    return currentValue;
  }

  const read = () => {
    return value;
  };

  const subscribe = (listener: (state: StoreType) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const write: Updater<StoreType> = (newState) => {
    if (value instanceof Function) {
      throw new Error("Cannot set value on computed state");
    }
    if (newState instanceof Function) {
      newState = newState(value);
    }
    value = newState;
    for (const listener of listeners) {
      listener(value);
    }
  };

  return {
    read,
    subscribe,
    write,
  };
}

export { createFunctionStore };

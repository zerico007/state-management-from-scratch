import {
  createStore,
  createClassStore,
  createFunctionStore,
  useClassStore,
  useStore,
  useStoreSync,
  useFunctionStoreSync,
} from "../storeCreation";

const countStore = createStore(1);

const classCountStore = createClassStore(1);

const functionCountStore = createFunctionStore(1);

const useCountStore = () => useStore(countStore);

const useCountStoreSync = () => useStoreSync(countStore);

const useClassCountStore = () => useClassStore(classCountStore);

const useFunctionCountStore = () => useFunctionStoreSync(functionCountStore);

export {
  countStore,
  classCountStore,
  useClassCountStore,
  useCountStore,
  useCountStoreSync,
  useFunctionCountStore,
  functionCountStore,
};

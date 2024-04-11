import { createStore, createClassStore, useClassStore, useStore } from "../storeCreation";

const countStore = createStore(1);

const classCountStore = createClassStore(1);

const useCountStore = () => useStore(countStore);

const useClassCountStore = () => useClassStore(classCountStore);

export { countStore, classCountStore, useClassCountStore, useCountStore };
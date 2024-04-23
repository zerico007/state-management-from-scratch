import { useFunctionStoreSync, createFunctionStore } from "./storeCreation";
import { functionCountStore } from "./store/countStore";

const doubleCountStore = createFunctionStore((get) => get(functionCountStore) * 2);


export default function NavBar() {
  const [count] = useFunctionStoreSync(doubleCountStore);

  return (
    <nav>
      <div>Navbar double count is {count}</div>
    </nav>
  );
}

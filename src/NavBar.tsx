import { useStore, createStore } from "./storeCreation";
import { countStore } from "./store/countStore";

const doubleCountStore = createStore((get) => get(countStore) * 2);


export default function NavBar() {
  const [count] = useStore(doubleCountStore);

  return (
    <nav>
      <div>Navbar double count is {count}</div>
    </nav>
  );
}

import { useCountStore } from "./store/countStore";

export default function Count() {
  const [count, setCount] = useCountStore();

  return (
    <>
      <button onClick={() => setCount((previousCount) => previousCount + 1)}>
        Increment (current count: {count})
      </button>
      <button onClick={() => setCount((previousCount) => previousCount - 1)}>
        Decrement (current count: {count})
      </button>
      <button onClick={() => setCount(0)}>Reset count</button>
    </>
  );
}

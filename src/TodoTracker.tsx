import { todoClassStore } from "./store/todoStore";
import { useClassStore, createClassStore } from "./storeCreation";

const completedTodosStore = createClassStore(
  (get) => get(todoClassStore).todos.filter((todo) => todo.completed).length
);

export default function TodoTracker() {
  const [completedTodos] = useClassStore(completedTodosStore);
  return <div>Completed todos: {completedTodos} </div>;
}

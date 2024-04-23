import { createStore, createClassStore, useStore, useClassStore, useClassStoreSync } from "../storeCreation";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type TodoStore = {
  todos: Todo[];
};

const todoStore = createStore<TodoStore>({
  todos: [],
});

const todoClassStore = createClassStore<TodoStore>({ todos: []});

const useTodoStore = () => useStore(todoStore);

const useClassTodoStore = () => useClassStore(todoClassStore);

const useClassTodoStoreSync = () => useClassStoreSync(todoClassStore);

export { useTodoStore, todoStore, useClassTodoStore, todoClassStore, useClassTodoStoreSync };

import type { FC, FormEvent } from "react";

import { useState } from "react";
import { useClassTodoStore } from "./store/todoStore";
import Todo from "./Todo";

const TodoList: FC = () => {
  const [todoState, setTodos] = useClassTodoStore();
  const [text, setText] = useState("");

  const handleComplete = (id: number) => {
    const newTodos = todoState.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos({ todos: newTodos });
  };

  const addTodo = (text: string) => {
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos({ todos: [...todoState.todos, newTodo] });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    addTodo(text);
    setText("");
  }

  return (
    <section>
      <form onSubmit={onSubmit}>
        <label htmlFor="todo-input">Add a new todo:</label>
        <input
          type="text"
          value={text}
          id="todo-input"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      {todoState.todos.map((todo) => (
        <Todo key={todo.id} {...todo} handleComplete={handleComplete} />
      ))}
    </section>
  );
};

export default TodoList;

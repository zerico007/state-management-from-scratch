import type { Todo } from "./store/todoStore";
import type { FC } from "react";

type TodoProps = Todo & {
  handleComplete: (id: number) => void;
};

const Todo: FC<TodoProps> = ({ id, text, completed, handleComplete }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => handleComplete(id)}
      />
      <span>{text}</span>
    </div>
  );
};

export default Todo;

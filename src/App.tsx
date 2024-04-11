import Count from "./Count";
import NavBar from "./NavBar";
import TodoList from "./TodoList";
import TodoTracker from "./TodoTracker";
import { countStore } from "./store/countStore";

countStore.subscribe((count) => {
  console.log("Count changed to", count);
});

function App() {
  return (
    <div className="App">
      <NavBar />
      <Count />
      <TodoTracker />
      <TodoList />
    </div>
  );
}

export default App;

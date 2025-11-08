import React, { useState } from "react";
import type { Task } from './types';
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { usePersistentState } from './hooks/useLocalStorage';
import "./App.css";

type Filter = "all" | "completed" | "pending";

const TASKS_PER_PAGE = 5;

function App() {
  const [tasks, setTasks] = usePersistentState<Task[]>("my_todo_tasks_v1", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const addTask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTask: Task = { id: Date.now(), title: trimmed, completed: false };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const editTask = (id: number, newText: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newText } : t));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    if (filter === "completed") return t.completed;
    return !t.completed;
  });

  const indexOfLastTask = currentPage * TASKS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - TASKS_PER_PAGE;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="app-container">
      <header>
        <h1>To-Do List App</h1>
      </header>

      <TaskInput onAdd={addTask} />

      <div className="controls">
        <div className="filters">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Todas</button>
          <button className={filter === "pending" ? "active pending-btn" : "pending-btn"} onClick={() => setFilter("pending")}>Pendientes</button>
          <button className={filter === "completed" ? "active completed-btn" : "completed-btn"} onClick={() => setFilter("completed")}>Completadas</button>
        </div>

        <div className="right-controls">
          <span className="pending-count">Tareas pendientes: <strong>{pendingCount}</strong></span>
          <button onClick={clearCompleted} className="delete-btn">Borrar completadas</button>
        </div>
      </div>

      <TaskList
        tasks={currentTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      <footer className="footer">
        <small className="total-count">Total tareas: {tasks.length}</small>
      </footer>
    </div>
  );
}

export default App;

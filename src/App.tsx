import React, { useEffect, useState } from "react";
import type { Task } from './types';
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import "./App.css";

type Filter = "all" | "completed" | "pending";
const STORAGE_KEY = "my_todo_tasks_v1";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.error("Error leyendo localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Error guardando localStorage", e);
    }
  }, [tasks]);

  const addTask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTask: Task = { id: Date.now(), title: trimmed, completed: false };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter(t => t.id !== id));
  };

  const editTask = (id: number, newText: string) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter(t => !t.completed));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    if (filter === "completed") return t.completed;
    return !t.completed;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="app-container">
      <header>
        <h1>To-Do List</h1>
      </header>

      <TaskInput onAdd={addTask} />

      <div className="controls">
        <div className="filters">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Todas</button>
          <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pendientes</button>
          <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completadas</button>
        </div>

        <div className="right-controls">
          <span>Tareas pendientes: <strong>{pendingCount}</strong></span>
          <button onClick={clearCompleted} className="clear-btn">Borrar completadas</button>
        </div>
      </div>

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />

      <footer className="footer">
        <small>Total tareas: {tasks.length}</small>
      </footer>
    </div>
  );
}

export default App;

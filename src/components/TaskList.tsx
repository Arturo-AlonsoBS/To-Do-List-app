import React, { useState } from "react";
import type { Task } from '../types';

interface Props {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = (id: number) => {
    const trimmed = editText.trim();
    if (!trimmed) { setEditingId(null); return; }
    onEdit(id, trimmed);
    setEditingId(null);
  };

  return (
    <ul className="task-list">
      {tasks.length === 0 && <li className="empty">No hay tareas.</li>}
      {tasks.map(task => (
        <li key={task.id} className="task-item">
          <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />

          {editingId === task.id ? (
            <>
              <input
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(task.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
              <button className="edit-btn" onClick={() => saveEdit(task.id)}>Guardar</button>
              <button className="delete-btn" onClick={() => setEditingId(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <span
                onDoubleClick={() => startEdit(task)}
                className={task.completed ? "text-completed" : ""}
              >
                {task.title}
              </span>
              <button className="edit-btn" onClick={() => startEdit(task)}>Editar</button>
              <button className="delete-btn" onClick={() => onDelete(task.id)}>Eliminar</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

import { useState } from 'react';
import type { ColumnId, Priority } from '../types';

interface Props {
  columnId: ColumnId;
  onAdd: (title: string, description: string, priority: Priority) => void;
  onClose: () => void;
}

export default function AddTaskModal({ columnId, onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    onAdd(title.trim(), description.trim(), priority);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold text-gray-800">New Task</h2>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Title *</label>
          <input
            className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Task title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <textarea
            className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            placeholder="Optional description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Priority</label>
          <select
            className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-gray-500 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition font-medium"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
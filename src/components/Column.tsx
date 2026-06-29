import { useState } from 'react';
import { ColumnId, Task, Priority } from '../types';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';

interface Props {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onAdd: (title: string, description: string, priority: Priority, columnId: ColumnId) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, to: ColumnId) => void;
}

const columnStyles: Record<ColumnId, { header: string; badge: string; button: string }> = {
  todo: {
    header: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-600',
    button: 'hover:bg-pink-50 border-pink-200 text-pink-400',
  },
  inprogress: {
    header: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-600',
    button: 'hover:bg-purple-50 border-purple-200 text-purple-400',
  },
  done: {
    header: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-600',
    button: 'hover:bg-emerald-50 border-emerald-200 text-emerald-400',
  },
};

export default function Column({ id, title, tasks, onAdd, onDelete, onMove }: Props) {
  const [showModal, setShowModal] = useState(false);
  const styles = columnStyles[id];

  return (
    <div className="flex flex-col bg-pink-50/60 rounded-2xl p-4 gap-3 min-h-[500px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className={`font-bold text-sm tracking-wide ${styles.header}`}>{title}</h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-400 italic">No tasks in this column</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} onMove={onMove} />
          ))
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`mt-2 w-full border border-dashed rounded-xl py-2 text-xs font-medium transition ${styles.button}`}
      >
        + Add Task
      </button>

      {showModal && (
        <AddTaskModal
          columnId={id}
          onAdd={(title, desc, priority) => onAdd(title, desc, priority, id)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
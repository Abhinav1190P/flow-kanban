import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, ColumnId } from '../types';

const priorityStyles = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const moveOptions: { label: string; value: ColumnId }[] = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Done', value: 'done' },
];

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  onMove: (id: string, to: ColumnId) => void;
}

export default function TaskCard({ task, onDelete, onMove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-pink-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-grab active:cursor-grabbing"
    >
      {/* Drag handle + title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <span
            {...attributes}
            {...listeners}
            className="text-gray-300 hover:text-pink-400 mt-0.5 cursor-grab active:cursor-grabbing select-none"
            title="Drag to move"
          >
            ⠿
          </span>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed pl-5">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-1 pl-5">
        <select
          className="text-xs border border-pink-200 rounded-lg px-2 py-1 text-gray-600 bg-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-300"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onMove(task.id, e.target.value as ColumnId);
          }}
        >
          <option value="" disabled>Move to...</option>
          {moveOptions
            .filter((o) => o.value !== task.columnId)
            .map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
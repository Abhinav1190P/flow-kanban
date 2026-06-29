import { useReducer, useEffect } from 'react';
import { boardReducer, loadState, saveState } from './reducer';
import { ColumnId, Priority } from './types';
import Column from './components/Column';

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function App() {
  const [state, dispatch] = useReducer(boardReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  function handleAdd(title: string, description: string, priority: Priority, columnId: ColumnId) {
    dispatch({ type: 'ADD_TASK', payload: { title, description, priority, columnId } });
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  }

  function handleMove(id: string, to: ColumnId) {
    dispatch({ type: 'MOVE_TASK', payload: { id, to } });
  }

  const tasksByColumn = (columnId: ColumnId) =>
    Object.values(state.tasks)
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="px-8 py-6 border-b border-pink-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-pink-600 tracking-tight">Flow</h1>
            <p className="text-xs text-gray-400 mt-0.5">Your personal Kanban board</p>
          </div>
          <span className="text-xs text-gray-400">
            {Object.values(state.tasks).length} total tasks
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasksByColumn(col.id)}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
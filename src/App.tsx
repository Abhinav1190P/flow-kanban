import { useReducer, useEffect, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { boardReducer, loadState, saveState } from './reducer';
import type { ColumnId, Priority, Task } from './types';
import Column from './components/Column';
import TaskCard from './components/TaskCard';

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function App() {
  const [state, dispatch] = useReducer(boardReducer, undefined, loadState);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleAdd(title: string, description: string, priority: Priority, columnId: ColumnId) {
    dispatch({ type: 'ADD_TASK', payload: { title, description, priority, columnId } });
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  }

  function handleMove(id: string, to: ColumnId) {
    dispatch({ type: 'MOVE_TASK', payload: { id, to } });
  }

  function handleDragStart(event: DragStartEvent) {
    const task = state.tasks[event.active.id as string];
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = state.tasks[activeId];
    if (!activeTask) return;

    // Dragging over a column directly
    const isOverColumn = COLUMNS.some((c) => c.id === overId);
    if (isOverColumn && activeTask.columnId !== overId) {
      handleMove(activeId, overId as ColumnId);
      return;
    }

    // Dragging over another task
    const overTask = state.tasks[overId];
    if (overTask && overTask.columnId !== activeTask.columnId) {
      handleMove(activeId, overTask.columnId);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = state.tasks[activeId];
    if (!activeTask) return;

    const isOverColumn = COLUMNS.some((c) => c.id === overId);
    if (isOverColumn && activeTask.columnId !== overId) {
      handleMove(activeId, overId as ColumnId);
    }
  }

  const tasksByColumn = (columnId: ColumnId) =>
    Object.values(state.tasks)
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        {/* Header */}
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

        {/* Board */}
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onDelete={() => {}}
            onMove={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
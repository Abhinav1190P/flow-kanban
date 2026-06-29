import type { BoardState, ColumnId, Priority, Task } from './types';

export const COLUMNS = ['todo', 'inprogress', 'done'] as const;

export const initialState: BoardState = {
  tasks: {},
  columnOrder: ['todo', 'inprogress', 'done'],
};

export function loadState(): BoardState {
  try {
    const saved = localStorage.getItem('flow-kanban');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

export function saveState(state: BoardState) {
  localStorage.setItem('flow-kanban', JSON.stringify(state));
}

export type Action =
  | { type: 'ADD_TASK'; payload: { title: string; description: string; priority: Priority; columnId: ColumnId } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'MOVE_TASK'; payload: { id: string; to: ColumnId } };

export function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'ADD_TASK': {
      const id = crypto.randomUUID();
      const task: Task = {
        id,
        title: action.payload.title,
        description: action.payload.description,
        priority: action.payload.priority,
        createdAt: Date.now(),
        columnId: action.payload.columnId,
      };
      return { ...state, tasks: { ...state.tasks, [id]: task } };
    }
    case 'DELETE_TASK': {
      const tasks = { ...state.tasks };
      delete tasks[action.payload.id];
      return { ...state, tasks };
    }
    case 'MOVE_TASK': {
      const task = state.tasks[action.payload.id];
      if (!task) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.id]: { ...task, columnId: action.payload.to },
        },
      };
    }
    default:
      return state;
  }
}
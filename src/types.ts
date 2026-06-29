export type ColumnId = 'todo' | 'inprogress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: number;
  columnId: ColumnId;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export type BoardState = {
  tasks: Record<string, Task>;
  columnOrder: ColumnId[];
};
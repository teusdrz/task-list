// src/types.ts
export type TaskPriority = 'normal' | 'important' | 'emergency';

export interface Task {
  id: number;
  title: string;
  priority?: 'normal' | 'important' | 'emergency'; // opcional para compatibilidade
  done?: boolean; // opcional para compatibilidade
}
  // src/components/molecules/TaskForm.tsx
  import React, { useState } from 'react';
  import { Button } from '../atoms/Button';
  import PrioritySelect from '../atoms/PrioritySelect';
  import type { TaskPriority } from '../../types';

  interface TaskFormProps {
    onAddTask: (title: string, priority: TaskPriority) => void;
  }

  export const TaskForm = ({ onAddTask }: TaskFormProps) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('normal');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (title.trim()) {
        onAddTask(title.trim(), priority);
        setTitle('');
        setPriority('normal');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-grow p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />
        
        <PrioritySelect
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        />
        
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 rounded-lg"
        >
          Add Task
        </Button>
      </form>
    );
  };
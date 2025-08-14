import React, { useMemo } from 'react';
import { type Task } from '../../types';
import { TaskItem } from '../molecules/TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refetchTasks: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, error, refetchTasks }) => {
  console.log('TaskList received tasks:', tasks);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-400">
        <p>Error: {error}</p>
        <p className="text-gray-400 mt-2">Failed to load tasks. Please try again.</p>
      </div>
    );
  }

  const pendingTasks = useMemo(() => tasks.filter(task => !task.done), [tasks]);
  
  // Sort pending tasks by priority
  const sortedPending = {
    emergency: pendingTasks.filter(task => task.priority === 'emergency'),
    important: pendingTasks.filter(task => task.priority === 'important'),
    normal: pendingTasks.filter(task => task.priority === 'normal')
  };

  if (!pendingTasks || pendingTasks.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400">
        <p>No pending tasks! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Seção de tarefas Pendentes */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Pending Tasks</h2>
        <div className="space-y-6">
          {sortedPending.emergency.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-500 dark:text-red-400">🚨 Emergency</h3>
              <div className="space-y-4">
                {sortedPending.emergency.map((task) => (
                  <TaskItem key={task.id} task={task} refetchTasks={refetchTasks} />
                ))}
              </div>
            </div>
          )}
          {sortedPending.important.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-500 dark:text-yellow-400">⚠️ Important</h3>
              <div className="space-y-4">
                {sortedPending.important.map((task) => (
                  <TaskItem key={task.id} task={task} refetchTasks={refetchTasks} />
                ))}
              </div>
            </div>
          )}
          {sortedPending.normal.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-500 dark:text-gray-400">✅ Normal</h3>
              <div className="space-y-4">
                {sortedPending.normal.map((task) => (
                  <TaskItem key={task.id} task={task} refetchTasks={refetchTasks} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

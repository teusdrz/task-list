import { useMemo } from 'react';
import { type Task } from '../../types';
import { TaskItem } from '../molecules/TaskItem';

interface CompletedTasksListProps {
  tasks: Task[];
  refetchTasks: () => void;
}

export const CompletedTasksList: React.FC<CompletedTasksListProps> = ({ tasks, refetchTasks }) => {
  // Use useMemo para filtrar as tarefas concluídas de forma eficiente
  const doneTasks = useMemo(() => tasks.filter(task => task.done), [tasks]);

  if (!doneTasks || doneTasks.length === 0) {
    return null; // Não renderiza nada se não houver tarefas concluídas
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-500">Completed Tasks</h2>
      <div className="space-y-4">
        {doneTasks.map((task) => (
          <TaskItem key={task.id} task={task} refetchTasks={refetchTasks} />
        ))}
      </div>
    </section>
  );
};

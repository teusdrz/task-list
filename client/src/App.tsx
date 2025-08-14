import React, { useState, useEffect, useCallback } from 'react';
import { TaskForm } from './components/molecules/TaskForm';
import { api } from './services/api';
import { type Task, type TaskPriority } from './types';
import { Toaster, toast } from 'sonner';
import { TaskList } from './components/organisms/TaskList';
import { CompletedTasksList } from './components/organisms/CompletedTasksList';
import ThemeToggle from './components/atoms/ThemeToggle';

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching tasks from API...');
      const response = await api.get('/tasks');
      console.log('API Response fetchTasks:', response.data);
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      const errorMessage = (err as Error).message || 'Falha ao carregar as tarefas do servidor.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Usa useEffect para buscar as tarefas assim que o componente for montado
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // A função para adicionar tarefas
  const handleAddTask = async (title: string, priority: TaskPriority) => {
    try {
      console.log('🚀 Sending task to API:', { title, priority });
      const response = await api.post('/tasks', { title, priority });
      console.log('📡 API response handleAddTask:', response.data);
      
      if (response.data) {
        toast.success(`Task "${title}" was added with priority "${priority}"!`);
        fetchTasks(); // Chama a função para recarregar as tarefas
      } else {
        const errorMessage = 'Failed to add task: API response was empty.';
        console.error(errorMessage, response);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Failed to add task:", err);
      const errorMessage = (err as Error).message || 'Failed to add the new task.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-200">
        <main className="max-w-2xl mx-auto p-8">
          <header className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Task List Pro
            </h1>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </header>
          <p className="text-gray-400 mt-2 text-center">Organize your life, one task at a time.</p>
          {/* O TaskForm agora recebe a função handleAddTask que, por sua vez, chama o fetchTasks */}
          <TaskForm onAddTask={handleAddTask} />
          {/* O TaskList continua recebendo a função fetchTasks para ser usada no TaskItem */}
          <TaskList tasks={tasks} isLoading={isLoading} error={error} refetchTasks={fetchTasks} />
          {/* Adicionando a nova lista de tarefas concluídas aqui */}
          <CompletedTasksList tasks={tasks} refetchTasks={fetchTasks} />
        </main>
      </div>
    </>
  );
}

export default App;

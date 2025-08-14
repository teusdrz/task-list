import React, { useState, useEffect } from 'react';
import { type Task } from '../../types';
import { api } from '../../services/api'; // Importando a instância 'api'
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
  refetchTasks: () => void;
}

type Priority = 'normal' | 'important' | 'emergency';

export const TaskItem: React.FC<TaskItemProps> = ({ task, refetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const getValidPriority = (priority: any): Priority => {
    const priorityStr = String(priority || 'normal').toLowerCase();
    
    if (priorityStr === 'emergency') return 'emergency';
    if (priorityStr === 'important') return 'important';
    return 'normal';
  };
  
  const [editPriority, setEditPriority] = useState<Priority>(() => getValidPriority(task.priority));

  useEffect(() => {
    setEditTitle(task.title || '');
    setEditPriority(getValidPriority(task.priority));
  }, [task.id, task.title, task.priority]);

  const handleToggleDone = async () => {
    setIsLoading(true);
    try {
      const newDoneStatus = !task.done;
      console.log(`[TaskItem] Tentando atualizar a tarefa ${task.id} para done: ${newDoneStatus}`);
      
      const response = await api.patch(`/tasks/${task.id}`, { done: newDoneStatus });

      if (response.status === 200) {
        console.log(`[TaskItem] API respondeu com sucesso para a tarefa ${task.id}. Dados:`, response.data);
        toast.success(`Tarefa "${task.title}" atualizada com sucesso!`);
        console.log(`[TaskItem] Chamando refetchTasks() para atualizar a lista.`);
        refetchTasks();
      } else {
        const errorData = response.data;
        const errorMessage = `Falha ao atualizar a tarefa: ${response.status} - ${errorData?.message || response.statusText}`;
        console.error(`[TaskItem] Erro da API ao atualizar a tarefa ${task.id}:`, errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('[TaskItem] Erro na requisição para atualizar a tarefa:', error);
      toast.error(`Erro ao atualizar o status da tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();
    
    if (!trimmedTitle) {
      toast.error('O título não pode estar vazio.');
      return;
    }
    
    setIsLoading(true);
    try {
      const updateData = { 
        title: trimmedTitle,
        priority: editPriority
      };
      
      const response = await api.patch(`/tasks/${task.id}`, updateData);

      if (response.status === 200) {
        setIsEditing(false);
        toast.success(`Task "${trimmedTitle}" saved successfully!`);
        refetchTasks();
      } else {
        throw new Error(`Failed to save task: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(`Falha ao salvar a tarefa: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    setIsLoading(true);
    setShowConfirmDelete(false);
    try {
      const response = await api.delete(`/tasks/${task.id}`);

      // Verifica se o status é 200 ou 204
      if (response.status === 200 || response.status === 204) {
        toast.success(`Task "${task.title}" deleted successfully!`);
        refetchTasks(); // Recarrega a lista para refletir a exclusão
      } else {
        const errorData = response.data;
        console.error('Failed to delete task:', response.status, errorData);
        toast.error(`Falha ao excluir a tarefa: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erro de rede ao excluir a tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'emergency':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'important':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'normal':
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600';
    }
  };

  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'important':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'normal':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'emergency':
        return '🚨';
      case 'important':
        return '⚠️';
      case 'normal':
      default:
        return '✅';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'emergency':
        return 'Emergency';
      case 'important':
        return 'Important';
      case 'normal':
      default:
        return 'Normal';
    }
  };

  const currentPriority = getValidPriority(task.priority);
  const done = task.done; 
  const taskTitle = task.title || '';

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as Priority;
    setEditPriority(newPriority);
  };

  const handleStartEdit = () => {
    setEditTitle(task.title || '');
    setEditPriority(getValidPriority(task.priority));
    setIsEditing(true);
    toast.dismiss();
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title || '');
    setEditPriority(getValidPriority(task.priority));
    setIsEditing(false);
    toast.dismiss();
  };

  return (
    <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${getPriorityColor(currentPriority)} ${done ? 'opacity-60' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
              placeholder="Enter task title"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={editPriority}
              onChange={handlePriorityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            >
              <option value="normal">✅ Normal</option>
              <option value="important">⚠️ Important</option>
              <option value="emergency">🚨 Emergency</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={isLoading || !editTitle.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getPriorityIcon(currentPriority)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getPriorityBadgeColor(currentPriority)}`}>
                  {getPriorityLabel(currentPriority)}
                </span>
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${done ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                {taskTitle}
              </h3>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>ID:</strong> {task.id}</p>
                <p><strong>Status:</strong> {done ? 'Completed' : 'Pending'}</p>
                <p><strong>Priority:</strong> {getPriorityLabel(currentPriority)}</p>
              </div>
            </div>

            <div className="flex gap-2 ml-4 flex-wrap">
              <button
                onClick={handleToggleDone}
                disabled={isLoading}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                  done
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoading ? '...' : (done ? 'Undo' : 'Done')}
              </button>
              
              <button
                onClick={handleStartEdit}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm font-medium"
              >
                Edit
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm font-medium"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          {/* Modal de confirmação de exclusão */}
          {showConfirmDelete && (
            <div className="mt-4 p-4 rounded-md bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tem certeza que deseja excluir esta tarefa?</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1 text-sm rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

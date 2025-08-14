// src/components/atoms/PrioritySelect.tsx
import React from 'react';
import type { TaskPriority } from '../../types';

interface PrioritySelectProps {
  value: TaskPriority;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange }) => {
  return (
    <select
 className="p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"      value={value}
      onChange={onChange}
    >
      <option value="emergency">🚨 Emergency</option>
      <option value="important">⚠️ Important</option>
      <option value="normal">✅ Normal</option>
    </select>
  );
};

export default PrioritySelect;
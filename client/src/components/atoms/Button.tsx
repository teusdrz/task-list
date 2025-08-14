import React, { type ButtonHTMLAttributes } from 'react';

// Define as propriedades que o nosso componente de botão pode aceitar
// 'ButtonHTMLAttributes<HTMLButtonElement>' herda todas as propriedades nativas de um botão HTML
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

// O componente Button. Ele aceita props e renderiza um botão com estilos Tailwind
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  let baseStyles = 'px-4 py-2 font-semibold rounded-lg transition-colors duration-200';
  let variantStyles = '';

  // Aplica estilos diferentes com base na variante do botão
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-600 hover:bg-blue-700 text-white shadow-md';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 hover:bg-red-700 text-white shadow-md';
      break;
    default:
      variantStyles = 'bg-blue-600 hover:bg-blue-700 text-white shadow-md';
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

const Button = ({ 
  variant = 'primary', 
  children, 
  onClick, 
  type = 'button',
  disabled = false,
  className = ''
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} w-full`}
    >
      {children}
    </button>
  );
};

export default Button;

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-sm",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
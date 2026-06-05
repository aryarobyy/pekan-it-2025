import React from 'react';

type FormInputProps = {
  label: React.ReactNode;
  /**
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  name: string;
  id?: string;
  error?: string;
  /**
   * @default false
   */
  required?: boolean;
  placeholder?: string;
  value?: string;
  /**
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'id' | 'placeholder' | 'value' | 'onChange'>;

const MyFormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  id,
  error,
  required = false,
  placeholder = ' ',
  value,
  onChange,
  className = '',
  variant,
  ...rest
}) => {
  const inputId = id || name;
  const hasError = !!error;

  
  if (variant === 'secondary') {
    return (
      <div className="flex flex-col gap-1 font-helvetica">
        <label htmlFor={inputId} className="text-white text-sm font-semibold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={type}
          name={name}
          id={inputId}
          value={value}
          onChange={onChange}
          className={`w-full rounded-md px-4 py-2 bg-[#FFFFFF]/25 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
          placeholder={placeholder}
          required={required}
          {...rest}
        />
        {hasError && (
          <p className="text-sm text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-0 w-full mb-5 group font-helvetica">
      <input
        type={type}
        name={name}
        id={inputId}
        value={value}
        onChange={onChange}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
          ${hasError 
            ? 'border-red-500 focus:border-red-600' 
            : 'border-gray-300 focus:border-blue-600'
          }
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        placeholder={placeholder}
        required={required}
        {...rest}
      />
      
      <label 
        htmlFor={inputId} 
        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6
          ${hasError 
            ? 'text-red-500 peer-focus:text-red-600' 
            : 'text-gray-500 peer-focus:text-blue-600'
          }
        `.trim().replace(/\s+/g, ' ')}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

type FormProps = {
  children: React.ReactNode;
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const MyForm: React.FC<FormProps> = ({
  children,
  title,
  className = '',
  ...rest
}) => {
  return (
    <div className="max-w-md mx-auto" {...rest}>
      {title && (
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          {title}
        </h2>
      )}
      <div className={`space-y-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};


export { MyFormInput, MyForm };
export const ProfileInput = ({ 
  value, 
  onChange, 
  disabled, 
  type = "text", 
  placeholder, 
  rows, 
  options = [] 
}) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm";
  const disabledClasses = disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white hover:border-gray-400";

  if (type === "textarea") {
    return (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 4}
        disabled={disabled}
        placeholder={placeholder}
        className={`${baseClasses} ${disabledClasses} resize-none`}
      />
    );
  }

  if (type === "select") {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${baseClasses} ${disabledClasses}`}
      >
        <option value="">Select {placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`${baseClasses} ${disabledClasses}`}
    />
  );
};
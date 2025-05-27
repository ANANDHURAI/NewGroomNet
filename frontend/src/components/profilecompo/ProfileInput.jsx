export const ProfileInput = ({ value, onChange, disabled, type = "text", placeholder, rows }) => {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
    const disabledClasses = disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white";
    
    if (type === "textarea") {
        return (
            <textarea
                value={value}
                onChange={onChange}
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
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`${baseClasses} ${disabledClasses} appearance-none`}
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        );
    }
    
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${baseClasses} ${disabledClasses}`}
        />
    );
};
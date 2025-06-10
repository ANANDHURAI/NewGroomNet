
export const ActionButton = ({ onClick, icon: Icon, title, className = "", variant = "primary" }) => {
    const baseClasses = "p-2 rounded-lg transition-colors"
    const variants = {
        primary: "text-blue-600 hover:bg-blue-50",
        success: "text-green-600 hover:bg-green-50",
        warning: "text-yellow-600 hover:bg-yellow-50",
        danger: "text-red-600 hover:bg-red-50"
    }
    
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            title={title}
        >
            <Icon size={16} />
        </button>
    )
}
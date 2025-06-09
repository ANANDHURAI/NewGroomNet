export const ProfileField = ({ label, icon: Icon, children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-semibold text-gray-700 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-blue-500" />}
      {label}
    </label>
    {children}
  </div>
);
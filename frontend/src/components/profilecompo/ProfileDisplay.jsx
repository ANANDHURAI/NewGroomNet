export const ProfileDisplay = ({ value, icon: Icon }) => (
  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-start">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />}
      <p className="text-gray-900 font-medium whitespace-pre-wrap flex-1">
        {value || 'Not provided'}
      </p>
    </div>
  </div>
);
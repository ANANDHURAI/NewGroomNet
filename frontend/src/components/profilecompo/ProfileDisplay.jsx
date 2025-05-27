export const ProfileDisplay = ({ value, badge = false }) => (
    <div className="px-4 py-3 bg-gray-50 rounded-lg">
        {badge ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {value || 'Not provided'}
            </span>
        ) : (
            <p className="text-gray-900 font-medium whitespace-pre-wrap">
                {value || 'Not provided'}
            </p>
        )}
    </div>
);
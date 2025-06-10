export const StatusBadge = ({ isBlocked }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isBlocked 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
    }`}>
        {isBlocked ? 'Blocked' : 'Active'}
    </span>
)
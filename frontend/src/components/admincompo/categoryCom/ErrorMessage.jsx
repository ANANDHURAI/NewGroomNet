export const ErrorMessage = ({ error, onRetry }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        {onRetry && (
            <button 
                onClick={onRetry}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
                Retry
            </button>
        )}
    </div>
)
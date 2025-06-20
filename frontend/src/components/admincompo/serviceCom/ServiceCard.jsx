import { StatusBadge } from "../categoryCom/StatusBadge"
import { ActionButton } from "../categoryCom/ActionButton"
import { Edit2, Eye, EyeOff, AlertTriangle} from 'lucide-react'


export const ServiceCard = ({ service, onEdit, onToggleBlock, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
            {service.image ? (
                <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-gray-500">No Image</span>
            )}
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                <StatusBadge isBlocked={service.is_blocked} />
            </div>
            <p className="text-sm text-gray-600 mb-2">
                Category: {service.category?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
                Price: ₹{service.price}
            </p>
            <p className="text-sm text-gray-600 mb-3">
                Duration: {service.duration_minutes} mins
            </p>
            {service.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                </p>
            )}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <ActionButton
                        onClick={() => onEdit(service)}
                        icon={Edit2}
                        title="Edit"
                        variant="primary"
                    />
                    <ActionButton
                        onClick={() => onToggleBlock(service)}
                        icon={service.is_blocked ? Eye : EyeOff}
                        title={service.is_blocked ? 'Unblock' : 'Block'}
                        variant={service.is_blocked ? 'success' : 'warning'}
                    />
                    <ActionButton
                        onClick={() => onDelete(service)}
                        icon={AlertTriangle}
                        title="Delete"
                        variant="danger"
                    />
                </div>
            </div>
        </div>
    </div>
)
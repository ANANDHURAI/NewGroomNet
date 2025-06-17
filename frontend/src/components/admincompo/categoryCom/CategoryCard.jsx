import { ActionButton } from "./ActionButton"
import {StatusBadge} from './StatusBadge'
import { Edit2, Eye, EyeOff, Trash2 } from 'lucide-react'

export const CategoryCard = ({ category, onEdit, onToggleBlock, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
            {category.image ? (
                <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-gray-500">No Image</span>
            )}
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <StatusBadge isBlocked={category.is_blocked} />
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <ActionButton
                        onClick={() => onEdit(category)}
                        icon={Edit2}
                        title="Edit"
                        variant="primary"
                    />
                    <ActionButton
                        onClick={() => onToggleBlock(category)}
                        icon={category.is_blocked ? Eye : EyeOff}
                        title={category.is_blocked ? 'Unblock' : 'Block'}
                        variant={category.is_blocked ? 'success' : 'warning'}
                    />
                    <ActionButton
                        onClick={() => onDelete(category)}
                        icon={Trash2}
                        title="Delete"
                        variant="danger"
                    />
                </div>
            </div>
        </div>
    </div>
)
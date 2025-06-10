import { AlertTriangle } from 'lucide-react'
import { Modal } from '../categoryCom/Modal'


export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, serviceName }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
        <div className="text-center">
            <div className="flex justify-center mb-4">
                <AlertTriangle className="text-red-500" size={48} />
            </div>
            <p className="text-gray-700 mb-6">
                Are you sure you want to delete the service "<strong>{serviceName}</strong>"? 
                This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
                <button
                    onClick={onConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition"
                >
                    Delete
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-medium transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    </Modal>
)
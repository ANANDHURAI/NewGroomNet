import { AlertTriangle } from 'lucide-react';
import { Modal } from '../categoryCom/Modal';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-red-600 hover:bg-red-700", 
  icon = <AlertTriangle className="text-red-500" size={48} />,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onConfirm}
          className={`${confirmColor} text-white px-4 py-2 rounded-md font-medium transition`}
        >
          {confirmText}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-medium transition"
        >
          {cancelText}
        </button>
      </div>
    </div>
  </Modal>
);

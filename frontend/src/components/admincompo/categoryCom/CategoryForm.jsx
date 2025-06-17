export const CategoryForm = ({ formData, onFormChange, onSubmit, onCancel, isEditing, error }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5">

            {error && (
                <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        onFormChange({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                    Category Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        onFormChange({ ...formData, image: e.target.files[0] })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Must upload an image for this category
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition"
                >
                    {isEditing ? 'Update Category' : 'Create Category'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md font-medium transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

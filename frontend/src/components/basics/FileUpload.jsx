import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

function FileUpload({ 
  id, 
  file, 
  onChange, 
  accept, 
  icon: Icon, 
  title, 
  description, 
  error,
  showPreview = false 
}) {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    onChange(selectedFile);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="text-center mb-4">
        {showPreview && file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-12 h-12 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <Icon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className="block w-full p-4 border-2 border-dashed border-purple-300 rounded-lg text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          {file ? (
            <div className="flex items-center justify-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              {file.name}
            </div>
          ) : (
            <div className="text-gray-500">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              Click to upload {title.toLowerCase()}
            </div>
          )}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default FileUpload;
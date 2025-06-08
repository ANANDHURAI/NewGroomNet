import React from 'react';

export const ProfileImageUpload = ({ currentImage, onImageChange, isEdit }) => {
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        e.target.value = '';
    };

    const getImageSrc = () => {
        if (!currentImage) return null;
        
       
        if (currentImage instanceof File) {
            return URL.createObjectURL(currentImage);
        }
        
       
        if (typeof currentImage === 'string') {
            return currentImage;
        }
        
        return null;
    };

    const imageSrc = getImageSrc();

    return (
        <div className="relative">
            {imageSrc ? (
                <img 
                    src={imageSrc}
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    onError={(e) => {
                        console.error('Image failed to load:', e);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            
            
            <div 
                className={`w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ${imageSrc ? 'hidden' : 'flex'}`}
            >
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
            
            {isEdit && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
};
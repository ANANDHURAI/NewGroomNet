import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';
import ServiceCount from '../../components/basics/ServiceCount';
import CategoryCard from '../../components/barbercompo/CategoryCard';


function BookServices() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/barbersite/barber-services/categories/');
      setCategories(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleProceed = () => {
    if (selectedCategory) {
      navigate(`/barber/select-service/${selectedCategory.id}`, {
        state: { category: selectedCategory }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <BarberSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BarberSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Service Category</h1>
              <p className="text-gray-600">Choose a category to view available services</p>
            </div>
            <ServiceCount />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onSelect={handleCategorySelect}
                    isSelected={selectedCategory?.id === category.id}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button 
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                    selectedCategory 
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer transform hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedCategory}
                  onClick={handleProceed}
                >
                  {selectedCategory ? `View ${selectedCategory.name} Services` : 'Select a Category'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Categories Available</h3>
              <p className="text-gray-500">Please contact admin to add service categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookServices;
import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="mb-6">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === tab.id 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="bg-gray-100 text-gray-900 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default TabNavigation;
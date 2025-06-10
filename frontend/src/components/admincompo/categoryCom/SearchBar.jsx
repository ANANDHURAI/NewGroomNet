import {Search } from 'lucide-react'
export const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => (
    <div className="mb-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-96 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    </div>
)
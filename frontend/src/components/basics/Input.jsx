import React from 'react'

function Input({ value, onChange, type = "text", placeholder, name, required = false ,autoComplete = "off"}) {
  return (
    <div className="mb-4">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default Input
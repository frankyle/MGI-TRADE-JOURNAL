import React from 'react';

const ImageUploadField = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col items-center border p-2 rounded-md bg-gray-50">
      <label className="text-sm font-semibold mb-1">{label}</label>
      {value && (
        <img
          src={value}
          alt={label}
          className="w-20 h-20 object-cover rounded mb-2 border"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="w-full text-sm"
      />
    </div>
  );
};

export default ImageUploadField;

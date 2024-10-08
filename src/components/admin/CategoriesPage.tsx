import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Edit, X } from 'lucide-react';
import { Category } from '../../types';

const CategoriesPage: React.FC = () => {
  const { categories, addCategory, removeCategory, updateCategory } = useAppContext();
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (newCategory.name) {
      addCategory({ ...newCategory, id: Date.now().toString() });
      setNewCategory({ name: '' });
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={handleAddCategory} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full">
          Add Category
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Category List</h3>
        {categories.map((category: Category) => (
          <div key={category.id} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100 rounded">
            <span>{category.name}</span>
            <div>
              <button onClick={() => setEditingCategory(category)} className="text-blue-500 hover:text-blue-700 mr-2">
                <Edit size={18} />
              </button>
              <button onClick={() => removeCategory(category.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Category</h2>
              <button onClick={() => setEditingCategory(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <button onClick={handleUpdateCategory} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
              Update Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
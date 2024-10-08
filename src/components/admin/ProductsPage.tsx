import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Trash2, Edit, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Product, ProductVariation } from '../../types';

const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    removeProduct,
    addProductVariation,
    removeProductVariation,
    updateProductVariation,
  } = useAppContext();

  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '', hasVariations: false, stock: 0 });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newVariation, setNewVariation] = useState({ name: '', stock: 0 });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.categoryId) {
      addProduct({
        ...newProduct,
        id: Date.now().toString(),
        price: parseFloat(newProduct.price),
        variations: newProduct.hasVariations ? [] : undefined,
        stock: newProduct.hasVariations ? undefined : newProduct.stock
      });
      setNewProduct({ name: '', price: '', categoryId: '', hasVariations: false, stock: 0 });
    }
  };

  const handleToggleVariations = () => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        variations: editingProduct.variations ? undefined : [],
        stock: editingProduct.variations ? undefined : 0
      };
      updateProduct(updatedProduct);
      setEditingProduct(updatedProduct);
    }
  };

  const handleAddVariation = () => {
    if (editingProduct && newVariation.name) {
      const newVariationWithId = {
        id: Date.now().toString(),
        name: newVariation.name,
        stock: newVariation.stock,
      };
      addProductVariation(editingProduct.id, newVariationWithId);
      
      setEditingProduct({
        ...editingProduct,
        variations: [...(editingProduct.variations || []), newVariationWithId]
      });
      
      setNewVariation({ name: '', stock: 0 });
    }
  };

  const handleUpdateVariationStock = (productId: string, variationId: string, newStock: number) => {
    const product = products.find(p => p.id === productId);
    const variation = product?.variations?.find(v => v.id === variationId);
    if (product && variation) {
      const updatedVariation = { ...variation, stock: newStock };
      updateProductVariation(productId, updatedVariation);
      
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct({
          ...editingProduct,
          variations: editingProduct.variations?.map(v => 
            v.id === variationId ? updatedVariation : v
          )
        });
      }
    }
  };

  const handleRemoveVariation = (productId: string, variationId: string) => {
    removeProductVariation(productId, variationId);
    
    if (editingProduct && editingProduct.id === productId) {
      setEditingProduct({
        ...editingProduct,
        variations: editingProduct.variations?.filter(v => v.id !== variationId)
      });
    }
  };

  const getTotalStock = (product: Product) => {
    return product.variations
      ? product.variations.reduce((total, variation) => total + variation.stock, 0)
      : product.stock || 0;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <div className="mb-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
        <select
          value={newProduct.categoryId}
          onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="hasVariations"
            checked={newProduct.hasVariations}
            onChange={(e) => setNewProduct({ ...newProduct, hasVariations: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="hasVariations">Has Variations</label>
        </div>
        {!newProduct.hasVariations && (
          <div className="mb-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="stock"
              min="0"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        )}
        <button onClick={handleAddProduct} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
          Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Product List</h3>
        {products.map(product => (
          <div key={product.id} className="mb-4 border-b pb-2">
            <div className="flex justify-between items-center mb-2">
              <span>
                {product.name} - ${product.price.toFixed(2)}
                <span className="ml-2 text-sm text-gray-600">
                  (Total Stock: {getTotalStock(product)})
                </span>
              </span>
              <div>
                <button onClick={() => setEditingProduct(product)} className="text-blue-500 hover:text-blue-700 mr-2">
                  <Edit size={18} />
                </button>
                <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Edit Product: {editingProduct.name}
                <span className="ml-2 text-sm text-gray-600">
                  (Total Stock: {getTotalStock(editingProduct)})
                </span>
              </h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="editPrice" className="block text-sm font-medium text-gray-700">Price ($)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="editPrice"
                  step="0.01"
                  min="0"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="editCategory"
                value={editingProduct.categoryId}
                onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-2">Variations:</span>
              <button
                onClick={handleToggleVariations}
                className="flex items-center"
              >
                {editingProduct.variations ? (
                  <ToggleRight className="text-blue-500" size={24} />
                ) : (
                  <ToggleLeft className="text-gray-400" size={24} />
                )}
                <span className="ml-2">{editingProduct.variations ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
            {editingProduct.variations ? (
              <>
                <h3 className="text-lg font-semibold mb-2">Variations</h3>
                <table className="w-full mb-4">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left">Stock</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingProduct.variations.map(variation => (
                      <tr key={variation.id}>
                        <td>{variation.name}</td>
                        <td>
                          <input
                            type="number"
                            value={variation.stock}
                            onChange={(e) => handleUpdateVariationStock(editingProduct.id, variation.id, parseInt(e.target.value))}
                            className="w-20 p-1 border rounded"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemoveVariation(editingProduct.id, variation.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Add Variation</h4>
                  <input
                    type="text"
                    placeholder="Variation Name"
                    value={newVariation.name}
                    onChange={(e) => setNewVariation({ ...newVariation, name: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <div className="mb-2">
                    <label htmlFor="variationStock" className="block text-sm font-medium text-gray-700">Initial Stock</label>
                    <input
                      type="number"
                      id="variationStock"
                      min="0"
                      value={newVariation.stock}
                      onChange={(e) => setNewVariation({ ...newVariation, stock: parseInt(e.target.value) })}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <button onClick={handleAddVariation} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full flex items-center justify-center">
                    <Plus size={18} className="mr-2" />
                    Add Variation
                  </button>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="editStock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  id="editStock"
                  min="0"
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
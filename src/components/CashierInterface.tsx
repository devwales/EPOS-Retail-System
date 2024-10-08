import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, Trash2, Search, X, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Category, BasketItem, ProductVariation } from '../types';

const CashierInterface: React.FC = () => {
  const {
    products,
    categories,
    basket,
    addToBasket,
    removeFromBasket,
    clearBasket,
    checkout,
    paymentMethods,
    currency
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [changeDue, setChangeDue] = useState(0);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [lastSale, setLastSale] = useState<{
    items: BasketItem[];
    total: number;
    paymentMethod: string;
    amountPaid: number;
    transactionId: string;
  } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || product.categoryId === selectedCategory)
  );

  const totalAmount = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProductClick = (product: Product) => {
    if (product.variations && product.variations.length > 0) {
      setSelectedProduct(product);
    } else {
      addToBasket(product);
    }
  };

  const handleVariationSelect = (variation: ProductVariation) => {
    if (selectedProduct) {
      addToBasket(selectedProduct, variation.id);
      setSelectedProduct(null);
    }
  };

  const handleRemoveFromBasket = (itemId: string) => {
    removeFromBasket(itemId);
  };

  const handleCheckout = () => {
    if (basket.length > 0) {
      setShowPaymentModal(true);
    }
  };

  const handleCashPayment = () => {
    const cashAmountNum = parseFloat(cashAmount);
    const change = cashAmountNum > totalAmount ? cashAmountNum - totalAmount : 0;
    setChangeDue(change);
    const transactionId = checkout('Cash');
    setLastSale({
      items: [...basket],
      total: totalAmount,
      paymentMethod: 'Cash',
      amountPaid: cashAmountNum || totalAmount,
      transactionId,
    });
    setShowPaymentModal(false);
    setReceiptVisible(true);
    setCashAmount('');
  };

  const handleCardPayment = () => {
    const transactionId = checkout('Card');
    setLastSale({
      items: [...basket],
      total: totalAmount,
      paymentMethod: 'Card',
      amountPaid: totalAmount,
      transactionId,
    });
    setShowPaymentModal(false);
    setReceiptVisible(true);
  };

  const closeReceipt = () => {
    setReceiptVisible(false);
    setLastSale(null);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const updatedBasket = basket.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    clearBasket();
    updatedBasket.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        for (let i = 0; i < item.quantity; i++) {
          addToBasket(product, item.variationId);
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Product Catalog */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
              onClick={() => handleProductClick(product)}
            >
              <h3 className="font-bold">{product.name}</h3>
              <p>{currency}{product.price.toFixed(2)}</p>
              {product.variations && product.variations.length > 0 && (
                <p className="text-sm text-gray-500">Has variations</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Basket and Checkout */}
      <div className="w-1/3 bg-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Basket</h2>
        {basket.length === 0 ? (
          <p>No items in basket</p>
        ) : (
          <>
            {basket.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>
                  {item.name} {item.variationId && `(${item.variationId})`}
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {editingQuantity === item.id ? (
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      onBlur={() => setEditingQuantity(null)}
                      className="w-12 text-center border rounded"
                      min="1"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingQuantity(item.id)}
                      className="cursor-pointer"
                    >
                      {item.quantity}
                    </span>
                  )}
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className="ml-2">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveFromBasket(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <p className="font-bold">Total: {currency}{totalAmount.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Variation Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Select Variation</h2>
            <p className="mb-4">{selectedProduct.name}</p>
            <div className="grid grid-cols-2 gap-4">
              {selectedProduct.variations?.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => handleVariationSelect(variation)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  {variation.name} (Stock: {variation.stock})
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded mt-4 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>
            <p className="mb-4">Total: {currency}{totalAmount.toFixed(2)}</p>
            <div className="mb-4">
              <input
                type="number"
                placeholder="Cash amount (optional)"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleCashPayment}
                className="w-full bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600"
              >
                Pay with Cash
              </button>
            </div>
            <button
              onClick={handleCardPayment}
              className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
            >
              Pay with Card
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded mt-2 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptVisible && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Receipt</h2>
            <p>Transaction ID: {lastSale.transactionId}</p>
            <p>Date: {new Date().toLocaleString()}</p>
            <hr className="my-2" />
            {lastSale.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} {item.variationId && `(${item.variationId})`} x{item.quantity}</span>
                <span>{currency}{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{currency}{lastSale.total.toFixed(2)}</span>
            </div>
            <p>Payment Method: {lastSale.paymentMethod}</p>
            {lastSale.paymentMethod === 'Cash' && (
              <>
                <p>Amount Paid: {currency}{lastSale.amountPaid.toFixed(2)}</p>
                {lastSale.amountPaid > lastSale.total && (
                  <p>Change: {currency}{(lastSale.amountPaid - lastSale.total).toFixed(2)}</p>
                )}
              </>
            )}
            <button
              onClick={closeReceipt}
              className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierInterface;
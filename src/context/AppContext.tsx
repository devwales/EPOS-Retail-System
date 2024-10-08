import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Category, BasketItem, Sale, PaymentMethod, ProductVariation } from '../types';

interface AppContextType {
  products: Product[];
  categories: Category[];
  basket: BasketItem[];
  sales: Sale[];
  paymentMethods: PaymentMethod[];
  siteName: string;
  currency: string;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
  addToBasket: (product: Product, variationId?: string) => void;
  removeFromBasket: (itemId: string) => void;
  clearBasket: () => void;
  checkout: (paymentMethod: string) => string;
  refundSale: (saleId: string, reason: string) => void;
  updateSiteName: (name: string) => void;
  updateCurrency: (newCurrency: string) => void;
  addProductVariation: (productId: string, variation: ProductVariation) => void;
  removeProductVariation: (productId: string, variationId: string) => void;
  updateProductVariation: (productId: string, variation: ProductVariation) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Product 1', price: 10, categoryId: '1' },
    { id: '2', name: 'Product 2', price: 20, categoryId: '2' },
  ]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' },
  ]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'cash', name: 'Cash', enabled: true },
    { id: 'card', name: 'Card', enabled: true },
  ]);
  const [siteName, setSiteName] = useState('EPOS System');
  const [currency, setCurrency] = useState('$');

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prevProducts => prevProducts.map(p => p.id === product.id ? product : p));
  };

  const removeProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  const addCategory = (category: Category) => {
    setCategories(prevCategories => [...prevCategories, category]);
  };

  const updateCategory = (category: Category) => {
    setCategories(prevCategories => prevCategories.map(c => c.id === category.id ? category : c));
  };

  const removeCategory = (categoryId: string) => {
    setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
  };

  const addToBasket = (product: Product, variationId?: string) => {
    setBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.id === product.id && item.variationId === variationId);
      if (existingItem) {
        return prevBasket.map(item =>
          item.id === product.id && item.variationId === variationId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevBasket, { ...product, quantity: 1, variationId }];
      }
    });
  };

  const removeFromBasket = (itemId: string) => {
    setBasket(prevBasket => prevBasket.filter(item => item.id !== itemId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const checkout = (paymentMethod: string): string => {
    const transactionId = Date.now().toString();
    const newSale: Sale = {
      id: transactionId,
      transactionId,
      items: [...basket],
      total: basket.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      date: new Date(),
    };
    setSales(prevSales => [...prevSales, newSale]);
    clearBasket();
    return transactionId;
  };

  const refundSale = (saleId: string, reason: string) => {
    setSales(prevSales => prevSales.map(sale =>
      sale.id === saleId ? { ...sale, refunded: true, refundReason: reason } : sale
    ));
  };

  const updateSiteName = (name: string) => {
    setSiteName(name);
  };

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  const addProductVariation = (productId: string, variation: ProductVariation) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === productId
        ? { ...product, variations: [...(product.variations || []), variation] }
        : product
    ));
  };

  const removeProductVariation = (productId: string, variationId: string) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === productId
        ? { ...product, variations: product.variations?.filter(v => v.id !== variationId) }
        : product
    ));
  };

  const updateProductVariation = (productId: string, variation: ProductVariation) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === productId
        ? {
            ...product,
            variations: product.variations?.map(v => v.id === variation.id ? variation : v)
          }
        : product
    ));
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prevMethods => [...prevMethods, method]);
  };

  const removePaymentMethod = (methodId: string) => {
    setPaymentMethods(prevMethods => prevMethods.filter(m => m.id !== methodId));
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prevMethods => prevMethods.map(m => m.id === method.id ? method : m));
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      basket,
      sales,
      paymentMethods,
      siteName,
      currency,
      addProduct,
      updateProduct,
      removeProduct,
      addCategory,
      updateCategory,
      removeCategory,
      addToBasket,
      removeFromBasket,
      clearBasket,
      checkout,
      refundSale,
      updateSiteName,
      updateCurrency,
      addProductVariation,
      removeProductVariation,
      updateProductVariation,
      addPaymentMethod,
      removePaymentMethod,
      updatePaymentMethod,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
import React from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  variations?: ProductVariation[];
  stock?: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variationId?: string;
}

export interface Sale {
  id: string;
  transactionId: string;
  items: BasketItem[];
  total: number;
  paymentMethod: string;
  date: Date;
  refunded?: boolean;
  refundReason?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}
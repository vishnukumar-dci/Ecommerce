export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type Product = {
  id: number;
  product_name: string;
  descriptions: string;
  amount: number;
  image_path: string;
};

export type User = {
  name: string;
  email: string;
  role: string;
};

export type CartItem = {
  id: number;
  product_id: number;
  qty: number;
  image_path: string;
  product_name: string;
  amount: number;
};

export type Order = {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  order_id: number;
  product_id: number;
  qty: number;
  amount: number;
};

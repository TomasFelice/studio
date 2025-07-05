export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Completado' | 'Cancelado';
  createdAt: Date;
  isManual: boolean;
};

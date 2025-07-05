import type { Product, Category, Order, OrderItem } from './types';

// Mock Data
export const categories: Category[] = [
  { id: '1', name: 'Mates de Calabaza', slug: 'mates-calabaza' },
  { id: '2', name: 'Mates de Algarrobo', slug: 'mates-algarrobo' },
  { id: '3', name: 'Mates de Acero', slug: 'mates-acero' },
  { id: '4', name: 'Bombillas', slug: 'bombillas' },
  { id: '5', name: 'Termos', slug: 'termos' },
  { id: '6', name: 'Yerberas', slug: 'yerberas' },
  { id: '7', name: 'Yerbas', slug: 'yerbas' },
];

let products: Product[] = [
  { id: '1', name: 'Mate Imperial de Lujo', description: 'Experimenta la tradición con nuestro mate imperial, hecho a mano con virola de alpaca y cuero genuino. Cada pieza es única.', price: 8500, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Mates de Calabaza', featured: true },
  { id: '2', name: 'Mate Camionero Clásico', description: 'El compañero ideal para tus viajes. Mate de calabaza forrado en cuero, resistente y de gran capacidad.', price: 6200, images: ['https://placehold.co/600x600.png'], category: 'Mates de Calabaza', featured: false },
  { id: '3', name: 'Mate de Algarrobo Torneado', description: 'Diseño elegante y madera noble. El algarrobo le da un sabor especial a tus mates.', price: 4800, images: ['https://placehold.co/600x600.png'], category: 'Mates de Algarrobo', featured: true },
  { id: '4', name: 'Mate de Acero Inoxidable', description: 'Moderno, práctico y eterno. No necesita curado y es fácil de limpiar.', price: 5500, images: ['https://placehold.co/600x600.png'], category: 'Mates de Acero', featured: false },
  { id: '5', name: 'Bombilla Pico de Loro', description: 'Bombilla de alpaca con filtro de alta calidad, ideal para todo tipo de yerba.', price: 3200, images: ['https://placehold.co/600x600.png'], category: 'Bombillas', featured: true },
  { id: '6', name: 'Termo Stanley 1L', description: 'El clásico. Mantiene la temperatura perfecta durante horas. Compañero infaltable.', price: 25000, images: ['https://placehold.co/600x600.png'], category: 'Termos', featured: false },
  { id: '7', name: 'Yerbera de Cuero', description: 'Practicidad y estilo para llevar tu yerba a todos lados. Con pico vertedor.', price: 4100, images: ['https://placehold.co/600x600.png'], category: 'Yerberas', featured: false },
  { id: '8', name: 'Yerba Mate Canarias 1kg', description: 'La preferida de los uruguayos, sin palo y con un sabor intenso y duradero.', price: 3800, images: ['https://placehold.co/600x600.png'], category: 'Yerbas', featured: false },
  { id: '9', name: 'Mate Torpedo Premium', description: 'Forma ergonómica y cuero de alta calidad. Un mate para disfrutar todos los días.', price: 7900, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Mates de Calabaza', featured: true },
];

let orders: Order[] = [
    {
        id: '1001',
        customerName: 'Juan Perez',
        customerWhatsapp: '+5491122334455',
        customerAddress: 'Av. Corrientes 1234, CABA',
        items: [
            { productId: '1', productName: 'Mate Imperial de Lujo', quantity: 1, price: 8500 },
            { productId: '5', productName: 'Bombilla Pico de Loro', quantity: 1, price: 3200 },
        ],
        total: 11700,
        status: 'Pendiente',
        createdAt: new Date(),
        isManual: false,
    }
];

// Product Functions
export const getProducts = async (category?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  if (category) {
    const categoryName = categories.find(c => c.slug === category)?.name;
    return products.filter(p => p.category === categoryName);
  }
  return products;
};

export const getFeaturedProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.filter(p => p.featured);
}

export const getProductById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return products.find(p => p.id === id) || null;
};

export const createProduct = async (productData: Omit<Product, 'id' | 'featured'> & {featured?: boolean}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct: Product = {
        ...productData,
        id: (Math.max(...products.map(p => parseInt(p.id))) + 1).toString(),
        featured: productData.featured || false,
    };
    products.push(newProduct);
    return newProduct;
}

export const updateProduct = async (id: string, productData: Partial<Product>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        return products[index];
    }
    return null;
}

export const deleteProduct = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        return true;
    }
    return false;
}

// Order Functions
export const getOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getOrderById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return orders.find(o => o.id === id) || null;
};

export const createOrder = async (orderData: {
  customerName: string;
  customerWhatsapp: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  isManual?: boolean;
}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newOrder: Order = {
    id: (Math.max(0, ...orders.map(o => parseInt(o.id))) + 1).toString(),
    ...orderData,
    status: 'Pendiente',
    createdAt: new Date(),
    isManual: orderData.isManual || false,
  };
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index].status = status;
        return orders[index];
    }
    return null;
}

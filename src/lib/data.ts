import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import type { Product, Order, OrderItem } from './types';
import { categories } from './constants';

// Firebase Admin SDK Configuration
try {
    if (!getApps().length) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
        initializeApp({
            credential: cert(serviceAccount)
        });
    }
} catch (error: any) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message || String(error));
}

const db = getApps().length ? getFirestore() : null;

// Product Functions
export const getProducts = async (category?: string): Promise<Product[]> => {
    if (!db) return [];
    try {
        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection('products');
        if (category) {
            const categoryName = categories.find(c => c.slug === category)?.name;
            if (categoryName) {
                query = query.where('category', '==', categoryName);
            }
        }
        const snapshot = await query.get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error("Error getting products:", error instanceof Error ? error.message : String(error));
        return [];
    }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
    if (!db) return [];
    try {
        const snapshot = await db.collection('products').where('featured', '==', true).get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error("Error getting featured products:", error instanceof Error ? error.message : String(error));
        return [];
    }
}

export const getProductById = async (id: string): Promise<Product | null> => {
    if (!db) return null;
    try {
        const doc = await db.collection('products').doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() } as Product;
    } catch (error) {
        console.error(`Error getting product by id (${id}):`, error instanceof Error ? error.message : String(error));
        return null;
    }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    if (!db) throw new Error("Database not available");
    const docRef = await db.collection('products').add(productData);
    return { id: docRef.id, ...productData };
}

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    if (!db) return null;
    try {
        const docRef = db.collection('products').doc(id);
        await docRef.update(productData);
        const updatedDoc = await docRef.get();
        return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    } catch(e) {
        console.error(`Error updating product (${id}):`, e instanceof Error ? e.message : String(e));
        return null;
    }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
    if (!db) return false;
    try {
        await db.collection('products').doc(id).delete();
        return true;
    } catch(e) {
        console.error(`Error deleting product (${id}):`, e instanceof Error ? e.message : String(e));
        return false;
    }
}

// Order Functions
export const getOrders = async (): Promise<Order[]> => {
    if (!db) return [];
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp).toDate(),
            } as Order;
        });
    } catch (error) {
        console.error("Error getting orders:", error instanceof Error ? error.message : String(error));
        return [];
    }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
    if (!db) return null;
    try {
        const doc = await db.collection('orders').doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data()!;
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Order;
    } catch (error) {
        console.error(`Error getting order by id (${id}):`, error instanceof Error ? error.message : String(error));
        return null;
    }
};

export const createOrder = async (orderData: {
  customerName: string;
  customerWhatsapp: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  isManual?: boolean;
}): Promise<Order> => {
  if (!db) {
    console.error("Firestore database is not available to create order.");
    throw new Error("La conexión con la base de datos no está disponible.");
  }

  try {
    const newOrderData: Omit<Order, 'id'> = {
      ...orderData,
      status: 'Pendiente',
      createdAt: new Date(),
      isManual: orderData.isManual || false,
    };

    const docRef = await db.collection('orders').add({
        ...newOrderData,
        createdAt: Timestamp.fromDate(newOrderData.createdAt)
    });

    return { ...newOrderData, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating order in Firestore:", error.message || error);
    throw new Error("No se pudo crear el pedido en la base de datos.");
  }
};


export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
    if (!db) return null;
    try {
        const docRef = db.collection('orders').doc(id);
        await docRef.update({ status });
        const order = await getOrderById(id);
        return order;
    } catch (error) {
        console.error(`Error updating order status (${id}):`, error instanceof Error ? error.message : String(error));
        return null;
    }
}

"use server";

import { z } from 'zod';
import { createOrder, getProductById, createProduct, updateProduct } from './data';
import type { CartItem, Order, OrderItem, Product } from './types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { redirect } from 'next/navigation';

// AUTH ACTIONS
export async function createSession(idToken: string) {
    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
        cookies().set("session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            path: "/",
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to create session:", error);
        return { success: false, error: "Failed to create session." };
    }
}

export async function removeSession() {
    cookies().delete("session");
    redirect("/login");
}


// ORDER ACTIONS
const orderSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  whatsapp: z.string().min(10, "El número de WhatsApp no es válido."),
  address: z.string().min(5, "La dirección es requerida."),
  cart: z.string(),
});

export type State = {
  errors?: {
    name?: string[];
    whatsapp?: string[];
    address?: string[];
    cart?: string[];
  };
  message?: string | null;
  success?: boolean;
  orderId?: string;
};

async function sendWhatsAppNotification(order: Order) {
    const messageItems = order.items.map(item => `- ${item.quantity}x ${item.productName}`).join('\n');
    const message = `
📦 ¡Nuevo pedido en PuraBombilla! 📦
*N° de Pedido:* ${order.id}
*Fecha:* ${new Date(order.createdAt).toLocaleString('es-AR')}
*Cliente:*
- *Nombre:* ${order.customerName}
- *WhatsApp:* ${order.customerWhatsapp}
*Detalle:*
${messageItems}
*Total:* $${order.total.toLocaleString('es-AR')}
*Dirección/Notas:*
${order.customerAddress}
*Origen:* ${order.isManual ? 'Manual' : 'Tienda Online'}
    `.trim();

    console.log("--- START WHATSAPP NOTIFICATION ---");
    console.log(`To: PuraBombilla Business Number`);
    console.log(message);
    console.log("--- END WHATSAPP NOTIFICATION ---");
}


export async function createOrderAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = orderSchema.safeParse({
    name: formData.get('name'),
    whatsapp: formData.get('whatsapp'),
    address: formData.get('address'),
    cart: formData.get('cart'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el pedido.',
    };
  }
  
  const { name, whatsapp, address, cart } = validatedFields.data;
  
  let cartItems: CartItem[] = [];
  try {
      cartItems = JSON.parse(cart);
      if(!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error("Cart is empty or invalid");
      }
  } catch (error) {
      return { message: "El carrito está vacío o tiene un formato inválido." };
  }

  try {
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of cartItems) {
        const product = await getProductById(item.id);
        if(!product) {
            return { message: `El producto "${item.name}" ya no está disponible.` };
        }
        orderItems.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            price: product.price,
        });
        total += product.price * item.quantity;
    }

    const newOrder = await createOrder({
        customerName: name,
        customerWhatsapp: whatsapp,
        customerAddress: address,
        items: orderItems,
        total,
        isManual: false,
    });
    
    await sendWhatsAppNotification(newOrder);

    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return { success: true, orderId: newOrder.id, message: null, errors: {} };

  } catch (error) {
    console.error("Error creating order action:", error);
    return {
      message: 'Error en la base de datos: No se pudo crear el pedido.',
    };
  }
}

const manualOrderSchema = z.object({
  customerName: z.string().min(3, "El nombre es requerido."),
  customerWhatsapp: z.string().min(9, "El WhatsApp no es válido."),
  customerAddress: z.string().min(5, "La dirección es requerida."),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    price: z.coerce.number(),
  })).min(1, "Debes agregar al menos un producto al pedido."),
});

export async function createManualOrderAction(data: z.infer<typeof manualOrderSchema>) {
    try {
        const total = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        const newOrder = await createOrder({
            customerName: data.customerName,
            customerWhatsapp: data.customerWhatsapp,
            customerAddress: data.customerAddress,
            items: data.items,
            total: total,
            isManual: true,
        });

        await sendWhatsAppNotification(newOrder);
        
        revalidatePath('/admin/orders');
        revalidatePath('/admin');
        return { success: true, message: "Pedido manual creado con éxito." };
    } catch (error) {
        return { success: false, message: "Error al crear el pedido manual." };
    }
}


// PRODUCT ACTIONS
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
  category: z.string({ required_error: "Debes seleccionar una categoría." }),
  images: z.string().min(1, "Debes agregar al menos una URL de imagen."),
  featured: z.boolean().default(false),
});


export async function createOrUpdateProductAction(data: z.infer<typeof productSchema>) {
    const validatedFields = productSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Datos inválidos.",
        };
    }
    const { id, ...productData } = validatedFields.data;
    const imagesArray = productData.images.split(',').map(url => url.trim()).filter(url => url);

    try {
        if (id) {
            await updateProduct(id, { ...productData, images: imagesArray });
        } else {
            await createProduct({ ...productData, images: imagesArray });
        }
        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error creating/updating product:", error);
        return { success: false, message: "No se pudo guardar el producto." };
    }
}

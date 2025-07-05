"use server";

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createOrder, getProductById } from './data';
import type { CartItem, OrderItem } from './types';

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
};

async function sendWhatsAppNotification(order: Awaited<ReturnType<typeof createOrder>>) {
    // This is a placeholder for the actual WhatsApp API integration.
    // In a real application, you would use Twilio, Meta API, etc.
    const messageItems = order.items.map(item => `- ${item.quantity}x ${item.productName}`).join('\n');

    const message = `
📦 ¡Nuevo pedido en PuraBombilla! 📦

*N° de Pedido:* ${order.id}
*Fecha:* ${order.createdAt.toLocaleString('es-AR')}

*Cliente:*
- *Nombre:* ${order.customerName}
- *WhatsApp:* ${order.customerWhatsapp}

*Detalle:*
${messageItems}

*Total:* $${order.total.toLocaleString('es-AR')}

*Dirección/Notas:*
${order.customerAddress}
    `.trim();

    console.log("--- START WHATSAPP NOTIFICATION ---");
    console.log(`To: PuraBombilla Business Number`);
    console.log(message);
    console.log("--- END WHATSAPP NOTIFICATION ---");

    // Here you would make the API call to your WhatsApp provider.
    // For example:
    // await fetch('https://api.whatsappprovider.com/v1/messages', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to: process.env.BUSINESS_WHATSAPP_NUMBER, text: message })
    // });
}


export async function createOrderAction(prevState: State, formData: FormData) {
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
            throw new Error(`Producto con ID ${item.id} no encontrado.`);
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
    });
    
    // Send notification
    await sendWhatsAppNotification(newOrder);

    // Redirect to confirmation page
    redirect(`/order-confirmation/${newOrder.id}`);

  } catch (error) {
    return {
      message: 'Error en la base de datos: No se pudo crear el pedido.',
    };
  }
}

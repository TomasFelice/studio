import { getOrderById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package } from 'lucide-react';
import Link from 'next/link';

type OrderConfirmationPageProps = {
  params: { id: string };
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-headline mt-4">¡Gracias por tu compra!</CardTitle>
          <p className="text-muted-foreground">Tu pedido ha sido recibido y lo estamos procesando.</p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-center">Recibirás una notificación por WhatsApp en breve para coordinar el pago y la entrega.</p>
          </div>
          <h3 className="font-semibold mb-4">Resumen del Pedido #{order.id}</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.quantity} x {item.productName}</span>
                <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${order.total.toLocaleString('es-AR')}</span>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="font-semibold mb-2">Información del Cliente</h4>
            <p className="text-sm text-muted-foreground"><strong>Nombre:</strong> {order.customerName}</p>
            <p className="text-sm text-muted-foreground"><strong>WhatsApp:</strong> {order.customerWhatsapp}</p>
            <p className="text-sm text-muted-foreground"><strong>Dirección:</strong> {order.customerAddress}</p>
          </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/products">
                    <Package className="mr-2 h-4 w-4" />
                    Seguir comprando
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

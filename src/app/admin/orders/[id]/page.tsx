import { getOrderById, updateOrderStatus } from "@/lib/data";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, User, MessageSquare, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }
  
  const getStatusVariant = (status: typeof order.status) => {
    switch (status) {
      case 'Pendiente': return 'default';
      case 'Procesando': return 'secondary';
      case 'Enviado': return 'outline';
      case 'Completado': return 'destructive';
      case 'Cancelado': return 'destructive';
      default: return 'default';
    }
  }

  async function changeStatus(formData: FormData) {
    'use server'
    const status = formData.get('status') as typeof order.status
    await updateOrderStatus(params.id, status)
    revalidatePath(`/admin/orders/${params.id}`)
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild>
        <Link href="/admin/orders"><ArrowLeft className="mr-2 h-4 w-4"/>Volver a Pedidos</Link>
      </Button>
      
      <div className="flex items-start justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Pedido #{order.id}</h1>
            <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString('es-AR')}</span>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </div>
        </div>
        <form action={changeStatus}>
            <div className="flex items-center gap-2">
                <Select name="status" defaultValue={order.status}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Procesando">Procesando</SelectItem>
                        <SelectItem value="Enviado">Enviado</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} x ${item.price.toLocaleString('es-AR')}</p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>${order.total.toLocaleString('es-AR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-1"/>
                <div>
                  <p className="font-semibold">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-1"/>
                <div>
                  <p className="font-semibold">{order.customerWhatsapp}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1"/>
                <div>
                  <p className="font-semibold leading-snug">{order.customerAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

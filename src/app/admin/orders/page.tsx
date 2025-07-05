import { getOrders } from "@/lib/data";
import { OrdersTable } from "./OrdersTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestión de Pedidos</h1>
            <p className="text-muted-foreground">Visualizá y administrá todos los pedidos.</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new"><PlusCircle className="mr-2 h-4 w-4" /> Crear Pedido Manual</Link>
        </Button>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}

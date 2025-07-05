import { getOrders, getProducts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, PlusCircle } from "lucide-react"
import Link from "next/link"
import { OrdersTable } from "./orders/OrdersTable"

export default async function AdminDashboard() {
  const orders = await getOrders()
  const products = await getProducts()
  
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <p className="text-muted-foreground">Una vista rápida de tu negocio.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild>
                <Link href="/admin/orders/new"><PlusCircle className="mr-2 h-4 w-4"/>Crear Pedido Manual</Link>
            </Button>
            <Button asChild variant="secondary">
                <Link href="/admin/products/new"><PlusCircle className="mr-2 h-4 w-4"/>Nuevo Producto</Link>
            </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Pedidos históricos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Productos activos en la tienda</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Pedidos Recientes</h2>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  )
}

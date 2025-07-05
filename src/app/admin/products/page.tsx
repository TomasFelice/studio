import { getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import ProductsTable from "./ProductsTable";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="space-y-8">
       <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestión de Productos</h1>
            <p className="text-muted-foreground">Agregá, editá o eliminá productos de tu tienda.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new"><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto</Link>
        </Button>
      </div>
      <ProductsTable products={products} />
    </div>
  )
}

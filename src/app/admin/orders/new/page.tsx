import { getProducts } from "@/lib/data";
import { ManualOrderForm } from "../ManualOrderForm";

export default async function NewManualOrderPage() {
    const products = await getProducts();
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Crear Pedido Manual</h1>
                <p className="text-muted-foreground">Ingresa los datos para crear un nuevo pedido manualmente.</p>
            </div>
            <ManualOrderForm products={products} />
        </div>
    )
}

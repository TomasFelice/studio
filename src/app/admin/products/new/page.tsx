import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Nuevo Producto</h1>
                <p className="text-muted-foreground">Completa los detalles para agregar un nuevo producto a la tienda.</p>
            </div>
            <ProductForm />
        </div>
    )
}

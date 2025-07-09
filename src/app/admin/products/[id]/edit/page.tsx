import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductForm } from "../../ProductForm";

type EditProductPageProps = {
  params: { id: string };
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Editar Producto</h1>
            <p className="text-muted-foreground">Actualiza los detalles del producto.</p>
        </div>
        <ProductForm product={product} />
    </div>
  )
}

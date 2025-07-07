import { getProducts } from '@/lib/data';
import { categories } from '@/lib/constants';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const selectedCategorySlug = searchParams?.category;
  const products = await getProducts(selectedCategorySlug);
  const selectedCategory = categories.find(c => c.slug === selectedCategorySlug);
  
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <h2 className="text-lg font-bold font-headline mb-4">Categorías</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/products"
                className={cn(
                    "font-medium text-muted-foreground hover:text-primary transition-colors",
                    !selectedCategorySlug && "text-primary font-semibold"
                )}>
                Todas
            </Link>
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                className={cn(
                    "font-medium text-muted-foreground hover:text-primary transition-colors",
                    selectedCategorySlug === category.slug && "text-primary font-semibold"
                )}>
                {category.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
            <h1 className="text-3xl font-bold font-headline mb-8">
                {selectedCategory ? selectedCategory.name : 'Todos los Productos'}
            </h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 border-dashed border-2 rounded-lg">
                    <p className="text-muted-foreground mb-4">No se encontraron productos en esta categoría.</p>
                    <Button asChild>
                        <Link href="/products">Ver todos los productos</Link>
                    </Button>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}

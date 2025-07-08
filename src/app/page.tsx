import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/data';
import { categories } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, CupSoda, ShoppingBasket, PlusCircle } from 'lucide-react';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Mates': <CupSoda className="h-8 w-8" />,
    'Bombillas': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pipe"><path d="M2 14h2"/><path d="M6 14h2"/><path d="M10 14h2"/><path d="M2 10h11a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h5"/><path d="M18 6a2 2 0 0 1 2 2v2"/></svg>,
    'Combos': <ShoppingBasket className="h-8 w-8" />,
    'Adicionales': <PlusCircle className="h-8 w-8" />,
  };
  
  return (
    <div>
      <section className="relative w-full h-[560px] flex items-center justify-center text-white">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/purabombilla-web.firebasestorage.app/o/static%2Fbanner.jpg?alt=media"
          alt="Banner de mates"
          fill
          className="object-cover -z-20"
          priority
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />
        <div className="container mx-auto text-center z-10">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">El Arte de un Buen Mate</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Descubrí nuestra selección de mates, bombillas y accesorios artesanales.
            Calidad y tradición en cada producto.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">Ver Productos <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">Navegá por Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link href={`/products?category=${category.slug}`} key={category.id}>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
                    <div className="text-primary">{categoryIcons[category.name] || <CupSoda className="h-8 w-8" />}</div>
                    <span className="font-semibold text-sm">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

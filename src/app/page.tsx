import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/data';
import { categories } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, CupSoda, Leaf, Package, FlaskConical } from 'lucide-react';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Mates de Calabaza': <CupSoda className="h-8 w-8" />,
    'Mates de Algarrobo': <CupSoda className="h-8 w-8" />,
    'Mates de Acero': <CupSoda className="h-8 w-8" />,
    'Bombillas': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pipe"><path d="M2 14h2"/><path d="M6 14h2"/><path d="M10 14h2"/><path d="M2 10h11a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h5"/><path d="M18 6a2 2 0 0 1 2 2v2"/></svg>,
    'Termos': <FlaskConical className="h-8 w-8" />,
    'Yerberas': <Package className="h-8 w-8" />,
    'Yerbas': <Leaf className="h-8 w-8" />,
  };
  
  return (
    <div>
      <section className="relative bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-accent">El Arte de un Buen Mate</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow">
        <CardHeader className="p-0 border-b">
          <div className="aspect-square relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="mate product"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-body font-semibold leading-tight">{product.name}</CardTitle>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
         <div className="w-full flex justify-between items-center">
           <p className="text-xl font-bold text-primary">${product.price.toLocaleString('es-AR')}</p>
           <Button variant="secondary" size="sm" asChild>
              <Link href={`/products/${product.id}`}>Ver detalle</Link>
           </Button>
         </div>
      </CardFooter>
    </Card>
  );
}

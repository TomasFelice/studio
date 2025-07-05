"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "¡Agregado!",
      description: `${quantity} x ${product.name} se agregó a tu carrito.`,
    });
    setQuantity(1); // Reset quantity
  };
  
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
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3">
         <p className="text-xl font-bold text-primary w-full">${product.price.toLocaleString('es-AR')}</p>
         <div className="w-full flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => {e.preventDefault(); setQuantity(q => Math.max(1, q - 1))}}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    value={quantity}
                    onClick={(e) => e.preventDefault()}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 h-8 text-center"
                    min="1"
                />
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => {e.preventDefault(); setQuantity(q => q + 1)}}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button variant="secondary" size="sm" onClick={(e) => {e.preventDefault(); handleAddToCart()}} className="flex-grow">
                <ShoppingCart/>
                Agregar
            </Button>
         </div>
      </CardFooter>
    </Card>
  );
}

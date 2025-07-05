"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProductById } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!params.id) {
        return;
    }
    const fetchProduct = async () => {
      setLoading(true);
      const fetchedProduct = await getProductById(params.id);
      setProduct(fetchedProduct);
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "¡Agregado!",
      description: `${quantity} x ${product.name} se agregó a tu carrito.`,
    });
  };

  return (
    <div className="container py-12">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4"/> Volver a productos</Link>
        </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                       <Image
                        src={img}
                        alt={`${product.name} - imagen ${index + 1}`}
                        width={600}
                        height={600}
                        className="rounded-lg object-cover"
                        data-ai-hint="mate product"
                        />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4"/>
            <CarouselNext className="right-4"/>
          </Carousel>
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mt-4 mb-6">${product.price.toLocaleString('es-AR')}</p>
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
                className="w-16 text-center"
                min="1"
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-grow">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function ProductDetailSkeleton() {
    return (
        <div className="container py-12">
             <Skeleton className="h-10 w-48 mb-4" />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div>
                    <Skeleton className="w-full aspect-square rounded-lg" />
                </div>
                <div>
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-10 w-1/3 mt-4 mb-6" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <div className="mt-8 flex items-center gap-4">
                        <Skeleton className="h-12 w-48" />
                        <Skeleton className="h-12 flex-grow" />
                    </div>
                </div>
            </div>
        </div>
    )
}

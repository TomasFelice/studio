"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createManualOrderAction } from '@/lib/actions';
import type { Product, OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';


const manualOrderSchema = z.object({
  customerName: z.string().min(3, "El nombre es requerido."),
  customerWhatsapp: z.string().min(9, "El WhatsApp no es válido."),
  customerAddress: z.string().min(5, "La dirección es requerida."),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    price: z.coerce.number(),
  })).min(1, "Debes agregar al menos un producto al pedido."),
});

type ManualOrderFormData = z.infer<typeof manualOrderSchema>;

export function ManualOrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const form = useForm<ManualOrderFormData>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      customerName: '',
      customerWhatsapp: '',
      customerAddress: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const total = fields.reduce((acc, item) => acc + item.price * item.quantity, 0);

  async function onSubmit(data: ManualOrderFormData) {
    setIsSubmitting(true);
    const result = await createManualOrderAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Pedido Creado",
        description: `El pedido manual ha sido creado exitosamente.`,
      });
      router.push('/admin/orders');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  }

  const handleAddProduct = (product: Product) => {
    // Check if product is already in the list
    if (fields.some(item => item.productId === product.id)) {
        toast({
            variant: "default",
            title: "Producto ya agregado",
            description: "Puedes modificar la cantidad en la tabla.",
        });
        return;
    }
    append({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
    });
    setPopoverOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Productos del Pedido</CardTitle>
                        <CardDescription>Agrega productos y define las cantidades.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {fields.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="w-[100px]">Cantidad</TableHead>
                                        <TableHead className="w-[120px] text-right">Precio</TableHead>
                                        <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>{field.productName}</TableCell>
                                            <TableCell>
                                                <Input type="number" min="1" {...form.register(`items.${index}.quantity`)} />
                                            </TableCell>
                                            <TableCell className="text-right">${field.price.toLocaleString('es-AR')}</TableCell>
                                            <TableCell className="text-right">${(field.price * form.watch(`items.${index}.quantity`)).toLocaleString('es-AR')}</TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {form.formState.errors.items && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.message}</p>}
                    </CardContent>
                    <CardFooter>
                         <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Agregar Producto</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar producto..." />
                                    <CommandList>
                                        <CommandEmpty>No se encontraron productos.</CommandEmpty>
                                        <CommandGroup>
                                            {products.map((product) => (
                                            <CommandItem
                                                key={product.id}
                                                value={product.name}
                                                onSelect={() => handleAddProduct(product)}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", fields.some(i => i.productId === product.id) ? "opacity-100" : "opacity-0")} />
                                                {product.name}
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </CardFooter>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nombre y Apellido</FormLabel>
                                <FormControl>
                                    <Input placeholder="Juan Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="customerWhatsapp"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Número de WhatsApp</FormLabel>
                                <FormControl>
                                    <Input placeholder="+54 9 11 1234 5678" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customerAddress"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Dirección / Indicaciones</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Av. Siempre Viva 742" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Resumen</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between font-bold text-lg">
                        <p>Total</p>
                        <p>${total.toLocaleString('es-AR')}</p>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Crear Pedido
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </form>
    </Form>
  )
}

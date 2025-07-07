"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateProductAction } from '@/lib/actions';
import { categories } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app as firebaseApp } from '@/lib/firebase/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
  category: z.string({ required_error: "Debes seleccionar una categoría." }),
  images: z.string().min(1, "Debes agregar al menos una URL de imagen."),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(product?.images || []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id || undefined,
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || '',
      images: product?.images.join(',\\n') || '',
      featured: product?.featured || false,
    },
  });

  async function onSubmit(data: ProductFormData) {
    setIsSubmitting(true);
    const result = await createOrUpdateProductAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: product ? "Producto Actualizado" : "Producto Creado",
        description: `El producto "${data.name}" ha sido guardado exitosamente.`,
      });
      router.push('/admin/products');
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setSelectedFiles(Array.from(e.target.files));
  }

  async function handleUpload() {
    if (!selectedFiles.length) return;
    setUploading(true);
    try {
      const storage = getStorage(firebaseApp);
      const urls: string[] = [];
      for (const file of selectedFiles) {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      setUploadedUrls(prev => [...prev, ...urls]);
      // Actualiza el campo del formulario con las nuevas URLs
      form.setValue('images', [...uploadedUrls, ...urls].join(','));
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      toast({
        variant: 'destructive',
        title: 'Error al subir imágenes',
        description: 'Verifica tu conexión o los permisos de Firebase Storage.'
      });
    } finally {
      setUploading(false);
      setSelectedFiles([]);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="grid gap-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Mate Imperial de Lujo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el producto..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="8500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Campo de imágenes: input file y previsualización */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imágenes</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                      <Button type="button" onClick={handleUpload} disabled={uploading || !selectedFiles.length}>
                        {uploading ? 'Subiendo...' : 'Subir Imágenes'}
                      </Button>
                      <Textarea
                        placeholder="https://..."
                        {...field}
                        value={uploadedUrls.join(',')}
                        onChange={e => {
                          field.onChange(e);
                          setUploadedUrls(e.target.value.split(','));
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {uploadedUrls.filter(url => !!url).map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img src={url} alt={`img-${idx}`} className="w-20 h-20 object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = uploadedUrls.filter((_, i) => i !== idx);
                                setUploadedUrls(newUrls);
                                form.setValue('images', newUrls.join(','));
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
                              title="Eliminar imagen"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Adjunta imágenes del producto. Puedes subir varias. La primera será la principal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Producto Destacado</FormLabel>
                    <FormDescription>
                      Mostrar este producto en la página de inicio.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

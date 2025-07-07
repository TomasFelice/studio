"use client"

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { deleteProductAction } from "@/lib/actions";
import { useRouter } from "next/navigation";


export default function ProductsTable({ products }: { products: Product[] }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async (id: string) => {
        const result = await deleteProductAction(id);
        if (result.success) {
            toast({
                title: "Producto Eliminado",
                description: "El producto ha sido eliminado exitosamente.",
            });
            router.refresh();
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message || "No se pudo eliminar el producto.",
            });
        }
    }

  return (
    <div className="rounded-lg border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Destacado</TableHead>
            <TableHead className="w-[50px]"></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => (
            <TableRow key={product.id}>
                <TableCell>
                <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint="mate product" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toLocaleString('es-AR')}</TableCell>
                <TableCell>
                {product.featured && <Badge>Sí</Badge>}
                </TableCell>
                <TableCell>
                <AlertDialog>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`}><Pencil className="mr-2 h-4 w-4"/>Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                            de la base de datos.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  )
}

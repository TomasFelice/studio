"use client"

import { type Order } from "@/lib/types";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente': return 'default';
      case 'Procesando': return 'secondary';
      case 'Enviado': return 'outline';
      case 'Completado': return 'destructive';
      default: return 'default';
    }
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString('es-AR')}</TableCell>
              <TableCell>${order.total.toLocaleString('es-AR')}</TableCell>
              <TableCell><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/orders/${order.id}`}>Ver detalle <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

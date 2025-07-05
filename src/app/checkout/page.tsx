"use client"

import { useFormStatus } from 'react-dom';
import { useCart } from '@/context/CartContext';
import { createOrderAction, type State } from '@/lib/actions';
import { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</> : "Realizar Pedido"}
        </Button>
    )
}

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const initialState: State = { message: null, errors: {} };
    const createOrderWithCart = createOrderAction.bind(null);
    const [state, dispatch] = useActionState(createOrderWithCart, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                variant: 'destructive',
                title: "Error en el pedido",
                description: state.message,
            })
        }
        // This check is to clear cart only on successful redirect, which won't run this effect again.
        // A more robust solution might use URL params on the confirmation page.
        // For this MVP, we clear the cart optimistically when the action is dispatched.
    }, [state, toast]);

    const handleFormSubmit = (formData: FormData) => {
        if(cartItems.length === 0) {
            toast({
                variant: 'destructive',
                title: "Carrito vacío",
                description: "No puedes realizar un pedido con el carrito vacío.",
            });
            return;
        }
        formData.append('cart', JSON.stringify(cartItems));
        dispatch(formData);
        clearCart();
    }


    return (
        <form action={handleFormSubmit}>
            <div className="container py-12">
                <h1 className="text-3xl font-bold font-headline mb-8">Finalizar Compra</h1>
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Tus Datos</CardTitle>
                                <CardDescription>Necesitamos esta información para coordinar el pago y la entrega.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre y Apellido</Label>
                                    <Input id="name" name="name" placeholder="Juan Pérez" required />
                                    {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                                    <Input id="whatsapp" name="whatsapp" placeholder="+54 9 11 1234 5678" required />
                                    {state.errors?.whatsapp && <p className="text-sm text-destructive">{state.errors.whatsapp[0]}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Dirección de envío o indicaciones para retiro</Label>
                                    <Textarea id="address" name="address" placeholder="Av. Siempre Viva 742, Springfield" required />
                                    {state.errors?.address && <p className="text-sm text-destructive">{state.errors.address[0]}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md" data-ai-hint="mate product" />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <p>Total</p>
                                        <p>${cartTotal.toLocaleString('es-AR')}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-4 items-start">
                                <Alert variant="default" className="bg-primary/10 border-primary/20">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    <AlertTitle className="text-primary font-semibold">¡Importante!</AlertTitle>
                                    <AlertDescription className="text-primary/80">
                                        Una vez realizado el pedido, nos contactaremos por WhatsApp para coordinar el pago y la entrega.
                                    </AlertDescription>
                                </Alert>
                                <SubmitButton />
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </form>
    )
}

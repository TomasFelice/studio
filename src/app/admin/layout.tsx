import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Home, Package, ShoppingCart, User, LogOut } from "lucide-react"
import Link from "next/link"
import { removeSession } from "@/lib/actions"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/firebase/admin"
import { Logo } from "@/components/Logo"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar sesión en el server
  const session = cookies().get('session')?.value;
  if (!session || !auth) {
    redirect('/login');
  }
  try {
    await auth.verifySessionCookie(session, true);
  } catch {
    redirect('/login');
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <SidebarTrigger />
                    <Logo className="text-primary group-data-[collapsible=icon]:hidden duration-300" />
                    <span className="font-headline font-bold text-lg group-data-[collapsible=icon]:hidden duration-300">PuraBombilla</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Dashboard">
                            <Link href="/admin"><Home/>Dashboard</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Productos">
                            <Link href="/admin/products"><Package/>Productos</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Pedidos">
                            <Link href="/admin/orders"><ShoppingCart/>Pedidos</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton asChild tooltip="Mi Cuenta">
                            <Link href="#"><User/>Admin</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <form action={removeSession} className="w-full">
                            <SidebarMenuButton type="submit" className="w-full" tooltip="Cerrar Sesión">
                                <LogOut/>Cerrar Sesión
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  )
}

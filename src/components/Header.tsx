import Link from 'next/link';
import { Logo } from './Logo';
import { CartIcon } from './CartIcon';

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Logo className="h-10 w-10 text-primary" />
          <span className="font-bold font-headline text-xl">PuraBombilla</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Inicio
          </Link>
          <Link href="/products" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Productos
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <CartIcon />
        </div>
      </div>
    </header>
  );
}

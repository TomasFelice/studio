import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <Logo className="h-12 w-12 text-primary" />
                <span className="font-bold text-lg font-headline">PuraBombilla</span>
            </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PuraBombilla. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

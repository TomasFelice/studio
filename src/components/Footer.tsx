import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
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

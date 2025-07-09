"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";

export function MobileSidebarTrigger() {
  const isMobile = useIsMobile();
  let sidebar: ReturnType<typeof useSidebar> | null = null;
  try {
    sidebar = useSidebar();
  } catch {
    return null;
  }
  if (!isMobile || sidebar.openMobile) return null;
  return (
    <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 100 }}>
      <SidebarTrigger />
    </div>
  );
}

export function DesktopSidebarTrigger() {
  // Solo mostrar en desktop
  const isMobile = useIsMobile();
  let sidebar: ReturnType<typeof useSidebar> | null = null;
  try {
    sidebar = useSidebar();
  } catch {
    return null;
  }
  // Mostrar solo si NO es mobile y el sidebar está colapsado
  if (isMobile || sidebar.state !== "collapsed") return null;
  return (
    <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 100 }} className="hidden md:block">
      <SidebarTrigger />
    </div>
  );
} 
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={cn("h-6 w-6", className)}
    >
      <path d="M14.5 14.25c2.5-1 4.5-3.5 4.5-6.5a7.5 7.5 0 0 0-14.5-0.25c0 3 2 5.5 4.5 6.5"></path>
      <path d="M14.5 8h.5"></path><path d="M9 8h-.5"></path>
      <path d="M15 5h2.5"></path><path d="M7.5 5H5"></path>
      <path d="M18 3h-2.5"></path><path d="M8.5 3H6"></path>
      <path d="M16 14.5c-1.5 2.5-3.5 4-5 4s-3.5-1.5-5-4"></path>
      <path d="M9.5 21a2.5 2.5 0 0 1-5 0"></path>
      <path d="m16 4.5-6 6"></path>
    </svg>
  );
}

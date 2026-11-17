import { cn } from "@workspace/ui/lib/utils"

type LogoMarkProps = {
  className?: string
  innerClassName?: string
}

export function LogoMark({
  className = "h-7 w-7 border-2",
  innerClassName = "h-3 w-3 border",
}: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border-foreground/60",
        className
      )}
    >
      <span
        className={cn("rounded-full border-foreground/60", innerClassName)}
      />
    </span>
  )
}

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { GalleryVerticalEndIcon, SunIcon } from "lucide-react"

export function ThemeToggle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button size="icon-lg" variant="ghost" className={cn(className)} {...props}>
      <SunIcon />
    </Button>
  )
}

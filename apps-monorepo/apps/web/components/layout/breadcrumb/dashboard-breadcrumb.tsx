import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { InputSearch } from "./input-search"
import { Separator } from "@workspace/ui/components/separator"
import { GalleryVerticalEndIcon, Sun, SunIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ThemeToggle } from "./theme-toggle"
import { LanguagePopover } from "./language-popover"
import { ShoppingCart } from "./shopping-cart"

export function DashboardBreadcrumb() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <Button size="icon-xs" className="mr-4 flex md:hidden">
          <GalleryVerticalEndIcon />
        </Button>
        <SidebarTrigger className="-ml-1" size={"icon-lg"} />
        <Separator
          orientation="vertical"
          className="mr-4 ml-2 hidden lg:block"
        />
        <div className="hidden w-xs md:block">
          <InputSearch />
        </div>
      </div>
      <div className="flex items-center">
        <ThemeToggle />
        <LanguagePopover />
        <ShoppingCart />
      </div>
    </header>
  )
}

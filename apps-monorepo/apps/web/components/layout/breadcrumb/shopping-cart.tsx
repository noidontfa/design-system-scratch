"use client"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
} from "@workspace/ui/components/drawer"
import { Button } from "@workspace/ui/components/button"

import { Badge, MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react"
import React from "react"
import Image from "next/image"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function ShoppingCart() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            size="icon-lg"
            variant="ghost"
            className="relative"
            onClick={() => setOpen(true)}
          >
            <ShoppingCartIcon />
            <span className="absolute end-0 top-0 h-4 w-4 rounded-full bg-primary text-center text-xs text-white dark:text-primary-foreground">
              11
            </span>
          </Button>
        }
      />
      <SheetContent className="max-w-80 data-[swipe-direction=down]:rounded-t-none data-[swipe-direction=right]:rounded-l-none">
        <SheetHeader className="border-b p-4 md:gap-1.5">
          <SheetTitle className="text-lg font-semibold">
            Shopping Cart
          </SheetTitle>
          <DrawerDescription className="text-start">
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </SheetHeader>
        <div className="flex scroll-fade flex-col gap-6 overflow-y-auto p-6">
          <ShoppingCartItem />
          <ShoppingCartItem />
          <ShoppingCartItem />
          <ShoppingCartSubTotal />
          <ShoppingCartTotal />
          <Button className="h-[2.125rem]" variant={"outline"}>
            <Link href="/shopping-cart">Go to shopping cart</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ShoppingCartItem() {
  return (
    <div className="flex items-start justify-center gap-5">
      <AspectRatio ratio={4 / 3} className="w-20">
        <Image
          src="https://picsum.photos/id/1/80/80"
          alt="Shopping Cart Item"
          fill
          className="rounded-md object-cover"
        />
      </AspectRatio>

      <div className="flex grow flex-col items-start justify-center gap-1">
        <h4 className="text-sm font-medium">Supreme toys cooker</h4>
        <p className="text-xs text-muted-foreground">Kitchenware Item</p>
        <div className="mt-2 flex w-full items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">$250</p>
          <div className="flex flex-col items-start gap-8">
            <ButtonGroup>
              <Button variant="secondary" size="icon-xs">
                <MinusIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                className="w-8 text-xs font-semibold text-muted-foreground"
              >
                5
              </Button>
              <Button variant="secondary" size="icon-xs">
                <PlusIcon />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShoppingCartSubTotal() {
  return (
    <div className="items-between flex justify-between">
      <p className="text-sm text-muted-foreground">Subtotal</p>
      <p className="text-sm font-semibold text-muted-foreground">$250.00</p>
    </div>
  )
}

function ShoppingCartTotal() {
  return (
    <div className="items-between flex justify-between">
      <p className="text-sm text-muted-foreground">Total</p>
      <p className="text-sm font-semibold text-muted-foreground">$250.00</p>
    </div>
  )
}

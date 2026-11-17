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
import { FieldContent, FieldTitle } from "@workspace/ui/components/field"
import { Badge, ShoppingCartIcon } from "lucide-react"
import React from "react"

const deliveryTimes = [
  {
    value: "asap",
    id: "delivery-asap",
    label: "Standard delivery",
    description: "25–35 min · Driver assigned now",
    badge: "Fastest",
  },
  {
    value: "5-00",
    id: "delivery-5-00",
    label: "5:00 PM – 5:15 PM",
    description: "Prep starts at 4:45 PM",
  },
  {
    value: "5-30",
    id: "delivery-5-30",
    label: "5:30 PM – 5:45 PM",
    description: "Good if you're heading home",
  },
  {
    value: "6-00",
    id: "delivery-6-00",
    label: "6:00 PM – 6:15 PM",
    description: "Most popular · High demand",
  },
  {
    value: "6-30",
    id: "delivery-6-30",
    label: "6:30 PM – 6:45 PM",
    description: "Last slot before kitchen closes",
  },
]
export function ShoppingCart() {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime)
    if (!selected) {
      return
    }
    setOpen(false)
    // toast("Delivery time confirmed", {
    //   description: selected.label,
    // })
  }
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pick a delivery time</DrawerTitle>
          <DrawerDescription>
            We&apos;ll prepare your order as soon as possible.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4">
          Hello world
        </div>
        <DrawerFooter>
          <Button onClick={handleConfirm} className="h-[34px]">
            Confirm Delivery Time
          </Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

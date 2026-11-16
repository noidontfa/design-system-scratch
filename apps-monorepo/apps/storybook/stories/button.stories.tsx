import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Plus } from "lucide-react"
import { expect } from "storybook/test"

import { Button } from "@workspace/ui/components/button"

const meta = {
  title: "Button",
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

const variants = [
  { name: "Save" },
  { name: "Outline", variant: "outline" },
  { name: "Secondary", variant: "secondary" },
  { name: "Ghost", variant: "ghost" },
  { name: "Destructive", variant: "destructive" },
  { name: "Link", variant: "link" },
] as const

const sizes = [
  { name: "Extra small", size: "xs" },
  { name: "Small", size: "sm" },
  { name: "Large", size: "lg" },
  { name: "Add", size: "icon" },
  { name: "Add extra small", size: "icon-xs" },
  { name: "Add small", size: "icon-sm" },
  { name: "Add large", size: "icon-lg" },
] as const

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {variants.map(({ name, ...props }) => (
          <Button key={name} {...props}>
            {name}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {sizes.map(({ name, size }) => (
          <Button
            key={name}
            size={size}
            aria-label={size.startsWith("icon") ? name : undefined}
          >
            {size.startsWith("icon") ? <Plus /> : name}
          </Button>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const { name } of [...variants, ...sizes]) {
      await expect(canvas.getByRole("button", { name })).toBeInTheDocument()
    }
  },
}

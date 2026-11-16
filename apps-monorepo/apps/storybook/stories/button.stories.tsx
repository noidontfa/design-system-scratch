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

const names = [
  "Save",
  "Outline",
  "Secondary",
  "Ghost",
  "Destructive",
  "Link",
  "Extra small",
  "Small",
  "Large",
  "Add",
  "Add small",
  "Add extra small",
  "Add large",
] as const

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Save</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add">
          <Plus />
        </Button>
        <Button size="icon-xs" aria-label="Add extra small">
          <Plus />
        </Button>
        <Button size="icon-sm" aria-label="Add small">
          <Plus />
        </Button>
        <Button size="icon-lg" aria-label="Add large">
          <Plus />
        </Button>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const name of names) {
      await expect(canvas.getByRole("button", { name })).toBeInTheDocument()
    }
  },
}

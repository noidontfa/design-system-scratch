import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Label } from "@workspace/ui/components/label"

const meta = {
  title: "Label",
  component: Label,
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Label htmlFor="name">Name</Label>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Name")).toBeInTheDocument()
  },
}

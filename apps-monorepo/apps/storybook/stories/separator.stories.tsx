import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Separator } from "@workspace/ui/components/separator"

const meta = {
  title: "Separator",
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

const orientations = [
  { name: "Between sections", orientation: "horizontal" },
  { name: "Between Blog and Docs", orientation: "vertical" },
] as const

export const Default: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" aria-label="Between Blog and Docs" />
        <span>Docs</span>
      </div>
      <Separator aria-label="Between sections" />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const { name } of orientations) {
      await expect(canvas.getByRole("separator", { name })).toBeInTheDocument()
    }
  },
}

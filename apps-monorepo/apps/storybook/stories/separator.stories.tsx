import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Separator } from "@workspace/ui/components/separator"

const meta = {
  title: "Separator",
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

const separators = [
  { name: "Between Blog and Docs", orientation: "vertical" },
  { name: "Between sections", orientation: "horizontal" },
] as const

export const Default: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      {separators.map(({ name, orientation }) =>
        orientation === "vertical" ? (
          <div key={name} className="flex h-5 items-center gap-3 text-sm">
            <span>Blog</span>
            <Separator orientation={orientation} aria-label={name} />
            <span>Docs</span>
          </div>
        ) : (
          <Separator key={name} orientation={orientation} aria-label={name} />
        )
      )}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const { name } of separators) {
      await expect(canvas.getByRole("separator", { name })).toBeInTheDocument()
    }
  },
}

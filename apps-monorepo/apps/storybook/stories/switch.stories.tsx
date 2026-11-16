import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Switch } from "@workspace/ui/components/switch"

const meta = {
  title: "Switch",
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

const sizes = [
  { name: "Notifications", size: "default" },
  { name: "Compact notifications", size: "sm" },
] as const

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {sizes.map(({ name, size }) => (
        <Switch key={name} aria-label={name} size={size} />
      ))}
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const { name } of sizes) {
      const control = canvas.getByRole("switch", { name })

      await expect(control).not.toBeChecked()
      await userEvent.click(control)
      await expect(control).toBeChecked()
      await userEvent.click(control)
      await expect(control).not.toBeChecked()
    }
  },
}

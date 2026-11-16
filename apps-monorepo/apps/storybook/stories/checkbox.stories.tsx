import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Checkbox } from "@workspace/ui/components/checkbox"

const meta = {
  title: "Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Checkbox aria-label="Accept terms" />,
  play: async ({ canvas, userEvent }) => {
    const terms = canvas.getByRole("checkbox", { name: "Accept terms" })

    await expect(terms).not.toBeChecked()
    await userEvent.click(terms)
    await expect(terms).toBeChecked()
  },
}

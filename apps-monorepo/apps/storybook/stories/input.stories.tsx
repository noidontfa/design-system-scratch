import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Input",
  component: Input,
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Input aria-label="Email" placeholder="Email" />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", { name: "Email" })
    ).toBeInTheDocument()
  },
}

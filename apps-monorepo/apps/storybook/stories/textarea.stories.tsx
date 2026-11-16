import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Textarea } from "@workspace/ui/components/textarea"

const meta = {
  title: "Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Textarea aria-label="Notes" placeholder="Notes" />,
  play: async ({ canvas, userEvent }) => {
    const notes = canvas.getByRole("textbox", { name: "Notes" })

    await userEvent.type(notes, "First line{enter}Second line")

    await expect(notes).toHaveValue("First line\nSecond line")
  },
}

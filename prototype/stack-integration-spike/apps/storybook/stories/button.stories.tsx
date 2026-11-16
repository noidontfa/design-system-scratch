import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@workspace/ui/components/button"

const meta = {
  title: "Button",
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Themed: Story = {
  args: {
    children: "Themed button",
  },
}

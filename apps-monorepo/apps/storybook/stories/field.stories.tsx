import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Field",
  component: Field,
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

const orientations = [
  {
    name: "Email",
    id: "email",
    orientation: "vertical",
    description: "We use this to contact you.",
  },
  {
    name: "Name",
    id: "name",
    orientation: "horizontal",
  },
  {
    name: "City",
    id: "city",
    orientation: "responsive",
  },
] as const

export const Default: Story = {
  render: () => (
    <FieldGroup>
      {orientations.map(({ name, id, orientation, ...rest }) => (
        <Field key={id} orientation={orientation}>
          <FieldLabel htmlFor={id}>{name}</FieldLabel>
          <Input id={id} />
          {"description" in rest ? (
            <FieldDescription>{rest.description}</FieldDescription>
          ) : null}
        </Field>
      ))}
      <Field data-invalid>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" aria-invalid />
        <FieldError>Choose another username.</FieldError>
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvas }) => {
    for (const { name } of orientations) {
      await expect(canvas.getByRole("textbox", { name })).toBeInTheDocument()
    }

    await expect(
      canvas.getByText("We use this to contact you.")
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("textbox", { name: "Username" })
    ).toBeInTheDocument()
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose another username."
    )
  },
}

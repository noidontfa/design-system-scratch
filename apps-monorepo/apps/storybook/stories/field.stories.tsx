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

const fields = [
  {
    name: "Email",
    id: "email",
    orientation: "vertical",
    description: "We use this to contact you.",
    error: undefined,
  },
  {
    name: "Name",
    id: "name",
    orientation: "horizontal",
    description: undefined,
    error: undefined,
  },
  {
    name: "City",
    id: "city",
    orientation: "responsive",
    description: undefined,
    error: undefined,
  },
  {
    name: "Username",
    id: "username",
    orientation: "vertical",
    description: undefined,
    error: "Choose another username.",
  },
] as const

export const Default: Story = {
  render: () => (
    <FieldGroup>
      {fields.map(({ name, id, orientation, description, error }) => (
        <Field
          key={id}
          orientation={orientation}
          aria-labelledby={`${id}-label`}
          data-invalid={error ? true : undefined}
        >
          <FieldLabel id={`${id}-label`} htmlFor={id}>
            {name}
          </FieldLabel>
          <Input id={id} aria-invalid={error ? true : undefined} />
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      ))}
    </FieldGroup>
  ),
  play: async ({ canvas }) => {
    for (const { name } of fields) {
      await expect(canvas.getByRole("group", { name })).toBeInTheDocument()
      await expect(canvas.getByRole("textbox", { name })).toBeInTheDocument()
    }

    await expect(
      canvas.getByText("We use this to contact you.")
    ).toBeInTheDocument()
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose another username."
    )
  },
}

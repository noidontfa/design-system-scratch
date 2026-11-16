import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"

export default function Page() {
  return (
    <main className="flex min-h-svh items-center p-6">
      <form className="flex w-full max-w-sm flex-col gap-6">
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input id="name" autoComplete="name" />
            <FieldDescription>How we should address you.</FieldDescription>
          </Field>
          <Separator />
          <Field data-invalid>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" aria-invalid />
            <FieldError>Enter a valid email.</FieldError>
          </Field>
        </FieldGroup>
        <Button type="submit">Save</Button>
      </form>
    </main>
  )
}

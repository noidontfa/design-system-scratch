import { Button } from "@workspace/ui/components/button"

export default function Page() {
  const renderedAt = new Date().toISOString()

  return (
    <main className="flex min-h-svh flex-col gap-4 border-[#c33e02] p-6">
      <h1 className="text-lg font-medium">Other app</h1>
      <p>
        Server render: <time dateTime={renderedAt}>{renderedAt}</time>
      </p>
      <Button>Themed button</Button>
    </main>
  )
}

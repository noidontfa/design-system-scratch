import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"

export function HeaderCard() {
  return (
    <Card className="relative h-full w-full gap-6 px-6 md:px-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Good afternoon, Cameron
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll px-(--card-spacing) text-sm leading-relaxed">
          <p className="max-w-72 text-sm text-muted-foreground">
            Stay informed with today’s analytics. Get a quick snapshot of key
            statistics.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-none bg-background">
        <Button variant="default" size="lg">
          View full report
          <ArrowRightIcon />
        </Button>
      </CardFooter>

      <div className="absolute right-10 bottom-0 md:right-8">
        <Image
          src="/images/analytic-user-dark.svg"
          alt="Analytic User"
          className="object-cover"
          width={230}
          height={230}
        />
      </div>
    </Card>
  )
}

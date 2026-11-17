import type { Metadata } from "next"

import { LandingPage } from "@/components/mindloop/landing-page"

export const metadata: Metadata = {
  title: "Mindloop",
  description:
    "Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.",
}

export default function Page() {
  return <LandingPage />
}

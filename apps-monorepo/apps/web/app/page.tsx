import type { Metadata } from "next"

import LandingPage from "@/features/mindloop/page"

export const metadata: Metadata = {
  title: "Mindloop",
  description:
    "Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.",
}

export default function Page() {
  return <LandingPage />
}

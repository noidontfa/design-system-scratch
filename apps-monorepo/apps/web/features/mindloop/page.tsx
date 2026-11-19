"use client"

import { MotionConfig } from "framer-motion"

import { CtaSection } from "@/features/mindloop/components/cta-section"
import { Hero } from "@/features/mindloop/components/hero"
import { MissionSection } from "@/features/mindloop/components/mission-section"
import { Navbar } from "@/features/mindloop/components/navbar"
import { SearchSection } from "@/features/mindloop/components/search-section"
import { SiteFooter } from "@/features/mindloop/components/site-footer"
import { SolutionSection } from "@/features/mindloop/components/solution-section"

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mindloop min-h-svh bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Hero />
          <SearchSection />
          <MissionSection />
          <SolutionSection />
          <CtaSection />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  )
}

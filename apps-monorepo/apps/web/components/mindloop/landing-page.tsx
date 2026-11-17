"use client"

import { MotionConfig } from "framer-motion"

import { CtaSection } from "@/components/mindloop/cta-section"
import { Hero } from "@/components/mindloop/hero"
import { MissionSection } from "@/components/mindloop/mission-section"
import { Navbar } from "@/components/mindloop/navbar"
import { SearchSection } from "@/components/mindloop/search-section"
import { SiteFooter } from "@/components/mindloop/site-footer"
import { SolutionSection } from "@/components/mindloop/solution-section"

export function LandingPage() {
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

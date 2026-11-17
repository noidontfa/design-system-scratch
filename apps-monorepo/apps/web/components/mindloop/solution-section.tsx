"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/components/mindloop/fade-up"
import { LoopVideo } from "@/components/mindloop/loop-video"

const SOLUTION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"

const features = [
  {
    title: "Curated Feed",
    description:
      "Essays, briefings, and notes gathered into one feed, ordered for depth.",
  },
  {
    title: "Writer Tools",
    description:
      "Draft, revise, and publish a newsletter without switching tools.",
  },
  {
    title: "Community",
    description:
      "Replies stay on the piece, so a letter can turn into a conversation.",
  },
  {
    title: "Distribution",
    description: "One publish reaches subscribers, the feed, and the archive.",
  },
]

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="scroll-mt-28 border-t border-border/30 px-6 py-32 md:py-44"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          {...fadeUp(0)}
          className="text-xs tracking-[3px] text-muted-foreground uppercase"
        >
          Solution
        </motion.p>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-4 max-w-4xl text-4xl font-medium md:text-6xl"
        >
          The platform for{" "}
          <span className="font-serif font-normal italic">meaningful</span>{" "}
          content
        </motion.h2>
        <motion.div {...fadeUp(0.2)} className="mt-12">
          <LoopVideo
            src={SOLUTION_VIDEO}
            className="aspect-[3/1] w-full rounded-2xl object-cover"
          />
        </motion.div>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              {...fadeUp(0.25 + index * 0.08)}
            >
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

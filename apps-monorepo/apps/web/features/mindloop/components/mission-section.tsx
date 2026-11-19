"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { fadeUp } from "@/features/mindloop/components/fade-up"
import { LoopVideo } from "@/features/mindloop/components/loop-video"
import { cn } from "@workspace/ui/lib/utils"

const MISSION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"

const paragraphOne =
  "We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having."

const paragraphTwo =
  "A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved."

const highlighted = new Set(["curiosity", "meets", "clarity"])

export function MissionSection() {
  return (
    <section id="mission" className="scroll-mt-28 px-6 pt-0 pb-32 md:pb-44">
      <motion.div {...fadeUp(0)} className="mx-auto w-full max-w-[800px]">
        <LoopVideo
          src={MISSION_VIDEO}
          className="aspect-square w-full object-cover"
        />
      </motion.div>
      <div className="mx-auto mt-16 max-w-5xl text-center md:mt-24">
        <RevealParagraph
          text={paragraphOne}
          highlight={highlighted}
          className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl"
        />
        <RevealParagraph
          text={paragraphTwo}
          className="mt-10 text-xl font-medium md:text-2xl lg:text-3xl"
        />
      </div>
    </section>
  )
}

function RevealParagraph({
  text,
  className,
  highlight,
}: {
  text: string
  className?: string
  highlight?: Set<string>
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  })
  const words = text.split(" ")

  return (
    <p ref={ref} className={cn("leading-tight", className)}>
      {words.map((word, index) => (
        <RevealWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          total={words.length}
          progress={scrollYProgress}
          highlighted={highlight?.has(
            word.replace(/[^a-zA-Z]/g, "").toLowerCase()
          )}
          dimmed={Boolean(highlight)}
        />
      ))}
    </p>
  )
}

function RevealWord({
  word,
  index,
  total,
  progress,
  highlighted,
  dimmed,
}: {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
  highlighted?: boolean
  dimmed: boolean
}) {
  const start = index / total
  const end = Math.min(1, start + 1 / total)
  const opacity = useTransform(progress, [start, end], [0.15, 1])

  return (
    <motion.span
      style={{ opacity }}
      className={cn(
        highlighted || !dimmed
          ? "text-foreground"
          : "text-[hsl(var(--hero-subtitle))]"
      )}
    >
      {word}{" "}
    </motion.span>
  )
}

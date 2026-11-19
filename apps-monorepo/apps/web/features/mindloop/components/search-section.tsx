"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { fadeUp } from "@/features/mindloop/components/fade-up"

const platforms = [
  {
    name: "ChatGPT",
    icon: "/icon-chatgpt.png",
    description:
      "People ask it instead of scanning results. If your work isn't a source, it never arrives.",
  },
  {
    name: "Perplexity",
    icon: "/icon-perplexity.png",
    description:
      "Citations sit beside every claim. Clear, sourced writing is what gets named.",
  },
  {
    name: "Google AI",
    icon: "/icon-google.png",
    description:
      "The overview is written before the links. Pages that answer directly are the ones quoted.",
  },
]

export function SearchSection() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-28 px-6 pt-52 pb-6 text-center md:pt-64 md:pb-9"
    >
      <motion.h2
        {...fadeUp(0)}
        className="text-5xl leading-none font-medium tracking-[-2px] md:text-7xl lg:text-8xl"
      >
        Search has{" "}
        <span className="font-serif font-normal italic">changed.</span> Have
        you?
      </motion.h2>
      <motion.p
        {...fadeUp(0.1)}
        className="mx-auto mt-6 mb-24 max-w-2xl text-lg text-muted-foreground"
      >
        Readers now get a composed answer before they ever see a list of links.
        The writing that gets cited is the writing that still exists.
      </motion.p>
      <div className="mx-auto mb-20 grid max-w-6xl gap-12 md:grid-cols-3 md:gap-8">
        {platforms.map((platform, index) => (
          <motion.article
            key={platform.name}
            {...fadeUp(0.15 + index * 0.1)}
            className="flex flex-col items-center"
          >
            <Image
              src={platform.icon}
              alt=""
              width={200}
              height={200}
              className="h-[200px] w-[200px] object-contain"
            />
            <h3 className="mt-6 text-base font-semibold">{platform.name}</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {platform.description}
            </p>
          </motion.article>
        ))}
      </div>
      <motion.p
        {...fadeUp(0.45)}
        className="text-center text-sm text-muted-foreground"
      >
        If you don&apos;t answer the questions, someone else will.
      </motion.p>
    </section>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { fadeUp } from "@/components/mindloop/fade-up"
import { LoopVideo } from "@/components/mindloop/loop-video"

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"

const avatars = ["/avatar-1.png", "/avatar-2.png", "/avatar-3.png"]

const MotionButton = motion.create(Button)

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 pt-28 md:pt-32"
    >
      <LoopVideo
        src={HERO_VIDEO}
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-t from-background to-transparent"
      />
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {avatars.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={32}
                height={32}
                priority
                className="h-8 w-8 rounded-full border-2 border-background object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            7,000+ people already subscribed
          </p>
        </motion.div>
        <motion.h1
          {...fadeUp(0.2)}
          className="mt-8 text-5xl leading-none font-medium tracking-[-2px] [text-shadow:0_2px_24px_rgba(0,0,0,0.72)] md:text-7xl lg:text-8xl"
        >
          Get <span className="font-serif font-normal italic">Inspired</span>{" "}
          with Us
        </motion.h1>
        <motion.p
          {...fadeUp(0.3)}
          className="mt-6 max-w-2xl text-lg text-[hsl(var(--hero-subtitle))] [text-shadow:0_2px_16px_rgba(0,0,0,0.8)]"
        >
          Join our feed for meaningful updates, news around technology and a
          shared journey toward depth and direction.
        </motion.p>
        <motion.div {...fadeUp(0.4)} className="mt-8 w-full max-w-lg">
          <SubscribeForm />
        </motion.div>
      </div>
    </section>
  )
}

function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email.")
      setDone(false)
      return
    }
    setError("")
    setDone(true)
  }

  if (done) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        You&apos;re on the list. We&apos;ll write when there&apos;s something
        worth reading.
      </p>
    )
  }

  return (
    <form
      id="subscribe"
      onSubmit={onSubmit}
      className="scroll-mt-32"
      noValidate
    >
      <div className="liquid-glass flex items-center gap-2 rounded-full p-2">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "email-error" : undefined}
          className="h-11 flex-1 border-0 bg-transparent px-4 shadow-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0 md:text-base dark:bg-transparent"
        />
        <MotionButton
          type="submit"
          className="h-auto shrink-0 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background hover:bg-foreground"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          SUBSCRIBE
        </MotionButton>
      </div>
      {error ? (
        <p
          id="email-error"
          role="alert"
          className="mt-3 text-sm text-muted-foreground"
        >
          {error}
        </p>
      ) : null}
    </form>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type Hls from "hls.js"

import { fadeUp } from "@/components/mindloop/fade-up"
import { LogoMark } from "@/components/mindloop/logo-mark"

const HLS_URL =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/30 px-6 py-32 md:py-44">
      <HlsBackground src={HLS_URL} />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-background/45"
      />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div {...fadeUp(0)}>
          <LogoMark
            className="h-10 w-10 border-2"
            innerClassName="h-5 w-5 border"
          />
        </motion.div>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-8 font-serif text-5xl leading-none font-normal tracking-[-2px] italic md:text-7xl"
        >
          Start Your Journey
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Subscribe for the briefing, or start publishing to the readers already
          here.
        </motion.p>
        <motion.div
          {...fadeUp(0.3)}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#subscribe"
            className="inline-flex rounded-lg bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Subscribe Now
          </a>
          <a
            href="#solution"
            className="liquid-glass inline-flex rounded-lg px-8 py-3.5 text-sm font-medium text-foreground"
          >
            Start Writing
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function HlsBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let player: Hls | null = null
    let cancelled = false

    const replay = () => {
      const node = videoRef.current
      if (!node) return
      node.currentTime = 0
      void node.play().catch(() => undefined)
    }

    video.muted = true
    video.addEventListener("ended", replay)

    void (async () => {
      const { default: HlsCtor } = await import("hls.js")
      const node = videoRef.current
      if (!node || cancelled) return

      if (HlsCtor.isSupported()) {
        const instance = new HlsCtor()
        player = instance
        if (cancelled) {
          instance.destroy()
          return
        }
        instance.loadSource(src)
        instance.attachMedia(node)
        instance.on(HlsCtor.Events.MANIFEST_PARSED, () => {
          void node.play().catch(() => undefined)
        })
        return
      }

      if (node.canPlayType("application/vnd.apple.mpegurl")) {
        node.src = src
        void node.play().catch(() => undefined)
      }
    })()

    return () => {
      cancelled = true
      video.removeEventListener("ended", replay)
      player?.destroy()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    />
  )
}

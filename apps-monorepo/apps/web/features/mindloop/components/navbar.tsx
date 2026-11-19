"use client"

import { motion } from "framer-motion"

import { LogoMark } from "@/features/mindloop/components/logo-mark"
import {
  Instagram,
  Linkedin,
  Twitter,
} from "@/features/mindloop/components/social-icons"

const links = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#solution" },
  { label: "Philosophy", href: "#mission" },
  { label: "Use Cases", href: "#use-cases" },
]

const socials = [
  {
    label: "Mindloop on Instagram",
    href: "https://www.instagram.com/",
    icon: Instagram,
  },
  {
    label: "Mindloop on LinkedIn",
    href: "https://www.linkedin.com/",
    icon: Linkedin,
  },
  {
    label: "Mindloop on Twitter",
    href: "https://x.com/",
    icon: Twitter,
  },
]

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center gap-x-8 gap-y-3 bg-transparent px-8 py-4 md:px-28"
    >
      <a href="#home" className="flex items-center gap-2.5 text-foreground">
        <LogoMark />
        <span className="font-bold">Mindloop</span>
      </a>
      <nav
        aria-label="Primary"
        className="order-3 flex w-full items-center overflow-x-auto text-sm md:order-none md:w-auto"
      >
        {links.map((link, index) => (
          <span key={link.href} className="flex shrink-0 items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="px-3 text-muted-foreground">
                •
              </span>
            ) : null}
            <a
              href={link.href}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </span>
        ))}
      </nav>
      <nav aria-label="Social" className="ml-auto flex items-center gap-2">
        {socials.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10"
          >
            <item.icon className="size-4" />
          </a>
        ))}
      </nav>
    </motion.header>
  )
}

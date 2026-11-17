"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/components/mindloop/fade-up"

const links = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Contact", href: "mailto:hello@mindloop.com" },
]

export function SiteFooter() {
  return (
    <motion.footer
      {...fadeUp(0)}
      className="flex flex-col gap-4 px-8 py-12 sm:flex-row sm:items-center sm:justify-between md:px-28"
    >
      <p className="text-sm text-muted-foreground">
        © 2026 Mindloop. All rights reserved.
      </p>
      <nav aria-label="Legal" className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.footer>
  )
}

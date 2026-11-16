import type { Decorator, Preview } from "@storybook/nextjs-vite"

import "../app/globals.css"

const withDarkAppearance: Decorator = (Story) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("dark")
  }

  return <Story />
}

const preview: Preview = {
  decorators: [withDarkAppearance],
}

export default preview

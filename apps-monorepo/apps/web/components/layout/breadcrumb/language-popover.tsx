import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverTrigger,
  PopoverTitle,
  PopoverDescription,
  PopoverContent,
  PopoverHeader,
} from "@workspace/ui/components/popover"
import Image from "next/image"

const languages = [
  {
    icon: (
      <Image
        src="/images/icon-flag-en.svg"
        alt="English flag"
        width={40}
        height={40}
        className="h-5 w-5 rounded-full object-cover"
      />
    ),

    label: "English (UK)",
    value: "en",
  },
  {
    icon: (
      <Image
        src="/images/icon-flag-cn.svg"
        alt="Chinese flag"
        width={40}
        height={40}
        className="h-5 w-5 rounded-full object-cover"
      />
    ),
    label: "中国人 (Chinese)",
    value: "cn",
  },
  {
    icon: (
      <Image
        src="/images/icon-flag-fr.svg"
        alt="French flag"
        width={40}
        height={40}
        className="h-5 w-5 rounded-full object-cover"
      />
    ),
    label: "français (French)",
    value: "fr",
  },
  {
    icon: (
      <Image
        src="/images/icon-flag-sa.svg"
        alt="Saudi Arabia flag"
        width={40}
        height={40}
        className="h-5 w-5 rounded-full object-cover"
      />
    ),
    label: "عربي (Arabic)",
    value: "sa",
  },
]

export function LanguagePopover() {
  const activeLanguage = languages[0]
  return (
    <>
      <Popover>
        <PopoverTrigger
          render={
            <Button size="icon-lg" variant="ghost" className="rounded-full">
              {activeLanguage?.icon}
            </Button>
          }
        />
        <PopoverContent className="max-w-64 p-1" align="start">
          <div className="flex flex-col">
            {languages.map((language) => (
              <Button
                key={language.value}
                variant="ghost"
                className="h-auto justify-start gap-2 px-4 py-2"
              >
                {language.icon}
                <span className="text-sm text-muted-foreground">
                  {language.label}
                </span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

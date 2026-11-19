import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@workspace/ui/components/input-group"
import { Search } from "lucide-react"

export function InputSearch() {
  return (
    <InputGroup className="w-full">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {/* <InputGroupAddon align="inline-end">12 results</InputGroupAddon> */}
    </InputGroup>
  )
}

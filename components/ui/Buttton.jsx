import { Button } from "../components/ui/button";
import {Input} from "../ui/input"
import {Textarea} from "../ui/textarea"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="max-w-md w-full space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter a prompt"
            className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button variant="default">
            Generate Story
          </Button>
        </div>
        <Textarea
          placeholder="Your story will appear here..."
          className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[200px] resize-none"
        />
      </div>
    </div>
  )
}

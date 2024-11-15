import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TimelineBlock } from "./TimelineBlock"

interface TimelineItem {
  id: string
  title: string
  status: "not-started" | "in-progress" | "completed"
  type: "task" | "quiz" | "project" | "meeting"
  description?: string
  date: Date
  duration?: string
}

interface TimeBlock {
  id: string
  title: string
  startDate: Date
  endDate: Date
  items: TimelineItem[]
}

interface TimelineProps {
  blocks: TimeBlock[]
  onAddBlock: () => void
  onUpdateBlock: (block: TimeBlock) => void
}

export function Timeline({ blocks, onAddBlock, onUpdateBlock }: TimelineProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <Button onClick={onAddBlock}>
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </div>
      <div className="space-y-4">
        {blocks.map((block) => (
          <TimelineBlock
            key={block.id}
            block={block}
            onUpdateBlock={onUpdateBlock}
          />
        ))}
      </div>
    </div>
  )
}

export default Timeline
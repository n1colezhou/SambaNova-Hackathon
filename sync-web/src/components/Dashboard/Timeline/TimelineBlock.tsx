import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimelineItem } from "./TimelineItem";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

interface TimelineItem {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "completed";
  type: "task" | "quiz" | "project" | "meeting";
  description?: string;
  date: Date;
  duration?: string;
}

interface TimeBlock {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  items: TimelineItem[];
}

interface TimeBlockProps {
  block: TimeBlock;
  onUpdateBlock: (block: TimeBlock) => void;
}

export function TimelineBlock({ block, onUpdateBlock }: TimeBlockProps) {
  const [isEditingBlock, setIsEditingBlock] = useState(false);
  const [editedBlock, setEditedBlock] = useState(block);
  const [newItemModal, setNewItemModal] = useState(false);
  const [newItemData, setNewItemData] = useState<Partial<TimelineItem>>({
    title: "",
    type: "task",
    description: "",
    date: new Date(),
    duration: "",
  });

  const handleSaveBlock = () => {
    onUpdateBlock(editedBlock);
    setIsEditingBlock(false);
  };

  const handleCreateNewItem = () => {
    setNewItemData({
      title: "",
      type: "task",
      description: "",
      date: new Date(),
      duration: "",
    });
    setNewItemModal(true);
  };

  const handleSaveNewItem = () => {
    if (!newItemData.title || !newItemData.date) {
      return;
    }

    const newItem: TimelineItem = {
      id: uuidv4(),
      title: newItemData.title,
      status: "not-started",
      type: newItemData.type as TimelineItem["type"] || "task",
      description: newItemData.description,
      date: newItemData.date,
      duration: newItemData.duration,
    };

    const updatedItems = [...block.items, newItem].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    onUpdateBlock({
      ...block,
      items: updatedItems,
    });
    setNewItemModal(false);
  };

  const handleUpdateItem = (updatedItem: TimelineItem) => {
    const updatedItems = block.items
      .map((item) => (item.id === updatedItem.id ? updatedItem : item))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    onUpdateBlock({
      ...block,
      items: updatedItems,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    onUpdateBlock({
      ...block,
      items: block.items.filter((item) => item.id !== itemId),
    });
  };

  const sortedItems = [...block.items].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">{block.title}</h3>
          {block.startDate && block.endDate && (
            <span className="text-sm text-muted-foreground">
              {format(block.startDate, 'MMM d, yyyy')} - {format(block.endDate, 'MMM d, yyyy')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingBlock(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNewItem}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {sortedItems.map((item) => (
          <TimelineItem
            key={item.id}
            item={item}
            onUpdate={handleUpdateItem}
            onDelete={() => handleDeleteItem(item.id)}
          />
        ))}
      </div>

      {/* Edit Block Dialog */}
      <Dialog open={isEditingBlock} onOpenChange={setIsEditingBlock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editedBlock.title}
                onChange={(e) =>
                  setEditedBlock({
                    ...editedBlock,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={format(editedBlock.startDate, 'yyyy-MM-dd')}
                onChange={(e) =>
                  setEditedBlock({
                    ...editedBlock,
                    startDate: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={format(editedBlock.endDate, 'yyyy-MM-dd')}
                onChange={(e) =>
                  setEditedBlock({
                    ...editedBlock,
                    endDate: new Date(e.target.value),
                  })
                }
              />
            </div>
            <Button onClick={handleSaveBlock}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Item Modal */}
      <Dialog open={newItemModal} onOpenChange={setNewItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newItemData.title || ""}
                onChange={(e) =>
                  setNewItemData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={newItemData.date ? format(new Date(newItemData.date), 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  setNewItemData((prev) => ({
                    ...prev,
                    date: new Date(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newItemData.type || "task"}
                onValueChange={(value) =>
                  setNewItemData((prev) => ({
                    ...prev,
                    type: value as TimelineItem["type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                placeholder="e.g., 2 hours"
                value={newItemData.duration || ""}
                onChange={(e) =>
                  setNewItemData((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={newItemData.description || ""}
                onChange={(e) =>
                  setNewItemData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNewItem}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
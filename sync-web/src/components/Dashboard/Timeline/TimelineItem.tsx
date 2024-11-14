import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  CheckCircle,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface TimelineItem {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "completed";
  type: "task" | "quiz" | "project" | "meeting";
  description?: string;
  date: Date;
  duration?: string;
}

interface TimelineItemProps {
  item: TimelineItem;
  onUpdate: (item: TimelineItem) => void;
  onDelete: () => void;
}

export function TimelineItem({ item, onUpdate, onDelete }: TimelineItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleStatusUpdate = (newStatus: TimelineItem["status"]) => {
    onUpdate({ ...item, status: newStatus });
  };

  const handleSaveEdit = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };

  return (
    <>
      <div
        className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
          item.status === "completed"
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-secondary hover:bg-secondary/60"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              item.type === "quiz"
                ? "bg-yellow-500"
                : item.type === "project"
                ? "bg-purple-500"
                : "bg-emerald-500"
            }`}
          />
          <div className="flex flex-col">
            <span>{item.title}</span>
            <div className="flex items-center gap-2 text-xs opacity-80">
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(item.date), "MMM d, yyyy")}
            </div>
          </div>
          {item.type && (
            <Badge variant="outline" className="text-xs">
              {item.type}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {item.status === "completed" ? (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="text-white hover:text-emerald-100"
                onClick={() => handleStatusUpdate("not-started")}
              >
                <CheckCircle className="h-5 w-5" />
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="text-emerald-500 hover:text-emerald-600"
                onClick={() => handleStatusUpdate("completed")}
              >
                <CheckCircle className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editedItem.title}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={format(new Date(editedItem.date), "yyyy-MM-dd")}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    date: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={editedItem.type || ""}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    type: e.target.value as TimelineItem["type"],
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={editedItem.description || ""}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, LayoutDashboard, Dumbbell, FolderKanban, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  type: 'course' | 'project' | 'workout' | 'custom';
  active: boolean;
  icon: any;
}

interface SidebarProps {
  collections: Collection[];
  onAddCollection: (collection: Collection) => void;
  onSelectCollection: (id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ 
  collections, 
  onAddCollection, 
  onSelectCollection,
  isExpanded,
  onToggle
}: SidebarProps) {
  const [newCollection, setNewCollection] = useState({
    name: '',
    type: 'course' as const,
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'course':
        return Code;
      case 'project':
        return FolderKanban;
      case 'workout':
        return Dumbbell;
      default:
        return LayoutDashboard;
    }
  };

  const handleAddCollection = () => {
    if (newCollection.name.trim()) {
      const collection: Collection = {
        id: Date.now().toString(),
        name: newCollection.name,
        type: newCollection.type,
        active: false,
        icon: getIconForType(newCollection.type),
      };
      onAddCollection(collection);
      setNewCollection({ name: '', type: 'course' });
    }
  };

  return (
    <div
      className={cn(
        "h-full fixed inset-y-0 left-0 bg-card border-r transition-all duration-300 z-10",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        {isExpanded ? (
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2 min-w-0">
              <Code className="h-6 w-6 text-primary flex-shrink-0" />
              <h2 className="text-xl font-semibold truncate">Sync</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={onToggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-b">
            <Button
              variant="ghost"
              size="icon"
              className="w-full p-4 h-full hover:bg-transparent flex items-center justify-center"
              onClick={onToggle}
            >
              <Code className="h-6 w-6 text-primary" />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {collections.map((collection) => {
              const CollectionIcon = collection.icon;
              return (
                <Button
                  key={collection.id}
                  variant={collection.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !isExpanded && "px-2"
                  )}
                  onClick={() => onSelectCollection(collection.id)}
                >
                  <CollectionIcon className={cn(
                    "flex-shrink-0",
                    isExpanded ? "mr-2 h-4 w-4" : "h-5 w-5"
                  )} />
                  {isExpanded && <span className="truncate">{collection.name}</span>}
                </Button>
              );
            })}

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full",
                    isExpanded ? "justify-start" : "px-2"
                  )}
                >
                  <Plus className={cn(
                    "flex-shrink-0",
                    isExpanded ? "mr-2 h-4 w-4" : "h-5 w-5"
                  )} />
                  {isExpanded && "Add Collection"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Enter collection name"
                      value={newCollection.name}
                      onChange={e => setNewCollection({ ...newCollection, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newCollection.type}
                      onValueChange={(value: 'course' | 'project' | 'workout' | 'custom') => 
                        setNewCollection({ ...newCollection, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="workout">Workout</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCollection} className="w-full">
                    Add Collection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !isExpanded && "px-2"
            )}
          >
            <User className={cn(
              "flex-shrink-0",
              isExpanded ? "mr-2 h-4 w-4" : "h-5 w-5"
            )} />
            {isExpanded && <span className="truncate">Account</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
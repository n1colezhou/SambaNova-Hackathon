'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code, LayoutDashboard, Dumbbell, FolderKanban, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Collection {
  id: string
  name: string
  type: 'course' | 'project' | 'workout' | 'custom'
  active: boolean
  icon: any
}

export function Sidebar() {
  const [collections, setCollections] = useState<Collection[]>([
    { id: '1', name: 'Full Stack Development', type: 'course', active: true, icon: Code },
    { id: '2', name: 'UI/UX Design', type: 'course', active: false, icon: LayoutDashboard },
    { id: '3', name: 'Workout Plan', type: 'workout', active: false, icon: Dumbbell },
    { id: '4', name: 'App Launch', type: 'project', active: false, icon: FolderKanban },
  ])

  const [newCollection, setNewCollection] = useState({
    name: '',
    type: 'course' as const,
  })

  const getIconForType = (type: string) => {
    switch (type) {
      case 'course':
        return Code
      case 'project':
        return FolderKanban
      case 'workout':
        return Dumbbell
      default:
        return LayoutDashboard
    }
  }

  const handleAddCollection = () => {
    if (newCollection.name.trim()) {
      const collection: Collection = {
        id: Date.now().toString(),
        name: newCollection.name,
        type: newCollection.type,
        active: false,
        icon: getIconForType(newCollection.type),
      }
      setCollections(prev => [...prev, collection])
      setNewCollection({ name: '', type: 'course' })
    }
  }

  const handleSelectCollection = (id: string) => {
    setCollections(prev => prev.map(collection => ({
      ...collection,
      active: collection.id === id,
    })))
  }

  return (
    <div className="w-64 fixed inset-y-0 left-0 bg-card border-r">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Sync</h2>
          </div>
        </div>

        <div className="space-y-2">
          {collections.map((collection) => {
            const CollectionIcon = collection.icon
            return (
              <Button
                key={collection.id}
                variant={collection.active ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleSelectCollection(collection.id)}
              >
                <CollectionIcon className="mr-2 h-4 w-4" />
                {collection.name}
              </Button>
            )
          })}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Collection
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
    </div>
  )
}

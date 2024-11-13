// src/components/Dashboard/Timeline.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit2, Plus, MoreHorizontal, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface TimelineItem {
  id: string
  title: string
  status: 'not-started' | 'in-progress' | 'completed'
  date?: string
  type?: string
  description?: string
}

interface TimeBlock {
  id: string
  title: string
  period?: string
  items: TimelineItem[]
}

export function Timeline() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      title: 'Week 1',
      period: 'Nov 15 - Nov 21',
      items: [
        { 
          id: '1', 
          title: 'Component Creation', 
          status: 'completed',
          type: 'task',
          description: 'Create the main components for the application'
        },
        { 
          id: '2', 
          title: 'Props & State Quiz', 
          status: 'in-progress',
          type: 'quiz'
        },
      ],
    },
    {
      id: '2',
      title: 'Week 2',
      period: 'Nov 22 - Nov 28',
      items: [
        { 
          id: '3', 
          title: 'Redux Setup', 
          status: 'not-started',
          type: 'task'
        },
        { 
          id: '4', 
          title: 'Todo App Project', 
          status: 'not-started',
          type: 'project'
        },
      ],
    },
  ])

  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null)
  const [editingItem, setEditingItem] = useState<{ blockId: string, item: TimelineItem } | null>(null)

  const handleSaveBlock = (updatedBlock: TimeBlock) => {
    setBlocks(prev => prev.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ))
    setEditingBlock(null)
  }

  const handleAddBlock = (title: string) => {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      title,
      items: []
    }
    setBlocks(prev => [...prev, newBlock])
  }

  const handleUpdateItemStatus = (blockId: string, itemId: string, newStatus: TimelineItem['status']) => {
    setBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block
      return {
        ...block,
        items: block.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      }
    }))
  }

  const handleSaveItem = (blockId: string, updatedItem: TimelineItem) => {
    setBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block
      return {
        ...block,
        items: block.items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      }
    }))
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Block</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  placeholder="Enter block title"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddBlock((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {blocks.map(block => (
          <Card key={block.id} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">{block.title}</h3>
                {block.period && (
                  <span className="text-sm text-muted-foreground">{block.period}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingBlock(block)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {block.items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'quiz' ? "bg-yellow-500" :
                      item.type === 'project' ? "bg-purple-500" :
                      "bg-emerald-500"
                    }`} />
                    <span>{item.title}</span>
                    {item.type && (
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingItem({ blockId: block.id, item })}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateItemStatus(block.id, item.id, 'not-started')}>
                          Set Not Started
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateItemStatus(block.id, item.id, 'in-progress')}>
                          Set In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateItemStatus(block.id, item.id, 'completed')}>
                          Set Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                      item.status === 'in-progress' ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Block Dialog */}
      <Dialog open={!!editingBlock} onOpenChange={() => setEditingBlock(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={editingBlock?.title || ''} 
                onChange={e => editingBlock && setEditingBlock({
                  ...editingBlock,
                  title: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Input 
                value={editingBlock?.period || ''} 
                onChange={e => editingBlock && setEditingBlock({
                  ...editingBlock,
                  period: e.target.value
                })}
              />
            </div>
            <Button onClick={() => editingBlock && handleSaveBlock(editingBlock)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={editingItem?.item.title || ''} 
                onChange={e => editingItem && setEditingItem({
                  ...editingItem,
                  item: { ...editingItem.item, title: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input 
                value={editingItem?.item.type || ''} 
                onChange={e => editingItem && setEditingItem({
                  ...editingItem,
                  item: { ...editingItem.item, type: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={editingItem?.item.description || ''} 
                onChange={e => editingItem && setEditingItem({
                  ...editingItem,
                  item: { ...editingItem.item, description: e.target.value }
                })}
              />
            </div>
            <Button onClick={() => editingItem && handleSaveItem(editingItem.blockId, editingItem.item)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Plan, TimelineItem, TimeBlock } from '@/types'

interface PlanState {
  currentPlan: Plan | null
  updatePlan: (plan: Partial<Plan>) => void
  updateTimeBlock: (blockId: string, updates: Partial<TimeBlock>) => void
  updateItem: (blockId: string, itemId: string, updates: Partial<TimelineItem>) => void
  updateOverview: (overview: string) => void
  setCurrentPlan: (plan: Plan) => void
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      currentPlan: null,

      setCurrentPlan: (plan) => set({ currentPlan: plan }),

      updatePlan: (updates) =>
        set((state) => ({
          currentPlan: state.currentPlan
            ? { ...state.currentPlan, ...updates }
            : null,
        })),

      updateTimeBlock: (blockId, updates) =>
        set((state) => {
          if (!state.currentPlan) return state

          const newTimeBlocks = state.currentPlan.timeBlocks.map((block) =>
            block.id === blockId ? { ...block, ...updates } : block
          )

          return {
            currentPlan: {
              ...state.currentPlan,
              timeBlocks: newTimeBlocks,
            },
          }
        }),
        
      updateItem: (blockId, itemId, updates) =>
        set((state) => {
          if (!state.currentPlan) return state

          const newTimeBlocks = state.currentPlan.timeBlocks.map((block) => {
            if (block.id !== blockId) return block

            const newItems = block.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            )

            return { ...block, items: newItems }
          })

          return {
            currentPlan: {
              ...state.currentPlan,
              timeBlocks: newTimeBlocks,
            },
          }
        }),

      updateOverview: (overview) =>
        set((state) => ({
          currentPlan: state.currentPlan
            ? { ...state.currentPlan, overview }
            : null,
        })),
    }),
    {
      name: 'plan-storage',
    }
  )
)
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Calendar as CalendarIcon, FileText } from 'lucide-react';
  import { Button } from "@/components/ui/button";

const SyncWith = () => {
  return (
    <div>
      <TooltipProvider>
          <div className="fixed bottom-8 right-8 flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {/* Add Google Calendar sync logic */}}
                  className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span>Sync Google Calendar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sync with Google Calendar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {/* Add Notion sync logic */}}
                  className="h-12 px-6 rounded-full bg-gray-800 hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Sync Notion</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sync with Notion</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
    </div>
  )
}

export default SyncWith

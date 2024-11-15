"use client";

import { useState, useEffect } from "react";
import { Timeline } from "./Timeline/Timeline";
import { Sidebar } from "./Sidebar";
import { Editor } from "../Overview/Editor";
import { MetricsGrid } from "./MetricsGrid";
import { CalendarView } from "./Calendar/CalendarView";
import { TaskList } from "./TaskList";
import { v4 as uuidv4 } from "uuid";

import { Code, LayoutDashboard, Dumbbell, FolderKanban, Plus } from 'lucide-react';
import SyncWith from "./SyncWith";

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

interface Collection {
  id: string;
  name: string;
  type: 'course' | 'project' | 'workout' | 'custom';
  active: boolean;
  icon: any;
}

const DEFAULT_OVERVIEW = `<h1>Product Overview</h1>

<p>Our latest product is a game-changing solution that revolutionizes the way you approach your daily tasks. With a sleek and intuitive design, it seamlessly integrates with your existing workflow, empowering you to maximize your productivity and achieve your goals with ease.</p>

<h2>Key Features</h2>

<ul>
  <li>Intuitive user interface for effortless navigation</li>
  <li><strong>Powerful automation</strong> capabilities to streamline your workflows</li>
  <li><em>Real-time collaboration</em> for enhanced teamwork and communication</li>
  <li>Comprehensive analytics and reporting to drive informed decision-making</li>
</ul>

<h2>Benefits</h2>

<ol>
  <li>Increased efficiency and productivity</li>
  <li>Improved collaboration and team coordination</li>
  <li>Enhanced decision-making through data-driven insights</li>
  <li>Seamless integration with your existing tools and systems</li>
</ol>

<p>Experience the future of productivity with our cutting-edge solution. <strong>Contact us today</strong> to schedule a demo and discover how it can transform your business.</p>`;

export default function Dashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "React Course",
      type: "course",
      active: true,
      icon: Code,
    },
    {
      id: "2",
      name: "Personal Projects",
      type: "project",
      active: false,
      icon: FolderKanban,
    },
    {
      id: "3",
      name: "Workout Plan",
      type: "workout",
      active: false,
      icon: Dumbbell,
    },
  ]);

  const [blocks, setBlocks] = useState<TimeBlock[]>([
    {
      id: "1",
      title: "Week 1",
      startDate: new Date("2024-11-15"),
      endDate: new Date("2024-11-21"),
      items: [
        {
          id: "1",
          title: "Component Creation",
          status: "completed",
          type: "task",
          description: "Create the main components for the application",
          date: new Date("2024-11-15"),
          duration: "2 hours",
        },
        {
          id: "2",
          title: "Props & State Quiz",
          status: "in-progress",
          type: "quiz",
          date: new Date("2024-11-18"),
          duration: "1 hour",
        },
      ],
    },
    {
      id: "2",
      title: "Week 2",
      startDate: new Date("2024-11-22"),
      endDate: new Date("2024-11-28"),
      items: [
        {
          id: "3",
          title: "Redux Setup",
          status: "not-started",
          type: "task",
          date: new Date("2024-11-22"),
          duration: "3 hours",
        },
        {
          id: "4",
          title: "Todo App Project",
          status: "not-started",
          type: "project",
          date: new Date("2024-11-25"),
          duration: "4 hours",
        },
      ],
    },
  ]);

  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("projectOverview");
      if (saved) {
        setOverview(saved);
      }
    } catch (error) {
      console.error("Error loading overview from localStorage:", error);
    }
  }, []);

  const handleAddBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: "New Block",
        startDate: new Date(),
        endDate: new Date(),
        items: [],
      },
    ]);
  };

  const handleUpdateBlock = (updatedBlock: TimeBlock) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  };

  const handleUpdateOverview = (content: string) => {
    setOverview(content);
    try {
      localStorage.setItem("projectOverview", content);
    } catch (error) {
      console.error("Error saving overview:", error);
    }
  };

  const handleAddCollection = (collection: Collection) => {
    setCollections(prev => [...prev, collection]);
  };

  const handleSelectCollection = (id: string) => {
    setCollections(prev => prev.map(collection => ({
      ...collection,
      active: collection.id === id,
    })));
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collections={collections}
        onAddCollection={handleAddCollection}
        onSelectCollection={handleSelectCollection}
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
      <main 
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? 'ml-64' : 'ml-16'
        }`}
      >
        <SyncWith />
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <MetricsGrid />
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="col-span-2">
                <h1 className="text-2xl font-bold mb-6">Calendar</h1>
                <CalendarView blocks={blocks} />
              </div>
              <div className="col-span-3">
                <Timeline
                  blocks={blocks}
                  onAddBlock={handleAddBlock}
                  onUpdateBlock={handleUpdateBlock}
                />
              </div>
            </div>
            <div className="w-full">
              <Editor
                apiResponse={overview}
                onSave={handleUpdateOverview}
              />
            </div>
            <div className="w-full mb-10">
              <TaskList
                blocks={blocks}
                onUpdateItem={(updatedItem) => {
                  setBlocks((prevBlocks) =>
                    prevBlocks.map((block) => ({
                      ...block,
                      items: block.items.map((item) => 
                        item.id === updatedItem.id ? updatedItem : item
                      ),
                    }))
                  );
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export type { TimelineItem, TimeBlock, Collection };
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const projectSummary = `
# Project Overview

This project is a comprehensive web application that aims to streamline the management of various tasks, projects, and events. It provides a centralized platform for users to stay organized, collaborate, and track their progress effectively.

## Key Features

- **Calendar View**: A visually appealing calendar interface that displays upcoming events, tasks, and projects, allowing users to quickly view and manage their schedules.
- **Task Management**: A robust task management system that enables users to create, assign, and track the progress of individual tasks, with features like due dates, status updates, and reminders.
// Rest of the content remains the same
`;

export function Editor() {
  const [isEditing, setIsEditing] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: projectSummary,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-lg m-4 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg w-full">
      {isEditing ? (
        <>
          <div className="border-b p-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-secondary' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-secondary' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          <EditorContent editor={editor} className="min-h-[200px] p-4" />
        </>
      ) : (
        <div className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-lg m-4 p-4">
          <ReactMarkdown>{projectSummary}</ReactMarkdown>
        </div>
      )}

      <div className="flex justify-end p-4">
        <Button
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>
    </div>
  );
}
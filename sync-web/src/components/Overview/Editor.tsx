import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { debounce } from 'lodash'

interface EditorProps {
  apiResponse: string
  onSave: (content: string) => void
}

export function Editor({ apiResponse, onSave }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading,
      BulletList,
      ListItem
    ],
    content: apiResponse,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-lg p-4 focus:outline-none min-h-[300px] rounded-md shadow-md w-full max-w-none'
      }
    },
    onUpdate: debounce(({ editor }) => {
      const content = editor.getHTML()
      onSave(content)
    }, 750)
  })

  useEffect(() => {
    if (editor && apiResponse !== editor.getHTML()) {
      editor.commands.setContent(apiResponse)
    }
  }, [editor, apiResponse])

  if (!editor) {
    return null
  }

  return (
    <div className="mb-8 mt">
      {/* <div className="border-b p-2 flex gap-2 sticky top-0 bg-background rounded-t-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-secondary' : ''}
        >
          <h1>H1</h1>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
        >
          <h2>H2</h2>
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
      </div> */}

        <EditorContent editor={editor} />
    </div>
  )
}
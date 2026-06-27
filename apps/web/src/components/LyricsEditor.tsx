import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'
import { BoldIcon, ItalicIcon } from '@heroicons/react/24/outline'

type Props = { value: string; onChange: (html: string) => void }

const FONT_SIZES = [
  { label: 'Pequeno', value: '14px' },
  { label: 'Normal', value: '' },
  { label: 'Grande', value: '20px' },
  { label: 'Muito grande', value: '26px' },
]

export default function LyricsEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[180px] px-3 py-2 text-slate-800 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const currentSize = editor.getAttributes('textStyle').fontSize ?? ''

  function setSize(size: string) {
    if (size) {
      editor!.chain().focus().setFontSize(size).run()
    } else {
      editor!.chain().focus().unsetFontSize().run()
    }
  }

  const btn = (active: boolean) =>
    `grid h-8 w-8 place-items-center rounded-md text-sm transition ${
      active ? 'bg-teal-100 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <div className="rounded-lg border border-slate-300">
      <div className="flex items-center gap-1 border-b border-slate-200 p-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive('bold'))}
          aria-label="Negrito"
        >
          <BoldIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive('italic'))}
          aria-label="Itálico"
        >
          <ItalicIcon className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <select
          value={currentSize}
          onChange={(e) => setSize(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 outline-none"
        >
          {FONT_SIZES.map((size) => (
            <option key={size.label} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
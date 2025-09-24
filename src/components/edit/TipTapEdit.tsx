import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { Inter } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import Placeholder from '@tiptap/extension-placeholder';
import { useRouter } from 'next/navigation';
import BoldButton from '../icons/BoldButton';
import ItalicsButton from '../icons/ItalicsButton';
import UnderlineButton from '../icons/UnderlineButton';
import Strikethrough from '../icons/Strikethrough';
import Alignleft from '../icons/Alignleft';
import Aligncenter from '../icons/Aligncenter';
import Alignright from '../icons/Alignright';
import BulletListButton from '../icons/BulletListButton';
import OrderedListButton from '../icons/OrderListButton';
import { fetchChapterToEdit, handleEditChapter } from '../../../functions/edit/fetch';

const inter = Inter({ subsets: ["latin"] });

type Props = {

  userId : string;
  draftId : string;
  index : number;
  setLoading: Function
}

function TipTapEdit({index, userId, draftId, setLoading}: Props) {
  const router = useRouter(); 

  const [content, setContent] = useState<string>('');
  const [titleContent, setTitleContent] = useState<string>(''); 
  const [unsavedChanges, setUnsavedChanges] = useState(false); // Track unsaved changes

  useEffect(() => {
    if (draftId && index !== null) {
      fetchChapterToEdit(userId, draftId, index, setContent, setTitleContent);
    }
  }, [draftId, index]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const onChange = (value: string) => {
    setContent(value);
    localStorage.setItem('unsavedContent', value);
    setUnsavedChanges(true);
  };


  const titleOnChange = (value: string) => {
    setTitleContent(value);
    localStorage.setItem('unsavedTitleContent', value);
    setUnsavedChanges(true);
  };
  
  const handleSubmit = async() => { 
    setUnsavedChanges(false);  
    setLoading(true);
    //perform the operation i need
    localStorage.removeItem('unsavedContent');
    localStorage.removeItem('unsavedTitleContent');
    await handleEditChapter(userId, titleContent, content, index, draftId); 
    router.push(`/draft/${draftId}`);
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      CharacterCount.configure({
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-3'
        }
      }), 
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-3'
        }
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false

  })

  const titleEditor = useEditor({
    extensions: [
      StarterKit, 
      Placeholder.configure({
        placeholder: 'Enter chapter title...',
      }),
    ],
    content: titleContent,
    onUpdate: ({ editor }) => {
      titleOnChange(editor.getText());
    },
    immediatelyRender: false

  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
    if (titleEditor && titleContent !== titleEditor.getText()) {
      titleEditor.commands.setContent(titleContent || '');
    }
  }, [content, titleContent, editor, titleEditor]);

  return (
    <main className={`flex md:flex-col w-full h-full items-center space-x-2 p-4 ${inter.className}`}> 
      <div className="relative flex flex-col w-full h-full basis-1/4 bg-[#171717] rounded-2xl text-white">

        <div className="flex flex-col md:flex-row md:w-full ss:hidden">
            <div className="flex w-full space-x-1 px-2 mt-2 md:px-1 md:mt-0">
              <p 
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex text-2xl md:text-base sm:text-sm items-center justify-center font-semibold font-mono ${editor?.isActive('heading', { level: 1 }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md text-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md text-slate-500'}`}
              >H1</p>

              <p 
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`flex text-2xl md:text-base sm:text-sm items-center justify-center font-semibold font-mono ${editor?.isActive('heading', { level: 2 }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md text-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md text-slate-500'}`}
              >H2</p>

              
              <p 
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex text-2xl md:text-base sm:text-sm items-center justify-center font-mono font-semibold ${editor?.isActive('heading', { level: 3 }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md text-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md text-slate-500'}`}
              >H3</p>

            </div>

            <div className="flex w-full space-x-1 px-2 mt-2 md:mt-0 md:text-base sm:text-sm">
              <BoldButton  
                className={`${editor?.isActive('bold') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              />

              <ItalicsButton 
                className={`${editor?.isActive('italic') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              />

              <UnderlineButton 
                className={`${editor?.isActive('underline') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              />

              <Strikethrough
                className={`${editor?.isActive('strike') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              />
            </div>

            <div className="flex w-full space-x-1 px-2 mt-2 md:mt-0 md:text-base sm:text-sm">
              <Alignleft 
                className={`${editor?.isActive({ textAlign: 'left' }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              />

              <Aligncenter 
                className={`${editor?.isActive({ textAlign: 'center' }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              />

              <Alignright
                className={`${editor?.isActive({ textAlign: 'right' }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              />

            </div>

            <div className="flex w-full space-x-1 px-2 mt-2 md:mt-0 md:text-base sm:text-sm">
              <BulletListButton 
                className={`${editor?.isActive('bulletList') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              />

              <OrderedListButton 
                className={`${editor?.isActive('orderedList') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#262626] rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              />
            </div>

        </div>

        <div className="absolute bottom-0 w-full md:flex md:relative md:items-center md:justify-center">

          <div className="text-slate-400 text-sm p-4">
            <p> {editor?.storage.characterCount.characters()} characters </p>
            <p>{editor?.storage.characterCount.words()} words</p>
          </div>
    

          <div onClick={handleSubmit} className="hover:cursor-pointer bg-indigo-600 p-4 md:p-2 md:mb-0 md:w-1/3 md:text-lg mb-4 rounded-2xl mx-4 font-semibold text-xl text-center">
              <p>Save</p>
          </div>
      
        </div>

      </div>

      <div className="flex flex-col space-y-1 w-full h-full basis-3/4  rounded-2xl text-white">
        <div className="flex basis-1/12 rounded-2xl bg-[#2a2929]">
          <EditorContent editor={titleEditor} className="self-center w-full"/>
        </div>
        <div className="flex basis-11/12 overflow-hidden w-full h-full rounded-2xl bg-[#2a2929]">
            {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="flex p-1 bg-white border border-gray-500 text-sm space-x-1 rounded-lg text-black">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}

                    className={editor.isActive('bold') ? 'is-active bg-purple-700 text-white rounded-lg p-1' : 'rounded-lg p-1'}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active bg-purple-700 text-white rounded-lg p-1' : 'rounded-lg p-1'}
                  >
                    Italic
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active bg-purple-700 text-white rounded-lg p-1' : 'rounded-lg p-1'}
                  >
                    Strike
                  </button>

                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'is-active bg-purple-700 text-white rounded-lg p-1' : 'rounded-lg p-1'}
                  >
                    Underline
                  </button>
                </div>
              </BubbleMenu>
            }
          <EditorContent editor={editor} className="w-full"/>
        </div>
          
      </div>

  </main>
  )
}

export default TipTapEdit
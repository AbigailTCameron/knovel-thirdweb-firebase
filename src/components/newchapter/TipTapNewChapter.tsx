import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
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
import { handleSubmitAnotherDraftChapter } from '../../../functions/newChapter/fetch';


type Props = {
  userId : string;
  id : string;
  setLoading : (value: boolean) => void;
}

function TipTapNewDraft({ id, userId, setLoading}: Props) {
  const router = useRouter();

  const [content, setContent] = useState<string>('');
  const [titleContent, setTitleContent] = useState<string>('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false); // 👈 prevent double-clicks


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);


  const onChange = (value: string) => {
    setContent(value);
    localStorage.setItem('unsavedContent', value);
    setHasUnsavedChanges(true);
  };

  const titleOnChange = (value: string) => {
    setTitleContent(value);
    localStorage.setItem('unsavedTitleContent', value);
    setHasUnsavedChanges(true);
  };
  

  const handleSubmit = async() => { 
    if (saving) return;                // 👈 double-click guard
    if (!userId || !id) return;        // sanity guard
    if (!titleContent.trim() && !content.trim()) return; // optional: avoid empty chapter

    setHasUnsavedChanges(false);
    setSaving(true);
    setLoading(true);

    try{
      const result = await handleSubmitAnotherDraftChapter(
        userId, id, titleContent, content, setError
      );

      if (error) return;

      localStorage.removeItem('unsavedContent');
      localStorage.removeItem('unsavedTitleContent');

      router.prefetch(`/draft/${userId}/${id}`);
      await router.push(`/draft/${userId}/${id}`);
    }finally {
      setLoading(false);               // ✅ always hide overlay
      setSaving(false);
    } 
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
  })


  return (
    <main className="flex w-full md:flex-col h-full items-center space-x-2 p-4"> 
      <div className="relative flex flex-col w-full h-full basis-1/4 bg-[#7F60F9]/5 backdrop-blur-lg border border-[#7F60F9]/15 rounded-2xl text-white">

        {/* <ImageUploader2 
          imageFile={imageFile}
          bookUrl={bookUrl}
          userId={userId}
          draftId={id}
        />
         */}
        <div className="flex flex-col md:flex-row md:w-full ss:hidden">
            <div className="flex w-full space-x-1 px-2 mt-2 md:px-1 md:mt-0">
              <p 
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex text-2xl md:text-base sm:text-sm items-center justify-center font-semibold font-mono ${editor?.isActive('heading', { level: 1 }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md text-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md text-slate-500'}`}
              >H1</p>

              <p 
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`flex text-2xl md:text-base sm:text-sm items-center justify-center font-semibold font-mono ${editor?.isActive('heading', { level: 2 }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md text-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md text-slate-500'}`}
              >H2</p>

              
              <p 
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex text-2xl md:text-base sm:text-sm items-center justify-center font-mono font-semibold ${editor?.isActive('heading', { level: 3 }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md text-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md text-slate-500'}`}
              >H3</p>

            </div>

            <div className="flex w-full space-x-1 px-2 mt-2 md:px-1 md:mt-0 md:text-base sm:text-sm">
              <BoldButton  
                className={`${editor?.isActive('bold') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              />

              <ItalicsButton 
                className={`${editor?.isActive('italic') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              />

              <UnderlineButton 
                className={`${editor?.isActive('underline') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              />

              <Strikethrough
                className={`${editor?.isActive('strike') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              />
            </div>

            <div className="flex w-full space-x-1 px-2 mt-2 md:px-1 md:mt-0 md:text-base sm:text-sm">
              <Alignleft 
                className={`${editor?.isActive({ textAlign: 'left' }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              />

              <Aligncenter 
                className={`${editor?.isActive({ textAlign: 'center' }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              />

              <Alignright
                className={`${editor?.isActive({ textAlign: 'right' }) ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              />

            </div>


            <div className="flex w-full space-x-1 px-2 mt-2 md:px-1 md:mt-0 md:text-base sm:text-sm">
              <BulletListButton 
                className={`${editor?.isActive('bulletList') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              />

              <OrderedListButton 
                className={`${editor?.isActive('orderedList') ? 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-white rounded-md stroke-slate-500' : 'hover:cursor-pointer w-1/4 p-2 size-14 md:size-10 sm:size-8 bg-[#7F60F9]/5 backdrop-blur-lg rounded-md stroke-slate-500'}`}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              />
            </div>
        </div>

        <div className="absolute bottom-0 w-full px-4 md:px-4 flex flex-col md:relative md:items-stretch">

          <div className="text-slate-400 text-sm p-4">
            <p> {editor?.storage.characterCount.characters()} characters </p>
            <p>{editor?.storage.characterCount.words()} words</p>
          </div>
    
          
          <button disabled={saving} onClick={handleSubmit} className="hover:cursor-pointer bg-indigo-600 p-4 mb-4 md:p-2 md:mb-0 md:w-1/3 md:text-lg rounded-2xl mx-4 font-semibold text-xl text-center">
              <p>Save</p>
          </button>
      
        </div>

      </div>

      <div className="flex flex-col space-y-1 w-full h-full basis-3/4  rounded-2xl text-white">
        <div className="flex basis-1/12 rounded-2xl bg-[#7F60F9]/5 backdrop-blur-lg border border-[#7F60F9]/15">
          <EditorContent editor={titleEditor} className="self-center w-full"/>
        </div>
        <div className="flex basis-11/12 overflow-hidden w-full h-full rounded-2xl bg-[#7F60F9]/5 backdrop-blur-lg border border-[#7F60F9]/15">
          <EditorContent editor={editor} className="w-full"/>
        </div>
          
      </div>
    </main>
  )
}

export default TipTapNewDraft
"use client"

import React, { useState } from 'react'
import Editor from '@/components/Editor';
function Page() {
  const [editorContent, setEditorContent] = useState<string>("");
  console.log(editorContent);
  return (
    <div>
      <Editor handleClick={() => {}} setEditorContent={setEditorContent} />
    </div>
  )
}

export default Page

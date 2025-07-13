"use client";

import { motion } from "framer-motion";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { abcdef } from "@uiw/codemirror-theme-abcdef";
import { Button } from "@/components/ui/button";

function Editor({
  handleClick,
  setEditorContent,
  isSubmitting = false,
}: {
  handleClick: () => void;
  setEditorContent: (value: string) => void;
  isSubmitting?: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-6 rounded-xl w-[800px]"
    >
      <div className="mb-4" style={{ width: "100%" }}>
        <CodeMirror
          value="console.log('hello world!');"
          onChange={(value) => setEditorContent(value)}
          theme={abcdef}
          height="800px"
          extensions={[markdown()]}
          style={{ fontSize: "20px", width: "100%" }}
        />
      </div>

      <div className="flex justify-center">
        <Button
          className="bg-blue-500 text-white"
          onClick={handleClick}
          loading={isSubmitting}
          loadingText="Submitting..."
        >
          Submit
        </Button>
      </div>
    </motion.div>
  );
}

export default Editor;

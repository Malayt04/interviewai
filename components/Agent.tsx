"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import Editor from "./Editor";
import { Button } from "@/components/ui/button";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  credits,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const [editorVisible, setEditorVisible] = useState(false);
  const [isEditorSubmitting, setIsEditorSubmitting] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  // Monitor for writing prompts in messages to show the editor button
  useEffect(() => {
    if (
      lastMessage.toLowerCase().includes("write") &&
      callStatus === CallStatus.ACTIVE
    ) {
      // Instead of automatically showing the editor, we'll make a button visible
      console.log("Writing prompt detected");
    }
  }, [lastMessage, callStatus]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      if (credits! <= 2) {
        alert("You don't have enough credits to generate an interview");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      await vapi.start("0b754c5b-f8c9-4e8b-9fdb-f876eb8b8d04", {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      if (credits! < 8) {
        alert("You don't have enough credits to start an interview");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      console.log("formattedQuestions", formattedQuestions);

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const shouldShowEditorButton = useMemo(() => {
    return (
      lastMessage.toLowerCase().includes("write") &&
      callStatus === CallStatus.ACTIVE
    );
  }, [lastMessage, callStatus]);

  const openEditor = () => {
    setEditorVisible(true);
  };

  const handleEditorSubmit = async () => {
    setIsEditorSubmitting(true);
    try {
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessages((prev) => [
        ...prev,
        { role: "user", content: "Here is the code I wrote: " + editorContent },
      ]);
      setEditorVisible(false);
    } finally {
      setIsEditorSubmitting(false);
    }
  };

  return (
    <>
      <div className="call-view flex justify-between items-center relative w-full max-w-4xl mx-auto px-4">
        {/* AI Interviewer Card - Now on the left */}
        <motion.div
          layout
          animate={{ x: editorVisible ? -100 : 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="card-interviewer z-10"
        >
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </motion.div>

        {/* Editor - Positioned in the center */}
        <AnimatePresence>
          {editorVisible && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="z-20 bg-white shadow-xl p-4 rounded-xl border border-gray-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3"
            >
              <Editor
                handleClick={handleEditorSubmit}
                setEditorContent={setEditorContent}
                isSubmitting={isEditorSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Card - Now on the right */}
        <motion.div
          layout
          animate={{ x: editorVisible ? 100 : 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="card-border z-10"
        >
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </motion.div>
      </div>

      {/* Transcript with Editor Button */}
      {messages.length > 0 && (
        <div className="transcript-border mt-8 relative">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>

          {/* Editor Button - Only shows when a writing prompt is detected */}
          {shouldShowEditorButton && !editorVisible && (
            <Button
              onClick={openEditor}
              className="absolute right-4 bottom-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Open Editor
            </Button>
          )}
        </div>
      )}

      {/* Call / Disconnect Button */}
      <div className="w-full flex justify-center mt-6">
        {callStatus !== "ACTIVE" ? (
          <Button
            className="relative btn-call"
            onClick={handleCall}
            loading={callStatus === "CONNECTING"}
            loadingText="Connecting..."
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </Button>
        ) : (
          <Button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </Button>
        )}
      </div>
    </>
  );
};

export default Agent;

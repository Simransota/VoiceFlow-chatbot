"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Mic } from "lucide-react"; // Make sure lucide-react is installed
import { useRouter } from "next/navigation";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  disabled?: boolean
}

interface TypewriterProps {
  text: string | string[]
  speed?: number
  waitTime?: number
  deleteSpeed?: number
  className?: string
  cursorChar?: string
}

function Typewriter({
  text,
  speed = 70,
  waitTime = 1500,
  deleteSpeed = 40,
  className = "",
  cursorChar = "_"
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = Array.isArray(text) ? text[currentTextIndex] : text;

  useEffect(() => {
    if (isTyping && !isDeleting) {
      if (currentIndex < currentText.length) {
        // Typing
        const timeout = setTimeout(() => {
          setDisplayedText(prevText => prevText + currentText[currentIndex]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, speed);

        return () => clearTimeout(timeout);
      } else {
        // Finished typing current text
        setIsTyping(false);

        if (Array.isArray(text)) {
          const timeout = setTimeout(() => {
            setIsDeleting(true);
            setIsTyping(true);
          }, waitTime);

          return () => clearTimeout(timeout);
        }
      }
    } else if (isDeleting) {
      if (displayedText.length > 0) {
        // Deleting
        const timeout = setTimeout(() => {
          setDisplayedText(prevText => prevText.slice(0, -1));
        }, deleteSpeed);

        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentIndex(0);
        setCurrentTextIndex((prevIndex) =>
          (prevIndex + 1) % (Array.isArray(text) ? text.length : 1)
        );
      }
    }
  }, [currentIndex, currentText, currentTextIndex, displayedText, isDeleting, isTyping, speed, text, waitTime, deleteSpeed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">{cursorChar}</span>
    </span>
  );
}

export default function ChatInput({ value, onChange, onSend, onKeyDown, disabled }: ChatInputProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // Hide the placeholder when input has a value
  useEffect(() => {
    setShowPlaceholder(value.length === 0);
  }, [value]);

  const [recordings, setRecordings] = useState<{ duration: number; timestamp: Date }[]>([]);

  const handleStop = (duration: number) => {
    setRecordings(prev => [...prev.slice(-4), { duration, timestamp: new Date() }]);
  };

  return (
    <div className="flex items-end gap-2 relative">
      <div className="flex-1 relative">
        {/* Only show input when not recording */}
        {!isRecording && (
          <>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder=""
              disabled={disabled}
              className="w-full text-lg p-0 border-none outline-none focus:ring-0 focus:outline-none bg-transparent"
            />
            {showPlaceholder && (
              <div className="absolute inset-0 pointer-events-none text-gray-400">
                <Typewriter
                  text={[
                    "Type here...",
                    "Ask me anything...",
                    "Share your thoughts...",
                    "What's on your mind?",
                    "How can I help you today?"
                  ]}
                  speed={70}
                  waitTime={20}
                  deleteSpeed={40}
                  cursorChar="|"
                />
              </div>
            )}
          </>
        )}

        {/* Show visualizer when recording */}
        {isRecording && (
          <div className="flex  items-center justify-center w-full">
            
            <div className="h-4 w-64 flex items-center justify-center gap-0.5">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full transition-all duration-300 bg-blue-600  animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            
              </div>
          
          
        )}
      </div>

      {/* Voice input button */}
      <AIVoiceInput
        onStart={() => {
          console.log("Recording started");
          setIsRecording(true);
        }}
        onStop={(duration) => {
          setIsRecording(false);
          handleStop(duration);
        }}
        compact
        className="flex-shrink-0"
      />

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm font-medium"
      >
        Send
      </button>

      <span className="text-sm text-gray-500 ml-2">Or Press Enter ↵</span>
    </div>
  );
}

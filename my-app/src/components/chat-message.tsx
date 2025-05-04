import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
    text: string
    isUser: boolean
    isTyping?: boolean
  }
  
  export default function ChatMessage({ text, isUser, isTyping }: ChatMessageProps) {
    return (
      <div
        className={cn(
         isTyping ? "text-gray-300 text-3xl font-medium" : "text-black text-3xl font-medium"
        )}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    )
  }
  
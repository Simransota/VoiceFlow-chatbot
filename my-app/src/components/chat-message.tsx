import { cn } from "@/lib/utils"

interface ChatMessageProps {
    text: string
    isUser: boolean
    isTyping?: boolean
  }
  
  export default function ChatMessage({ text, isUser, isTyping }: ChatMessageProps) {
    return (
      <div
        className={cn(
          isUser ? "text-black text-lg" : isTyping ? "text-gray-300 text-3xl font-medium" : "text-black text-3xl font-medium"
        )}
      >
        {text}
      </div>
    )
  }
  
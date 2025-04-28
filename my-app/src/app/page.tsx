"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ChatInput from "@/components/chat-input"
import ChatMessage from "@/components/chat-message"
import ThinkingIndicator from "@/components/thinking-indicator"
import { LightPullThemeSwitcher } from "@/components/ui/light-pull-theme-switcher"
import { Spotlight } from "@/components/ui/spotlight"
import { GridPatternSpotlight } from "@/components/demo"
import useScreenSize from "@/app/hooks/use-screen-size"
import PixelTrail from "@/fancy/components/background/pixel-trail"
import CSSBox from "@/components/ui/3d-css-box"

interface TextStreamProps {
  text: string
  speed?: number
  onComplete?: () => void
}

function TextStream({ text, speed = 30, onComplete }: TextStreamProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);

  const screenSize = useScreenSize()
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default function Home() {
  const screenSize = useScreenSize()
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Great! I'll be here whenever you're ready to chat. Just let me know!", isUser: false },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingMessage, setCurrentTypingMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  

  // Sample responses for demo purposes
  const botResponses = [
    "Hello! Can you tell me your name and a bit about your business and what you're looking to build? I'll send you a summary by email after.",
    "Welcome to the Voiceflow AI agent on Webflow! You can build an experience like this to replace complex forms.",
    "That's interesting! Could you tell me more about your specific requirements?",
    "I understand. Let me suggest a few options that might work better for your needs.",
    "Great! I've noted down your preferences. Is there anything else you'd like to add?",
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentTypingMessage, isThinking, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }])
    setInputValue("")

    // Show thinking indicator first
    setIsThinking(true)

    // Simulate thinking delay
    setTimeout(() => {
      // Hide thinking indicator and show typing effect
      setIsThinking(false)
      setIsTyping(true)

      // Get random response
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      setCurrentTypingMessage(randomResponse)

      // When typing is complete, add the message
      const handleTypingComplete = () => {
        setIsTyping(false)
        setMessages((prev) => [...prev, { text: randomResponse, isUser: false }])
        setCurrentTypingMessage("")
      }

      // TextStream will handle the typing effect and call onComplete when done
    }, 2000) // Show thinking indicator for 2 seconds
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col">
     
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 16 : 24}
          fadeDuration={500}
          pixelClassName="bg-blue-600"
        />
      
        <header className="border-b border-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec5ff90_voiceflow-logo-dark-no-shadow.svg" />
            </Link>
          </div>
          <Link href="#" className="bg-black text-white px-4 py-2 rounded-full flex items-center text-sm font-medium">
            Get started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
        </header>
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="p-6 md:p-12 flex-1 flex flex-col">
            <div className="mb-6">
              <Link href="#" className="text-blue-600 hover:underline">
                Webflow X Voiceflow
              </Link>
            </div>
            <div className="flex-1 flex flex-col">
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-6">
                {messages.length > 0 && (
                  <ChatMessage
                    text={messages[messages.length - 1].text}
                    isUser={messages[messages.length - 1].isUser}
                  />
                )}


                {/* Show thinking indicator */}
                {isThinking && <ThinkingIndicator />}

                {/* Show typing effect using TextStream */}
                {isTyping && (
                  <div className="text-3xl text-gray-300 font-medium">
                    <TextStream
                      text={currentTypingMessage}
                      speed={30}
                      onComplete={() => {
                        setIsTyping(false)
                        setMessages((prev) => [...prev, { text: currentTypingMessage, isUser: false }])
                        setCurrentTypingMessage("")
                      }}
                    />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                onKeyDown={handleKeyDown}
                disabled={isTyping || isThinking}
              />
            </div>
          </div>

          <div className="hidden md:block relative flex-1">
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
            <CSSBox
        ref={null}
        width={320}
        height={320}
        depth={320}
        perspective={800}
        draggable
        faces={{
          front:  <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg"  alt="Front"  />,
          back:   <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg"   alt="Back"   />,
          left:   <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg"   alt="Left"   />,
          right:  <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg"  alt="Right"  />,
          top:    <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg"    alt="Top"    />,
          bottom: <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg" alt="Bottom" />,
        }}
      />
              {/* <img src="https://cdn.prod.website-files.com/67c8b85bd35a3a51dec5fdff/67c8b85bd35a3a51dec6018c_Group%201%20(1).svg" /> */}
            </div>
          </div>
        </div>

        <footer className="p-4 flex justify-end">
          <Link href="#" className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="#4353FF"
                stroke="#4353FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#4353FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#4353FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Made in Webflow
          </Link>
        </footer>
        </div>
    </main>
  )
}
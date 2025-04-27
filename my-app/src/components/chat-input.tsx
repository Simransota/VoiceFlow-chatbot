"use client"

import type React from "react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  disabled?: boolean
}

export default function ChatInput({ value, onChange, onSend, onKeyDown, disabled }: ChatInputProps) {
  return (
    <div className="flex items-end gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type here..."
        disabled={disabled}
        className="flex-1 text-lg p-0 border-none outline-none focus:ring-0 focus:outline-none bg-transparent"
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm font-medium"
      >
        Send
      </button>
      <span className="text-sm text-gray-500 ml-2">Or Press Enter ↵</span>
    </div>
  )
}

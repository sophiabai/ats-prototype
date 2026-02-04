import * as React from "react"
import { Plus, AtSign, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  disabled?: boolean
  className?: string
  showAttachButton?: boolean
  showMentionButton?: boolean
  minHeight?: string
}

export function SearchInput({
  placeholder = "What are you looking for?",
  value,
  onChange,
  onSubmit,
  disabled = false,
  className,
  showAttachButton = true,
  showMentionButton = true,
  minHeight = "200px",
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(value || "")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const currentValue = value !== undefined ? value : internalValue
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleSubmit = () => {
    if (!currentValue.trim() || disabled) return
    onSubmit?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={cn("relative border rounded-lg", className)}>
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "resize-none border-0 focus-visible:ring-0 pr-16 text-base",
          minHeight && `min-h-[${minHeight}]`
        )}
        style={{ minHeight }}
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        {showAttachButton && (
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={disabled}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
        {showMentionButton && (
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={disabled}>
            <AtSign className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="absolute bottom-4 right-4">
        <Button 
          size="icon" 
          className="h-8 w-8 rounded-md"
          onClick={handleSubmit}
          disabled={disabled || !currentValue.trim()}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}


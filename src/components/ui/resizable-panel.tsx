import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  storageKey?: string
  className?: string
  onResize?: (width: number) => void
}

export function ResizablePanel({
  children,
  defaultWidth = 300,
  minWidth = 200,
  maxWidth = 800,
  storageKey,
  className,
  onResize,
}: ResizablePanelProps) {
  const [width, setWidth] = React.useState(() => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      if (saved) return parseInt(saved, 10)
    }
    return defaultWidth
  })
  const [isResizing, setIsResizing] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, width.toString())
    }
    onResize?.(width)
  }, [width, storageKey, onResize])

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  React.useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return
      
      const panelRect = panelRef.current.getBoundingClientRect()
      const newWidth = e.clientX - panelRect.left
      
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth])

  return (
    <div
      ref={panelRef}
      className={cn("relative flex-shrink-0", className)}
      style={{ width: `${width}px` }}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-border active:bg-primary transition-colors z-10",
          isResizing && "bg-primary"
        )}
        style={{ cursor: 'col-resize' }}
      />
    </div>
  )
}


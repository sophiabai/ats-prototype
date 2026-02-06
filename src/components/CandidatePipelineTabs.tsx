import { useEffect, useState, useRef, useCallback } from 'react'
import { LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type FilterStatus =
  | 'new'
  | 'messaged'
  | 'replied'
  | 'interview'
  | 'hired'
  | 'rejected'
  | 'not_interested'
  | 'snoozed'

interface FilterTab {
  id: FilterStatus
  label: string
}

const defaultFilterTabs: FilterTab[] = [
  { id: 'new', label: 'New' },
  { id: 'messaged', label: 'Messaged' },
  { id: 'replied', label: 'Replied' },
  { id: 'interview', label: 'Interview' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'not_interested', label: 'Not interested' },
  { id: 'snoozed', label: 'Snoozed' },
]

interface CandidatePipelineTabsProps {
  tabs?: FilterTab[]
  value?: FilterStatus
  onValueChange?: (value: FilterStatus) => void
  defaultValue?: FilterStatus
  /** Counts to show next to specific tab labels, keyed by tab id */
  counts?: Partial<Record<FilterStatus, number>>
  className?: string
}

export function CandidatePipelineTabs({
  tabs = defaultFilterTabs,
  value: valueProp,
  onValueChange: onValueChangeProp,
  defaultValue = 'new',
  counts = {},
  className,
}: CandidatePipelineTabsProps) {
  const [internalValue, setInternalValue] = useState<FilterStatus>(defaultValue)
  const activeFilter = valueProp ?? internalValue

  const setActiveFilter = useCallback(
    (newValue: FilterStatus) => {
      if (valueProp === undefined) {
        setInternalValue(newValue)
      }
      onValueChangeProp?.(newValue)
    },
    [valueProp, onValueChangeProp]
  )

  // Responsive tab calculation
  const containerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [visibleTabsCount, setVisibleTabsCount] = useState(tabs.length)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const calculateVisibleTabs = () => {
      const containerWidth = container.offsetWidth
      const tabsEl = tabsRef.current
      if (!tabsEl) return

      // Measure each tab's natural width by temporarily showing all
      const prevCount = visibleTabsCount
      setVisibleTabsCount(tabs.length)

      // Use requestAnimationFrame so DOM has updated
      requestAnimationFrame(() => {
        const tabButtons = tabsEl.querySelectorAll('[data-slot="tabs-trigger"], [role="tab"]')
        if (!tabButtons.length) {
          return
        }

        const overflowButtonWidth = 100 // approximate width of "N more..." button
        let totalWidth = 8 // padding
        let fitCount = 0

        for (let i = 0; i < tabButtons.length; i++) {
          const tabWidth = (tabButtons[i] as HTMLElement).offsetWidth + 4 // gap
          const remainingForOverflow =
            i < tabButtons.length - 1 ? overflowButtonWidth : 0

          if (totalWidth + tabWidth + remainingForOverflow <= containerWidth) {
            totalWidth += tabWidth
            fitCount++
          } else {
            break
          }
        }

        // If all tabs fit, show all; otherwise show fitCount
        const newCount = fitCount >= tabs.length ? tabs.length : Math.max(1, fitCount)
        if (newCount !== prevCount) {
          setVisibleTabsCount(newCount)
        }
      })
    }

    const observer = new ResizeObserver(() => {
      calculateVisibleTabs()
    })

    observer.observe(container)
    calculateVisibleTabs()

    return () => observer.disconnect()
  }, [tabs.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className={className}>
      <Tabs
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as FilterStatus)}
        className="flex-shrink min-w-0"
      >
        <TabsList ref={tabsRef} className="h-auto p-1 bg-transparent flex-nowrap">
          {tabs.slice(0, visibleTabsCount).map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-3 py-1 text-sm whitespace-nowrap"
            >
              {tab.label}
              {counts[tab.id] !== undefined && (
                <span className="ml-1.5 bg-primary-foreground/20 text-current rounded-full px-1.5 text-xs">
                  {counts[tab.id]}
                </span>
              )}
            </TabsTrigger>
          ))}
          {visibleTabsCount < tabs.length && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={
                    tabs.slice(visibleTabsCount).some((t) => t.id === activeFilter)
                      ? 'default'
                      : 'ghost'
                  }
                  size="sm"
                  className="rounded-full px-3 py-1 text-sm h-auto"
                >
                  <LayoutList className="h-3.5 w-3.5 mr-1" />
                  {tabs.length - visibleTabsCount} more...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {tabs.slice(visibleTabsCount).map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={activeFilter === tab.id ? 'bg-accent' : ''}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TabsList>
      </Tabs>
    </div>
  )
}

export type { FilterStatus, FilterTab }


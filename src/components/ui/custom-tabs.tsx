import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface CustomTabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const CustomTabsContext = React.createContext<CustomTabsContextValue | null>(null)

function useCustomTabs() {
  const context = React.useContext(CustomTabsContext)
  if (!context) {
    throw new Error("CustomTabs components must be used within CustomTabs")
  }
  return context
}

function CustomTabs({
  defaultValue,
  value: valueProp,
  onValueChange: onValueChangeProp,
  children,
  className,
}: CustomTabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const value = valueProp ?? internalValue
  const onValueChange = React.useCallback(
    (newValue: string) => {
      if (valueProp === undefined) {
        setInternalValue(newValue)
      }
      onValueChangeProp?.(newValue)
    },
    [valueProp, onValueChangeProp]
  )

  return (
    <CustomTabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    </CustomTabsContext.Provider>
  )
}

function CustomTabsList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-gray-100 inline-flex h-9 items-center justify-center rounded-lg p-1 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CustomTabsTriggerProps extends React.ComponentProps<"button"> {
  value: string
  children: React.ReactNode
}

function CustomTabsTrigger({
  value,
  children,
  className,
  ...props
}: CustomTabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useCustomTabs()
  const isActive = selectedValue === value

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-gray-900 font-bold shadow-sm"
          : "text-gray-600 font-normal",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function CustomTabsContent({
  value,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { value: selectedValue } = useCustomTabs()
  
  if (selectedValue !== value) {
    return null
  }

  return (
    <div className={cn("mt-2", className)} {...props}>
      {children}
    </div>
  )
}

export { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent }


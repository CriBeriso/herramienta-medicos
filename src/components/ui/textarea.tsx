
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows, ...props }, ref) => {
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      
      // Auto-resize functionality
      if (maxRows) {
        target.style.height = "auto";
        const computed = window.getComputedStyle(target);
        const lineHeight = parseInt(computed.lineHeight);
        const paddingTop = parseInt(computed.paddingTop);
        const paddingBottom = parseInt(computed.paddingBottom);
        
        const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
        const scrollHeight = target.scrollHeight;
        
        target.style.height = Math.min(scrollHeight, maxHeight) + "px";
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

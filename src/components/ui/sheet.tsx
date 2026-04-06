import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from './button'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: 'left' | 'right' | 'top' | 'bottom'
  }
>(({ side = 'left', className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 gap-4 bg-white/90 shadow-soft backdrop-blur dark:bg-black/60 border border-[hsl(var(--border))] p-0 overflow-hidden',
        side === 'left' && 'left-0 top-0 h-full w-[320px] rounded-r-xl',
        side === 'right' && 'right-0 top-0 h-full w-[320px] rounded-l-xl',
        side === 'top' && 'top-0 left-0 right-0 w-full rounded-b-xl',
        side === 'bottom' && 'bottom-0 left-0 right-0 w-full rounded-t-xl',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div />
        <DialogPrimitive.Close asChild>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </DialogPrimitive.Close>
      </div>
      <div className="px-4 pb-4">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
SheetContent.displayName = 'SheetContent'


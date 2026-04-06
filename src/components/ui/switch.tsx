'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      'group inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[hsl(var(--border))] bg-white/60 shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:bg-[hsl(var(--accent))] data-[state=checked]:border-[hsl(var(--accent))] dark:bg-black/20',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-[hsl(var(--foreground))] shadow-soft transition-transform duration-200 group-data-[state=checked]:translate-x-[22px]'
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'

